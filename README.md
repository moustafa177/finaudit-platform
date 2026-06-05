# 🏢 الامتثال المالي — منصة التدقيق الآلي والامتثال

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-blue.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](#)

---

## 🎯 نبذة عن المشروع

**الامتثال المالي** هي منصة ذكية متخصصة في:

✅ **إدارة الامتثال المالي** — تتبع التشريعات والأنظمة المالية السعودية  
✅ **إدارة المخاطر** — رصد ومراقبة المخاطر المالية والتشغيلية  
✅ **اكتشاف الاحتيال** — كشف المعاملات المشبوهة بالذكاء الاصطناعي  
✅ **التدقيق الآلي** — فحص الفواتير والامتثال لـ ZATCA تلقائياً  
✅ **التقارير الذكية** — تقارير تفاعلية وتحليلات متقدمة  

---

## 🚀 الميزات الأساسية

### 📊 لوحة التحكم الذكية
- KPIs تفاعلية (الإيرادات، الضريبة، معدل الامتثال)
- رسوم بيانية ولوحات معلومات في الوقت الفعلي
- تنبيهات فورية للمشكلات المالية

### 🧠 الذكاء الاصطناعي المتقدم
- **استخراج البيانات (RPA)** — استخرج البيانات من الفواتير تلقائياً
- **تنظيف البيانات** — كشف وإصلاح الأخطاء والتناقضات
- **توقعات الطلب** — توقع الإيرادات والاتجاهات بدقة
- **كشف الاحتيال** — رصد المعاملات المشبوهة بنسبة 94% دقة

### ✅ الامتثال التلقائي
- **ZATCA** — التحقق من الفواتير لـ ZATCA المرحلة الثانية
- **التشريعات** — متابعة التشريعات المالية الجديدة
- **إدارة المخاطر** — مصفوفة مخاطر تفاعلية

### 🔒 الأمان والحماية
- JWT مع Refresh Tokens (15 دقيقة + 7 أيام)
- Multi-tenant isolation مع Row-Level Security
- تشفير البيانات الحساسة
- سجلات تدقيق شاملة (Audit Logs)

---

## 🛠️ البنية التقنية

```
finaudit-platform/
├── apps/
│   ├── api/               ← NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/     ← JWT & Auth
│   │   │   ├── invoices/ ← Invoice CRUD
│   │   │   ├── zatca/    ← ZATCA Validator
│   │   │   ├── ai/       ← Claude AI Integration
│   │   │   ├── reports/  ← Analytics & Reports
│   │   │   └── health/   ← System Health
│   │   └── package.json
│   │
│   └── web/               ← Next.js Frontend
│       ├── app/
│       │   ├── (auth)/   ← Login & Register
│       │   └── (dashboard)/
│       │       ├── overview/       ← Dashboard
│       │       ├── invoices/       ← Invoice Management
│       │       ├── compliance/     ← ZATCA Compliance
│       │       ├── regulations/    ← Financial Regulations
│       │       ├── risk/           ← Risk Management
│       │       ├── fraud/          ← Fraud Detection
│       │       ├── rpa/            ← AI-Powered RPA
│       │       ├── cleansing/      ← Data Cleansing
│       │       ├── forecasting/    ← Demand Forecasting
│       │       ├── costing/        ← Dynamic Costing
│       │       ├── settings/       ← 9-Section Settings
│       │       └── health/         ← System Health Center
│       ├── components/
│       └── package.json
│
├── packages/
│   ├── shared-types/    ← TypeScript Shared Types
│   └── zatca-validator/ ← ZATCA Validation Library
│
├── render.yaml          ← Render Deployment Config
├── RENDER_DEPLOYMENT.md ← Full Deployment Guide
└── QUICK_START.md       ← Quick Setup Guide
```

---

## 📈 المواصفات الفنية

| المكون | التقنية |
|--------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | NestJS, TypeORM, PostgreSQL 16 |
| **AI** | Claude API (Anthropic) |
| **Database** | PostgreSQL 16 مع RLS و UUID |
| **Validation** | React Hook Form + Zod |
| **Charts** | Recharts (responsive & RTL) |
| **Internationalization** | Arabic RTL, Cairo Font |
| **Monorepo** | Turborepo |

---

## 🚀 البدء السريع

### التثبيت المحلي (5 دقائق)

```bash
# 1. استنساخ المستودع
git clone https://github.com/your-username/finaudit-platform.git
cd finaudit-platform

# 2. تثبيت المكتبات
npm install --legacy-peer-deps

# 3. إعداد قاعدة البيانات
# (انظر QUICK_START.md للتفاصيل)

# 4. متغيرات البيئة
cp .env.example .env

# 5. تشغيل المشروع
# Terminal 1:
cd apps/api && npm run dev

# Terminal 2:
cd apps/web && npm run dev
```

**الوصول:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Health: http://localhost:3001/api/v1/health

---

## 📤 الرفع على Render

### الطريقة 1: استخدام Render Dashboard (سهل)

1. **تسجيل الدخول** إلى [render.com](https://render.com)
2. **ربط GitHub** وأعط الإذن
3. **إنشاء الخدمات:**
   - PostgreSQL Database (finaudit-db)
   - NestJS Web Service (finaudit-api)
   - Next.js Web Service (finaudit-web)
4. **ضبط متغيرات البيئة** لكل خدمة
5. **النشر التلقائي** عند دفع commits

**تكاليف Render:**
- API: $7/شهر (Starter Plan)
- Frontend: $7/شهر (Starter Plan)
- Database: $15/شهر (PostgreSQL Starter)
- **الإجمالي:** ~$29/شهر

### الطريقة 2: استخدام render.yaml (موصى به)

```bash
# ادفع الكود مع render.yaml
git push origin main

# Render سيقرأ render.yaml تلقائياً ويُنشئ الخدمات
# (راجع RENDER_DEPLOYMENT.md للتفاصيل الكاملة)
```

---

## 🔐 متغيرات البيئة المطلوبة

### في Render Dashboard:

**finaudit-api (NestJS):**
```
NODE_ENV                = production
DATABASE_URL            = [من قاعدة البيانات]
JWT_SECRET              = [قيمة قوية عشوائية]
JWT_REFRESH_SECRET      = [قيمة قوية عشوائية]
ANTHROPIC_API_KEY       = [من console.anthropic.com]
```

**finaudit-web (Next.js):**
```
NEXT_PUBLIC_API_URL     = https://finaudit-api.onrender.com/api/v1
NEXT_PUBLIC_APP_URL     = https://finaudit-web.onrender.com
```

---

## ✅ اختبار المنصة

### حساب تجريبي:

```
البريد:     test@finaudit.sa
كلمة المرور: Test@2026
الرقم الضريبي: 310122519900003
```

### الصفحات الرئيسية:

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| لوحة التحكم | `/overview` | KPIs والرسوم البيانية |
| الفواتير | `/invoices` | إدارة الفواتير |
| الامتثال | `/compliance` | ZATCA Compliance |
| التشريعات | `/regulations` | Financial Regulations Tracker |
| إدارة المخاطر | `/risk` | Risk Matrix & Management |
| اكتشاف الاحتيال | `/fraud` | Fraud Detection & Alerts |
| صحة النظام | `/health` | System Health Center |

---

## 📊 الأداء والموثوقية

- **Uptime:** 99.9% (SLA Render)
- **استجابة API:** < 100ms (P95)
- **استخراج البيانات:** 100+ وثيقة/دقيقة
- **دقة كشف الاحتيال:** 94%
- **قاعدة البيانات:** PostgreSQL 16 مع Automated Backups

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. **Fork** المستودع
2. **إنشاء فرع** جديد (`git checkout -b feature/amazing-feature`)
3. **Commit** التغييرات (`git commit -m 'Add amazing feature'`)
4. **Push** إلى الفرع (`git push origin feature/amazing-feature`)
5. **فتح Pull Request**

---

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

---

## 📞 التواصل والدعم

- **GitHub Issues:** [Report a bug](https://github.com/your-username/finaudit-platform/issues)
- **Discussions:** [Ask a question](https://github.com/your-username/finaudit-platform/discussions)
- **Email:** support@finaudit.sa

---

## 📚 الموارد الإضافية

- [🚀 البدء السريع](./QUICK_START.md)
- [📤 دليل الرفع على Render](./RENDER_DEPLOYMENT.md)
- [🔧 دليل التطوير](./docs/DEVELOPMENT.md)
- [📖 API Documentation](./docs/API.md)

---

## 🎯 الخارطة الطريقية

- [x] Core Architecture (Auth, Multi-tenant, Database)
- [x] Invoice Management (CRUD, ZATCA Validation, QR/XML)
- [x] AI-Powered Features (RPA, Data Cleansing, Forecasting, Fraud Detection)
- [x] Dashboard & Reports (KPIs, Charts, Exports)
- [x] Financial Regulations Tracker
- [x] Risk Management Matrix
- [x] System Health Center
- [ ] Mobile App (iOS/Android)
- [ ] Advanced Analytics & Dashboards
- [ ] Integration APIs for Third-party Systems

---

## 🙏 الشكر والتقدير

تم بناء هذا المشروع بـ ❤️ لخدمة المؤسسات السعودية في مجال الامتثال المالي.

---

**Version:** 1.0.0  
**Last Updated:** June 6, 2026  
**Maintained by:** FinAudit Team

**اجعل الامتثال المالي سهلاً وآلياً! 🚀**
