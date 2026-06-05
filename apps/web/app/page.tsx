'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  BarChart3, Brain, Users, Leaf, Shield, ArrowLeft,
  CheckCircle2, TrendingUp, Zap, Lock, Globe, ChevronDown,
  FileText, ShieldCheck, Bot, AlertTriangle, Eye, Target,
  Heart, Star, Award, Sparkles, ArrowUpRight, Building2
} from 'lucide-react'

// ── Animated Counter ───────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let cur = 0
    const step = Math.ceil(to / 60)
    const timer = setInterval(() => {
      cur += step
      if (cur >= to) { setCount(to); clearInterval(timer) }
      else setCount(cur)
    }, 24)
    return () => clearInterval(timer)
  }, [started, to])

  return <span ref={ref}>{count.toLocaleString('ar-SA')}{suffix}</span>
}

// ── Fade-in on scroll ──────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}>
      {children}
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────
const GOALS = [
  {
    id: 1,
    icon: BarChart3,
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600',
    title: 'تحليل البيانات',
    subtitle: 'رؤى ذكية تدعم القرار',
    description: 'حوّل بياناتك المالية الخام إلى رؤى استراتيجية قابلة للتنفيذ. لوحات تحكم تفاعلية وتقارير فورية تكشف عن فرص النمو وتحدد مواطن الهدر.',
    features: ['تقارير مالية فورية', 'رسوم بيانية تفاعلية', 'تحليل التدفق النقدي', 'مؤشرات الأداء الرئيسية'],
    stat: { value: 98, suffix: '%', label: 'دقة التحليل' },
  },
  {
    id: 2,
    icon: Brain,
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600',
    title: 'الذكاء الاصطناعي',
    subtitle: 'حلول مبتكرة وكفاءة متقدمة',
    description: 'وظّف قوة الذكاء الاصطناعي لأتمتة التدقيق، كشف الاحتيال، وتوقع الإيرادات. تقنية RPA تستخرج البيانات من الفواتير والمستندات تلقائياً.',
    features: ['استخراج البيانات آلياً (RPA)', 'كشف الاحتيال الفوري', 'توقع الإيرادات', 'تنظيف البيانات ذكياً'],
    stat: { value: 47, suffix: ' ساعة', label: 'توفير أسبوعي' },
  },
  {
    id: 3,
    icon: Users,
    color: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600',
    title: 'تجربة العملاء',
    subtitle: 'خدمة مالية سهلة ومخصصة',
    description: 'واجهة عربية احترافية مصممة للمحاسبين وأصحاب الأعمال. Onboarding سريع، دعم متعدد الأدوار، وتجربة استخدام سلسة على جميع الأجهزة.',
    features: ['واجهة عربية RTL كاملة', 'Onboarding تلقائي', 'أدوار متعددة للفريق', 'دعم الأجهزة المحمولة'],
    stat: { value: 4, suffix: ' دقائق', label: 'وقت الإعداد' },
  },
  {
    id: 4,
    icon: Leaf,
    color: 'from-teal-500 to-teal-700',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600',
    title: 'حلول مستدامة',
    subtitle: 'نمو مستمر على المدى البعيد',
    description: 'بنية تحتية سحابية قابلة للتوسع مع ضمان الامتثال المستمر لأنظمة ZATCA المتطورة. حلول تنمو مع نمو منشأتك وتتكيف مع التغييرات التشريعية.',
    features: ['بنية Multi-tenant', 'امتثال ZATCA مستمر', 'تحديثات تلقائية للأنظمة', 'استضافة سحابية سعودية'],
    stat: { value: 99.9, suffix: '%', label: 'وقت التشغيل' },
  },
]

const STATS = [
  { value: 1284, suffix: '+', label: 'فاتورة مُدقَّقة' },
  { value: 96,   suffix: '%', label: 'دقة الامتثال' },
  { value: 47,   suffix: 'k', label: 'ريال سعودي موفَّر' },
  { value: 100,  suffix: '%', label: 'توافق ZATCA' },
]

const MODULES = [
  { icon: FileText,      label: 'الفواتير الإلكترونية', color: 'text-blue-600 bg-blue-100' },
  { icon: ShieldCheck,   label: 'الامتثال ZATCA',       color: 'text-green-600 bg-green-100' },
  { icon: Bot,           label: 'AI-Powered RPA',        color: 'text-purple-600 bg-purple-100' },
  { icon: AlertTriangle, label: 'إدارة المخاطر',        color: 'text-amber-600 bg-amber-100' },
  { icon: BarChart3,     label: 'التقارير المالية',      color: 'text-indigo-600 bg-indigo-100' },
  { icon: Brain,         label: 'توقعات الطلب',         color: 'text-rose-600 bg-rose-100' },
]

// ── Page ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [activeGoal, setActiveGoal] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const goal = GOALS[activeGoal]
  const GoalIcon = goal.icon

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className={`font-bold text-lg ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
              الامتثال المالي
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#about"
              className={`text-sm font-medium transition-colors hidden md:block ${scrolled ? 'text-gray-600 hover:text-gray-900 dark:text-gray-300' : 'text-white/80 hover:text-white'}`}>
              من نحن
            </a>
            <Link href="/login"
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900 dark:text-gray-300' : 'text-white/80 hover:text-white'}`}>
              تسجيل الدخول
            </Link>
            <Link href="/register"
              className="px-4 py-2 bg-white text-brand-700 font-semibold rounded-xl text-sm hover:bg-brand-50 transition-colors shadow-sm">
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Glow blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 text-sm mb-8">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            متوافق مع اشتراطات ZATCA — الفاتورة الإلكترونية المرحلة الثانية
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            منصة التدقيق المالي الآلي
            <br />
            <span className="bg-gradient-to-l from-blue-200 to-emerald-200 bg-clip-text text-transparent">
              والامتثال للأنظمة
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10">
            نجمع الذكاء الاصطناعي، تحليل البيانات، وإدارة المخاطر في منصة واحدة متكاملة —
            مصممة للشركات السعودية لضمان الامتثال وتحقيق النمو.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register"
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-bold rounded-2xl hover:bg-brand-50 transition-colors shadow-xl text-base">
              ابدأ مجاناً الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/login"
              className="flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur text-white font-semibold rounded-2xl hover:bg-white/20 transition-colors border border-white/20 text-base">
              تسجيل الدخول
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <p className="text-3xl font-bold text-white">
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-blue-200 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           قسم: من نحن
      ══════════════════════════════════════════════ */}
      <section id="about" className="py-24 px-6 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* ─── Header ─── */}
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-semibold mb-4">
              <Building2 className="w-4 h-4" /> من نحن
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              نُعيد تعريف الامتثال الرقمي
              <br />
              <span className="text-brand-600">للمؤسسات السعودية</span>
            </h2>
          </FadeIn>

          {/* ─── Main Content Grid ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">

            {/* النص */}
            <FadeIn delay={100}>
              <div className="space-y-5">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  نحن منصة متخصصة في <span className="font-semibold text-brand-600">إدارة الامتثال والمخاطر والحوكمة</span>،
                  نهدف إلى تمكين المؤسسات من تحسين كفاءة العمليات الرقابية، وتعزيز الالتزام بالأنظمة واللوائح،
                  وإدارة المخاطر بذكاء من خلال حلول رقمية متطورة.
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  نعمل على توفير بيئة عمل متكاملة تساعد الجهات على متابعة السياسات والإجراءات، وإدارة المهام
                  والتدقيق والامتثال، مع تقديم تقارير ولوحات معلومات تفاعلية تدعم اتخاذ القرار وتحقيق التميز المؤسسي.
                </p>
                <div className="pt-2">
                  <Link href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-brand-200 dark:shadow-brand-900/30 text-sm">
                    تعرّف على المزيد <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* الرسم التوضيحي */}
            <FadeIn delay={200}>
              <div className="relative">
                {/* الكارت الرئيسي */}
                <div className="bg-gradient-to-br from-brand-900 to-brand-700 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">الامتثال المالي</p>
                      <p className="text-blue-200 text-xs">نظرة عامة</p>
                    </div>
                    <div className="mr-auto flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-300">نشط</span>
                    </div>
                  </div>

                  {/* Progress bars */}
                  {[
                    { label: 'امتثال ZATCA',       value: 96, color: 'bg-green-400' },
                    { label: 'إدارة المخاطر',      value: 88, color: 'bg-blue-400' },
                    { label: 'جودة الحوكمة',        value: 92, color: 'bg-purple-400' },
                    { label: 'التحول الرقمي',       value: 79, color: 'bg-amber-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-blue-200">{label}</span>
                        <span className="font-semibold">{value}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
                    {[
                      { n: '+150', l: 'مؤسسة' },
                      { n: '+12k', l: 'تقرير' },
                      { n: '99%',  l: 'رضا العملاء' },
                    ].map(({ n, l }) => (
                      <div key={l}>
                        <p className="text-xl font-bold">{n}</p>
                        <p className="text-blue-200 text-xs">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* بطاقات عائمة */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">ZATCA معتمد</p>
                    <p className="text-xs text-gray-400">المرحلة الثانية</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Claude AI</p>
                    <p className="text-xs text-gray-400">تحليل ذكي</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ─── إحصائيات ─── */}
          <FadeIn delay={150}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
              {[
                { value: 150,  suffix: '+', label: 'مؤسسة تثق بنا',     icon: Building2, color: 'from-brand-500 to-brand-700' },
                { value: 12000,suffix: '+', label: 'تقرير مُنجَز',       icon: FileText,  color: 'from-green-500 to-emerald-700' },
                { value: 98,   suffix: '%', label: 'رضا العملاء',        icon: Star,      color: 'from-amber-500 to-orange-600' },
                { value: 3,    suffix: ' سنوات', label: 'من الخبرة والتميز', icon: Award, color: 'from-purple-500 to-purple-700' },
              ].map(({ value, suffix, label, icon: Icon, color }) => (
                <div key={label}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow text-center group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ─── بطاقات الرؤية والرسالة والقيم ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* الرؤية */}
            <FadeIn delay={0}>
              <div className="relative bg-gradient-to-br from-brand-900 to-brand-700 rounded-3xl p-7 text-white overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-12 -translate-y-12" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 translate-y-8" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest">رؤيتنا</span>
                  <h3 className="text-xl font-bold mt-2 mb-3 leading-snug">الريادة الإقليمية في التحول الرقمي</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    أن نكون المنصة الرائدة في التحول الرقمي للامتثال وإدارة المخاطر على مستوى المنطقة.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* الرسالة */}
            <FadeIn delay={100}>
              <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-7 text-white overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-12 -translate-y-12" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 translate-y-8" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-100 uppercase tracking-widest">رسالتنا</span>
                  <h3 className="text-xl font-bold mt-2 mb-3 leading-snug">حلول ذكية للحوكمة والشفافية</h3>
                  <p className="text-emerald-100 text-sm leading-relaxed">
                    تقديم حلول ذكية ومبتكرة تساعد المؤسسات على تعزيز الحوكمة والشفافية ورفع كفاءة إدارة المخاطر.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* القيم */}
            <FadeIn delay={200}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm h-full">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">قيمنا</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-5">ما نؤمن به</h3>
                <div className="space-y-3">
                  {[
                    { label: 'الاحترافية',       icon: '🏆', color: 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' },
                    { label: 'الابتكار',          icon: '💡', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
                    { label: 'الشفافية',          icon: '🔍', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300' },
                    { label: 'الموثوقية',         icon: '🛡️', color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' },
                    { label: 'التحسين المستمر',   icon: '📈', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' },
                  ].map(({ label, icon, color }) => (
                    <div key={label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${color} font-medium text-sm`}>
                      <span className="text-base">{icon}</span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* ── Goals Section ── */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">رسالتنا وأهدافنا</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              أربعة أهداف استراتيجية تقود مسيرتنا
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              نبني منصة مالية شاملة تجمع بين الدقة التقنية والرؤية الاستراتيجية لخدمة المنشآت السعودية.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goal tabs */}
            <div className="space-y-3">
              {GOALS.map((g, i) => {
                const Icon = g.icon
                const isActive = i === activeGoal
                return (
                  <button key={g.id} onClick={() => setActiveGoal(i)}
                    className={`w-full text-right p-5 rounded-2xl border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-brand-500 bg-white dark:bg-gray-800 shadow-lg'
                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700'
                    }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isActive ? `bg-gradient-to-br ${g.color} shadow-lg` : g.bg}`}>
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : g.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-base transition-colors ${isActive ? 'text-brand-600' : 'text-gray-800 dark:text-white'}`}>
                          {g.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{g.subtitle}</p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Goal detail */}
            <div key={activeGoal} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl animate-fade-in">
              {/* Header */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center mb-6 shadow-lg`}>
                <GoalIcon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
              <p className={`text-sm font-semibold mb-4 ${goal.iconColor}`}>{goal.subtitle}</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{goal.description}</p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2.5 mb-8">
                {goal.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${goal.iconColor}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{f}</span>
                  </div>
                ))}
              </div>

              {/* Stat */}
              <div className={`flex items-center gap-4 p-4 rounded-2xl ${goal.bg}`}>
                <div>
                  <p className={`text-3xl font-bold ${goal.iconColor}`}>
                    {goal.stat.value}{goal.stat.suffix}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{goal.stat.label}</p>
                </div>
                <TrendingUp className={`w-8 h-8 mr-auto ${goal.iconColor} opacity-50`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">وحدات المنصة المتكاملة</h2>
            <p className="text-gray-500 dark:text-gray-400">كل ما تحتاجه في منصة واحدة</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MODULES.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-shadow group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">لماذا نحن؟</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                المنصة الوحيدة التي تجمع
                <br />
                <span className="text-brand-600">الامتثال والذكاء الاصطناعي</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
                صُمِّمت خصيصاً للسوق السعودي مع فهم عميق لاشتراطات هيئة الزكاة والضريبة والجمارك، ومتطلبات الفاتورة الإلكترونية بمرحلتيها.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock,   text: 'أمان بمستوى مؤسسي — تشفير AES-256 واستضافة داخل المملكة' },
                  { icon: Globe,  text: 'متوافق مع ZATCA المرحلة الأولى والثانية (الربط الآني)' },
                  { icon: Zap,    text: 'تشغيل فوري — إعداد الحساب في أقل من 4 دقائق' },
                  { icon: Shield, text: 'تحديثات تلقائية مع كل تغيير في الأنظمة والتشريعات' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-brand-600" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual card */}
            <div className="bg-gradient-to-br from-brand-900 to-brand-700 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold">الامتثال المالي</p>
                  <p className="text-blue-200 text-xs">لوحة التحكم</p>
                </div>
                <div className="mr-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-300">متصل</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: 'نسبة الامتثال',     value: '96%',      bar: 96, color: 'bg-green-400' },
                  { label: 'دقة الذكاء الاصطناعي', value: '94%',   bar: 94, color: 'bg-blue-400' },
                  { label: 'جودة البيانات',     value: '88%',      bar: 88, color: 'bg-purple-400' },
                ].map(({ label, value, bar, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-200">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'فواتير اليوم', value: '23' },
                  { label: 'تنبيهات', value: '2' },
                  { label: 'مخاطر مفتوحة', value: '1' },
                  { label: 'تشريعات جديدة', value: '3' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-3">
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-blue-200 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ابدأ رحلة الامتثال الذكي اليوم
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            انضم إلى المنشآت السعودية التي تثق بمنصتنا لإدارة امتثالها المالي وتحقيق أهدافها الاستراتيجية.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register"
              className="flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl hover:bg-brand-50 transition-colors shadow-xl text-base">
              إنشاء حساب مجاني
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/login"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-colors text-base">
              الدخول للمنصة
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">الامتثال المالي</span>
          </div>
          <p className="text-gray-500 text-sm text-center">
            منصة التدقيق المالي الآلي والامتثال للأنظمة السعودية · جميع الحقوق محفوظة © 2026
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            <span>متوافق مع ZATCA</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
