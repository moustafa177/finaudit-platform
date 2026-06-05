'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { cn } from '@/lib/utils'
import { aiApi } from '@/lib/api'
import {
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2,
  RefreshCw, Eye, Wrench, Trash2, Sparkles, TrendingUp, Brain
} from 'lucide-react'

type IssueType = 'duplicate' | 'missing' | 'vat_mismatch' | 'date_error' | 'format'
type IssueSeverity = 'critical' | 'warning' | 'info'
type IssueStatus = 'pending' | 'fixed' | 'ignored'

interface DataIssue {
  id: string
  type: IssueType | string
  severity: IssueSeverity
  field: string
  record: string
  description: string
  suggestion: string
  status: IssueStatus
}

const ISSUE_LABELS: Record<string, string> = {
  duplicate: 'تكرار', missing: 'قيمة مفقودة',
  vat_mismatch: 'تناقض ضريبي', date_error: 'خطأ في التاريخ', format: 'تنسيق خاطئ',
}

const SEVERITY_CONFIG: Record<IssueSeverity, { label: string; icon: typeof XCircle; className: string }> = {
  critical: { label: 'حرج',   icon: XCircle,       className: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  warning:  { label: 'تحذير', icon: AlertTriangle,  className: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  info:     { label: 'معلومة',icon: CheckCircle2,   className: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
}

export default function CleansingPage() {
  const [issues, setIssues] = useState<DataIssue[]>([])
  const [cleanScore, setCleanScore] = useState<number | null>(null)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<IssueSeverity | 'all'>('all')

  const fetchAnalysis = async () => {
    setLoading(true)
    try {
      const res = await aiApi.dataCleansing()
      const data = res.data.data
      const rawIssues = (data.issues || []).map((issue: Omit<DataIssue, 'id' | 'status'>, i: number) => ({
        ...issue,
        id: String(i + 1),
        status: 'pending' as IssueStatus,
      }))
      setIssues(rawIssues)
      setCleanScore(data.cleanScore ?? 100)
      setSummary(data.summary ?? '')
    } catch {
      setSummary('تعذّر الاتصال بخدمة الذكاء الاصطناعي')
      setCleanScore(100)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAnalysis() }, [])

  const pending  = issues.filter((i) => i.status === 'pending')
  const fixed    = issues.filter((i) => i.status === 'fixed')
  const critical = pending.filter((i) => i.severity === 'critical').length

  const updateStatus = (id: string, status: IssueStatus) =>
    setIssues((prev) => prev.map((i) => i.id === id ? { ...i, status } : i))

  const fixAll = () => setIssues((prev) => prev.map((i) => i.status === 'pending' ? { ...i, status: 'fixed' } : i))

  const displayed = issues.filter((i) => filter === 'all' ? true : i.severity === filter)
  const score = cleanScore ?? (issues.length === 0 ? 100 : Math.round(((issues.length - pending.length) / issues.length) * 100))
  const rateColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Topbar title="Smart Data Cleansing" subtitle="تنظيف وتصحيح البيانات المالية بالذكاء الاصطناعي Claude" />

      {/* Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3" strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{score}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">جودة البيانات</p>
            <p className={cn('text-sm font-bold mt-0.5', rateColor)}>
              {score >= 80 ? 'ممتاز' : score >= 60 ? 'جيد' : 'يحتاج تحسين'}
            </p>
          </div>
        </div>
        {[
          { label: 'مشاكل حرجة',  value: critical,       color: 'text-red-600' },
          { label: 'تم الإصلاح',  value: fixed.length,   color: 'text-green-600' },
          { label: 'تبقى',         value: pending.length, color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <p className={cn('text-3xl font-bold', color)}>{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      {summary && (
        <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl">
          <Brain className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-purple-800 dark:text-purple-200">{summary}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {(['all', 'critical', 'warning', 'info'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                filter === f ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500')}>
              {f === 'all' ? 'الكل' : f === 'critical' ? 'حرج' : f === 'warning' ? 'تحذير' : 'معلومة'}
            </button>
          ))}
        </div>
        <button onClick={fetchAnalysis}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          {loading ? 'يحلل Claude...' : 'إعادة التحليل'}
        </button>
        <button onClick={fixAll} disabled={pending.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl text-sm font-medium transition-colors">
          <Sparkles className="w-4 h-4" /> إصلاح تلقائي للكل
        </button>
      </div>

      {/* Issues */}
      <div className="space-y-3">
        {loading && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Claude يحلل بياناتك...</p>
          </div>
        )}
        {!loading && displayed.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">لا توجد مشاكل — بياناتك نظيفة!</p>
          </div>
        )}
        {!loading && displayed.map((issue) => {
          const sev = SEVERITY_CONFIG[issue.severity as IssueSeverity] ?? SEVERITY_CONFIG.info
          const SevIcon = sev.icon
          return (
            <div key={issue.id}
              className={cn('bg-white dark:bg-gray-900 rounded-2xl border shadow-sm p-4 transition-all',
                issue.status === 'fixed' ? 'opacity-50 border-green-200' :
                issue.status === 'ignored' ? 'opacity-40 border-gray-100 dark:border-gray-800' :
                'border-gray-100 dark:border-gray-800 hover:shadow-md')}>
              <div className="flex items-start gap-4">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', sev.className.split(' ').slice(1).join(' '))}>
                  {issue.status === 'fixed'
                    ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                    : <SevIcon className={cn('w-5 h-5', sev.className.split(' ')[0])} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', sev.className)}>{sev.label}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {ISSUE_LABELS[issue.type] ?? issue.type}
                    </span>
                    <span className="text-xs text-gray-400">{issue.field} — <span className="font-mono">{issue.record}</span></span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-white mt-1.5">{issue.description}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-500" />
                    <p className="text-xs text-brand-600">{issue.suggestion}</p>
                  </div>
                </div>
                {issue.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateStatus(issue.id, 'fixed')} className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 transition-colors"><Wrench className="w-3.5 h-3.5" /></button>
                    <button onClick={() => updateStatus(issue.id, 'pending')} className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => updateStatus(issue.id, 'ignored')} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {issue.status === 'fixed' && <span className="text-xs font-semibold text-green-600 flex-shrink-0">✓ تم</span>}
                {issue.status === 'ignored' && <span className="text-xs text-gray-400 flex-shrink-0">مُتجاهَل</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
