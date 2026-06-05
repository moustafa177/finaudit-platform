'use client'

import { Topbar } from '@/components/layout/topbar'
import { StatCard } from '@/components/ui/stat-card'
import { RevenueChart } from '@/components/charts/revenue-chart'
import { ComplianceChart } from '@/components/charts/compliance-chart'
import { reportsApi, invoicesApi } from '@/lib/api'
import { useApi } from '@/hooks/use-api'
import { useAuth } from '@/contexts/auth-context'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { TrendingUp, Receipt, ShieldCheck, AlertTriangle, Wallet, ArrowUpRight, Plus, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700', className)} />
}

function KpiSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between">
        <div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-7 w-32" /></div>
        <Skeleton className="w-11 h-11 rounded-xl" />
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const { user, tenant } = useAuth()

  const { data: kpis, loading: kpiLoading, refetch } = useApi(() => reportsApi.dashboard())
  const { data: invoiceStats, loading: statsLoading } = useApi(
    () => invoicesApi.stats(new Date().getFullYear()) as Promise<{ data: { data: unknown } }>,
  )

  const monthlyData = (invoiceStats as { monthly?: Array<{ month: string; revenue: number; vat: number }> })?.monthly ?? []
  const complianceData = (kpis as { complianceBreakdown?: Array<{ status: string; count: string }> })?.complianceBreakdown ?? []
  const totalRevenue = (kpis as { totalRevenue?: number })?.totalRevenue ?? 0
  const totalVat = (kpis as { totalVat?: number })?.totalVat ?? 0
  const totalInvoices = (kpis as { totalInvoices?: number })?.totalInvoices ?? 0
  const complianceRate = (kpis as { complianceRate?: number })?.complianceRate ?? 0
  const pendingInvoices = (kpis as { pendingInvoices?: number })?.pendingInvoices ?? 0
  const nonCompliantInvoices = (kpis as { nonCompliantInvoices?: number })?.nonCompliantInvoices ?? 0

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'صباح الخير'
    if (h < 17) return 'مساء الخير'
    return 'مساء النور'
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Topbar
        title="لوحة التحكم"
        subtitle={`${greeting()}، ${user?.fullName?.split(' ')[0] ?? ''} — ${new Date().toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      />

      {/* Company Banner */}
      {tenant && (
        <div className="bg-gradient-to-l from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-900/10 rounded-2xl p-4 flex items-center justify-between border border-brand-100 dark:border-brand-800">
          <div>
            <p className="font-bold text-brand-900 dark:text-brand-200">{tenant.name}</p>
            <p className="text-xs text-brand-600 dark:text-brand-400">رقم ضريبي: {tenant.vatNumber} · الباقة: {tenant.plan === 'free' ? 'مجانية' : tenant.plan}</p>
          </div>
          <button onClick={refetch} className="p-2 rounded-lg hover:bg-brand-200 dark:hover:bg-brand-800 text-brand-600 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiLoading ? Array(4).fill(0).map((_, i) => <KpiSkeleton key={i} />) : (
          <>
            <StatCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenue)}
              change="هذا العام" changeType="up" icon={TrendingUp} />
            <StatCard title="ضريبة القيمة المضافة" value={formatCurrency(totalVat)}
              change="مستحقة للسداد" changeType="neutral" icon={Wallet}
              iconColor="text-green-600" iconBg="bg-green-50 dark:bg-green-900/20" />
            <StatCard title="إجمالي الفواتير" value={formatNumber(totalInvoices)}
              change={`${pendingInvoices} في الانتظار`} changeType="neutral" icon={Receipt}
              iconColor="text-purple-600" iconBg="bg-purple-50 dark:bg-purple-900/20" />
            <StatCard title="نسبة الامتثال" value={`${complianceRate}%`}
              change={nonCompliantInvoices ? `${nonCompliantInvoices} غير ممتثل` : 'ممتاز ✓'}
              changeType={complianceRate >= 90 ? 'up' : 'down'} icon={ShieldCheck}
              iconColor="text-brand-600" iconBg="bg-brand-50 dark:bg-brand-900/20" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">الإيرادات الشهرية</h3>
              <p className="text-xs text-gray-500">بيانات حقيقية من قاعدة البيانات</p>
            </div>
            <Link href="/reports" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
              تقرير مفصل <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {statsLoading
            ? <Skeleton className="h-64 w-full" />
            : monthlyData.length > 0
              ? <RevenueChart data={monthlyData} />
              : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
                  <Receipt className="w-10 h-10 opacity-30" />
                  <p className="text-sm">لا توجد فواتير بعد</p>
                  <Link href="/invoices/new" className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors">
                    <Plus className="w-4 h-4" /> أنشئ أول فاتورة
                  </Link>
                </div>
              )
          }
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">حالة الامتثال</h3>
              <p className="text-xs text-gray-500">ZATCA الفاتورة الإلكترونية</p>
            </div>
            <Link href="/compliance" className="text-xs text-brand-600 flex items-center gap-1">
              التفاصيل <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {kpiLoading
            ? <Skeleton className="h-40 w-full" />
            : <ComplianceChart
                data={complianceData.map((d) => ({ status: d.status, count: Number(d.count) }))}
                totalInvoices={totalInvoices}
                complianceRate={complianceRate}
              />
          }
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'إنشاء فاتورة جديدة', href: '/invoices/new', icon: Receipt, color: 'bg-brand-600 hover:bg-brand-700 text-white' },
          { label: 'مراجعة الامتثال', href: '/compliance', icon: ShieldCheck, color: 'bg-green-600 hover:bg-green-700 text-white' },
          { label: 'تحليل AI للبيانات', href: '/cleansing', icon: TrendingUp, color: 'bg-purple-600 hover:bg-purple-700 text-white' },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link key={href} href={href}
            className={`${color} rounded-2xl p-4 flex items-center gap-3 font-medium transition-colors shadow-sm`}>
            <Icon className="w-5 h-5" /> {label}
          </Link>
        ))}
      </div>

      {/* Alerts */}
      {!kpiLoading && nonCompliantInvoices > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              {nonCompliantInvoices} فاتورة غير ممتثلة لاشتراطات ZATCA
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
              راجع صفحة الامتثال وصحّح الأخطاء قبل التقديم.
            </p>
          </div>
          <Link href="/compliance" className="text-sm font-medium text-amber-700 underline whitespace-nowrap">
            مراجعة →
          </Link>
        </div>
      )}

      {/* Empty state for new users */}
      {!kpiLoading && totalInvoices === 0 && (
        <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-2xl p-6 text-center">
          <div className="w-14 h-14 bg-brand-100 dark:bg-brand-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-7 h-7 text-brand-600" />
          </div>
          <h3 className="font-bold text-brand-900 dark:text-brand-200 mb-2">مرحباً بك في الامتثال المالي!</h3>
          <p className="text-sm text-brand-700 dark:text-brand-400 mb-4 max-w-sm mx-auto">
            ابدأ بإنشاء أول فاتورة إلكترونية ممتثلة لـ ZATCA وستظهر التحليلات تلقائياً.
          </p>
          <Link href="/invoices/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
            <Plus className="w-4 h-4" /> إنشاء أول فاتورة
          </Link>
        </div>
      )}
    </div>
  )
}
