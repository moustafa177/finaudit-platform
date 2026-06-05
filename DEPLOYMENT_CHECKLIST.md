# ✅ قائمة التحقق من الرفع — الامتثال المالي

## قبل الرفع على Render

### 1️⃣ تحضير المستودع (Local)

- [ ] تأكد من أن جميع التغييرات committed
```bash
git status  # يجب أن تكون النتيجة "nothing to commit"
```

- [ ] تحديث .gitignore (إذا لم تكن موجودة):
```bash
# تأكد من أن node_modules و .env في .gitignore
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Update gitignore"
```

- [ ] التحقق من ملف .env.example صحيح:
```bash
# تأكد من وجود جميع المتغيرات المطلوبة
cat .env.example
```

### 2️⃣ الاختبار المحلي (Optional ولكن موصى به)

```bash
# Terminal 1 — API
cd apps/api
npm run dev
# يجب أن يكون على http://localhost:3001

# Terminal 2 — Frontend
cd apps/web
npm run dev
# يجب أن يكون على http://localhost:3000

# اختبر:
# - /login و /register
# - /overview
# - /health endpoint
```

- [ ] Frontend يحمل بدون أخطاء
- [ ] API يستجيب على /health
- [ ] Authentication يعمل

---

## خطوات الرفع على Render

### 3️⃣ إعداد GitHub

- [ ] أنشئ مستودع جديد على GitHub:
```bash
# أو استخدم مستودع موجود
git remote add origin https://github.com/YOUR_USERNAME/finaudit-platform.git
git push -u origin main
```

- [ ] تأكد من أن `render.yaml` و `RENDER_DEPLOYMENT.md` في جذر المشروع:
```bash
ls -la render.yaml
ls -la RENDER_DEPLOYMENT.md
```

### 4️⃣ حساب Render

- [ ] اذهب إلى [render.com](https://render.com) وسجل حساباً جديداً
- [ ] ربط حساب GitHub:
  1. Dashboard → Account → GitHub
  2. اضغط "Connect GitHub"
  3. أعط الإذن للمشروع

### 5️⃣ إنشاء قاعدة البيانات

- [ ] في Render Dashboard:
  1. اضغط **New +** → **Database**
  2. اختر **PostgreSQL**
  3. ملء البيانات:
     - **Name:** finaudit-db
     - **Database:** finaudit_db
     - **User:** finaudit_user
     - **Region:** Frankfurt (eu-central-1)
  4. اضغط **Create**

- [ ] بعد الإنشاء:
  - [ ] انسخ **Internal Database URL** (للـ API)
  - [ ] الرابط سيكون شبه هذا: `postgresql://finaudit_user:PASSWORD@dpg-xxxxx.render.com:5432/finaudit_db`

### 6️⃣ إنشاء خدمة الـ API

- [ ] اضغط **New +** → **Web Service**
- [ ] اختر GitHub repo: `finaudit-platform`
- [ ] ملء البيانات:
  - **Name:** finaudit-api
  - **Environment:** Node
  - **Region:** Frankfurt
  - **Branch:** main
  - **Build Command:** `cd apps/api && npm install --legacy-peer-deps && npm run build`
  - **Start Command:** `cd apps/api && node -r tsconfig-paths/register dist/src/main`
  - **Auto-Deploy:** ON

- [ ] **Environment Variables** — أضف:

| Key | Value | Source |
|-----|-------|--------|
| NODE_ENV | production | Manual |
| API_PORT | 3001 | Manual |
| API_PREFIX | api/v1 | Manual |
| DATABASE_URL | [من الـ DB] | Paste from Database URL |
| JWT_SECRET | [قيمة قوية] | Generate random (32+ chars) |
| JWT_REFRESH_SECRET | [قيمة قوية] | Generate random (32+ chars) |
| JWT_EXPIRES_IN | 15m | Manual |
| JWT_REFRESH_EXPIRES_IN | 7d | Manual |
| ZATCA_ENV | sandbox | Manual |
| ANTHROPIC_API_KEY | [مفتاح Claude] | From console.anthropic.com |

**Generator للـ JWT Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] اضغط **Create Web Service**
- [ ] انتظر البناء (5-10 دقائق)
- [ ] انسخ رابط الـ API: `https://finaudit-api.onrender.com`

### 7️⃣ اختبار الـ API

```bash
# بعد اكتمال البناء
curl https://finaudit-api.onrender.com/api/v1/health

# يجب أن ترى:
# {"status":"ok","api":"running","database":"connected",...}
```

- [ ] API يستجيب على endpoint /health

### 8️⃣ إنشاء خدمة الـ Frontend

- [ ] اضغط **New +** → **Web Service**
- [ ] نفس repo
- [ ] ملء البيانات:
  - **Name:** finaudit-web
  - **Environment:** Node
  - **Region:** Frankfurt
  - **Branch:** main
  - **Build Command:** `cd apps/web && npm install --legacy-peer-deps && npm run build`
  - **Start Command:** `cd apps/web && npm start`
  - **Auto-Deploy:** ON

- [ ] **Environment Variables:**

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| NEXT_PUBLIC_API_URL | https://finaudit-api.onrender.com/api/v1 |
| NEXT_PUBLIC_APP_URL | https://finaudit-web.onrender.com |

- [ ] اضغط **Create Web Service**
- [ ] انتظر البناء (5-10 دقائق)

### 9️⃣ اختبار التطبيق الكامل

- [ ] افتح `https://finaudit-web.onrender.com`
- [ ] اختبر الصفحات:
  - [ ] الصفحة الرئيسية تحمل
  - [ ] صفحة Register (يجب أن تتصل بـ API)
  - [ ] صفحة Login بنفس الطريقة
  - [ ] لا توجد أخطاء CORS في Console

### 🔟 تفعيل Auto-Deploy

- [ ] لكل service في Render Dashboard:
  - Check: **Auto-Deploy** is ON
  - هذا يعني أنه عند `git push` إلى main، سيتم الرفع تلقائياً

---

## بعد الرفع الناجح

### 11️⃣ المراقبة والصيانة

- [ ] **Logs Monitoring:**
  - Render Dashboard → Services → [Service] → Logs
  - تتبع أي أخطاء

- [ ] **Performance:**
  - Render Dashboard → Metrics
  - تتبع CPU، Memory، Request counts

- [ ] **Uptime:**
  - Render → Health Checks
  - تأكد من أن الخدمات تستجيب بانتظام

### 12️⃣ النسخ الاحتياطية

- [ ] إنشاء نسخة احتياطية من قاعدة البيانات:
  - Render Dashboard → Database → Backups
  - فعّل Automated Backups

### 13️⃣ التحديثات المستقبلية

```bash
# عند عمل تحديثات:
git add .
git commit -m "Update: [description]"
git push origin main

# Render سيقوم بالرفع تلقائياً خلال دقائق
```

---

## الأسعار والفواتير

**شهري:**
- API (Starter): $7
- Frontend (Starter): $7
- Database (PostgreSQL Starter): $15
- **الإجمالي:** ~$29/شهر

**Credit:**
- Render توفر $10 monthly free credit للحسابات الجديدة
- Cost الفعلي: ~$19/شهر الأول

---

## استكشاف الأخطاء

### Build Failed

```bash
# تحقق من:
1. جميع package.json موجودة في apps/api و apps/web
2. npm install يعمل محلياً بدون أخطاء
3. Build commands صحيحة:
   - API: cd apps/api && npm install --legacy-peer-deps && npm run build
   - Web: cd apps/web && npm install --legacy-peer-deps && npm run build
```

### Database Connection Error

```bash
# تحقق من:
1. DATABASE_URL صحيحة (انسخها من Render Database details)
2. قاعدة البيانات في حالة "available" (انظر Render Dashboard)
3. نوع قاعدة البيانات: PostgreSQL 16 (صحيح)
```

### Frontend لا يتصل بـ API

```bash
# تحقق من:
1. NEXT_PUBLIC_API_URL = https://finaudit-api.onrender.com/api/v1
2. API يعمل (اختبر curl على /health)
3. افتح Browser Console وشوف CORS errors
4. إذا كان هناك CORS error، تحقق من API CORS configuration
```

---

## قائمة الملفات المطلوبة

- [x] `render.yaml` — Render deployment configuration
- [x] `RENDER_DEPLOYMENT.md` — Full deployment guide
- [x] `QUICK_START.md` — Quick start guide
- [x] `.env.example` — Environment variables template
- [x] `README.md` — Project overview
- [x] `start.ps1` — Local development script
- [x] `DEPLOYMENT_CHECKLIST.md` — This file

---

## روابط مهمة

| الموارد | الرابط |
|--------|-------|
| **Render Dashboard** | https://dashboard.render.com |
| **Render Docs** | https://render.com/docs |
| **Anthropic Console** | https://console.anthropic.com |
| **GitHub** | https://github.com |
| **PostgreSQL Docs** | https://www.postgresql.org/docs/16/ |

---

## الخطوة التالية

```
1. اتبع الخطوات من 1-10 أعلاه
2. تفقد الروابط على Render لتأكد من التشغيل
3. عود إلى QUICK_START.md لاختبار المنصة محلياً
4. اقرأ README.md للتفاصيل الكاملة عن المشروع
```

---

**آخر تحديث:** 6 يونيو 2026  
**Status:** جاهز للرفع ✅

**اجعل الامتثال المالي سهلاً! 🚀**
