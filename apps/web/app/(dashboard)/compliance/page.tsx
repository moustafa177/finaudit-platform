'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { reportsApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShieldCheck, ShieldX, Clock, CheckCircle2, XCircle, AlertTriangle, Download } from 'lucide-react'

interface ZatcaReport {
  period: { month: number; year: number }
  summary: {
    totalInvoices: number
    compliantInvoices: number
    totalSales: number
    totalVatCollected: number
    complianceRate: number
  }
  invoices: Array<{
    invoiceNumber: string
    issueDate: string
    buyerName: string
    totalAmount: number
    vatAmount: number
    zatcaStatus: string
  }>
}

export default function CompliancePage() {
  const [report, setReport] = useState<ZatcaReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setLoading(true)
    reportsApi.zatcaMonthly(selectedMonth, selectedYear)
      .then((res) => setReport(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedMonth, selectedYear])

  const complianceRate = report?.summary.complianceRate || 0
  const rateColor = complianceRate >= 90 ? 'text-green-600' : complianceRate >= 70 ? 'text-amber-600' : 'text-red-600'
  const rateGrade = complianceRate >= 90 ? 'ممتاز' : complianceRate >= 70 ? 'جيد' : 'يحتاج تحسين'

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <Topbar title="الامتثال ZATCA" subtitle="مراجعة مستوى الامتثال للفاتورة الإلكترونية" />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(2024, m - 1, 1).toLocaleDateString('ar-SA', { month: 'long' })}
            </option>
          ))}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Download className="w-4 h-4" /> تصدير التقرير
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse" />
          ))}
        </div>
      ) : report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
              <div className={`text-3xl font-bold ${rateColor}`}>{complianceRate}%</div>
              <div className="text-sm text-gray-500 mt-1">نسبة الامتثال</div>
              <div className={`text-xs font-semibold mt-1 ${rateColor}`}>{rateGrade}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{report.summary.totalInvoices}</div>
              <div className="text-sm text-gray-500 mt-1">إجمالي الفواتير</div>
              <div className="text-xs text-green-600 mt-1">{report.summary.compliantInvoices} ممتثلة</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(report.summary.totalSales)}</div>
              <div className="text-sm text-gray-500 mt-1">إجمالي المبيعات</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
              <div className="text-xl font-bold text-brand-600">{formatCurrency(report.summary.totalVatCollected)}</div>
              <div className="text-sm text-gray-500 mt-1">ضريبة محصّلة</div>
            </div>
          </div>

          {/* Compliance notice */}
          {complianceRate < 100 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  {report.summary.totalInvoices - report.summary.compliantInvoices} فاتورة تحتاج مراجعة
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                  تحقق من الفواتير غير الممتثلة وصحح الأخطاء قبل تقديمها لهيئة الزكاة والضريبة والجمارك.
                </p>
              </div>
            </div>
          )}

          {/* Invoice list */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">تفاصيل الفواتير</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  {['رقم الفاتورة', 'العميل', 'التاريخ', 'المبلغ', 'الضريبة', 'حالة ZATCA'].map((h) => (
                    <th key={h} className="text-right text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {report.invoices.map((inv) => (
                  <tr key={inv.invoiceNumber} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-brand-600">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{inv.buyerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(inv.issueDate)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatCurrency(inv.vatAmount)}</td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${
                        inv.zatcaStatus === 'compliant' ? 'text-green-600' :
                        inv.zatcaStatus === 'non_compliant' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {inv.zatcaStatus === 'compliant' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                         inv.zatcaStatus === 'non_compliant' ? <XCircle className="w-3.5 h-3.5" /> :
                         <Clock className="w-3.5 h-3.5" />}
                        {inv.zatcaStatus === 'compliant' ? 'ممتثل' :
                         inv.zatcaStatus === 'non_compliant' ? 'غير ممتثل' : 'في الانتظار'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
