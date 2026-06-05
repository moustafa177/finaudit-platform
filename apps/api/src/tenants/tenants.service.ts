import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tenant } from './tenant.entity'

@Injectable()
export class TenantsService {
  constructor(@InjectRepository(Tenant) private tenantRepo: Repository<Tenant>) {}

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({ where: { id } })
    if (!tenant) throw new NotFoundException('الشركة غير موجودة')
    return tenant
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    await this.tenantRepo.update(id, data)
    return this.findById(id)
  }

  async incrementInvoiceCounter(id: string): Promise<number> {
    await this.tenantRepo.increment({ id }, 'invoiceCounter', 1)
    const tenant = await this.findById(id)
    return tenant.invoiceCounter
  }
}
