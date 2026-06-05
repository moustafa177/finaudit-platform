'use client'

import { useEffect, useState, useCallback } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { invoicesApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Invoice, InvoiceStatus, ZatcaStatus } from '@finaudit/shared-types'
import { Plus, Search, Filter, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const STATUS_BADGE: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: 'مسودة', className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  submitted: { label: 'مُقدَّمة', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  validated: { label: 'مُعتمدة', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'ملغاة', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

const ZATCA_BADGE: Record<ZatcaStatus, { label: string; icon: typeof CheckCircle }> = {
  pending: { label: 'في الانتظار', icon: Clock },
  compliant: { label: 'ممتثل', icon: CheckCircle },
  non_compliant: { label: 'غير ممتثل', icon: XCircle },
  cleared: { label: 'تم التخليص', icon: CheckCircle },
  reported: { label: 'تم الإبلاغ', icon: CheckCircle },
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })

  const load = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await invoicesApi.list({ page, limit: 15, search: search || undefined, status: statusFilter || undefined })
      setInvoices(res.data.items)
      setMeta(res.data.meta)
    } catch {
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <Topbar title="الفواتير" subtitle={`${meta.total} فاتورة إجمالاً`} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">كل الحالات</option>
          <option value="draft">مسودة</option>
          <option value="submitted">مُقدَّمة</option>
          <option value="validated">مُعتمدة</option>
          <option value="cancelled">ملغاة</option>
        </select>
        <Link href="/invoices/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          فاتورة جديدة
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">لا توجد فواتير بعد</p>
            <Link href="/invoices/new" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
              أنشئ أول فاتورة →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['رقم الفاتورة', 'العميل', 'التاريخ', 'المبلغ', 'الضريبة', 'الحالة', 'ZATCA', ''].map((h) => (
                  <th key={h} className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {invoices.map((inv) => {
                const statusBadge = STATUS_BADGE[inv.status]
                const zatcaBadge = ZATCA_BADGE[inv.zatcaStatus]
                const ZatcaIcon = zatcaBadge?.icon || AlertCircle
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-brand-600">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{inv.buyer?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(inv.issueDate)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatCurrency(inv.vatTotal)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-lg text-xs font-medium', statusBadge.className)}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={cn('flex items-center gap-1 text-xs', {
                        'text-green-600': inv.zatcaStatus === 'compliant' || inv.zatcaStatus === 'cleared',
                        'text-red-600': inv.zatcaStatus === 'non_compliant',
                        'text-amber-600': inv.zatcaStatus === 'pending',
                        'text-blue-600': inv.zatcaStatus === 'reported',
                      })}>
                        <ZatcaIcon className="w-3.5 h-3.5" />
                        {zatcaBadge?.label}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/invoices/${inv.id}`} className="text-xs text-brand-600 hover:underline">عرض</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>عرض {invoices.length} من {meta.total} فاتورة</span>
          <div className="flex gap-2">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => load(p)}
                className={cn('w-8 h-8 rounded-lg text-sm font-medium transition-colors', {
                  'bg-brand-600 text-white': p === meta.page,
                  'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600': p !== meta.page,
                })}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
