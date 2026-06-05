import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Invoice } from './invoice.entity'
import { TenantsService } from '../tenants/tenants.service'
import { ZatcaService } from '../zatca/zatca.service'
import { CreateInvoiceDto, InvoiceStatus, ZatcaStatus, PaginationQuery } from '@finaudit/shared-types'

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    private tenantsService: TenantsService,
    private zatcaService: ZatcaService,
  ) {}

  async findAll(tenantId: string, query: PaginationQuery & { status?: InvoiceStatus; dateFrom?: string; dateTo?: string }) {
    const { page = 1, limit = 20, search, status, dateFrom, dateTo } = query

    const qb = this.invoiceRepo.createQueryBuilder('inv')
      .where('inv.tenantId = :tenantId', { tenantId })

    if (search) {
      qb.andWhere('inv.invoiceNumber ILIKE :search OR inv.buyer::text ILIKE :search', { search: `%${search}%` })
    }
    if (status) qb.andWhere('inv.status = :status', { status })
    if (dateFrom && dateTo) qb.andWhere('inv.issueDate BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo })

    const [items, total] = await qb
      .orderBy('inv.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async findOne(id: string, tenantId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({ where: { id, tenantId } })
    if (!invoice) throw new NotFoundException('الفاتورة غير موجودة')
    return invoice
  }

  async create(tenantId: string, dto: CreateInvoiceDto): Promise<Invoice> {
    const tenant = await this.tenantsService.findById(tenantId)
    const counter = await this.tenantsService.incrementInvoiceCounter(tenantId)

    const lineItems = dto.lineItems.map((item, idx) => {
      const vatAmount = Math.round(item.quantity * item.unitPrice * item.vatRate * 100) / 100
      const totalAmount = Math.round(item.quantity * item.unitPrice * (1 + item.vatRate) * 100) / 100
      return { ...item, id: String(idx + 1), vatAmount, totalAmount }
    })

    const subtotal = lineItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
    const vatTotal = lineItems.reduce((sum, i) => sum + i.vatAmount, 0)
    const totalAmount = subtotal + vatTotal

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(counter).padStart(5, '0')}`

    const seller = {
      name: tenant.name,
      vatNumber: tenant.vatNumber,
      crNumber: tenant.crNumber,
      address: tenant.address || { street: '', city: 'الرياض', region: 'الرياض', postalCode: '12345', country: 'SA' },
    }

    const invoice = this.invoiceRepo.create({
      tenantId,
      invoiceNumber,
      type: dto.type,
      issueDate: dto.issueDate,
      supplyDate: dto.supplyDate,
      seller,
      buyer: dto.buyer,
      lineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal: 0,
      vatTotal: Math.round(vatTotal * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      currency: dto.currency || 'SAR',
      notes: dto.notes,
    })

    const saved = await this.invoiceRepo.save(invoice)

    // Validate with ZATCA in background
    this.zatcaService.validateAndEnrich(saved).then(async (enriched) => {
      await this.invoiceRepo.save(enriched)
    }).catch(() => {})

    return saved
  }

  async submit(id: string, tenantId: string): Promise<Invoice> {
    const invoice = await this.findOne(id, tenantId)
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('يمكن تقديم الفواتير في حالة المسودة فقط')
    }
    if (invoice.zatcaStatus === ZatcaStatus.NON_COMPLIANT) {
      throw new BadRequestException('لا يمكن تقديم فاتورة غير ممتثلة لاشتراطات هيئة الزكاة')
    }
    invoice.status = InvoiceStatus.SUBMITTED
    return this.invoiceRepo.save(invoice)
  }

  async cancel(id: string, tenantId: string): Promise<Invoice> {
    const invoice = await this.findOne(id, tenantId)
    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('الفاتورة ملغاة مسبقاً')
    }
    invoice.status = InvoiceStatus.CANCELLED
    return this.invoiceRepo.save(invoice)
  }

  async getStats(tenantId: string, year: number) {
    const stats = await this.invoiceRepo
      .createQueryBuilder('inv')
      .select([
        "DATE_TRUNC('month', inv.createdAt) AS month",
        'SUM(inv.totalAmount) AS revenue',
        'SUM(inv.vatTotal) AS vat',
        'COUNT(*) AS count',
      ])
      .where('inv.tenantId = :tenantId AND EXTRACT(YEAR FROM inv.createdAt) = :year', { tenantId, year })
      .andWhere('inv.status != :cancelled', { cancelled: InvoiceStatus.CANCELLED })
      .groupBy("DATE_TRUNC('month', inv.createdAt)")
      .orderBy('month', 'ASC')
      .getRawMany()

    const complianceStats = await this.invoiceRepo
      .createQueryBuilder('inv')
      .select(['inv.zatcaStatus AS status', 'COUNT(*) AS count'])
      .where('inv.tenantId = :tenantId', { tenantId })
      .groupBy('inv.zatcaStatus')
      .getRawMany()

    return { monthly: stats, compliance: complianceStats }
  }
}
