'use client'

import { Topbar } from '@/components/layout/topbar'
import { BarChart3, Download, FileText, TrendingUp, Calendar } from 'lucide-react'

const reportTypes = [
  {
    icon: TrendingUp,
    title: 'تقرير الإيرادات والمصروفات',
    description: 'ملخص شامل للإيرادات والمصروفات خلال الفترة المحددة',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  },
  {
    icon: FileText,
    title: 'تقرير ضريبة القيمة المضافة (VAT Return)',
    description: 'التقرير الرسمي للإقرار الضريبي المتوافق مع متطلبات الهيئة',
    color: 'bg-green-50 dark:bg-green-900/20 text-green-600',
  },
  {
    icon: BarChart3,
    title: 'تقرير الامتثال ZATCA الشهري',
    description: 'تحليل مستوى الامتثال للفاتورة الإلكترونية خلال الشهر',
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
  },
  {
    icon: Calendar,
    title: 'تقرير التدفق النقدي',
    description: 'تتبع حركة الأموال الواردة والصادرة وتوقعات السيولة',
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
  },
]

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <Topbar title="التقارير" subtitle="تقارير مالية شاملة جاهزة للتصدير" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reportTypes.map(({ icon: Icon, title, description, color }) => (
          <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-medium transition-colors">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors">
                <Download className="w-3.5 h-3.5" /> Excel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
