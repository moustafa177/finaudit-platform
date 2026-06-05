'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  ShieldAlert, Eye, EyeOff, Flag, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, Search, Zap, Brain, ArrowUpRight, Ban
} from 'lucide-react'

type AlertLevel = 'critical' | 'high' | 'medium'
type AlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive'

interface FraudAlert {
  id: string
  level: AlertLevel
  status: AlertStatus
  title: string
  description: string
  amount: number
  party: string
  detectedAt: string
  ruleTriggered: string
  aiScore: number   // 0–100
}

const LEVEL_CONFIG: Record<AlertLevel, { label: string; color: string; bg: string; glow: string }> = {
  critical: { label: 'حرج',   color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-900/20',    glow: 'shadow-red-100' },
  high:     { label: 'مرتفع', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', glow: 'shadow-orange-100' },
  medium:   { label: 'متوسط', color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-900/20',  glow: 'shadow-amber-100' },
}

const STATUS_CONFIG: Record<AlertStatus, { label: string; className: string; icon: typeof Clock }> = {
  open:           { label: 'مفتوح',         className: 'bg-red-100 text-red-700',    icon: AlertTriangle },
  investigating:  { label: 'قيد التحقيق',   className: 'bg-blue-100 text-blue-700',  icon: Eye },
  resolved:       { label: 'تم الحل',        className: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  false_positive: { label: 'إنذار خاطئ',    className: 'bg-gray-100 text-gray-600',  icon: EyeOff },
}

const FRAUD_ALERTS: FraudAlert[] = [
  {
    id: '1', level: 'critical', status: 'open', aiScore: 94,
    title: 'فاتورة مكررة بمبلغ مرتفع',
    description: 'رُصدت فاتورتان بنفس الرقم والمبلغ من مورد واحد في فترة 48 ساعة — محاولة محتملة للدفع المزدوج.',
    amount: 48750, party: 'مؤسسة الوثوق للخدمات', detectedAt: '2026-06-05T09:23:00',
    ruleTriggered: 'قاعدة: فواتير مكررة في نفس الفترة',
  },
  {
    id: '2', level: 'critical', status: 'investigating', aiScore: 88,
    title: 'تحويل مالي لجهة خارجية غير موثقة',
    description: 'تحويل 85,000 ر.س لحساب لا يرتبط بأي مورد معتمد في قاعدة بيانات الشركة.',
    amount: 85000, party: 'غير معروف (SA09 xxxx)', detectedAt: '2026-06-04T16:45:00',
    ruleTriggered: 'قاعدة: مستلم غير موثق في قائمة الموردين',
  },
  {
    id: '3', level: 'high', status: 'open', aiScore: 79,
    title: 'قيمة فاتورة تتجاوز الحد المعتاد بـ 340%',
    description: 'فاتورة خدمات بقيمة 32,000 ر.س من مورد متوسط المعاملات لا تتجاوز 7,400 ر.س عادةً.',
    amount: 32000, party: 'شركة التوريدات العامة', detectedAt: '2026-06-04T11:10:00',
    ruleTriggered: 'قاعدة: انحراف معياري يتجاوز 3 مستويات',
  },
  {
    id: '4', level: 'high', status: 'open', aiScore: 72,
    title: 'معاملات متكررة دون عقود',
    description: 'مورد جديد أصدر 4 فواتير خلال أسبوعين بإجمالي 44,000 ر.س دون عقد موقَّع في النظام.',
    amount: 44000, party: 'مؤسسة النسر للصيانة', detectedAt: '2026-06-03T14:30:00',
    ruleTriggered: 'قاعدة: مورد بدون عقد نشط',
  },
  {
    id: '5', level: 'medium', status: 'resolved', aiScore: 58,
    title: 'طلب فاتورة قبل اعتماد الطلبية',
    description: 'أُصدرت فاتورة قبل توليد أمر الشراء بـ 3 أيام — مخالفة لإجراءات الضبط الداخلي.',
    amount: 8200, party: 'شركة الحلول التقنية', detectedAt: '2026-06-02T08:00:00',
    ruleTriggered: 'قاعدة: الفاتورة تسبق أمر الشراء',
  },
  {
    id: '6', level: 'medium', status: 'false_positive', aiScore: 45,
    title: 'معاملة في ساعات خارج العمل',
    description: 'تمت الموافقة على فاتورة الساعة 2 فجراً — تبيّن أنها موافقة طارئة معتمدة.',
    amount: 5500, party: 'مورد الخدمات الطارئة', detectedAt: '2026-06-01T02:15:00',
    ruleTriggered: 'قاعدة: معاملات خارج أوقات العمل',
  },
]

const CHART_DATA = [
  { day: 'السبت',    alerts: 1 },
  { day: 'الأحد',    alerts: 3 },
  { day: 'الإثنين',  alerts: 2 },
  { day: 'الثلاثاء', alerts: 5 },
  { day: 'الأربعاء', alerts: 2 },
  { day: 'الخميس',  alerts: 4 },
  { day: 'الجمعة',  alerts: 1 },
]

const RULES = [
  { name: 'فواتير مكررة في 48 ساعة', triggered: 3, status: true },
  { name: 'انحراف القيمة > 300%',      triggered: 1, status: true },
  { name: 'مستلم خارج قائمة الموردين', triggered: 2, status: true },
  { name: 'موافقة خارج أوقات العمل',   triggered: 1, status: true },
  { name: 'فاتورة بدون عقد نشط',       triggered: 4, status: false },
]

export default function FraudPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>(FRAUD_ALERTS)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<AlertLevel | 'all'>('all')
  const [rules, setRules] = useState(RULES)

  const cycleStatus = (id: string) => setAlerts((a) => a.map((x) => {
    if (x.id !== id) return x
    const order: AlertStatus[] = ['open', 'investigating', 'resolved', 'false_positive']
    const next = order[(order.indexOf(x.status) + 1) % order.length]
    return { ...x, status: next }
  }))

  const filtered = alerts.filter((a) => {
    if (levelFilter !== 'all' && a.level !== levelFilter) return false
    if (search && !a.title.includes(search) && !a.party.includes(search)) return false
    return true
  })

  const openAlerts = alerts.filter((a) => a.status === 'open').length
  const criticalAlerts = alerts.filter((a) => a.level === 'critical').length
  const totalExposure = alerts.filter((a) => a.status === 'open' || a.status === 'investigating')
    .reduce((s, a) => s + a.amount, 0)
  const avgScore = Math.round(alerts.reduce((s, a) => s + a.aiScore, 0) / alerts.length)

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <Topbar title="اكتشاف الاحتيال" subtitle="رصد المعاملات المشبوهة والتنبيهات الآنية بالذكاء الاصطناعي" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'تنبيهات مفتوحة',   value: openAlerts,              color: 'text-red-600',    icon: ShieldAlert },
          { label: 'حالات حرجة',        value: criticalAlerts,          color: 'text-rose-600',   icon: Flag },
          { label: 'تعرض مالي محتمل',   value: formatCurrency(totalExposure), color: 'text-orange-600', icon: TrendingUp },
          { label: 'متوسط درجة AI',     value: `${avgScore}%`,          color: 'text-purple-600', icon: Brain },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{label}</p>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
            <p className={cn('text-xl font-bold', color)}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Alert trend */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">تنبيهات الأسبوع الماضي</h3>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip formatter={(v) => [`${v} تنبيه`, '']} />
              <Area type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2}
                fill="url(#alertGrad)" dot={{ r: 3, fill: '#ef4444' }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Rules */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">قواعد الكشف</h4>
              <button className="text-xs text-brand-600 hover:underline">+ إضافة قاعدة</button>
            </div>
            <div className="space-y-2">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setRules((r) => r.map((x, j) => j === i ? { ...x, status: !x.status } : x))}
                      className={cn('w-8 h-4 rounded-full transition-colors relative flex-shrink-0', rule.status ? 'bg-green-500' : 'bg-gray-300')}>
                      <div className={cn('absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all', rule.status ? 'right-0.5' : 'left-0.5')} />
                    </button>
                    <span className={rule.status ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 line-through'}>{rule.name}</span>
                  </div>
                  <span className={cn('font-semibold', rule.triggered > 2 ? 'text-red-600' : 'text-gray-500')}>
                    {rule.triggered}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-44">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث في التنبيهات..."
                className="w-full pr-9 pl-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            {(['all', 'critical', 'high', 'medium'] as const).map((l) => (
              <button key={l} onClick={() => setLevelFilter(l)}
                className={cn('px-3 py-1.5 rounded-xl text-xs font-medium transition-colors',
                  levelFilter === l ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200')}>
                {l === 'all' ? 'الكل' : LEVEL_CONFIG[l].label}
              </button>
            ))}
          </div>

          {filtered.map((alert) => {
            const lev = LEVEL_CONFIG[alert.level]
            const st = STATUS_CONFIG[alert.status]
            const StIcon = st.icon
            const scoreColor = alert.aiScore >= 80 ? 'text-red-600' : alert.aiScore >= 60 ? 'text-amber-600' : 'text-gray-500'

            return (
              <div key={alert.id} className={cn('bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 hover:shadow-md transition-shadow')}>
                <div className="flex items-start gap-3">
                  {/* AI Score ring */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="none"
                        stroke={alert.aiScore >= 80 ? '#ef4444' : alert.aiScore >= 60 ? '#f59e0b' : '#9ca3af'}
                        strokeWidth="3" strokeDasharray={`${alert.aiScore * 0.879} ${100}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn('text-xs font-bold', scoreColor)}>{alert.aiScore}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', lev.bg, lev.color)}>{lev.label}</span>
                      <span className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', st.className)}>
                        <StIcon className="w-3 h-3" /> {st.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{alert.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{alert.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-gray-400">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(alert.amount)}</span>
                      <span>·</span>
                      <span>{alert.party}</span>
                      <span>·</span>
                      <span>{new Date(alert.detectedAt).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span className="text-xs text-amber-600">{alert.ruleTriggered}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => cycleStatus(alert.id)} title="تحديث الحالة"
                      className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    {alert.status === 'open' && (
                      <button className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 transition-colors" title="إغلاق">
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
