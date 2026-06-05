'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, ShieldCheck, BarChart3,
  Settings, LogOut, ChevronLeft, Menu, X,
  Bot, Sparkles, TrendingUp, DollarSign,
  BookOpen, AlertTriangle, ShieldAlert, Activity
} from 'lucide-react'
import { useState } from 'react'

const mainNav = [
  { href: '/overview',     icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/invoices',     icon: FileText,         label: 'الفواتير' },
  { href: '/compliance',   icon: ShieldCheck,      label: 'الامتثال ZATCA' },
  { href: '/reports',      icon: BarChart3,        label: 'التقارير' },
]

const complianceNav = [
  { href: '/regulations',  icon: BookOpen,        label: 'التشريعات المالية' },
  { href: '/risk',         icon: AlertTriangle,   label: 'إدارة المخاطر' },
  { href: '/fraud',        icon: ShieldAlert,     label: 'اكتشاف الاحتيال' },
]

const aiNav = [
  { href: '/rpa',          icon: Bot,             label: 'AI-Powered RPA' },
  { href: '/cleansing',    icon: Sparkles,        label: 'تنظيف البيانات' },
  { href: '/forecasting',  icon: TrendingUp,      label: 'توقعات الطلب' },
  { href: '/costing',      icon: DollarSign,      label: 'تسعير الخدمات' },
]

const bottomNav = [
  { href: '/health',   icon: Activity, label: 'صحة النظام' },
  { href: '/settings', icon: Settings, label: 'الإعدادات' },
]

const ROLE_LABELS: Record<string, string> = {
  owner: 'مالك الحساب', admin: 'مسؤول', accountant: 'محاسب', viewer: 'مراقب',
}

interface SidebarProps {
  companyName?: string
  userName?: string
  userRole?: string
}

export function Sidebar({ companyName = 'شركتي', userName = 'المستخدم', userRole = 'owner' }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = 'accessToken=; path=/; max-age=0'
    window.location.href = '/login'
  }

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: typeof Bot; label: string }) => {
    const active = pathname === href || pathname.startsWith(href + '/')
    return (
      <Link href={href} onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
          active
            ? 'bg-white text-brand-700 shadow-sm font-semibold'
            : 'text-blue-100 hover:bg-white/10 hover:text-white',
        )}>
        <Icon className={cn('w-5 h-5 flex-shrink-0', active ? 'text-brand-600' : '')} />
        {!collapsed && <span className="text-sm">{label}</span>}
        {!collapsed && active && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-auto" />}
      </Link>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-base leading-tight">الامتثال المالي</span>
            <p className="text-blue-200 text-xs truncate mt-0.5">{companyName}</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors hidden lg:flex flex-shrink-0">
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {/* Main */}
        {mainNav.map((item) => <NavLink key={item.href} {...item} />)}

        {/* Compliance & Risk Section */}
        <div className="pt-3 pb-1">
          {!collapsed && (
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-1">
              الامتثال والمخاطر
            </p>
          )}
          {collapsed && <div className="border-t border-white/10 my-1" />}
          {complianceNav.map((item) => <NavLink key={item.href} {...item} />)}
        </div>

        {/* AI Section */}
        <div className="pt-3 pb-1">
          {!collapsed && (
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-1">
              ذكاء اصطناعي
            </p>
          )}
          {collapsed && <div className="border-t border-white/10 my-1" />}
          {aiNav.map((item) => <NavLink key={item.href} {...item} />)}
        </div>

        {/* Bottom */}
        <div className="pt-2 border-t border-white/10">
          {bottomNav.map((item) => <NavLink key={item.href} {...item} />)}
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <div className={cn('flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {userName.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{userName}</p>
              <p className="text-blue-200 text-xs">{ROLE_LABELS[userRole] ?? 'مستخدم'}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout}
          className={cn('mt-1 flex items-center gap-2 w-full px-3 py-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors text-sm', collapsed && 'justify-center')}>
          <LogOut className="w-4 h-4" />
          {!collapsed && 'تسجيل الخروج'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-brand-600 text-white shadow-lg">
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-gradient-to-b from-brand-900 to-brand-700 h-full shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-white/10 text-white">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col h-screen bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <SidebarContent />
      </aside>
    </>
  )
}
