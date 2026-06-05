import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import { InvoiceType, InvoiceStatus, ZatcaStatus, InvoiceParty, InvoiceLineItem } from '@finaudit/shared-types'
import { Tenant } from '../tenants/tenant.entity'

@Entity('invoices')
@Index(['tenantId', 'invoiceNumber'], { unique: true })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id' })
  @Index()
  tenantId: string

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ name: 'invoice_number', length: 50 })
  invoiceNumber: string

  @Column({ type: 'enum', enum: InvoiceType, default: InvoiceType.STANDARD })
  type: InvoiceType

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus

  @Column({ name: 'zatca_status', type: 'enum', enum: ZatcaStatus, default: ZatcaStatus.PENDING })
  zatcaStatus: ZatcaStatus

  @Column({ name: 'issue_date', type: 'date' })
  issueDate: string

  @Column({ name: 'supply_date', type: 'date', nullable: true })
  supplyDate?: string

  @Column({ type: 'jsonb' })
  seller: InvoiceParty

  @Column({ type: 'jsonb' })
  buyer: InvoiceParty

  @Column({ name: 'line_items', type: 'jsonb' })
  lineItems: InvoiceLineItem[]

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number

  @Column({ name: 'discount_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountTotal: number

  @Column({ name: 'vat_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  vatTotal: number

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number

  @Column({ length: 3, default: 'SAR' })
  currency: string

  @Column({ nullable: true, type: 'text' })
  notes?: string

  @Column({ name: 'qr_code', nullable: true, type: 'text' })
  qrCode?: string

  @Column({ name: 'xml_content', nullable: true, type: 'text' })
  xmlContent?: string

  @Column({ name: 'pdf_url', nullable: true })
  pdfUrl?: string

  @Column({ name: 'zatca_errors', type: 'jsonb', nullable: true })
  zatcaErrors?: unknown[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
