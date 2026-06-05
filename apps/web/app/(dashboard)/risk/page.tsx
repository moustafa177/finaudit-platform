'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { cn, formatCurrency } from '@/lib/utils'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import {
  AlertTriangle, Shield, TrendingDown, CheckCircle2,
  ArrowUpRight, Clock, ChevronDown, ChevronUp, Target, Zap
} from 'lucide-react'

type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
type RiskCategory = 'compliance' | 'operational' | 'financial' | 'fraud' | 'tax'
type MitigationStatus = 'pending' | 'in_progress' | 'done'

interface Risk {
  id: string
  title: string
  category: RiskCategory
  probability: number   // 1–5
  impact: number        // 1–5
  level: RiskLevel
  potentialLoss: number
  description: string
  mitigation: string
  owner: string
  dueDate: string
  mitigationStatus: MitigationStatus
  expanded: boolean
}

const LEVEL_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; border: string; dot: string }> = {
  critical: { label: 'حرج',     color: 'text-red-700',    bg: 'bg-red-100 dark:bg-red-900/30',     border: 'border-red-300',  dot: 'bg-red-500' },
  high:     { label: 'مرتفع',   color: 'text-orange-700', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-300', dot: 'bg-orange-500' },
  medium:   { label: 'متوسط',   color: 'text-amber-700',  bg: 'bg-amber-100 dark:bg-amber-900/30',  border: 'border-amber-300', dot: 'bg-amber-500' },
  low:      { label: 'منخفض',   color: 'text-green-700',  bg: 'bg-green-100 dark:bg-green-900/30',  border: 'border-green-300', dot: 'bg-green-500' },
}

const CAT_CONFIG: Record<RiskCategory, { label: string; color: string }> = {
  compliance:  { label: 'الامتثال',          color: 'text-blue-600' },
  operational: { label: 'التشغيل',           color: 'text-purple-600' },
  financial:   { label: 'مالي',              color: 'text-red-600' },
  fraud:       { label: 'الاحتيال',          color: 'text-rose-600' },
  tax:         { label: 'ضريبي',             color: 'text-amber-600' },
}

const MIT_CONFIG: Record<MitigationStatus, { label: string; className: string }> = {
  pending:     { label: 'لم يبدأ',   className: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'جارٍ',      className: 'bg-blue-100 text-blue-700' },
  done:        { label: 'مكتمل',     className: 'bg-green-100 text-green-700' },
}

const RISKS: Risk[] = [
  {
    id: '1', category: 'compliance', level: 'critical', probability: 4, impact: 5, potentialLoss: 120000,
    title: 'عدم الامتثال لمتطلبات الربط الآني ZATCA',
    description: 'تأخر تكامل النظام مع بوابة FATOORAH قد يُعرِّض المنشأة لغرامات يومية تصل إلى 50,000 ر.س.',
    mitigation: 'إسناد مهمة الربط لمزود خدمة معتمد وتحديد موعد تنفيذ لا يتجاوز 30 يوماً.',
    owner: 'مدير تقنية المعلومات', dueDate: '2026-07-15', mitigationStatus: 'in_progress', expanded: false,
  },
  {
    id: '2', category: 'tax', level: 'high', probability: 3, impact: 5, potentialLoss: 85000,
    title: 'أخطاء في احتساب ضريبة القيمة المضافة',
    description: 'اكتشاف فروق في احتساب الضريبة على الفواتير المتقاطعة بين الأنشطة المختلفة.',
    mitigation: 'مراجعة دورية شهرية للحسابات الضريبية واستخدام نظام التحقق التلقائي.',
    owner: 'المحاسب الرئيسي', dueDate: '2026-07-01', mitigationStatus: 'in_progress', expanded: false,
  },
  {
    id: '3', category: 'fraud', level: 'high', probability: 3, impact: 4, potentialLoss: 60000,
    title: 'مخاطر فواتير مزوّرة من موردين غير موثوقين',
    description: 'رصد 3 معاملات مشبوهة من موردين جدد بقيم غير معتادة ودون عقود موثقة.',
    mitigation: 'تفعيل نظام التحقق الثلاثي (three-way match) لكل مشتريات فوق 10,000 ر.س.',
    owner: 'مدير المشتريات', dueDate: '2026-06-20', mitigationStatus: 'pending', expanded: false,
  },
  {
    id: '4', category: 'operational', level: 'medium', probability: 3, impact: 3, potentialLoss: 25000,
    title: 'انقطاع نظام المحاسبة عن قاعدة البيانات',
    description: 'سجلت الأنظمة 4 حالات انقطاع خلال الربع الأول أثرت على توافر البيانات المالية.',
    mitigation: 'تطبيق خطة تعافي من الكوارث مع نسخ احتياطية كل 4 ساعات على السحابة السعودية.',
    owner: 'مدير العمليات', dueDate: '2026-08-01', mitigationStatus: 'pending', expanded: false,
  },
  {
    id: '5', category: 'financial', level: 'medium', probability: 2, impact: 4, potentialLoss: 40000,
    title: 'تركّز الإيرادات على عميل واحد',
    description: 'عميل واحد يمثل 38% من إجمالي الإيرادات — مخاطرة عالية في حال إنهاء العقد.',
    mitigation: 'استراتيجية تنويع قاعدة العملاء وتحديد سقف 25% لأي عميل منفرد.',
    owner: 'مدير المبيعات', dueDate: '2026-12-31', mitigationStatus: 'in_progress', expanded: false,
  },
  {
    id: '6', category: 'compliance', level: 'low', probability: 1, impact: 3, potentialLoss: 10000,
    title: 'انتهاء صلاحية شهادات التوقيع الرقمي',
    description: 'شهادتان رقميتان تنتهي صلاحيتهما خلال 60 يوماً.',
    mitigation: 'تجديد الشهادات من خلال هيئة الاتصالات وتقنية المعلومات.',
    owner: 'مدير الامتثال', dueDate: '2026-07-30', mitigationStatus: 'done', expanded: false,
  },
]

const SCATTER_COLORS = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#22c55e' }

export default function RiskPage() {
  const [risks, setRisks] = useState<Risk[]>(RISKS)
  const [levelFilter, setLevelFilter] = useState<RiskLevel | 'all'>('all')

  const toggle = (id: string) => setRisks((r) => r.map((x) => x.id === id ? { ...x, expanded: !x.expanded } : x))
  const cycleStatus = (id: string) => setRisks((r) => r.map((x) => {
    if (x.id !== id) return x
    const order: MitigationStatus[] = ['pending', 'in_progress', 'done']
    const next = order[(order.indexOf(x.mitigationStatus) + 1) % order.length]
    return { ...x, mitigationStatus: next }
  }))

  const filtered = levelFilter === 'all' ? risks : risks.filter((r) => r.level === levelFilter)

  const totalLoss = risks.reduce((s, r) => s + r.potentialLoss, 0)
  const critical = risks.filter((r) => r.level === 'critical').length
  const done = risks.filter((r) => r.mitigationStatus === 'done').length
  const riskScore = Math.round(risks.reduce((s, r) => s + r.probability * r.impact, 0) / risks.length * 10)

  const scatterData = risks.map((r) => ({
    x: r.probability, y: r.impact,
    z: r.potentialLoss / 10000,
    level: r.level, title: r.title,
  }))

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <Topbar title="إدارة المخاطر" subtitle="مصفوفة المخاطر المالية والامتثالية وخطط التخفيف" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'درجة المخاطرة الكلية', value: `${riskScore}/100`, color: riskScore > 60 ? 'text-red-600' : 'text-amber-600', icon: Target },
          { label: 'مخاطر حرجة',           value: critical,            color: 'text-red-600',    icon: AlertTriangle },
          { label: 'خسائر محتملة',         value: formatCurrency(totalLoss), color: 'text-orange-600', icon: TrendingDown },
          { label: 'مخاطر مُعالَجة',        value: `${done}/${risks.length}`, color: 'text-green-600', icon: Shield },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500">{label}</p>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
            <p className={cn('text-xl font-bold', color)}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Risk Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">مصفوفة المخاطر (الاحتمالية × التأثير)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" dataKey="x" domain={[0, 6]} tick={{ fontSize: 10 }} tickCount={6} label={{ value: 'الاحتمالية', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#9ca3af' }} />
              <YAxis type="number" dataKey="y" domain={[0, 6]} tick={{ fontSize: 10 }} tickCount={6} label={{ value: 'التأثير', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#9ca3af' }} />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-2.5 shadow text-xs max-w-40">
                      <p className="font-semibold text-gray-900 dark:text-white">{d.title}</p>
                    </div>
                  )
                }} />
              <Scatter data={scatterData}>
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={SCATTER_COLORS[entry.level as RiskLevel]} fillOpacity={0.75} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.entries(LEVEL_CONFIG).map(([level, { label, dot }]) => (
              <div key={level} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className={cn('w-2.5 h-2.5 rounded-full', dot)} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Risk List */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((l) => (
              <button key={l} onClick={() => setLevelFilter(l)}
                className={cn('px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                  levelFilter === l ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200')}>
                {l === 'all' ? 'الكل' : LEVEL_CONFIG[l].label}
              </button>
            ))}
          </div>

          {filtered.map((risk) => {
            const lev = LEVEL_CONFIG[risk.level]
            const mit = MIT_CONFIG[risk.mitigationStatus]
            return (
              <div key={risk.id} className={cn('bg-white dark:bg-gray-900 rounded-2xl border shadow-sm overflow-hidden', lev.border)}>
                <div className="flex items-start gap-3 p-4">
                  <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', lev.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded', lev.bg, lev.color)}>{lev.label}</span>
                      <span className={cn('text-xs', CAT_CONFIG[risk.category].color)}>{CAT_CONFIG[risk.category].label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{risk.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> {formatCurrency(risk.potentialLoss)}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {risk.dueDate}
                      </span>
                      <button onClick={() => cycleStatus(risk.id)}
                        className={cn('text-xs px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer', mit.className)}>
                        {mit.label}
                      </button>
                    </div>
                  </div>
                  <button onClick={() => toggle(risk.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 flex-shrink-0">
                    {risk.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {risk.expanded && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-800/30 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">وصف المخاطرة</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{risk.description}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-green-500" /> خطة التخفيف
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{risk.mitigation}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700">
                      <span>المسؤول: <span className="font-medium text-gray-600 dark:text-gray-300">{risk.owner}</span></span>
                      <span>احتمالية: {risk.probability}/5 · تأثير: {risk.impact}/5</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
