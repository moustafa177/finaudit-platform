import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  className?: string
}

export function StatCard({
  title, value, change, changeType = 'neutral',
  icon: Icon, iconColor = 'text-brand-600', iconBg = 'bg-brand-50 dark:bg-brand-900/20',
  className,
}: StatCardProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={cn('text-xs mt-2 flex items-center gap-1', {
              'text-green-600': changeType === 'up',
              'text-red-600': changeType === 'down',
              'text-gray-500': changeType === 'neutral',
            })}>
              {changeType === 'up' && '↑'}
              {changeType === 'down' && '↓'}
              {change}
            </p>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
    </div>
  )
}
