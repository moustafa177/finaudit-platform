'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Topbar } from '@/components/layout/topbar'
import { invoicesApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const lineSchema = z.object({
  description: z.string().min(1, 'وصف البند مطلوب'),
  quantity: z.number().min(0.001, 'الكمية يجب أن تكون أكبر من صفر'),
  unitPrice: z.number().min(0, 'السعر يجب أن يكون موجباً'),
  vatRate: z.number().min(0).max(1).default(0.15),
})

const schema = z.object({
  type: z.enum(['standard', 'simplified']),
  issueDate: z.string(),
  buyerName: z.string().min(2, 'اسم العميل مطلوب'),
  buyerVatNumber: z.string().optional(),
  buyerCity: z.string().min(1, 'المدينة مطلوبة'),
  buyerStreet: z.string().optional(),
  notes: z.string().optional(),
  lineItems: z.array(lineSchema).min(1, 'يجب إضافة بند واحد على الأقل'),
})

type FormData = z.infer<typeof schema>

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'standard',
      issueDate: new Date().toISOString().split('T')[0],
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, vatRate: 0.15 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lineItems' })
  const lineItems = watch('lineItems')

  const subtotal = lineItems.reduce((sum, i) => sum + (i.quantity || 0) * (i.unitPrice || 0), 0)
  const vatTotal = lineItems.reduce((sum, i) => sum + (i.quantity || 0) * (i.unitPrice || 0) * (i.vatRate || 0.15), 0)
  const total = subtotal + vatTotal

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      await invoicesApi.create({
        type: data.type,
        issueDate: data.issueDate,
        buyer: {
          name: data.buyerName,
          vatNumber: data.buyerVatNumber || undefined,
          address: { street: data.buyerStreet || '', city: data.buyerCity, region: '', postalCode: '', country: 'SA' },
        },
        lineItems: data.lineItems.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          vatRate: i.vatRate,
          discountAmount: 0,
        })),
        notes: data.notes,
      })
      router.push('/invoices')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message || 'حدث خطأ أثناء إنشاء الفاتورة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <Topbar title="فاتورة جديدة" subtitle="إنشاء فاتورة إلكترونية متوافقة مع ZATCA" />

      <div className="flex items-center gap-2 mb-2">
        <Link href="/invoices" className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">
          <ChevronLeft className="w-4 h-4" /> الفواتير
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-600">فاتورة جديدة</span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Invoice type + date */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">معلومات الفاتورة</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع الفاتورة</label>
                  <select {...register('type')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="standard">فاتورة ضريبية (B2B)</option>
                    <option value="simplified">فاتورة مبسطة (B2C)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ الإصدار</label>
                  <input {...register('issueDate')} type="date"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </div>

            {/* Buyer info */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">بيانات العميل (المشتري)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم العميل / الشركة</label>
                  <input {...register('buyerName')} placeholder="شركة النور للتجارة"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  {errors.buyerName && <p className="mt-1 text-xs text-red-600">{errors.buyerName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الرقم الضريبي (اختياري)</label>
                  <input {...register('buyerVatNumber')} placeholder="300000000000003" maxLength={15}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المدينة</label>
                  <input {...register('buyerCity')} placeholder="الرياض"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  {errors.buyerCity && <p className="mt-1 text-xs text-red-600">{errors.buyerCity.message}</p>}
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">بنود الفاتورة</h3>
                <button type="button" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, vatRate: 0.15 })}
                  className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700">
                  <Plus className="w-4 h-4" /> إضافة بند
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, idx) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="col-span-4">
                      <input {...register(`lineItems.${idx}.description`)} placeholder="وصف المنتج أو الخدمة"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div className="col-span-2">
                      <input {...register(`lineItems.${idx}.quantity`, { valueAsNumber: true })} type="number" placeholder="الكمية" min="0.001" step="0.001"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div className="col-span-2">
                      <input {...register(`lineItems.${idx}.unitPrice`, { valueAsNumber: true })} type="number" placeholder="السعر" min="0" step="0.01"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div className="col-span-2">
                      <select {...register(`lineItems.${idx}.vatRate`, { valueAsNumber: true })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <option value={0.15}>15% ضريبة</option>
                        <option value={0}>معفى</option>
                      </select>
                    </div>
                    <div className="col-span-1 text-sm font-medium text-gray-600 dark:text-gray-400 pt-2">
                      {formatCurrency((lineItems[idx]?.quantity || 0) * (lineItems[idx]?.unitPrice || 0))}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(idx)}
                          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ملاحظات (اختياري)</label>
              <textarea {...register('notes')} rows={3} placeholder="أي ملاحظات إضافية..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">ملخص الفاتورة</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>المجموع قبل الضريبة</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>ضريبة القيمة المضافة</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(vatTotal)}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-base">
                  <span className="text-gray-900 dark:text-white">الإجمالي</span>
                  <span className="text-brand-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-1">✓ ستُراجَع الفاتورة تلقائياً</p>
                <p>يتم التحقق من الامتثال لاشتراطات ZATCA فور الإنشاء</p>
              </div>

              <button type="submit" disabled={loading}
                className="mt-4 w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg> جاري الإنشاء...</>
                ) : 'إنشاء الفاتورة'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
