'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface MonthlyData {
  month: string
  revenue: number
  vat: number
}

interface RevenueChartProps {
  data: MonthlyData[]
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600 dark:text-gray-300">{p.name}:</span>
          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="vatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) =>
          value === 'revenue' ? 'الإيرادات' : 'ضريبة القيمة المضافة'} />
        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2}
          fill="url(#revenueGrad)" dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
        <Area type="monotone" dataKey="vat" stroke="#22c55e" strokeWidth={2}
          fill="url(#vatGrad)" dot={{ r: 3, fill: '#22c55e' }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
