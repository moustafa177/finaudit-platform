'use client'

import { useEffect, useState, useCallback } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, Activity,
  Database, Brain, Shield, Zap, Server, Cpu, HardDrive,
  FileText, Globe, Clock, BarChart3, Bot, ShieldCheck
} from 'lucide-react'

interface HealthData {
  status: 'healthy' | 'degraded' | 'down'
  latency: number
  timestamp: string
  services: {
    api:      { status: string; latency: number }
    database: { status: string; latency: number; tables: number }
    ai:       { status: string; model: string }
    zatca:    { status: string; env: string }
    rpa:      { status: string; rulesCount: number }
  }
  system: {
    uptime: number
    uptimeHuman: string
    nodeVersion: string
    platform: string
    memory: { used: number; total: number; free: number; totalRam: number; usagePercent: number }
  }
}

// ── Static page/module counts ──────────────────────────────────────────
const PAGES = [
  { path: '/overview',     name: 'لوحة التحكم',        group: 'رئيسي' },
  { path: '/invoices',     name: 'الفواتير',            group: 'رئيسي' },
  { path: '/invoices/new', name: 'فاتورة جديدة',        group: 'رئيسي' },
  { path: '/compliance',   name: 'الامتثال ZATCA',      group: 'رئيسي' },
  { path: '/reports',      name: 'التقارير',            group: 'رئيسي' },
  { path: '/regulations',  name: 'التشريعات المالية',   group: 'امتثال ومخاطر' },
  { path: '/risk',         name: 'إدارة المخاطر',      group: 'امتثال ومخاطر' },
  { path: '/fraud',        name: 'اكتشاف الاحتيال',    group: 'امتثال ومخاطر' },
  { path: '/rpa',          name: 'AI-Powered RPA',      group: 'ذكاء اصطناعي' },
  { path: '/cleansing',    name: 'تنظيف البيانات',      group: 'ذكاء اصطناعي' },
  { path: '/forecasting',  name: 'توقعات الطلب',        group: 'ذكاء اصطناعي' },
  { path: '/costing',      name: 'تسعير الخدمات',       group: 'ذكاء اصطناعي' },
  { path: '/settings',     name: 'الإعدادات',           group: 'نظام' },
  { path: '/health',       name: 'مركز الصحة',          group: 'نظام' },
]

const MODULES = [
  'Auth + JWT',  'Multi-tenant', 'Invoice CRUD', 'ZATCA Validator',
  'QR Generator', 'XML Builder', 'AI Service (Claude)', 'RPA Engine',
  'Data Cleansing', 'Forecasting', 'Fraud Detection', 'Reports Engine',
  'Regulations DB', 'Risk Matrix', 'Audit Logs', 'Settings Manager',
]

const API_ENDPOINTS = [
  { method: 'POST', path: '/auth/register',       desc: 'تسجيل شركة' },
  { method: 'POST', path: '/auth/login',           desc: 'تسجيل دخول' },
  { method: 'GET',  path: '/invoices',             desc: 'قائمة الفواتير' },
  { method: 'POST', path: '/invoices',             desc: 'إنشاء فاتورة' },
  { method: 'GET',  path: '/reports/dashboard',   desc: 'KPIs الداشبورد' },
  { method: 'GET',  path: '/reports/zatca-monthly',desc: 'تقرير ZATCA' },
  { method: 'GET',  path: '/ai/fraud-analysis',   desc: 'كشف الاحتيال' },
  { method: 'GET',  path: '/ai/data-cleansing',   desc: 'تنظيف البيانات' },
  { method: 'GET',  path: '/ai/forecast',          desc: 'التوقعات' },
  { method: 'GET',  path: '/ai/advisory-report',  desc: 'التقرير الاستشاري' },
  { method: 'GET',  path: '/health',              desc: 'صحة النظام' },
]

// ── Status Helpers ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    ok:          { label: 'يعمل',      color: 'text-green-600 bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
    connected:   { label: 'متصل',     color: 'text-green-600 bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
    healthy:     { label: 'سليم',     color: 'text-green-600 bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
    active:      { label: 'نشط',      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',   icon: Activity },
    mock:        { label: 'محاكاة',   color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30', icon: AlertTriangle },
    sandbox:     { label: 'تجريبي',   color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',   icon: Shield },
    error:       { label: 'خطأ',      color: 'text-red-600 bg-red-100 dark:bg-red-900/30',     icon: XCircle },
    degraded:    { label: 'متدهور',   color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30', icon: AlertTriangle },
    down:        { label: 'متوقف',    color: 'text-red-600 bg-red-100 dark:bg-red-900/30',     icon: XCircle },
  }
  const c = cfg[status] ?? cfg.ok
  const Icon = c.icon
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', c.color)}>
      <Icon className="w-3 h-3" />{c.label}
    </span>
  )
}

function KpiCard({ icon: Icon, label, value, sub, color = 'text-brand-600', bg = 'bg-brand-50 dark:bg-brand-900/20' }: {
  icon: typeof Activity; label: string; value: string | number; sub?: string; color?: string; bg?: string
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', bg)}>
          <Icon className={cn('w-4 h-4', color)} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs font-medium text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────
export default function HealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [pageStatuses, setPageStatuses] = useState<Record<string, boolean>>({})
  const [checkingPages, setCheckingPages] = useState(false)

  const fetchHealth = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/health')
      setHealth(res.data)
      setLastCheck(new Date())
    } catch {
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const checkAllPages = useCallback(async () => {
    setCheckingPages(true)
    const results: Record<string, boolean> = {}
    await Promise.all(
      PAGES.map(async ({ path }) => {
        try {
          const res = await fetch(`http://localhost:3000${path}`, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
          results[path] = res.status < 500
        } catch {
          results[path] = false
        }
      })
    )
    setPageStatuses(results)
    setCheckingPages(false)
  }, [])

  useEffect(() => { fetchHealth(); checkAllPages() }, [fetchHealth, checkAllPages])

  // ── auto-refresh every 30s ─────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(fetchHealth, 30000)
    return () => clearInterval(t)
  }, [fetchHealth])

  const pageGroups = PAGES.reduce((acc, page) => {
    if (!acc[page.group]) acc[page.group] = []
    acc[page.group].push(page)
    return acc
  }, {} as Record<string, typeof PAGES>)

  const okPages    = Object.values(pageStatuses).filter(Boolean).length
  const errorPages = Object.values(pageStatuses).filter((v) => !v).length

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Topbar title="مركز صحة النظام" subtitle="System Health Center — مراقبة شاملة في الوقت الفعلي" />

      {/* Status Banner */}
      <div className={cn('rounded-2xl p-4 flex items-center justify-between', {
        'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': health?.status === 'healthy',
        'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800': health?.status === 'degraded',
        'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': !health || health?.status === 'down',
        'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700': loading,
      })}>
        <div className="flex items-center gap-3">
          {loading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-brand-600 rounded-full animate-spin" /> :
            health?.status === 'healthy' ? <CheckCircle2 className="w-6 h-6 text-green-600" /> :
            <AlertTriangle className="w-6 h-6 text-amber-600" />}
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {loading ? 'جاري الفحص...' : health?.status === 'healthy' ? '✅ جميع الأنظمة تعمل بشكل طبيعي' : '⚠️ بعض الأنظمة تحتاج انتباهاً'}
            </p>
            {lastCheck && <p className="text-xs text-gray-500">آخر فحص: {lastCheck.toLocaleTimeString('ar-SA')}</p>}
          </div>
        </div>
        <button onClick={() => { fetchHealth(); checkAllPages() }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <RefreshCw className={cn('w-3.5 h-3.5', (loading || checkingPages) && 'animate-spin')} />
          تحديث
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={FileText}   label="الصفحات الكلية"       value={PAGES.length}          sub="صفحة في المنصة" />
        <KpiCard icon={BarChart3}  label="الوحدات (Modules)"    value={MODULES.length}         sub="وحدة وظيفية"
          color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/20" />
        <KpiCard icon={Globe}      label="نقاط API"              value={API_ENDPOINTS.length}   sub="endpoint"
          color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
        <KpiCard icon={CheckCircle2} label="صفحات سليمة"         value={loading ? '—' : okPages}
          sub={errorPages > 0 ? `${errorPages} أخطاء` : 'لا أخطاء'}
          color={errorPages > 0 ? 'text-red-600' : 'text-green-600'}
          bg={errorPages > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Services Status */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">حالة الخدمات</h3>
            {health && <span className="text-xs text-gray-400">استجابة: {health.latency}ms</span>}
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {[
              { icon: Server,    label: 'NestJS API',             key: 'api',      extra: health ? `${health.services.api.latency}ms` : '' },
              { icon: Database,  label: 'PostgreSQL',             key: 'database', extra: health ? `${health.services.database.tables} جدول · ${health.services.database.latency}ms` : '' },
              { icon: Brain,     label: 'Claude AI',              key: 'ai',       extra: health?.services.ai.model },
              { icon: ShieldCheck,label: 'ZATCA FATOORAH',        key: 'zatca',    extra: health?.services.zatca.env },
              { icon: Bot,       label: 'RPA Automation',         key: 'rpa',      extra: health ? `${health.services.rpa.rulesCount} قواعد نشطة` : '' },
            ].map(({ icon: Icon, label, key, extra }) => {
              const svc = health?.services[key as keyof typeof health.services] as { status: string } | undefined
              return (
                <div key={key} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                      {extra && <p className="text-xs text-gray-400">{extra}</p>}
                    </div>
                  </div>
                  {loading
                    ? <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    : <StatusBadge status={svc?.status ?? 'ok'} />
                  }
                </div>
              )
            })}
          </div>
        </div>

        {/* System Resources */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">موارد الخادم</h3>
            {loading ? (
              <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />)}</div>
            ) : health ? (
              <div className="space-y-4">
                {[
                  { label: 'استخدام الذاكرة (RAM)', value: health.system.memory.usagePercent, sub: `${health.system.memory.used} MB / ${health.system.memory.totalRam} MB` },
                  { label: 'Node.js Heap',           value: Math.round((health.system.memory.used / health.system.memory.total) * 100), sub: `${health.system.memory.used} MB / ${health.system.memory.total} MB` },
                ].map(({ label, value, sub }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{label}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', value > 80 ? 'bg-red-500' : value > 60 ? 'bg-amber-500' : 'bg-green-500')}
                        style={{ width: `${value}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  {[
                    { icon: Clock, label: 'وقت التشغيل', value: health.system.uptimeHuman },
                    { icon: Cpu,   label: 'Node.js',      value: health.system.nodeVersion },
                    { icon: HardDrive, label: 'المنصة',   value: health.system.platform },
                    { icon: Activity, label: 'الاستجابة', value: `${health.latency}ms` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">الـ API غير متاح</p>
            )}
          </div>
        </div>
      </div>

      {/* Pages Inventory */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            فهرس الصفحات ({PAGES.length} صفحة)
          </h3>
          {checkingPages && <span className="text-xs text-gray-400 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> يفحص...</span>}
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(pageGroups).map(([group, pages]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group}</p>
              <div className="space-y-1">
                {pages.map(({ path, name }) => (
                  <div key={path} className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 dark:text-gray-300">{name}</span>
                    {Object.keys(pageStatuses).length === 0
                      ? <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                      : pageStatuses[path]
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        : <XCircle className="w-3.5 h-3.5 text-red-500" />
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">نقاط API ({API_ENDPOINTS.length} endpoint)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['الطريقة', 'المسار', 'الوصف', 'الحالة'].map((h) => (
                  <th key={h} className="text-right px-4 py-2 font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {API_ENDPOINTS.map(({ method, path, desc }) => (
                <tr key={`${method}${path}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-2">
                    <span className={cn('px-1.5 py-0.5 rounded font-bold', {
                      'bg-green-100 text-green-700': method === 'GET',
                      'bg-blue-100 text-blue-700': method === 'POST',
                      'bg-amber-100 text-amber-700': method === 'PATCH',
                      'bg-red-100 text-red-700': method === 'DELETE',
                    })}>{method}</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-600 dark:text-gray-400">/api/v1{path}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{desc}</td>
                  <td className="px-4 py-2"><StatusBadge status="ok" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modules */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">
          وحدات النظام ({MODULES.length} وحدة)
        </h3>
        <div className="flex flex-wrap gap-2">
          {MODULES.map((m) => (
            <span key={m} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-3 h-3 text-green-500" />{m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
