# 📂 دليل الملفات — الامتثال المالي

هذا الدليل يشرح الملفات والمجلدات الموجودة في المشروع.

---

## 📖 ملفات التوثيق (Documentation)

### للقراءة الأولى

| الملف | الاستخدام | الوقت |
|------|---------|-------|
| **START_HERE.md** | نقطة الدخول الرئيسية - اقرأ هذا أولاً! | 2m |
| **GETTING_STARTED.txt** | ملخص سريع للبدء | 1m |
| **_DEPLOYMENT_SUMMARY.txt** | ملخص شامل للرفع | 3m |

### للتطوير والرفع

| الملف | الاستخدام | الوقت |
|------|---------|-------|
| **README.md** | شرح شامل للمشروع والميزات | 5m |
| **QUICK_START.md** | كيفية تشغيل المشروع محلياً | 10m |
| **PUSH_TO_GITHUB.md** | خطوات دفع الكود إلى GitHub | 5m |
| **RENDER_DEPLOYMENT.md** | نشر المشروع على Render | 20m |
| **DEPLOYMENT_CHECKLIST.md** | قائمة تحقق شاملة لجميع الخطوات | مرجع |
| **PROJECT_STATUS.md** | حالة المشروع والإنجازات | 5m |
| **QUICK_REFERENCE.md** | مرجع سريع للأوامر والروابط | مرجع |
| **FILES_GUIDE.md** | هذا الملف | - |

---

## ⚙️ ملفات الإعدادات (Configuration)

### ملفات مهمة

```
.env.example          ← قالب متغيرات البيئة (انسخ إلى .env)
.env                  ← متغيرات البيئة الفعلية (⚠️ لا تدفع إلى Git)
.gitignore            ← ملفات لا تدفع إلى Git
render.yaml           ← تكوين Render للرفع التلقائي
start.ps1             ← سكريبت تشغيل سريع (Windows)
```

---

## 📦 المشروع الأساسي (Core)

### الملفات الجذرية

```
finaudit-platform/
├── package.json                ← Workspace root configuration
├── turbo.json                  ← Turborepo build pipeline
├── tsconfig.json               ← TypeScript global config
├── .eslintrc.json              ← Linting rules
└── ...
```

---

## 🚀 تطبيقات (Apps)

### apps/api — NestJS Backend

```
apps/api/
├── src/
│   ├── app.module.ts           ← Root module
│   ├── main.ts                 ← Entry point
│   │
│   ├── auth/                   ← Authentication
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── invoices/               ← Invoice Management
│   │   ├── invoices.controller.ts
│   │   ├── invoices.service.ts
│   │   ├── invoice.entity.ts
│   │   └── invoices.module.ts
│   │
│   ├── zatca/                  ← ZATCA Validation
│   │   ├── zatca.controller.ts
│   │   ├── zatca.service.ts
│   │   └── zatca.module.ts
│   │
│   ├── ai/                     ← Claude AI Integration
│   │   ├── ai.controller.ts
│   │   ├── ai.service.ts
│   │   └── ai.module.ts
│   │
│   ├── reports/                ← Analytics & Reports
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   └── reports.module.ts
│   │
│   ├── health/                 ← System Health
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   │
│   ├── tenants/                ← Multi-tenant Support
│   │   ├── tenants.service.ts
│   │   └── tenants.module.ts
│   │
│   └── users/                  ← User Management
│       ├── users.service.ts
│       └── users.module.ts
│
├── dist/                       ← Build output (generated)
├── package.json                ← API dependencies
└── tsconfig.json               ← TypeScript config
```

### apps/web — Next.js Frontend

```
apps/web/
├── app/
│   ├── layout.tsx              ← Root layout
│   ├── page.tsx                ← Landing page
│   ├── globals.css             ← Global styles
│   │
│   ├── (auth)/                 ← Auth routes
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   └── (dashboard)/            ← Dashboard routes (15+ pages)
│       ├── layout.tsx
│       ├── overview/page.tsx
│       ├── invoices/page.tsx
│       ├── compliance/page.tsx
│       ├── regulations/page.tsx
│       ├── risk/page.tsx
│       ├── fraud/page.tsx
│       ├── rpa/page.tsx
│       ├── cleansing/page.tsx
│       ├── forecasting/page.tsx
│       ├── costing/page.tsx
│       ├── health/page.tsx
│       └── settings/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         ← Navigation sidebar
│   │   ├── topbar.tsx          ← Top bar with breadcrumbs
│   │   └── breadcrumb.tsx
│   │
│   ├── ui/                     ← Reusable UI components
│   │   ├── stat-card.tsx
│   │   ├── theme-provider.tsx
│   │   ├── toaster.tsx
│   │   └── ...
│   │
│   ├── charts/                 ← Chart components
│   │   ├── revenue-chart.tsx
│   │   ├── compliance-chart.tsx
│   │   └── ...
│   │
│   └── onboarding/
│       └── welcome-wizard.tsx
│
├── contexts/
│   └── auth-context.tsx        ← Auth state management
│
├── hooks/
│   ├── use-api.ts              ← API fetching hook
│   └── use-auth.ts             ← Auth hook
│
├── lib/
│   ├── api.ts                  ← Axios API client
│   └── utils.ts                ← Utility functions
│
├── middleware.ts               ← Route protection
├── next.config.js              ← Next.js configuration
├── tailwind.config.ts          ← Tailwind CSS config
├── package.json                ← Frontend dependencies
└── tsconfig.json               ← TypeScript config
```

---

## 📚 المكتبات المشتركة (Packages)

```
packages/
│
├── shared-types/               ← TypeScript Type Definitions
│   ├── src/
│   │   ├── index.ts            ← Main export
│   │   ├── auth.types.ts       ← Auth types
│   │   ├── tenant.types.ts     ← Tenant types
│   │   ├── invoice.types.ts    ← Invoice types
│   │   └── ...
│   └── package.json
│
└── zatca-validator/            ← ZATCA Validation Library
    ├── src/
    │   ├── index.ts            ← Main export
    │   ├── validator.ts        ← Validation logic
    │   ├── qr-generator.ts     ← QR code generation
    │   └── xml-builder.ts      ← XML generation
    └── package.json
```

---

## 🗄️ قاعدة البيانات

### تعريف الجداول

```
PostgreSQL 16

Tables:
├── users                       ← User accounts
├── tenants                     ← Company/Tenant info
├── invoices                    ← Invoice data
├── invoice_items              ← Line items
├── regulations                ← Financial regulations
├── risks                      ← Risk management
├── fraud_alerts               ← Fraud detection
├── reports                    ← Generated reports
└── audit_logs                 ← System audit logs

Features:
├── Row-Level Security (RLS)   ← Tenant isolation
├── UUID Primary Keys          ← Unique identifiers
├── Timestamps                 ← Created/Updated at
└── Constraints                ← Data integrity
```

---

## 🔐 ملفات حساسة (Security)

⚠️ **لا تدفع هذه الملفات إلى Git:**

```
.env                           ← متغيرات البيئة المحلية
node_modules/                  ← Dependencies (reinstall locally)
dist/                          ← Build output (rebuild locally)
.next/                         ← Next.js cache (rebuild locally)
.DS_Store                      ← macOS system file
Thumbs.db                      ← Windows system file
*.log                          ← Log files
coverage/                      ← Test coverage
```

✅ **تحقق من .gitignore** للتأكد من أنها مُضافة.

---

## 📊 ملفات البناء (Build)

```
turbo.json                     ← Turborepo configuration
                                 (build pipeline & caching)

package.json                   ← Scripts:
                                 ├── npm run dev     (develop)
                                 ├── npm run build   (production)
                                 └── npm run test    (testing)
```

---

## 🎨 أصول التصميم (Assets)

### Fonts

```
Fonts used:
├── Cairo              ← Arabic support (Google Fonts)
├── System fonts       ← English/Default
└── Tailwind CSS       ← Utility-first styling
```

### Colors & Theming

```
tailwind.config.ts     ← Custom colors & theme
globals.css            ← CSS variables & base styles
                        ├── Colors (brand, success, warning, danger)
                        ├── RTL support
                        └── Animations
```

---

## 📱 Responsive Design

```
Tailwind Breakpoints:
├── sm: 640px
├── md: 768px
├── lg: 1024px
├── xl: 1280px
└── 2xl: 1536px

Mobile First:
├── Mobile (< 640px)   ← Default
├── Tablet (≥ 640px)
└── Desktop (≥ 1024px)
```

---

## 🌍 Internationalization (i18n)

```
Arabic (ar) Support:
├── RTL (Right-to-Left) in all layouts
├── Cairo font for Arabic text
├── Tailwind dir="rtl" configuration
├── Component alignment (flex-row-reverse, etc.)
└── Form labels & placeholders

English (en) Compatible:
├── LTR (Left-to-Right) fallback
└── Default system fonts
```

---

## 🔄 Git Workflow

### Files that should go to Git

✅ Source code (`src/`)  
✅ Configuration files (`*.json`, `*.yaml`)  
✅ Documentation (`*.md`, `*.txt`)  
✅ Environment templates (`.env.example`)  

### Files that should NOT go to Git

❌ Dependencies (`node_modules/`)  
❌ Environment files (`.env`)  
❌ Build outputs (`dist/`, `.next/`)  
❌ System files (`.DS_Store`, `Thumbs.db`)  
❌ Logs (`*.log`)  

---

## 📈 Build & Deployment

### Local Development

```
npm install --legacy-peer-deps
npm run dev                    ← Both apps
```

### Production Build

```
npm run build
npm start
```

### Render Deployment

```
render.yaml                    ← Render configuration
                                 (automatic builds & deploys)
```

---

## 🎯 السير السريع (Quick Navigation)

| الحاجة | الملف |
|--------|------|
| **البدء السريع** | START_HERE.md |
| **البناء المحلي** | QUICK_START.md |
| **الرفع على Render** | RENDER_DEPLOYMENT.md |
| **استكشاف الأخطاء** | DEPLOYMENT_CHECKLIST.md |
| **مرجع سريع** | QUICK_REFERENCE.md |
| **حالة المشروع** | PROJECT_STATUS.md |
| **ملفات التكوين** | render.yaml, .env.example |

---

## 📝 ملاحظات مهمة

### عند الاستنساخ (Clone)

```bash
git clone [repo-url]
cd finaudit-platform
npm install --legacy-peer-deps
cp .env.example .env        # عدّل القيم!
```

### قبل الدفع (Push)

```bash
# تأكد من:
□ لم تضع كلمات السر في الكود
□ .env في .gitignore
□ لا توجد أخطاء في npm run build
□ الاختبارات تمر: npm run test
```

### بعد الرفع على GitHub

```bash
# تحقق من:
□ Repository موجود على GitHub
□ render.yaml موجود
□ .env.example موجود
□ README.md موجود
□ لا توجد ملفات حساسة
```

---

## 🎉 الخلاصة

هذا المشروع منظم بـ:

✅ **Monorepo Structure** مع Turborepo  
✅ **Shared Packages** للكود المشترك  
✅ **Separate Apps** لـ API و Frontend  
✅ **Comprehensive Documentation** لكل شيء  
✅ **Production Ready** Configuration  

**الآن أنت جاهز للبدء! 🚀**

---

**Last Updated:** 6 يونيو 2026  
**Version:** 1.0.0
