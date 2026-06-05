import { Module } from '@nestjs/common'
import { AiService } from './ai.service'
import { AiController } from './ai.controller'
import { InvoicesModule } from '../invoices/invoices.module'
import { ReportsModule } from '../reports/reports.module'
import { TenantsModule } from '../tenants/tenants.module'

@Module({
  imports: [InvoicesModule, ReportsModule, TenantsModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
