'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { StatCard } from '@/components/ui/stat-card'
import { formatCurrency } from '@/lib/utils'
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts'
import { TrendingUp, Brain, Target, AlertCircle, Lightbulb, Calendar, RefreshCw } from 'lucide-react'
import { aiApi } from '@/lib/api'
import { cn } from '@/lib/utils'

interface ForecastPoint { month: string; actual?: number; forecast?: number; lower?: number; upper?: number }
interface ForecastData {
  forecast: Array<{ month: string; predicted: number; lower: number; upper: number }>
  historical: Array<{ month: string; revenue: number; vat: number }>
  growthRate: number
  insights: string[]
  factors: Array<{ factor: string; impact: string; description: string }>
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm min-w-44">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
      {payload.filter((p) => p.value != null && p.value > 0).map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span className="text-gray-500">{p.name === 'actual' ? 'فعلي' : 'متوقع'}</span>
          <span className="font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ForecastingPage() {
  const [data, setData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchForecast = async () => {
    setLoading(true)
    try {
      const res = await aiApi.forecast()
      setData(res.data.data)
    } catch { setData(null) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchForecast() }, [])

  const chartData: ForecastPoint[] = [
    ...(data?.historical ?? []).map((h) => ({ month: h.month, actual: h.revenue })),
    ...(data?.forecast ?? []).map((f) => ({ month: f.month, forecast: f.predicted, lower: f.lower, upper: f.upper })),
  ]

  const nextQRevenue = (data?.forecast ?? []).reduce((s, f) => s + f.predicted, 0)
  const bestMonth = data?.forecast?.reduce((best, f) => f.predicted > best.predicted ? f : best, { month: '-', predicted: 0 })

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Topbar title="Demand Forecasting" subtitle="توقعات الإيرادات بالذكاء الاصطناعي Claude" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 h-24 animate-pulse" />
        )) : (
          <>
            <StatCard title="إيرادات الربع القادم" value={formatCurrency(nextQRevenue)} change={`+${data?.growthRate ?? 0}% نمو متوقع`} changeType="up" icon={TrendingUp} />
            <StatCard title="نمو متوقع" value={`${data?.growthRate ?? 0}%`} change="بناءً على بياناتك" changeType="up" icon={Brain} iconColor="text-purple-600" iconBg="bg-purple-50 dark:bg-purple-900/20" />
            <StatCard title="أفضل شهر متوقع" value={bestMonth?.month ?? '-'} change={formatCurrency(bestMonth?.predicted ?? 0)} changeType="up" icon={Target} iconColor="text-green-600" iconBg="bg-green-50 dark:bg-green-900/20" />
            <StatCard title="عوامل مؤثرة" value={data?.factors?.length ?? 0} change="عوامل محددة" changeType="neutral" icon={Calendar} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-900/20" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">توقعات الإيرادات</h3>
              <p className="text-xs text-gray-400">بيانات فعلية + توقعات Claude AI</p>
            </div>
            <button onClick={fetchForecast} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </button>
          </div>
          {loading
            ? <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={data?.historical?.[data.historical.length - 1]?.month} stroke="#d1d5db" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} fill="url(#ag)" dot={{ r: 3, fill: '#3b82f6' }} name="actual" connectNulls={false} />
                  <Area type="monotone" dataKey="forecast" stroke="#a855f7" strokeWidth={2.5} strokeDasharray="6 3" fill="url(#fg)" dot={{ r: 3, fill: '#a855f7' }} name="forecast" connectNulls={false} />
                  <Legend formatter={(v) => v === 'actual' ? 'فعلي' : 'توقعات AI'} wrapperStyle={{ fontSize: 11 }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                أنشئ فواتير أولاً لتوليد التوقعات
              </div>
            )
          }
        </div>

        {/* Factors + Insights */}
        <div className="space-y-4">
          {/* Factors */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">العوامل المؤثرة</h3>
            {loading ? <div className="space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}</div>
              : data?.factors?.length ? (
                <div className="space-y-3">
                  {data.factors.map(({ factor, impact, description }) => (
                    <div key={factor}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{factor}</span>
                        <span className={cn('text-xs font-bold', impact.startsWith('+') ? 'text-green-600' : 'text-red-600')}>{impact}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                      <div className="h-px bg-gray-100 dark:bg-gray-800 mt-2" />
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-gray-400">لا توجد بيانات كافية</p>
            }
          </div>

          {/* Insights */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" /> رؤى Claude AI
            </h3>
            {loading ? <div className="space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}</div>
              : (data?.insights ?? []).map((text, i) => (
                <div key={i} className="flex items-start gap-2.5 mb-3">
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', i === 0 ? 'bg-green-100 text-green-600' : i === 1 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600')}>
                    {i === 0 ? <TrendingUp className="w-3.5 h-3.5" /> : i === 1 ? <AlertCircle className="w-3.5 h-3.5" /> : <Lightbulb className="w-3.5 h-3.5" />}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
