'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/lib/api'

const schema = z.object({
  companyName: z.string().min(2, 'اسم الشركة مطلوب'),
  crNumber: z.string().regex(/^\d{10}$/, 'رقم السجل التجاري يجب أن يكون 10 أرقام'),
  vatNumber: z.string().regex(/^3\d{13}3$/, 'رقم الضريبة يجب أن يكون 15 رقماً يبدأ وينتهي بـ 3'),
  fullName: z.string().min(2, 'الاسم الكامل مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم'),
  phone: z.string().optional(),
  agreeTerms: z.boolean().refine((v) => v, 'يجب الموافقة على الشروط والأحكام'),
})

type FormData = z.infer<typeof schema>

const steps = [
  { title: 'بيانات الشركة', fields: ['companyName', 'crNumber', 'vatNumber'] },
  { title: 'بيانات المسؤول', fields: ['fullName', 'email', 'password', 'phone'] },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const nextStep = async () => {
    const fields = steps[step].fields as Array<keyof FormData>
    const valid = await trigger(fields)
    if (valid) setStep(1)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      const { agreeTerms, ...payload } = data
      const res = await authApi.register(payload)
      const { accessToken, refreshToken } = res.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      document.cookie = `accessToken=${accessToken}; path=/; max-age=900`
      router.push('/overview')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message || 'حدث خطأ، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تسجيل شركة جديدة</h2>
        <p className="text-gray-500 text-sm mt-1">مجاناً — بدون بطاقة ائتمانية</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i <= step ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>{i + 1}</div>
            <span className={`text-xs ${i <= step ? 'text-brand-600 font-medium' : 'text-gray-400'}`}>{s.title}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-brand-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشركة</label>
              <input {...register('companyName')} placeholder="شركة الأمانة للتجارة"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
              {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم السجل التجاري</label>
              <input {...register('crNumber')} placeholder="1234567890" maxLength={10}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
              {errors.crNumber && <p className="mt-1 text-xs text-red-600">{errors.crNumber.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الرقم الضريبي (VAT)</label>
              <input {...register('vatNumber')} placeholder="300000000000003" maxLength={15}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
              {errors.vatNumber && <p className="mt-1 text-xs text-red-600">{errors.vatNumber.message}</p>}
              <p className="mt-1 text-xs text-gray-500">15 رقماً يبدأ وينتهي بـ 3</p>
            </div>
            <button type="button" onClick={nextStep}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors">
              التالي →
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <input {...register('fullName')} placeholder="محمد أحمد العمري"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
                {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input {...register('email')} type="email" placeholder="mohammed@company.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                <input {...register('password')} type="password" placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال (اختياري)</label>
                <input {...register('phone')} type="tel" placeholder="0501234567"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input {...register('agreeTerms')} type="checkbox" className="mt-0.5 rounded" />
              <span>أوافق على <a href="#" className="text-brand-600">الشروط والأحكام</a> وسياسة الخصوصية</span>
            </label>
            {errors.agreeTerms && <p className="text-xs text-red-600">{errors.agreeTerms.message}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(0)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                ← رجوع
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                {loading ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg> جاري التسجيل...</>
                ) : 'إنشاء الحساب'}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        لديك حساب؟{' '}
        <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-700">تسجيل الدخول</Link>
      </p>
    </div>
  )
}
