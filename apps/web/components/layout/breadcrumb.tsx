'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── خريطة المسارات ─────────────────────────────────────────────────────
const ROUTE_MAP: Record<string, string> = {
  overview:    'لوحة التحكم',
  invoices:    'الفواتير',
  new:         'فاتورة جديدة',
  compliance:  'الامتثال ZATCA',
  reports:     'التقارير',
  regulations: 'التشريعات المالية',
  risk:        'إدارة المخاطر',
  fraud:       'اكتشاف الاحتيال',
  rpa:         'AI-Powered RPA',
  cleansing:   'تنظيف البيانات',
  forecasting: 'توقعات الطلب',
  costing:     'تسعير الخدمات',
  settings:    'الإعدادات',
}

interface Crumb {
  label: string
  href: string
  isLast: boolean
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: Crumb[] = [{ label: 'الرئيسية', href: '/overview', isLast: false }]

  let path = ''
  segments.forEach((seg, i) => {
    path += `/${seg}`
    const label = ROUTE_MAP[seg] ?? seg
    crumbs.push({ label, href: path, isLast: i === segments.length - 1 })
  })

  // لا نُظهر "الرئيسية" إذا كنا في overview نفسها
  if (pathname === '/overview') return []

  return crumbs
}

export function Breadcrumb() {
  const pathname = usePathname()
  const router = useRouter()
  const crumbs = buildCrumbs(pathname)

  // صفحة رئيسية — لا شيء
  if (crumbs.length === 0) return null

  const isSubPage = crumbs.length > 2
  const parentCrumb = crumbs[crumbs.length - 2]

  return (
    <div className="flex items-center gap-3 flex-wrap">

      {/* زر الرجوع — يظهر فقط في الصفحات الفرعية */}
      {isSubPage && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm text-xs font-medium group"
        >
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          رجوع
        </button>
      )}

      {/* Breadcrumbs */}
      <nav aria-label="مسار التنقل">
        <ol className="flex items-center gap-1 flex-wrap">
          {crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-1">
              {/* فاصل */}
              {i > 0 && (
                <ChevronLeft className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
              )}

              {crumb.isLast ? (
                /* الصفحة الحالية */
                <span className="text-xs font-semibold text-gray-900 dark:text-white px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                  {crumb.label}
                </span>
              ) : (
                /* رابط قابل للنقر */
                <Link
                  href={crumb.href}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors px-1 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
