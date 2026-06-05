import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvoicesController } from './invoices.controller'
import { InvoicesService } from './invoices.service'
import { Invoice } from './invoice.entity'
import { TenantsModule } from '../tenants/tenants.module'
import { ZatcaModule } from '../zatca/zatca.module'

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), TenantsModule, ZatcaModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
