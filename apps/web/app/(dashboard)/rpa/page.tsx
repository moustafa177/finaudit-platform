'use client'

import { useState, useRef } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { StatCard } from '@/components/ui/stat-card'
import { cn, formatCurrency } from '@/lib/utils'
import {
  FileText, Table, Building2, Mail, Upload, Zap, CheckCircle2,
  Clock, AlertTriangle, Play, Pause, RefreshCw, ChevronRight, Brain
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────
type SourceType = 'pdf' | 'excel' | 'bank' | 'email'
type ExtractionStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

interface ExtractedField {
  field: string
  value: string
  confidence: number
}

interface AutomationRule {
  id: string
  name: string
  source: SourceType
  schedule: string
  status: 'active' | 'paused'
  lastRun: string
  processed: number
}

// ── Constants ──────────────────────────────────────────────────────────
const SOURCES: { type: SourceType; label: string; icon: typeof FileText; accept: string; color: string; bg: string }[] = [
  { type: 'pdf',   label: 'فواتير PDF',       icon: FileText,  accept: '.pdf',       color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-900/20' },
  { type: 'excel', label: 'Excel / CSV',       icon: Table,     accept: '.xlsx,.csv', color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20' },
  { type: 'bank',  label: 'كشف البنك',         icon: Building2, accept: '.pdf,.csv',  color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { type: 'email', label: 'بريد إلكتروني',    icon: Mail,      accept: '.eml,.msg',  color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
]

const MOCK_EXTRACTIONS: Record<SourceType, ExtractedField[]> = {
  pdf: [
    { field: 'رقم الفاتورة', value: 'INV-2026-00142', confidence: 98 },
    { field: 'اسم المورد',   value: 'شركة التقنية المتقدمة', confidence: 95 },
    { field: 'الرقم الضريبي', value: '310122519900003', confidence: 97 },
    { field: 'تاريخ الإصدار', value: '2026-05-15', confidence: 99 },
    { field: 'المبلغ الإجمالي', value: '11,500 ر.س', confidence: 96 },
    { field: 'ضريبة القيمة المضافة', value: '1,500 ر.س', confidence: 99 },
  ],
  excel: [
    { field: 'عدد الصفوف المستوردة', value: '247 سجل', confidence: 100 },
    { field: 'إجمالي المبيعات', value: '342,800 ر.س', confidence: 99 },
    { field: 'الفترة الزمنية', value: 'يناير — مارس 2026', confidence: 94 },
    { field: 'عدد العملاء', value: '38 عميل', confidence: 98 },
  ],
  bank: [
    { field: 'رقم الحساب', value: 'SA29 8000 0000 6080 1016 7519', confidence: 99 },
    { field: 'الرصيد الافتتاحي', value: '215,400 ر.س', confidence: 100 },
    { field: 'إجمالي الإيداعات', value: '89,250 ر.س', confidence: 98 },
    { field: 'إجمالي السحوبات', value: '42,100 ر.س', confidence: 98 },
    { field: 'عدد المعاملات', value: '34 معاملة', confidence: 100 },
  ],
  email: [
    { field: 'المرسِل', value: 'accounts@vendor.com.sa', confidence: 100 },
    { field: 'الموضوع', value: 'فاتورة خدمات مارس 2026', confidence: 97 },
    { field: 'المبلغ المذكور', value: '8,625 ر.س', confidence: 89 },
    { field: 'تاريخ الاستحقاق', value: '2026-04-15', confidence: 92 },
  ],
}

const MOCK_RULES: AutomationRule[] = [
  { id: '1', name: 'استخراج فواتير الموردين', source: 'pdf',   schedule: 'يومياً 8 صباحاً', status: 'active', lastRun: 'منذ 3 ساعات', processed: 142 },
  { id: '2', name: 'مزامنة كشف البنك',        source: 'bank',  schedule: 'أسبوعياً الأحد',  status: 'active', lastRun: 'منذ يومين',   processed: 28 },
  { id: '3', name: 'استيراد تقارير المبيعات',  source: 'excel', schedule: 'شهرياً أول الشهر', status: 'paused', lastRun: 'منذ شهر',     processed: 6 },
]

// ── Component ──────────────────────────────────────────────────────────
export default function RpaPage() {
  const [activeSource, setActiveSource] = useState<SourceType>('pdf')
  const [status, setStatus] = useState<ExtractionStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [extracted, setExtracted] = useState<ExtractedField[]>([])
  const [rules, setRules] = useState<AutomationRule[]>(MOCK_RULES)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const runExtraction = () => {
    setStatus('uploading')
    setProgress(0)
    setExtracted([])

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 40) { setStatus('processing'); clearInterval(interval) }
        return p + 8
      })
    }, 120)

    setTimeout(() => {
      const proc = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(proc); setStatus('done'); setExtracted(MOCK_EXTRACTIONS[activeSource]); return 100 }
          return p + 6
        })
      }, 100)
    }, 700)
  }

  const toggleRule = (id: string) => {
    setRules((r) => r.map((x) => x.id === id ? { ...x, status: x.status === 'active' ? 'paused' : 'active' } : x))
  }

  const src = SOURCES.find((s) => s.type === activeSource)!

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Topbar title="AI-Powered RPA" subtitle="أتمتة استخراج البيانات المالية بالذكاء الاصطناعي" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="مستندات مُعالَجة" value="1,284" change="هذا الشهر" changeType="up" icon={FileText} />
        <StatCard title="دقة الاستخراج" value="96.8%" change="+1.2% عن الشهر الماضي" changeType="up" icon={Brain}
          iconColor="text-purple-600" iconBg="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard title="ساعات موفَّرة" value="47 ساعة" change="هذا الأسبوع" changeType="up" icon={Clock}
          iconColor="text-green-600" iconBg="bg-green-50 dark:bg-green-900/20" />
        <StatCard title="مهام نشطة" value="2" change="من 3 مهام إجمالاً" changeType="neutral" icon={Zap}
          iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-900/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Upload Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Source Selector */}
          <div className="grid grid-cols-4 gap-2">
            {SOURCES.map(({ type, label, icon: Icon, color, bg }) => (
              <button key={type} onClick={() => { setActiveSource(type); setStatus('idle'); setExtracted([]) }}
                className={cn('flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium',
                  activeSource === type
                    ? `border-brand-500 ${bg} ${color}`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-500')}>
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (status === 'idle') runExtraction() }}
            onClick={() => status === 'idle' && inputRef.current?.click()}
            className={cn(
              'relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all',
              isDragging
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',
              status !== 'idle' && 'cursor-default pointer-events-none',
            )}>
            <input ref={inputRef} type="file" accept={src.accept} className="hidden"
              onChange={() => { if (status === 'idle') runExtraction() }} />

            {status === 'idle' && (
              <div className="space-y-3">
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mx-auto', src.bg)}>
                  <src.icon className={cn('w-7 h-7', src.color)} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">اسحب {src.label} هنا</p>
                  <p className="text-sm text-gray-400 mt-1">أو انقر للتصفح — يدعم {src.accept}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); runExtraction() }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors">
                  <Zap className="w-4 h-4" /> استخراج بالذكاء الاصطناعي
                </button>
              </div>
            )}

            {(status === 'uploading' || status === 'processing') && (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {status === 'uploading' ? 'جاري الرفع...' : 'الذكاء الاصطناعي يحلل المستند...'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">يُرجى الانتظار</p>
                </div>
                <div className="w-64 mx-auto">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{progress}%</p>
                </div>
              </div>
            )}

            {status === 'done' && (
              <div className="space-y-2">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <p className="font-semibold text-green-700 dark:text-green-400">اكتمل الاستخراج بنجاح!</p>
                <button onClick={(e) => { e.stopPropagation(); setStatus('idle'); setExtracted([]) }}
                  className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline">
                  <RefreshCw className="w-3.5 h-3.5" /> رفع مستند آخر
                </button>
              </div>
            )}
          </div>

          {/* Extracted Fields */}
          {extracted.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">البيانات المستخرجة</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" /> تحويل إلى فاتورة
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    {['الحقل', 'القيمة المستخرجة', 'دقة الاستخراج'].map((h) => (
                      <th key={h} className="text-right text-xs font-semibold text-gray-500 px-4 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {extracted.map((row) => (
                    <tr key={row.field} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">{row.field}</td>
                      <td className="px-4 py-2.5 text-gray-900 dark:text-white font-mono text-xs">{row.value}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className={cn('h-full rounded-full', row.confidence >= 95 ? 'bg-green-500' : row.confidence >= 85 ? 'bg-amber-500' : 'bg-red-500')}
                              style={{ width: `${row.confidence}%` }} />
                          </div>
                          <span className={cn('text-xs font-semibold w-8', row.confidence >= 95 ? 'text-green-600' : row.confidence >= 85 ? 'text-amber-600' : 'text-red-600')}>
                            {row.confidence}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Automation Rules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">مهام الأتمتة المجدولة</h3>
              <button className="text-xs text-brand-600 hover:underline">+ إضافة مهمة</button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {rules.map((rule) => {
                const SrcIcon = SOURCES.find((s) => s.type === rule.source)!.icon
                const srcColor = SOURCES.find((s) => s.type === rule.source)!.color
                return (
                  <div key={rule.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', SOURCES.find((s) => s.type === rule.source)!.bg)}>
                          <SrcIcon className={cn('w-4 h-4', srcColor)} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{rule.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{rule.schedule}</p>
                          <p className="text-xs text-gray-400">آخر تشغيل: {rule.lastRun} · {rule.processed} مستند</p>
                        </div>
                      </div>
                      <button onClick={() => toggleRule(rule.id)}
                        className={cn('p-1.5 rounded-lg transition-colors flex-shrink-0', rule.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200')}>
                        {rule.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">نصيحة الذكاء الاصطناعي</span>
            </div>
            <p className="text-sm text-blue-100">
              لاحظنا أن 12 فاتورة من المورد "شركة التقنية" تتكرر شهرياً. أضف قاعدة أتمتة لمعالجتها تلقائياً وتوفير 3 ساعات يومياً.
            </p>
            <button className="mt-3 text-xs font-semibold underline hover:no-underline">
              إنشاء القاعدة تلقائياً →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
