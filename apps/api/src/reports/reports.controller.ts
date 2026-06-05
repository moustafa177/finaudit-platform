import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentTenant } from '../common/decorators/tenant.decorator'

@ApiTags('التقارير')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboard(@CurrentTenant() tenantId: string) {
    const kpis = await this.reportsService.getDashboardKPIs(tenantId)
    return { success: true, data: kpis }
  }

  @Get('zatca-monthly')
  async getZatcaMonthly(
    @CurrentTenant() tenantId: string,
    @Query('month') month = new Date().getMonth() + 1,
    @Query('year') year = new Date().getFullYear(),
  ) {
    const report = await this.reportsService.getZatcaMonthlyReport(tenantId, Number(month), Number(year))
    return { success: true, data: report }
  }
}
