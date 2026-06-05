import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AiService } from './ai.service'
import { InvoicesService } from '../invoices/invoices.service'
import { ReportsService } from '../reports/reports.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentTenant } from '../common/decorators/tenant.decorator'
import { TenantsService } from '../tenants/tenants.service'

@ApiTags('الذكاء الاصطناعي')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(
    private ai: AiService,
    private invoices: InvoicesService,
    private reports: ReportsService,
    private tenants: TenantsService,
  ) {}

  @Get('fraud-analysis')
  async fraudAnalysis(@CurrentTenant() tenantId: string) {
    const [result, tenant] = await Promise.all([
      this.invoices.findAll(tenantId, { limit: 50 }),
      this.tenants.findById(tenantId),
    ])
    const analysis = await this.ai.analyzeInvoices(
      result.items as unknown as Array<Record<string, unknown>>,
      tenant.name,
    )
    return { success: true, data: analysis }
  }

  @Get('data-cleansing')
  async dataCleansing(@CurrentTenant() tenantId: string) {
    const result = await this.invoices.findAll(tenantId, { limit: 50 })
    const cleansing = await this.ai.cleanseData(
      result.items as unknown as Array<Record<string, unknown>>,
    )
    return { success: true, data: cleansing }
  }

  @Get('forecast')
  async forecast(@CurrentTenant() tenantId: string) {
    const [stats, tenant] = await Promise.all([
      this.invoices.getStats(tenantId, new Date().getFullYear()),
      this.tenants.findById(tenantId),
    ])
    const monthly = (stats.monthly as Array<Record<string, unknown>>).map((m) => ({
      month: new Date(m.month as string).toLocaleDateString('ar-SA', { month: 'long' }),
      revenue: Number(m.revenue) || 0,
      vat: Number(m.vat) || 0,
    }))
    const forecast = await this.ai.forecastRevenue(monthly, tenant.name)
    return { success: true, data: { ...forecast, historical: monthly } }
  }

  @Get('advisory-report')
  async advisoryReport(@CurrentTenant() tenantId: string) {
    const [kpis, tenant] = await Promise.all([
      this.reports.getDashboardKPIs(tenantId),
      this.tenants.findById(tenantId),
    ])
    const report = await this.ai.generateAdvisoryReport({
      tenantName: tenant.name,
      totalRevenue: (kpis as { totalRevenue: number }).totalRevenue,
      totalVat: (kpis as { totalVat: number }).totalVat,
      complianceRate: (kpis as { complianceRate: number }).complianceRate,
      totalInvoices: (kpis as { totalInvoices: number }).totalInvoices,
      topRisks: ['عدم الامتثال ZATCA', 'تأخر الإقرار الضريبي'],
    })
    return { success: true, data: report }
  }

  @Post('extract-invoice')
  async extractInvoice(@Body() body: { text: string }) {
    const extracted = await this.ai.extractInvoiceData(body.text)
    return { success: true, data: extracted }
  }
}
