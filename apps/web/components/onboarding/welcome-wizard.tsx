'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  X, Building2, Users, Upload, Zap, CheckCircle2,
  ChevronRight, ChevronLeft, Rocket
} from 'lucide-react'

const STEPS = [
  {
    icon: Rocket,
    title: 'مرحباً بك في الامتثال المالي!',
    subtitle: 'منصة التدقيق المالي الآلي والامتثال لـ ZATCA',
    description: 'سنأخذك في جولة سريعة لإعداد حسابك والاستفادة من كامل إمكانيات المنصة.',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: Building2,
    title: 'بيانات شركتك',
    subtitle: 'تأكد من صحة المعلومات',
    description: 'تأكد من إدخال الرقم الضريبي ورقم السجل التجاري بشكل صحيح لضمان توافق الفواتير مع اشتراطات ZATCA.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: Upload,
    title: 'استيراد بياناتك الأولى',
    subtitle: 'ابدأ بفاتورة أو ملف',
    description: 'يمكنك رفع فواتيرك الحالية أو ملفات Excel للبدء الفوري. يدعم النظام PDF وExcel وCSV.',
    color: 'from-green-500 to-green-700',
  },
  {
    icon: Users,
    title: 'دعوة فريق العمل',
    subtitle: 'تعاون مع زملائك',
    description: 'أضف محاسبيك ومدراءك بأدوار مختلفة. كل عضو يصل فقط للبيانات المناسبة لدوره.',
    color: 'from-amber-500 to-amber-700',
  },
  {
    icon: CheckCircle2,
    title: 'أنت جاهز!',
    subtitle: 'كل شيء مُعَدّ',
    description: 'حسابك جاهز للاستخدام. ابدأ بإنشاء أول فاتورة إلكترونية ممتثلة لـ ZATCA.',
    color: 'from-emerald-500 to-emerald-700',
  },
]

const STORAGE_KEY = 'finaudit_onboarding_done'

export function WelcomeWizard() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) setTimeout(() => setOpen(true), 800)
  }, [])

  const close = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  const next = () => step < STEPS.length - 1 ? setStep(step + 1) : close()
  const prev = () => step > 0 && setStep(step - 1)

  if (!open) return null

  const current = STEPS[step]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Close */}
        <button onClick={close}
          className="absolute top-4 left-4 z-10 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* Header gradient */}
        <div className={cn('bg-gradient-to-br p-8 text-white text-center', current.color)}>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold">{current.title}</h2>
          <p className="text-white/80 text-sm mt-1">{current.subtitle}</p>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center">
            {current.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)}
                className={cn('rounded-full transition-all', i === step ? 'w-6 h-2 bg-brand-600' : 'w-2 h-2 bg-gray-200 dark:bg-gray-700')} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={prev}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft className="w-4 h-4" /> السابق
              </button>
            )}
            <button onClick={next}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors">
              {step === STEPS.length - 1 ? 'ابدأ الآن 🚀' : (<>التالي <ChevronRight className="w-4 h-4" /></>)}
            </button>
          </div>

          {step < STEPS.length - 1 && (
            <button onClick={close} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-3 transition-colors">
              تخطي الجولة
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
