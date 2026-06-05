import { Injectable } from '@nestjs/common'
import { InvoicesService } from '../invoices/invoices.service'
import { ZatcaStatus, InvoiceStatus } from '@finaudit/shared-types'

@Injectable()
export class ReportsService {
  constructor(private invoicesService: InvoicesService) {}

  async getDashboardKPIs(tenantId: string) {
    const currentYear = new Date().getFullYear()
    const stats = await this.invoicesService.getStats(tenantId, currentYear)

    const allInvoices = await this.invoicesService.findAll(tenantId, { limit: 1000 })
    const invoices = allInvoices.items

    const active = invoices.filter((i) => i.status !== InvoiceStatus.CANCELLED)
    const totalRevenue = active.reduce((sum, i) => sum + Number(i.totalAmount), 0)
    const totalVat = active.reduce((sum, i) => sum + Number(i.vatTotal), 0)
    const compliant = invoices.filter((i) => i.zatcaStatus === ZatcaStatus.COMPLIANT).length
    const complianceRate = invoices.length > 0 ? Math.round((compliant / invoices.length) * 100) : 0
    const pendingInvoices = invoices.filter((i) => i.status === InvoiceStatus.DRAFT).length
    const nonCompliant = invoices.filter((i) => i.zatcaStatus === ZatcaStatus.NON_COMPLIANT).length

    const monthlyData = stats.monthly.map((m: Record<string, unknown>) => ({
      month: new Date(m.month as string).toLocaleDateString('ar-SA', { month: 'short' }),
      revenue: Number(m.revenue) || 0,
      vat: Number(m.vat) || 0,
      count: Number(m.count) || 0,
    }))

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalVat: Math.round(totalVat * 100) / 100,
      totalInvoices: invoices.length,
      complianceRate,
      pendingInvoices,
      nonCompliantInvoices: nonCompliant,
      monthlyData,
      complianceBreakdown: stats.compliance,
    }
  }

  async getZatcaMonthlyReport(tenantId: string, month: number, year: number) {
    const dateFrom = `${year}-${String(month).padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const dateTo = `${year}-${String(month).padStart(2, '0')}-${lastDay}`

    const result = await this.invoicesService.findAll(tenantId, { dateFrom, dateTo, limit: 1000 })
    const invoices = result.items.filter((i) => i.status !== InvoiceStatus.CANCELLED)

    const totalSales = invoices.reduce((sum, i) => sum + Number(i.subtotal), 0)
    const totalVat = invoices.reduce((sum, i) => sum + Number(i.vatTotal), 0)
    const compliantCount = invoices.filter((i) => i.zatcaStatus === ZatcaStatus.COMPLIANT).length

    return {
      period: { month, year, dateFrom, dateTo },
      summary: {
        totalInvoices: invoices.length,
        compliantInvoices: compliantCount,
        totalSales: Math.round(totalSales * 100) / 100,
        totalVatCollected: Math.round(totalVat * 100) / 100,
        complianceRate: invoices.length > 0 ? Math.round((compliantCount / invoices.length) * 100) : 0,
      },
      invoices: invoices.map((i) => ({
        invoiceNumber: i.invoiceNumber,
        issueDate: i.issueDate,
        buyerName: i.buyer.name,
        totalAmount: i.totalAmount,
        vatAmount: i.vatTotal,
        zatcaStatus: i.zatcaStatus,
      })),
    }
  }
}
