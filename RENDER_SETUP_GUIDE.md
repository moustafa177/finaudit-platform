# 🚀 دليل إعداد Render الكامل — الامتثال المالي

**تم إعداد المشروع بالكامل! الآن تحتاج فقط إلى الخطوات اليدوية على Render.**

---

## ✅ ما تم إعداده بالفعل

- ✅ **المشروع كامل** (NestJS + Next.js + PostgreSQL)
- ✅ **ملف render.yaml** (تكوين Render جاهز)
- ✅ **.env.example** (قالب متغيرات البيئة)
- ✅ **جميع الملفات والتوثيق**

**الآن:** فقط تحتاج 3 خطوات يدوية على موقع Render!

---

## 🎯 الخطوات الثلاث النهائية

### 🔑 الخطوة 1️⃣: إنشاء حساب Render + GitHub

#### 1.1 - إنشاء حساب Render:

```
1. اذهب إلى: https://render.com
2. اضغط: Sign Up
3. اختر: Sign up with GitHub
4. أكمل التسجيل
```

#### 1.2 - ربط GitHub:

```
1. في Render Dashboard
2. اذهب إلى: Account Settings
3. اختر: GitHub
4. اضغط: Connect GitHub
5. أعط الإذن
```

#### 1.3 - نسخ GitHub Repo URL:

```
اذهب إلى:
https://github.com/your-username/finaudit-platform

انسخ الرابط (إذا لم تكن نسختها بعد):
https://github.com/YOUR-USERNAME/finaudit-platform.git
```

---

### 🗄️ الخطوة 2️⃣: إنشاء قاعدة البيانات

#### 2.1 - في Render Dashboard:

```
1. اضغط: New +
2. اختر: Database
3. اختر: PostgreSQL
4. انتظر اللود
```

#### 2.2 - ملء البيانات:

```
Name:                  finaudit-db
Database Name:         finaudit_db
User:                  finaudit_user
Region:                Frankfurt (eu-central-1)
PostgreSQL Version:    16
```

```
5. اضغط: Create Database
6. ⏳ انتظر 2-3 دقائق
```

#### 2.3 - نسخ الرابط:

```
بعد الإنشاء، ستجد:
"Internal Database URL"

مثال:
postgresql://finaudit_user:abc123xyz@dpg-xxxxx.postgres.render.com:5432/finaudit_db

👉 انسخ هذا الرابط (ستحتاجه الآن!)
```

---

### 🌐 الخطوة 3️⃣: إنشاء الخدمات (API + Frontend)

#### 3.1 - إنشاء خدمة API:

```
1. اضغط: New +
2. اختر: Web Service
3. اختر: Build and deploy from a Git repository
4. اختر: finaudit-platform من القائمة
```

#### 3.2 - إعدادات API:

```
Name:                  finaudit-api
Environment:           Node
Region:                Frankfurt
Branch:                main
Build Command:         cd apps/api && npm install --legacy-peer-deps && npm run build
Start Command:         cd apps/api && node -r tsconfig-paths/register dist/src/main
Auto-Deploy:           On
```

#### 3.3 - متغيرات البيئة للـ API:

```
في القسم "Environment":
```

| Key | Value | ملاحظات |
|-----|-------|--------|
| NODE_ENV | production | |
| API_PORT | 3001 | |
| API_PREFIX | api/v1 | |
| DATABASE_URL | [من 2.3 أعلاه] | ✅ الهام جداً! |
| JWT_SECRET | [اضغط Generate] | أو أي قيمة عشوائية |
| JWT_REFRESH_SECRET | [اضغط Generate] | أو أي قيمة عشوائية |
| JWT_EXPIRES_IN | 15m | |
| JWT_REFRESH_EXPIRES_IN | 7d | |
| ZATCA_ENV | sandbox | |
| ANTHROPIC_API_KEY | [اختياري] | من console.anthropic.com |

```
5. اضغط: Create Web Service
6. ⏳ انتظر البناء (5-10 دقائق)
7. ✅ عندما ينتهي، انسخ الـ URL
   مثال: https://finaudit-api.onrender.com
```

#### 3.4 - إنشاء خدمة Frontend:

```
1. اضغط: New +
2. اختر: Web Service
3. نفس الخطوات، لكن:
```

```
Name:                  finaudit-web
Environment:           Node
Region:                Frankfurt
Branch:                main
Build Command:         cd apps/web && npm install --legacy-peer-deps && npm run build
Start Command:         cd apps/web && npm start
Auto-Deploy:           On
```

#### 3.5 - متغيرات البيئة للـ Frontend:

```
NEXT_PUBLIC_API_URL    = https://finaudit-api.onrender.com/api/v1
NEXT_PUBLIC_APP_URL    = https://finaudit-web.onrender.com
NODE_ENV               = production
```

```
4. اضغط: Create Web Service
5. ⏳ انتظر البناء (5-10 دقائق)
6. ✅ عندما ينتهي، انسخ الـ URL
   مثال: https://finaudit-web.onrender.com
```

---

## ✅ اختبر النتيجة

### اختبر الـ API:

```bash
curl https://finaudit-api.onrender.com/api/v1/health

# يجب أن ترى شيء مثل:
# {"status":"ok","database":"connected","api":"running",...}
```

### اختبر الـ Frontend:

```
1. افتح: https://finaudit-web.onrender.com
2. يجب أن ترى الصفحة الرئيسية ✅
3. جرب: test@finaudit.sa / Test@2026
```

---

## 📊 البيانات المهمة

احفظ هذه في مكان آمن:

```
DATABASE_URL:
postgresql://finaudit_user:PASSWORD@dpg-xxxxx.postgres.render.com:5432/finaudit_db

API URL:
https://finaudit-api.onrender.com

Frontend URL:
https://finaudit-web.onrender.com

Test Credentials:
Email: test@finaudit.sa
Password: Test@2026
```

---

## 🎯 خلاصة الخطوات (10 دقائق يدوية)

```
1️⃣ أنشئ حساب Render + ربط GitHub (2m)
2️⃣ أنشئ Database PostgreSQL (2m)
3️⃣ أنشئ API Service (3m)
4️⃣ أنشئ Frontend Service (3m)
5️⃣ انتظر البناء (10m - تلقائي)
6️⃣ اختبر النتيجة (1m)

✅ الإجمالي: ~20 دقيقة
```

---

## ⚠️ نصائح مهمة

### الخطأ: "Database Connection Error"

```
✅ الحل:
1. تأكد من DATABASE_URL صحيح (انسخ كاملاً)
2. انتظر 2-3 دقائق بعد إنشاء Database
3. تأكد من database في حالة "available"
```

### الخطأ: "Build Failed"

```
✅ الحل:
1. اذهب إلى Logs
2. ابحث عن الخطأ
3. تأكد من:
   - package.json موجود في apps/api و apps/web
   - npm install --legacy-peer-deps يعمل
```

### الخطأ: "Frontend لا يتصل بـ API"

```
✅ الحل:
1. تأكد NEXT_PUBLIC_API_URL صحيح
2. افتح Console في المتصفح
3. شوف أي CORS errors
4. تأكد API يعمل: curl /health
```

---

## 📱 مراقبة الخدمات

بعد الإنشاء، في Render Dashboard:

```
✅ Services → finaudit-api → Logs
✅ Services → finaudit-web → Logs
✅ Databases → finaudit-db → Logs
✅ Metrics (CPU, Memory, etc.)
```

---

## 💰 التكاليف

```
API:         $7/month
Frontend:    $7/month
Database:    $15/month
─────────────────────
الإجمالي:     $29/month

Free Credit: $10/month
Net Cost:    $19/month (الشهر الأول)
```

---

## 🎉 تم!

بعد اكتمال الخطوات الثلاث، موقعك سيكون:

```
✅ Frontend:  https://finaudit-web.onrender.com
✅ API:       https://finaudit-api.onrender.com/api/v1
✅ Database:  PostgreSQL على Render
✅ AI:        Claude API جاهز
```

---

## 📞 معلومات إضافية

**ملفات مهمة محلياً:**

```
render.yaml              ← تكوين Render (كامل)
.env.example             ← قالب المتغيرات
RENDER_DEPLOYMENT.md     ← تفاصيل أكثر
QUICK_START.md           ← تشغيل محلي
```

---

## ✨ ملخص النهائي

**المشروع مُعد 100%. الآن:**

1. سجل على Render.com
2. اتبع الخطوات الثلاث أعلاه (20 دقيقة)
3. اختبر النتيجة ✅

**كل شيء موجود وجاهز!**

---

**Version:** 1.0.0  
**Status:** Ready for Render  
**Date:** 6 يونيو 2026

---

**تحتاج مساعدة؟ اقرأ DEPLOYMENT_CHECKLIST.md**

**اجعل الامتثال المالي سهلاً! 🚀**
