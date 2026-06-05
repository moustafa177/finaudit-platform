'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { cn } from '@/lib/utils'
import {
  BookOpen, Search, Filter, ExternalLink, Bell, CheckCircle2,
  Clock, AlertTriangle, ChevronDown, ChevronUp, Tag, Calendar,
  Building2, Scale, FileText, Shield
} from 'lucide-react'

type RegCategory = 'all' | 'zatca' | 'vat' | 'socpa' | 'cma' | 'labor'
type RegStatus = 'active' | 'upcoming' | 'updated'

interface Regulation {
  id: string
  title: string
  titleEn: string
  category: Exclude<RegCategory, 'all'>
  status: RegStatus
  effectiveDate: string
  lastUpdated: string
  authority: string
  summary: string
  keyPoints: string[]
  impact: 'high' | 'medium' | 'low'
  subscribed: boolean
  expanded: boolean
}

const CATEGORY_CONFIG: Record<Exclude<RegCategory, 'all'>, { label: string; color: string; bg: string; icon: typeof Shield }> = {
  zatca:  { label: 'هيئة الزكاة والضريبة', color: 'text-green-700',  bg: 'bg-green-100 dark:bg-green-900/30',  icon: Shield   },
  vat:    { label: 'ضريبة القيمة المضافة',  color: 'text-blue-700',   bg: 'bg-blue-100 dark:bg-blue-900/30',   icon: FileText },
  socpa:  { label: 'هيئة المحاسبين',        color: 'text-purple-700', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: BookOpen },
  cma:    { label: 'هيئة السوق المالية',    color: 'text-amber-700',  bg: 'bg-amber-100 dark:bg-amber-900/30',  icon: Scale    },
  labor:  { label: 'العمل والموارد البشرية', color: 'text-red-700',    bg: 'bg-red-100 dark:bg-red-900/30',    icon: Building2},
}

const STATUS_CONFIG: Record<RegStatus, { label: string; className: string }> = {
  active:   { label: 'ساري',     className: 'bg-green-100 text-green-700 dark:bg-green-900/30' },
  upcoming: { label: 'قادم',     className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' },
  updated:  { label: 'محدَّث',   className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' },
}

const IMPACT_CONFIG: Record<string, { label: string; className: string }> = {
  high:   { label: 'تأثير عالٍ',    className: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  medium: { label: 'تأثير متوسط',   className: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  low:    { label: 'تأثير منخفض',   className: 'text-gray-500 bg-gray-100 dark:bg-gray-700' },
}

const INITIAL_REGS: Regulation[] = [
  {
    id: '1', category: 'zatca', status: 'active', impact: 'high', subscribed: true, expanded: false,
    title: 'اشتراطات الفاتورة الإلكترونية — المرحلة الثانية (الربط)',
    titleEn: 'e-Invoicing Phase 2 — Integration',
    authority: 'هيئة الزكاة والضريبة والجمارك (ZATCA)',
    effectiveDate: '2023-01-01', lastUpdated: '2024-11-15',
    summary: 'إلزام المنشآت بربط أنظمتها مباشرة ببوابة الفاتورة الإلكترونية لهيئة الزكاة وتبادل الفواتير في الوقت الفعلي.',
    keyPoints: [
      'الربط المباشر مع منظومة FATOORAH',
      'توليد UUID فريد لكل فاتورة',
      'التوقيع الإلكتروني بشهادة رقمية معتمدة',
      'التحقق الفوري قبل إصدار الفاتورة للعميل',
      'الاحتفاظ بسجلات الفواتير لمدة 5 سنوات',
    ],
  },
  {
    id: '2', category: 'vat', status: 'active', impact: 'high', subscribed: true, expanded: false,
    title: 'الإقرار الضريبي لضريبة القيمة المضافة — نظام الفترات',
    titleEn: 'VAT Return Filing — Period System',
    authority: 'هيئة الزكاة والضريبة والجمارك',
    effectiveDate: '2018-01-01', lastUpdated: '2024-06-01',
    summary: 'التزامات تقديم الإقرار الضريبي وسداد ضريبة القيمة المضافة وفقاً لحجم المنشأة وفترة الإقرار.',
    keyPoints: [
      'المنشآت ذات الإيرادات فوق 40م ر.س: إقرار شهري',
      'الإيرادات بين 5م و40م ر.س: إقرار ربع سنوي',
      'الإيرادات دون 5م ر.س: إقرار نصف سنوي',
      'غرامة التأخر: 5% من الضريبة عن كل شهر',
      'الحد الأدنى للتسجيل: 375,000 ر.س سنوياً',
    ],
  },
  {
    id: '3', category: 'zatca', status: 'upcoming', impact: 'high', subscribed: false, expanded: false,
    title: 'تحديث معايير التحقق من الهوية الضريبية — 2026',
    titleEn: 'Tax Identity Verification Update 2026',
    authority: 'ZATCA',
    effectiveDate: '2026-09-01', lastUpdated: '2026-05-01',
    summary: 'إلزام جميع المنشآت باستخدام الهوية الوطنية الرقمية للتحقق من هوية الممثل القانوني عند تقديم الإقرارات.',
    keyPoints: [
      'ربط الحسابات الضريبية بالهوية الوطنية الرقمية',
      'مدة انتقالية 6 أشهر من تاريخ النفاذ',
      'إلغاء التوثيق الورقي بشكل كامل',
    ],
  },
  {
    id: '4', category: 'socpa', status: 'updated', impact: 'medium', subscribed: false, expanded: false,
    title: 'المعيار السعودي للمحاسبة SOCPA — تحديث IFRS 16',
    titleEn: 'SOCPA — IFRS 16 Leases Update',
    authority: 'الهيئة السعودية للمحاسبين القانونيين',
    effectiveDate: '2025-01-01', lastUpdated: '2025-03-10',
    summary: 'اعتماد معيار IFRS 16 المُعدَّل للإيجارات مع متطلبات إفصاح إضافية خاصة بالسوق السعودية.',
    keyPoints: [
      'إدراج عقود الإيجار في الميزانية العمومية',
      'الإفصاح عن التزامات حق الاستخدام',
      'التطبيق الإلزامي على المنشآت المدرجة',
    ],
  },
  {
    id: '5', category: 'cma', status: 'active', impact: 'medium', subscribed: false, expanded: false,
    title: 'لوائح مكافحة غسل الأموال وتمويل الإرهاب — تحديث',
    titleEn: 'AML/CTF Regulations Update',
    authority: 'هيئة السوق المالية (CMA)',
    effectiveDate: '2024-07-01', lastUpdated: '2024-07-01',
    summary: 'تعزيز متطلبات العناية الواجبة بالعملاء وتقارير المعاملات المشبوهة وفقاً لتوصيات FATF.',
    keyPoints: [
      'تعزيز إجراءات اعرف عميلك (KYC)',
      'الإبلاغ الإلزامي عن المعاملات فوق 60,000 ر.س',
      'تعيين مسؤول امتثال AML معتمد',
      'تقرير سنوي للهيئة عن مخاطر غسل الأموال',
    ],
  },
  {
    id: '6', category: 'labor', status: 'active', impact: 'low', subscribed: false, expanded: false,
    title: 'الوثائق المالية لصرف الرواتب — توطين الأجور',
    titleEn: 'Wage Protection System (WPS)',
    authority: 'وزارة الموارد البشرية والتنمية الاجتماعية',
    effectiveDate: '2013-01-01', lastUpdated: '2024-01-01',
    summary: 'إلزام المنشآت بصرف الرواتب عبر نظام حماية الأجور وتسجيل كافة بيانات الصرف إلكترونياً.',
    keyPoints: [
      'صرف الرواتب عبر قنوات بنكية معتمدة',
      'التسجيل في منظومة حماية الأجور (WPS)',
      'غرامة التأخر عن صرف الرواتب: تجميد التأشيرات',
    ],
  },
]

export default function RegulationsPage() {
  const [regs, setRegs] = useState<Regulation[]>(INITIAL_REGS)
  const [category, setCategory] = useState<RegCategory>('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<RegStatus | 'all'>('all')

  const toggle = (id: string) => setRegs((r) => r.map((x) => x.id === id ? { ...x, expanded: !x.expanded } : x))
  const toggleSubscribe = (id: string) => setRegs((r) => r.map((x) => x.id === id ? { ...x, subscribed: !x.subscribed } : x))

  const filtered = regs.filter((r) => {
    if (category !== 'all' && r.category !== category) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (search && !r.title.includes(search) && !r.summary.includes(search)) return false
    return true
  })

  const upcoming = regs.filter((r) => r.status === 'upcoming').length
  const subscribed = regs.filter((r) => r.subscribed).length
  const highImpact = regs.filter((r) => r.impact === 'high').length

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <Topbar title="التشريعات المالية" subtitle="مستجدات الأنظمة والمراسيم المالية السعودية" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي التشريعات', value: regs.length,  icon: BookOpen,      color: 'text-brand-600',  bg: 'bg-brand-50 dark:bg-brand-900/20' },
          { label: 'تشريعات قادمة',    value: upcoming,     icon: Clock,         color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'تأثير عالٍ',       value: highImpact,   icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'متابَعة',           value: subscribed,   icon: Bell,          color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في التشريعات..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1 flex-wrap">
          {(['all', 'zatca', 'vat', 'socpa', 'cma', 'labor'] as RegCategory[]).map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                category === c ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700')}>
              {c === 'all' ? 'الكل' : CATEGORY_CONFIG[c].label}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as RegStatus | 'all')}
          className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="all">كل الحالات</option>
          <option value="active">ساري</option>
          <option value="upcoming">قادم</option>
          <option value="updated">محدَّث</option>
        </select>
      </div>

      {/* Regulations List */}
      <div className="space-y-3">
        {filtered.map((reg) => {
          const cat = CATEGORY_CONFIG[reg.category]
          const CatIcon = cat.icon
          return (
            <div key={reg.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="flex items-start gap-4 p-5">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cat.bg)}>
                  <CatIcon className={cn('w-5 h-5', cat.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', STATUS_CONFIG[reg.status].className)}>
                      {STATUS_CONFIG[reg.status].label}
                    </span>
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', IMPACT_CONFIG[reg.impact].className)}>
                      {IMPACT_CONFIG[reg.impact].label}
                    </span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border', cat.bg, cat.color)}>
                      {cat.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{reg.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{reg.authority} · نفاذ: {reg.effectiveDate}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{reg.summary}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button onClick={() => toggleSubscribe(reg.id)}
                    className={cn('p-1.5 rounded-lg transition-colors', reg.subscribed
                      ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-brand-500')}>
                    <Bell className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggle(reg.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                    {reg.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {reg.expanded && (
                <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-4">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">النقاط الرئيسية</h4>
                  <ul className="space-y-2">
                    {reg.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" /> آخر تحديث: {reg.lastUpdated}
                    </div>
                    <a href="#" className="flex items-center gap-1 text-xs text-brand-600 hover:underline mr-auto">
                      <ExternalLink className="w-3.5 h-3.5" /> الرابط الرسمي
                    </a>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
