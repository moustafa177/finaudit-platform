'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ComplianceData {
  status: string
  count: number
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  compliant: { label: 'ممتثل', color: '#22c55e' },
  non_compliant: { label: 'غير ممتثل', color: '#ef4444' },
  pending: { label: 'في الانتظار', color: '#f59e0b' },
  cleared: { label: 'تم التخليص', color: '#3b82f6' },
  reported: { label: 'تم الإبلاغ', color: '#8b5cf6' },
}

interface ComplianceChartProps {
  data: ComplianceData[]
  totalInvoices: number
  complianceRate: number
}

export function ComplianceChart({ data, totalInvoices, complianceRate }: ComplianceChartProps) {
  const chartData = data.map((d) => ({
    name: STATUS_MAP[d.status]?.label || d.status,
    value: Number(d.count),
    color: STATUS_MAP[d.status]?.color || '#gray',
  }))

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-36 h-36 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={42} outerRadius={60}
              paddingAngle={3} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [v, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{complianceRate}%</span>
          <span className="text-xs text-gray-500">امتثال</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
          </div>
        ))}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500">الإجمالي</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{totalInvoices}</span>
        </div>
      </div>
    </div>
  )
}
