'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import {
  Building2, Users, Bell, Mail, Brain, Zap, Database,
  FileText, Shield, ChevronLeft, Save, Plus, Trash2,
  Eye, EyeOff, RefreshCw, CheckCircle2, AlertTriangle,
  Key, Clock, Activity, Copy, ExternalLink, Toggle
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────
type SettingTab =
  | 'company' | 'users' | 'notifications' | 'email'
  | 'ai' | 'integrations' | 'backup' | 'logs' | 'security'

const TABS: { id: SettingTab; label: string; icon: typeof Building2; badge?: string }[] = [
  { id: 'company',       label: 'إعدادات الشركة',     icon: Building2 },
  { id: 'users',         label: 'المستخدمون والصلاحيات', icon: Users },
  { id: 'notifications', label: 'الإشعارات',           icon: Bell },
  { id: 'email',         label: 'البريد الإلكتروني',   icon: Mail },
  { id: 'ai',            label: 'الذكاء الاصطناعي',    icon: Brain, badge: 'جديد' },
  { id: 'integrations',  label: 'التكاملات (APIs)',     icon: Zap },
  { id: 'backup',        label: 'النسخ الاحتياطي',     icon: Database },
  { id: 'logs',          label: 'السجلات',              icon: FileText },
  { id: 'security',      label: 'الأمان والمصادقة',    icon: Shield },
]

// ── Helper Components ──────────────────────────────────────────────────
function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
      {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
    </div>
  )
}

function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 gap-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle2({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={cn('w-11 h-6 rounded-full transition-colors relative flex-shrink-0', checked ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600')}>
      <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', checked ? 'right-1' : 'left-1')} />
    </button>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange?: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 w-64" />
  )
}

function SaveBtn({ loading, onClick }: { loading?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors">
      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      حفظ التغييرات
    </button>
  )
}

// ── Panels ─────────────────────────────────────────────────────────────
function CompanyPanel({ tenant }: { tenant: { name: string; vatNumber: string; crNumber: string; plan: string } | null }) {
  const [name, setName]     = useState(tenant?.name ?? '')
  const [saved, setSaved]   = useState(false)
  const [btype, setBtype]   = useState('mixed')
  const [currency, setCur]  = useState('SAR')

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div>
      <SectionTitle title="إعدادات الشركة" desc="المعلومات الأساسية للمنشأة المُسجَّلة في النظام" />
      <div className="space-y-0">
        <Field label="اسم الشركة">
          <Input value={name} onChange={setName} />
        </Field>
        <Field label="الرقم الضريبي (VAT)" desc="لا يمكن تغييره بعد التسجيل">
          <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono text-gray-500">{tenant?.vatNumber}</span>
        </Field>
        <Field label="رقم السجل التجاري">
          <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono text-gray-500">{tenant?.crNumber}</span>
        </Field>
        <Field label="نوع النشاط التجاري">
          <select value={btype} onChange={(e) => setBtype(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="retail">تجزئة</option>
            <option value="b2b_services">خدمات B2B</option>
            <option value="manufacturing">تصنيع</option>
            <option value="mixed">متعدد الأنشطة</option>
          </select>
        </Field>
        <Field label="عملة التقارير">
          <select value={currency} onChange={(e) => setCur(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="USD">دولار أمريكي (USD)</option>
          </select>
        </Field>
        <Field label="الباقة الحالية">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-semibold">
              {tenant?.plan === 'free' ? 'مجانية' : tenant?.plan}
            </span>
            <button className="text-xs text-brand-600 hover:underline">ترقية</button>
          </div>
        </Field>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <SaveBtn onClick={save} />
        {saved && <span className="flex items-center gap-1.5 text-sm text-green-600"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
      </div>
    </div>
  )
}

function UsersPanel() {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('accountant')
  const mockUsers = [
    { name: 'محمد التجريبي', email: 'test@finaudit.sa', role: 'owner',      active: true  },
    { name: 'سارة المحاسبة', email: 'sara@company.sa',  role: 'accountant', active: true  },
    { name: 'عبدالله المدير', email: 'mgr@company.sa',  role: 'admin',      active: false },
  ]
  const ROLE_LABELS: Record<string, string> = { owner: 'مالك', admin: 'مسؤول', accountant: 'محاسب', viewer: 'مراقب' }
  const ROLE_COLORS: Record<string, string> = {
    owner: 'bg-purple-100 text-purple-700', admin: 'bg-blue-100 text-blue-700',
    accountant: 'bg-green-100 text-green-700', viewer: 'bg-gray-100 text-gray-600',
  }

  return (
    <div>
      <SectionTitle title="المستخدمون والصلاحيات" desc="إدارة أعضاء الفريق وصلاحياتهم" />

      {/* Role matrix */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-xs border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">الصلاحية</th>
              {['مالك', 'مسؤول', 'محاسب', 'مراقب'].map((r) => (
                <th key={r} className="px-3 py-2 text-center font-semibold text-gray-600">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              ['إنشاء فواتير',     true,  true,  true,  false],
              ['تعديل الإعدادات',  true,  true,  false, false],
              ['الوصول للتقارير',  true,  true,  true,  true ],
              ['إدارة المستخدمين', true,  true,  false, false],
              ['عرض السجلات',      true,  true,  false, false],
            ].map(([perm, ...vals]) => (
              <tr key={perm as string} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">{perm as string}</td>
                {(vals as boolean[]).map((v, i) => (
                  <td key={i} className="px-3 py-2 text-center">
                    {v ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users list */}
      <div className="space-y-2 mb-6">
        {mockUsers.map((u) => (
          <div key={u.email} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center font-bold text-brand-600 text-sm">
                {u.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', ROLE_COLORS[u.role])}>
                {ROLE_LABELS[u.role]}
              </span>
              <div className={cn('w-2 h-2 rounded-full', u.active ? 'bg-green-500' : 'bg-gray-300')} />
              {u.role !== 'owner' && <button className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          </div>
        ))}
      </div>

      {/* Invite */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">دعوة مستخدم جديد</p>
        <div className="flex gap-2 flex-wrap">
          <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@company.sa" type="email"
            className="flex-1 min-w-48 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="admin">مسؤول</option>
            <option value="accountant">محاسب</option>
            <option value="viewer">مراقب</option>
          </select>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> إرسال دعوة
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationsPanel() {
  const [settings, setSettings] = useState({
    invoiceCreated: true, invoiceNonCompliant: true, zatcaUpdate: true,
    fraudAlert: true, riskHighAlert: true, weeklyReport: false,
    monthlyReport: true, systemHealth: true, loginAlert: true,
  })
  const toggle = (key: keyof typeof settings) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  const groups = [
    {
      title: 'الفواتير والامتثال',
      items: [
        { key: 'invoiceCreated' as const,      label: 'إنشاء فاتورة جديدة',          desc: 'عند إنشاء أي فاتورة' },
        { key: 'invoiceNonCompliant' as const, label: 'فاتورة غير ممتثلة',           desc: 'عند اكتشاف فاتورة مخالفة لـ ZATCA' },
        { key: 'zatcaUpdate' as const,         label: 'تحديثات ZATCA',                desc: 'عند صدور أنظمة أو تعديلات جديدة' },
      ],
    },
    {
      title: 'المخاطر والأمان',
      items: [
        { key: 'fraudAlert' as const,          label: 'تنبيه احتيال',                desc: 'عند رصد معاملة مشبوهة' },
        { key: 'riskHighAlert' as const,       label: 'خطر مرتفع أو حرج',           desc: 'عند رفع درجة المخاطرة' },
        { key: 'loginAlert' as const,          label: 'تسجيل دخول جديد',             desc: 'عند الدخول من جهاز غير معروف' },
      ],
    },
    {
      title: 'التقارير',
      items: [
        { key: 'weeklyReport' as const,        label: 'التقرير الأسبوعي',            desc: 'ملخص أسبوعي كل أحد' },
        { key: 'monthlyReport' as const,       label: 'التقرير الشهري',              desc: 'تقرير ZATCA الشهري' },
        { key: 'systemHealth' as const,        label: 'صحة النظام',                  desc: 'تنبيهات عند توقف أي خدمة' },
      ],
    },
  ]

  return (
    <div>
      <SectionTitle title="إعدادات الإشعارات" desc="تحكم في متى وكيف تتلقى الإشعارات" />
      {groups.map((g) => (
        <div key={g.title} className="mb-6">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{g.title}</h4>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {g.items.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <Toggle2 checked={settings[key]} onChange={() => toggle(key)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <SaveBtn />
    </div>
  )
}

function EmailPanel() {
  const [smtp, setSmtp] = useState({ host: 'smtp.gmail.com', port: '587', user: '', pass: '', from: '' })
  const [showPass, setShowPass] = useState(false)
  const [tested, setTested] = useState<null | boolean>(null)
  const test = () => { setTested(null); setTimeout(() => setTested(true), 1500) }

  return (
    <div>
      <SectionTitle title="إعدادات البريد الإلكتروني" desc="SMTP لإرسال الإشعارات والتقارير" />
      <div className="grid grid-cols-1 gap-4 max-w-lg">
        {[
          { label: 'خادم SMTP',    key: 'host' as const, placeholder: 'smtp.gmail.com' },
          { label: 'المنفذ',       key: 'port' as const, placeholder: '587' },
          { label: 'اسم المستخدم', key: 'user' as const, placeholder: 'user@gmail.com' },
          { label: 'من (From)',    key: 'from' as const, placeholder: 'noreply@company.sa' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <input value={smtp[key]} onChange={(e) => setSmtp({ ...smtp, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">كلمة المرور</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} value={smtp.pass}
              onChange={(e) => setSmtp({ ...smtp, pass: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 pl-10" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <SaveBtn />
          <button onClick={test} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Mail className="w-4 h-4" /> اختبار الاتصال
          </button>
          {tested === true && <span className="flex items-center gap-1.5 text-green-600 text-sm"><CheckCircle2 className="w-4 h-4" /> متصل</span>}
          {tested === false && <span className="flex items-center gap-1.5 text-red-600 text-sm"><AlertTriangle className="w-4 h-4" /> فشل</span>}
        </div>
      </div>
    </div>
  )
}

function AiPanel() {
  const [apiKey, setApiKey]     = useState('')
  const [showKey, setShowKey]   = useState(false)
  const [model, setModel]       = useState('claude-opus-4-5')
  const [features, setFeatures] = useState({
    fraud: true, cleansing: true, forecast: true, advisory: true, rpa: true,
  })
  const toggle = (k: keyof typeof features) => setFeatures((f) => ({ ...f, [k]: !f[k] }))

  return (
    <div>
      <SectionTitle title="إعدادات الذكاء الاصطناعي" desc="تكوين Claude AI لتحليل البيانات المالية" />
      <div className="max-w-lg space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Anthropic API Key
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input type={showKey ? 'text' : 'password'} value={apiKey}
                onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-api03-..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 pl-10" />
              <button onClick={() => setShowKey(!showKey)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">احصل على مفتاحك من <a href="https://console.anthropic.com" target="_blank" rel="noopener" className="text-brand-600 hover:underline">console.anthropic.com</a></p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">النموذج</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="claude-opus-4-5">Claude Opus 4.5 (أعلى دقة)</option>
            <option value="claude-sonnet-4-5">Claude Sonnet 4.5 (متوازن)</option>
            <option value="claude-haiku-4-5">Claude Haiku 4.5 (أسرع)</option>
          </select>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">الميزات المُفعَّلة</p>
          {[
            { key: 'fraud' as const,    label: 'كشف الاحتيال' },
            { key: 'cleansing' as const,label: 'تنظيف البيانات' },
            { key: 'forecast' as const, label: 'توقعات الطلب' },
            { key: 'advisory' as const, label: 'التقرير الاستشاري' },
            { key: 'rpa' as const,      label: 'استخراج الفواتير (RPA)' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              <Toggle2 checked={features[key]} onChange={() => toggle(key)} />
            </div>
          ))}
        </div>
        <SaveBtn />
      </div>
    </div>
  )
}

function IntegrationsPanel() {
  const apis = [
    { name: 'ZATCA FATOORAH', status: 'connected', env: 'sandbox', icon: '🏛️' },
    { name: 'SADAD بوابة الدفع', status: 'disconnected', env: '-', icon: '💳' },
    { name: 'SAP ERP', status: 'disconnected', env: '-', icon: '📊' },
    { name: 'Oracle Financials', status: 'disconnected', env: '-', icon: '🔮' },
    { name: 'Anthropic Claude', status: 'mock', env: 'محاكاة', icon: '🧠' },
  ]
  return (
    <div>
      <SectionTitle title="التكاملات (APIs)" desc="ربط المنصة بالأنظمة والخدمات الخارجية" />
      <div className="space-y-3">
        {apis.map((api) => (
          <div key={api.name} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{api.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{api.name}</p>
                <p className="text-xs text-gray-400">البيئة: {api.env}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('text-xs px-2 py-1 rounded-full font-medium', {
                'bg-green-100 text-green-700': api.status === 'connected',
                'bg-gray-100 text-gray-500': api.status === 'disconnected',
                'bg-amber-100 text-amber-700': api.status === 'mock',
              })}>
                {api.status === 'connected' ? 'متصل' : api.status === 'mock' ? 'محاكاة' : 'غير متصل'}
              </span>
              <button className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> إعداد
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BackupPanel() {
  const [schedule, setSchedule] = useState('daily')
  const [retention, setRetention] = useState('30')
  const backups = [
    { date: '2026-06-05 03:00', size: '2.4 MB', status: 'success' },
    { date: '2026-06-04 03:00', size: '2.2 MB', status: 'success' },
    { date: '2026-06-03 03:00', size: '2.1 MB', status: 'success' },
  ]
  return (
    <div>
      <SectionTitle title="النسخ الاحتياطي" desc="جدولة النسخ الاحتياطي التلقائي لقاعدة البيانات" />
      <div className="grid grid-cols-2 gap-4 max-w-sm mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الجدول الزمني</label>
          <select value={schedule} onChange={(e) => setSchedule(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="hourly">كل ساعة</option>
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاحتفاظ (أيام)</label>
          <input type="number" value={retention} onChange={(e) => setRetention(e.target.value)} min={7} max={365}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
      </div>
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">آخر النسخ الاحتياطية</h4>
        <div className="space-y-2">
          {backups.map((b) => (
            <div key={b.date} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{b.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{b.size}</span>
                <button className="text-xs text-brand-600 hover:underline">استعادة</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <SaveBtn />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Database className="w-4 h-4" /> نسخة الآن
        </button>
      </div>
    </div>
  )
}

function LogsPanel() {
  const logs = [
    { time: '05:12:20', level: 'INFO',  user: 'test@finaudit.sa', action: 'تسجيل دخول ناجح', ip: '192.168.1.1' },
    { time: '05:10:45', level: 'WARN',  user: 'system',           action: 'ANTHROPIC_API_KEY غير موجود', ip: '-' },
    { time: '05:09:11', level: 'INFO',  user: 'test@finaudit.sa', action: 'إنشاء فاتورة INV-2026-00001', ip: '192.168.1.1' },
    { time: '05:08:00', level: 'INFO',  user: 'system',           action: 'اتصال PostgreSQL ناجح', ip: 'localhost' },
    { time: '04:55:30', level: 'ERROR', user: 'unknown',          action: 'محاولة دخول فاشلة', ip: '10.0.0.45' },
  ]
  const LEVEL_COLORS: Record<string, string> = {
    INFO: 'text-blue-600 bg-blue-100', WARN: 'text-amber-600 bg-amber-100', ERROR: 'text-red-600 bg-red-100',
  }
  return (
    <div>
      <SectionTitle title="سجلات النظام (Audit Logs)" desc="جميع الأحداث والعمليات المسجلة" />
      <div className="overflow-x-auto">
        <table className="w-full text-xs border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['الوقت', 'المستوى', 'المستخدم', 'الحدث', 'IP'].map((h) => (
                <th key={h} className="px-3 py-2 text-right font-semibold text-gray-600 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-3 py-2 font-mono text-gray-500">{log.time}</td>
                <td className="px-3 py-2">
                  <span className={cn('px-1.5 py-0.5 rounded font-semibold', LEVEL_COLORS[log.level] ?? '')}>{log.level}</span>
                </td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{log.user}</td>
                <td className="px-3 py-2 text-gray-900 dark:text-white">{log.action}</td>
                <td className="px-3 py-2 font-mono text-gray-400">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 mt-4">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <FileText className="w-4 h-4" /> تصدير CSV
        </button>
      </div>
    </div>
  )
}

function SecurityPanel() {
  const [twoFa, setTwoFa]           = useState(false)
  const [sessionTimeout, setTO]     = useState('60')
  const [ipWhitelist, setIpWL]      = useState(false)
  const [forcePassReset, setFPR]    = useState(false)

  return (
    <div>
      <SectionTitle title="الأمان والمصادقة" desc="إعدادات حماية الحسابات والجلسات" />
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 mb-6">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">المصادقة الثنائية (2FA)</p>
            <p className="text-xs text-gray-500">طبقة حماية إضافية عند تسجيل الدخول</p>
          </div>
          <Toggle2 checked={twoFa} onChange={setTwoFa} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">تقييد IP</p>
            <p className="text-xs text-gray-500">السماح بالدخول من عناوين IP محددة فقط</p>
          </div>
          <Toggle2 checked={ipWhitelist} onChange={setIpWL} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">إلزام تغيير كلمة المرور</p>
            <p className="text-xs text-gray-500">كل 90 يوماً</p>
          </div>
          <Toggle2 checked={forcePassReset} onChange={setFPR} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">مدة انتهاء الجلسة</p>
            <p className="text-xs text-gray-500">دقائق من الخمول</p>
          </div>
          <select value={sessionTimeout} onChange={(e) => setTO(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="15">15 دقيقة</option>
            <option value="30">30 دقيقة</option>
            <option value="60">ساعة</option>
            <option value="480">8 ساعات</option>
          </select>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Key className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">إعادة تعيين كلمة المرور</p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">إرسال رابط إعادة التعيين إلى بريدك الإلكتروني</p>
          <button className="mt-2 text-xs text-amber-700 dark:text-amber-300 underline hover:no-underline">إرسال الرابط</button>
        </div>
      </div>
      <SaveBtn />
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, tenant } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingTab>('company')

  const panels: Record<SettingTab, React.ReactNode> = {
    company:       <CompanyPanel tenant={tenant} />,
    users:         <UsersPanel />,
    notifications: <NotificationsPanel />,
    email:         <EmailPanel />,
    ai:            <AiPanel />,
    integrations:  <IntegrationsPanel />,
    backup:        <BackupPanel />,
    logs:          <LogsPanel />,
    security:      <SecurityPanel />,
  }

  return (
    <div className="p-6 animate-fade-in">
      <Topbar title="الإعدادات" subtitle="إدارة إعدادات المنصة والحساب" />

      <div className="mt-5 flex gap-6">
        {/* Sidebar nav */}
        <aside className="w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon, badge }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-right',
                  activeTab === id
                    ? 'bg-brand-600 text-white font-semibold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                )}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-right">{label}</span>
                {badge && <span className="text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full">{badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 min-h-[500px]">
          {panels[activeTab]}
        </div>
      </div>
    </div>
  )
}
