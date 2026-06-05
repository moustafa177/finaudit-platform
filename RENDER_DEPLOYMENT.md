# 🚀 دليل الرفع على Render

## المتطلبات الأساسية

- حساب [Render.com](https://render.com)
- مستودع GitHub للمشروع
- متغيرات البيئة الحساسة

---

## خطوات الرفع

### 1. تحضير المستودع Git

```bash
# تأكد من أن المشروع في Git
git init
git add .
git commit -m "Initial commit: finaudit platform"

# ادفع إلى GitHub
git remote add origin https://github.com/your-username/finaudit-platform.git
git push -u origin main
```

### 2. ربط Render بـ GitHub

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. اضغط **New +** → **Web Service**
3. اختر **Build and deploy from a Git repository**
4. ربط حساب GitHub وأعط الإذن للمشروع

---

## الخدمات المراد إنشاؤها

### Service 1: API (NestJS)

**في Render Dashboard:**

```
Name:                finaudit-api
Environment:         Node
Region:              Frankfurt (eu-central-1)  [أقرب لأوروبا/الشرق الأوسط]
Runtime:             Node 20+
Build Command:       cd apps/api && npm install --legacy-peer-deps && npm run build
Start Command:       cd apps/api && node -r tsconfig-paths/register dist/src/main
Branch:              main
Auto-Deploy:         On
```

**Environment Variables:**

```
NODE_ENV              = production
API_PORT              = 3001
DATABASE_URL          = postgresql://user:pass@host:5432/finaudit_db  [من DB]
JWT_SECRET            = [تعيين قيمة قوية جديدة]
JWT_REFRESH_SECRET    = [تعيين قيمة قوية جديدة]
ZATCA_ENV             = sandbox  [أو production بعد اختبار]
ANTHROPIC_API_KEY     = [مفتاح Claude API من console.anthropic.com]
```

---

### Service 2: Frontend (Next.js)

**في Render Dashboard:**

```
Name:                finaudit-web
Environment:         Node
Region:              Frankfurt
Runtime:             Node 20+
Build Command:       cd apps/web && npm install --legacy-peer-deps && npm run build
Start Command:       cd apps/web && npm start
Branch:              main
Auto-Deploy:         On
```

**Environment Variables:**

```
NODE_ENV                    = production
NEXT_PUBLIC_API_URL         = https://finaudit-api.onrender.com/api/v1
NEXT_PUBLIC_APP_URL         = https://finaudit-web.onrender.com
```

---

### Service 3: PostgreSQL Database

**في Render Dashboard:**

```
Database:            PostgreSQL 16
Name:                finaudit-db
Region:              Frankfurt
PostgreSQL Version:  16
Database:            finaudit_db
User:                finaudit_user
```

**سيُعطيك Render رابط الاتصال:**
```
postgresql://finaudit_user:PASSWORD@dpg-xxxxx.xx.postgres.render.com:5432/finaudit_db
```

---

## الخطوات التفصيلية

### 1️⃣ إنشاء قاعدة البيانات

1. في Render Dashboard → **Databases** → **New Database**
2. اختر **PostgreSQL 16**
3. ملء البيانات:
   - **Name:** finaudit-db
   - **Database:** finaudit_db
   - **User:** finaudit_user
4. اضغط **Create**
5. انسخ رابط الاتصال من تفاصيل قاعدة البيانات

---

### 2️⃣ إنشاء خدمة الـ API

1. **New +** → **Web Service**
2. أختر repository من GitHub
3. ملء البيانات:
   - **Name:** finaudit-api
   - **Build Command:** `cd apps/api && npm install --legacy-peer-deps && npm run build`
   - **Start Command:** `cd apps/api && node -r tsconfig-paths/register dist/src/main`
4. **Advanced** → **Add Environment Variable**
5. أضف المتغيرات أعلاه (خاصة `DATABASE_URL` من قاعدة البيانات)
6. اضغط **Create Web Service**
7. انتظر البناء (5-10 دقائق)
8. **انسخ رابط الـ API:** `https://finaudit-api.onrender.com`

---

### 3️⃣ إنشاء خدمة الـ Frontend

1. **New +** → **Web Service**
2. نفس الخطوات، لكن:
   - **Name:** finaudit-web
   - **Build Command:** `cd apps/web && npm install --legacy-peer-deps && npm run build`
   - **Start Command:** `cd apps/web && npm start`
3. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL=https://finaudit-api.onrender.com/api/v1`
   - `NEXT_PUBLIC_APP_URL=https://finaudit-web.onrender.com`
4. اضغط **Create Web Service**

---

## ✅ التحقق بعد الرفع

```bash
# اختبر الـ API
curl https://finaudit-api.onrender.com/api/v1/health

# اختبر المتصفح
https://finaudit-web.onrender.com
```

---

## 🔒 نصائح أمان

1. **غير متغيرات البيئة الحساسة:**
   ```
   JWT_SECRET → قيمة عشوائية قوية
   JWT_REFRESH_SECRET → قيمة عشوائية قوية
   ```

2. **استخدم متغيرات Render المشفرة:**
   - Render تشفّر كل متغيرات البيئة تلقائياً
   - لا تضع أسرار في `render.yaml`

3. **مراقبة الـ Logs:**
   - Render Dashboard → Logs
   - تتبع أخطاء الرفع والتشغيل

4. **تفعيل ZATCA Production (اختياري):**
   - بعد اختبار شامل على sandbox
   - غيّر `ZATCA_ENV` من `sandbox` إلى `production`

---

## 🐛 استكشاف الأخطاء

### خطأ: Build Failed
```
حل:
- تحقق من logs في Render Dashboard
- تأكد من وجود package.json في apps/api و apps/web
- تأكد من صحة Build Command
```

### خطأ: Database Connection Error
```
حل:
- تحقق من DATABASE_URL صحيح
- تأكد من حالة قاعدة البيانات (يجب أن تكون "available")
- انتظر دقيقة واحدة بعد إنشاء DB
```

### الـ Frontend لا يتصل بـ API
```
حل:
- تحقق من NEXT_PUBLIC_API_URL
- تأكد من أن الـ API يعمل (curl الرابط)
- افتح Console في المتصفح لرؤية أخطاء CORS
```

---

## 📊 التكاليف (Render Pricing)

| الخدمة | Plan | المبلغ تقريباً |
|--------|------|-------------|
| API (Node Web) | Starter ($7) | $7/شهر |
| Frontend (Node Web) | Starter ($7) | $7/شهر |
| Database (PostgreSQL) | Starter ($15) | $15/شهر |
| **الإجمالي** | | **$29/شهر** |

> Render توفر **$10 monthly credit** للحسابات الجديدة

---

## 🚀 التطوير المستقبلي

بعد الرفع الأولي:
- فعّل Auto-Deploy من GitHub
- أعد مراقبة الـ Uptime والأداء
- أضف Alerts للأخطاء
- وسّع نطاق المزودات عند الحاجة

---

## الدعم

- [Render Documentation](https://render.com/docs)
- [Render Support](https://support.render.com)
