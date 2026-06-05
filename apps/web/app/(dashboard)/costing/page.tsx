'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { cn, formatCurrency } from '@/lib/utils'
import { Plus, Trash2, Edit3, TrendingUp, DollarSign, Package, Target, ChevronDown, ChevronUp } from 'lucide-react'

interface CostComponent {
  id: string
  name: string
  unit: string
  unitCost: number
  quantity: number
}

interface ServicePackage {
  id: string
  name: string
  description: string
  components: CostComponent[]
  targetMargin: number
  expanded: boolean
}

const INITIAL_PACKAGES: ServicePackage[] = [
  {
    id: '1', name: 'باقة التدقيق الشهري', description: 'مراجعة الفواتير والتوافق مع ZATCA',
    targetMargin: 40, expanded: false,
    components: [
      { id: 'a', name: 'ساعات عمل المحاسب', unit: 'ساعة', unitCost: 150, quantity: 8 },
      { id: 'b', name: 'تراخيص البرمجيات', unit: 'شهر', unitCost: 200, quantity: 1 },
      { id: 'c', name: 'مصاريف الاتصالات', unit: 'شهر', unitCost: 50, quantity: 1 },
    ],
  },
  {
    id: '2', name: 'باقة الاستشارة السنوية', description: 'تخطيط ضريبي واستراتيجي شامل',
    targetMargin: 55, expanded: false,
    components: [
      { id: 'd', name: 'ساعات عمل المستشار', unit: 'ساعة', unitCost: 250, quantity: 20 },
      { id: 'e', name: 'تقارير ودراسات', unit: 'تقرير', unitCost: 500, quantity: 4 },
      { id: 'f', name: 'Overhead إداري', unit: 'شهر', unitCost: 300, quantity: 12 },
    ],
  },
  {
    id: '3', name: 'باقة الإعداد الضريبي', description: 'إعداد الإقرار الضريبي الفصلي',
    targetMargin: 35, expanded: false,
    components: [
      { id: 'g', name: 'ساعات عمل المحاسب', unit: 'ساعة', unitCost: 150, quantity: 5 },
      { id: 'h', name: 'تراخيص ZATCA', unit: 'ربع سنة', unitCost: 150, quantity: 1 },
    ],
  },
]

function calcPackage(pkg: ServicePackage) {
  const cost = pkg.components.reduce((s, c) => s + c.unitCost * c.quantity, 0)
  const price = cost / (1 - pkg.targetMargin / 100)
  const profit = price - cost
  const vat = price * 0.15
  return { cost, price: Math.ceil(price / 100) * 100, profit, vat, finalPrice: Math.ceil(price / 100) * 100 + vat }
}

export default function CostingPage() {
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newMargin, setNewMargin] = useState(40)

  const toggle = (id: string) =>
    setPackages((p) => p.map((x) => x.id === id ? { ...x, expanded: !x.expanded } : x))

  const updateComponent = (pkgId: string, compId: string, field: keyof CostComponent, value: string | number) =>
    setPackages((p) => p.map((pkg) => pkg.id !== pkgId ? pkg : {
      ...pkg,
      components: pkg.components.map((c) => c.id !== compId ? c : { ...c, [field]: typeof value === 'string' ? value : Number(value) })
    }))

  const addComponent = (pkgId: string) =>
    setPackages((p) => p.map((pkg) => pkg.id !== pkgId ? pkg : {
      ...pkg,
      components: [...pkg.components, { id: Date.now().toString(), name: 'مكوّن جديد', unit: 'وحدة', unitCost: 0, quantity: 1 }]
    }))

  const removeComponent = (pkgId: string, compId: string) =>
    setPackages((p) => p.map((pkg) => pkg.id !== pkgId ? pkg : {
      ...pkg,
      components: pkg.components.filter((c) => c.id !== compId)
    }))

  const addPackage = () => {
    if (!newName.trim()) return
    setPackages((p) => [...p, { id: Date.now().toString(), name: newName, description: '', components: [], targetMargin: newMargin, expanded: true }])
    setNewName(''); setShowNew(false)
  }

  const totalRevenue = packages.reduce((s, pkg) => s + calcPackage(pkg).finalPrice, 0)
  const totalCost = packages.reduce((s, pkg) => s + calcPackage(pkg).cost, 0)
  const avgMargin = Math.round(packages.reduce((s, pkg) => s + pkg.targetMargin, 0) / packages.length)

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Topbar title="Dynamic Menu Costing" subtitle="تسعير ديناميكي لباقات الخدمات والاستشارات" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500">إجمالي الإيرادات المقدرة</p>
          <p className="text-xl font-bold text-brand-600 mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-gray-400 mt-0.5">شامل VAT</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500">إجمالي التكاليف</p>
          <p className="text-xl font-bold text-red-500 mt-1">{formatCurrency(totalCost)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500">متوسط هامش الربح</p>
          <p className="text-xl font-bold text-green-600 mt-1">{avgMargin}%</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500">عدد الباقات</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{packages.length}</p>
        </div>
      </div>

      {/* Header actions */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">باقات الخدمات</h3>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> باقة جديدة
        </button>
      </div>

      {/* New Package Form */}
      {showNew && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-brand-300 p-5 shadow-sm space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">إضافة باقة جديدة</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">اسم الباقة</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="مثل: باقة التدقيق الأسبوعي"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">هامش الربح المستهدف %</label>
              <input type="number" value={newMargin} onChange={(e) => setNewMargin(Number(e.target.value))} min={5} max={90}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addPackage} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors">إضافة</button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">إلغاء</button>
          </div>
        </div>
      )}

      {/* Packages */}
      <div className="space-y-4">
        {packages.map((pkg) => {
          const { cost, price, profit, vat, finalPrice } = calcPackage(pkg)
          const margin = Math.round((profit / price) * 100)

          return (
            <div key={pkg.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              {/* Package Header */}
              <button onClick={() => toggle(pkg.id)} className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{pkg.name}</p>
                    {pkg.description && <p className="text-xs text-gray-400">{pkg.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">التكلفة</p>
                    <p className="text-sm font-semibold text-red-500">{formatCurrency(cost)}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">السعر (قبل VAT)</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">السعر النهائي</p>
                    <p className="text-sm font-bold text-brand-600">{formatCurrency(finalPrice)}</p>
                  </div>
                  <span className={cn('text-xs font-bold px-2 py-1 rounded-lg', margin >= 40 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : margin >= 25 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700')}>
                    {margin}% ربح
                  </span>
                  {pkg.expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </div>
              </button>

              {/* Expanded Content */}
              {pkg.expanded && (
                <div className="border-t border-gray-100 dark:border-gray-800 p-5 space-y-4">
                  {/* Target margin slider */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Target className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">هامش الربح المستهدف</span>
                        <span className="font-semibold text-brand-600">{pkg.targetMargin}%</span>
                      </div>
                      <input type="range" min={5} max={80} value={pkg.targetMargin}
                        onChange={(e) => setPackages((p) => p.map((x) => x.id === pkg.id ? { ...x, targetMargin: Number(e.target.value) } : x))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">السعر المقترح</p>
                      <p className="font-bold text-brand-600 text-sm">{formatCurrency(price)}</p>
                    </div>
                  </div>

                  {/* Components table */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        {['المكوّن', 'الوحدة', 'تكلفة الوحدة', 'الكمية', 'الإجمالي', ''].map((h) => (
                          <th key={h} className="text-right text-xs text-gray-400 font-medium pb-2 px-1">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {pkg.components.map((comp) => (
                        <tr key={comp.id} className="group">
                          <td className="py-2 px-1">
                            <input value={comp.name} onChange={(e) => updateComponent(pkg.id, comp.id, 'name', e.target.value)}
                              className="w-full bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 rounded px-1" />
                          </td>
                          <td className="py-2 px-1 w-20">
                            <input value={comp.unit} onChange={(e) => updateComponent(pkg.id, comp.id, 'unit', e.target.value)}
                              className="w-full bg-transparent text-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 rounded px-1" />
                          </td>
                          <td className="py-2 px-1 w-28">
                            <input type="number" value={comp.unitCost} onChange={(e) => updateComponent(pkg.id, comp.id, 'unitCost', e.target.value)}
                              className="w-full bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 rounded px-1" />
                          </td>
                          <td className="py-2 px-1 w-20">
                            <input type="number" value={comp.quantity} onChange={(e) => updateComponent(pkg.id, comp.id, 'quantity', e.target.value)}
                              className="w-full bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 rounded px-1" />
                          </td>
                          <td className="py-2 px-1 w-28 font-semibold text-gray-900 dark:text-white text-sm">
                            {formatCurrency(comp.unitCost * comp.quantity)}
                          </td>
                          <td className="py-2 px-1 w-8">
                            <button onClick={() => removeComponent(pkg.id, comp.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button onClick={() => addComponent(pkg.id)}
                    className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700">
                    <Plus className="w-3.5 h-3.5" /> إضافة مكوّن
                  </button>

                  {/* Summary bar */}
                  <div className="grid grid-cols-4 gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    {[
                      { label: 'التكلفة', value: formatCurrency(cost), color: 'text-red-600' },
                      { label: 'الربح', value: formatCurrency(profit), color: 'text-green-600' },
                      { label: 'VAT 15%', value: formatCurrency(vat), color: 'text-amber-600' },
                      { label: 'السعر النهائي', value: formatCurrency(finalPrice), color: 'text-brand-600 font-bold' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className={cn('text-sm mt-0.5 font-semibold', color)}>{value}</p>
                      </div>
                    ))}
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
