# 🚀 ابدأ من هنا — الامتثال المالي

**مرحباً بك!** هذا الملف سيوجهك خلال جميع خطوات إطلاق منصة **الامتثال المالي** على Render.

---

## 📋 الخريطة السريعة

اختر الخطوة التي تريد:

| الخطوة | الملف | الوقت |
|--------|------|-------|
| 1️⃣ **نظرة عامة** | [README.md](./README.md) | 5 دقائق |
| 2️⃣ **تشغيل محلي** | [QUICK_START.md](./QUICK_START.md) | 10 دقائق |
| 3️⃣ **دفع إلى GitHub** | [PUSH_TO_GITHUB.md](./PUSH_TO_GITHUB.md) | 5 دقائق |
| 4️⃣ **رفع على Render** | [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) | 20 دقيقة |
| 5️⃣ **قائمة التحقق** | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | مرجع |

---

## 🎯 المسار الموصى به

### المرة الأولى فقط (الرفع الأول)

```
1. اقرأ README.md                    ← (فهم المشروع)
   ↓
2. اتبع QUICK_START.md             ← (اختبر محلياً)
   ↓
3. اتبع PUSH_TO_GITHUB.md          ← (ادفع إلى GitHub)
   ↓
4. اتبع RENDER_DEPLOYMENT.md       ← (رفع على Render)
   ↓
5. راجع DEPLOYMENT_CHECKLIST.md    ← (تأكد من كل شيء)
```

### التحديثات المستقبلية (سريعة)

```
1. عدّل الكود محلياً
   ↓
2. git add . && git commit && git push
   ↓
3. Render سيرفع تلقائياً ✅
```

---

## 📖 شرح سريع لكل ملف

### 1. README.md
✅ **استخدم هذا عندما تريد:**
- فهم ميزات المشروع
- معرفة البنية التقنية
- رؤية الصور والمخططات
- معلومات الترخيص والمساهمة

**المدة:** 5 دقائق  
**من يقرأه:** الجميع

---

### 2. QUICK_START.md
✅ **استخدم هذا عندما تريد:**
- تشغيل المشروع محلياً على جهازك
- اختبار الميزات قبل الرفع
- حل مشاكل الاتصال أو المنافذ
- فهم أوامر التطوير

**المدة:** 10 دقائق  
**من يقرأه:** المطورون

**الخطوات بالاختصار:**
```bash
1. npm install --legacy-peer-deps
2. إنشاء قاعدة بيانات PostgreSQL
3. cp .env.example .env
4. شغّل API و Frontend في تيرمينالات منفصلة
5. افتح http://localhost:3000
```

---

### 3. PUSH_TO_GITHUB.md
✅ **استخدم هذا عندما تريد:**
- دفع الكود إلى GitHub
- إنشاء مستودع جديد
- فهم Git basics
- حل مشاكل الاتصال بـ GitHub

**المدة:** 5 دقائق  
**من يقرأه:** أول مرة فقط

**الخطوات بالاختصار:**
```bash
1. git init
2. git add .
3. git commit -m "Initial commit"
4. git remote add origin [GitHub URL]
5. git push -u origin main
```

---

### 4. RENDER_DEPLOYMENT.md
✅ **استخدم هذا عندما تريد:**
- رفع المشروع على Render.com
- إنشاء خدمات Render (API، Frontend، Database)
- ضبط متغيرات البيئة للإنتاج
- استكشاف أخطاء الرفع

**المدة:** 20 دقيقة  
**من يقرأه:** DevOps / المسؤول

**الخطوات الرئيسية:**
```
1. إنشاء قاعدة بيانات PostgreSQL على Render
2. إنشاء خدمة NestJS API
3. إنشاء خدمة Next.js Frontend
4. ضبط متغيرات البيئة
5. التحقق من الاتصال
```

**التكلفة:**
- API: $7/شهر
- Frontend: $7/شهر
- Database: $15/شهر
- **الإجمالي:** ~$29/شهر

---

### 5. DEPLOYMENT_CHECKLIST.md
✅ **استخدم هذا عندما تريد:**
- قائمة تفاعلية للتحقق من كل خطوة
- مرجع سريع أثناء الرفع
- أوامر Git والـ terminal
- استكشاف الأخطاء الشائعة

**المدة:** مرجع (استخدمه أثناء العمل)  
**من يقرأه:** الجميع (أثناء الرفع)

---

## 🔑 متطلبات أساسية

قبل البدء، تأكد من:

- [ ] **Node.js 18+** — [تحميل](https://nodejs.org)
- [ ] **PostgreSQL 16** — [تحميل](https://www.postgresql.org/download)
- [ ] **Git** — [تحميل](https://git-scm.com)
- [ ] **حساب GitHub** — [إنشاء حساب](https://github.com/signup)
- [ ] **حساب Render** — [إنشاء حساب](https://render.com)

---

## ⚡ الخطوات الأساسية (الملخص)

### الخطوة 1️⃣: البدء المحلي (15 دقيقة)

```bash
# استنساخ أو فتح المشروع
cd finaudit-platform

# تثبيت المكتبات
npm install --legacy-peer-deps

# تشغيل الخوادم (في 2 terminal منفصلة)
cd apps/api && npm run dev      # Terminal 1
cd apps/web && npm run dev      # Terminal 2

# الوصول
http://localhost:3000           # Frontend
http://localhost:3001/api/v1/health  # API
```

### الخطوة 2️⃣: الدفع إلى GitHub (5 دقائق)

```bash
git init
git add .
git commit -m "Initial commit: FinAudit Platform v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/finaudit-platform.git
git push -u origin main
```

### الخطوة 3️⃣: الرفع على Render (20 دقيقة)

1. سجل دخول على [Render.com](https://render.com)
2. ربط GitHub
3. إنشاء 3 خدمات:
   - Database (PostgreSQL)
   - API (NestJS)
   - Frontend (Next.js)
4. ضبط متغيرات البيئة
5. الانتظار للبناء (5-10 دقائق)

---

## 📊 الميزات الرئيسية

**الامتثال المالي** توفر:

| الميزة | الوصف | الصفحة |
|-------|-------|--------|
| 📊 **لوحة التحكم** | KPIs، رسوم بيانية | `/overview` |
| 📄 **إدارة الفواتير** | CRUD + ZATCA | `/invoices` |
| ✅ **الامتثال** | ZATCA Compliance | `/compliance` |
| 📋 **التشريعات** | تتبع الأنظمة المالية | `/regulations` |
| ⚠️ **إدارة المخاطر** | مصفوفة مخاطر | `/risk` |
| 🚨 **كشف الاحتيال** | AI-powered detection | `/fraud` |
| 🤖 **RPA الذكي** | استخراج بيانات آلي | `/rpa` |
| 🧹 **تنظيف البيانات** | Smart cleansing | `/cleansing` |
| 📈 **التوقعات** | Demand forecasting | `/forecasting` |
| 💰 **التسعير** | Dynamic costing | `/costing` |

---

## 🔐 حساب تجريبي

بعد الرفع، استخدم:

```
البريد:     test@finaudit.sa
كلمة المرور: Test@2026
الرقم الضريبي: 310122519900003
```

---

## 🚨 استكشاف الأخطاء الشائعة

### خطأ: "Port 3000 already in use"
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### خطأ: "Database connection refused"
```bash
# تحقق من أن PostgreSQL يعمل
psql -U postgres -c "SELECT 1"

# إذا لم يعمل، ابدأ الخدمة
# Windows: services.msc → PostgreSQL → Start
# macOS: brew services start postgresql
```

### خطأ: "Cannot find module"
```bash
npm install --legacy-peer-deps
```

---

## 📞 الدعم والمساعدة

| السؤال | الملف المرجعي |
|--------|------------|
| كيف أشغل المشروع محلياً؟ | [QUICK_START.md](./QUICK_START.md) |
| كيف أرفع على GitHub؟ | [PUSH_TO_GITHUB.md](./PUSH_TO_GITHUB.md) |
| كيف أرفع على Render؟ | [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) |
| هل هناك خطأ في الرفع؟ | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) |
| ما هي ميزات المشروع؟ | [README.md](./README.md) |

---

## ✨ القادم

بعد الإطلاق بنجاح:

- [ ] مراقبة الأداء على Render Dashboard
- [ ] إضافة المزيد من الميزات
- [ ] توسيع القاعدة
- [ ] التكامل مع أنظمة خارجية

---

## 📚 الموارد الإضافية

- **Render Docs:** https://render.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **NestJS Docs:** https://docs.nestjs.com
- **GitHub Help:** https://docs.github.com
- **PostgreSQL Docs:** https://www.postgresql.org/docs/16

---

## 🎯 الخطوة التالية

**اختر:**

👉 **أول مرة?** ابدأ بـ [README.md](./README.md)

👉 **تريد تشغيل محلي?** انتقل إلى [QUICK_START.md](./QUICK_START.md)

👉 **جاهز للرفع?** اتجه إلى [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

---

**Version:** 1.0.0  
**Status:** 🟢 جاهز للإطلاق

---

**اجعل الامتثال المالي سهلاً! 🚀**

**آخر تحديث:** 6 يونيو 2026
