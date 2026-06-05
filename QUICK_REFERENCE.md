# ⚡ مرجع سريع — الامتثال المالي

## الأوامر الأساسية

### التشغيل المحلي

```bash
# Terminal 1 — API
cd apps/api
npm run dev
# http://localhost:3001/api/v1/health

# Terminal 2 — Frontend
cd apps/web
npm run dev
# http://localhost:3000
```

**أو استخدم السكريبت:**
```powershell
.\start.ps1
```

---

## Git Commands

```bash
# الدفع الأول
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/finaudit-platform.git
git push -u origin main

# التحديثات
git add .
git commit -m "Update: description"
git push origin main
```

---

## البيانات التجريبية

```
Email:     test@finaudit.sa
Password:  Test@2026
VAT:       310122519900003
CR:        1010123456
```

---

## متغيرات البيئة الضرورية

### Local (.env)
```
DATABASE_URL=postgresql://finaudit:finaudit2026@localhost:5432/finaudit_db
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=sk-ant-xxx
```

### Render
```
DATABASE_URL=[من قاعدة البيانات]
JWT_SECRET=[قيمة قوية عشوائية]
NEXT_PUBLIC_API_URL=https://finaudit-api.onrender.com/api/v1
```

---

## الروابط المهمة

| الموضوع | الرابط |
|--------|-------|
| GitHub | https://github.com |
| Render | https://render.com |
| Anthropic | https://console.anthropic.com |
| PostgreSQL | https://www.postgresql.org |

---

## أوامر مفيدة

### تنظيف المشروع
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### بناء الإنتاج
```bash
npm run build
npm start
```

### الاختبار
```bash
npm run test
npm run lint
```

### إعادة تعيين قاعدة البيانات
```bash
psql -U finaudit -d finaudit_db -f reset.sql
```

---

## حل المشاكل الشائعة

| المشكلة | الحل |
|--------|------|
| Port 3000 في الاستخدام | `lsof -i :3000 \| kill -9 <PID>` |
| DB غير متصل | `psql -U postgres` للتحقق |
| Module not found | `npm install --legacy-peer-deps` |
| CORS error | تحقق من API URL في .env |
| Build failed | شوف logs في Render Dashboard |

---

## الصفحات الرئيسية

| الرابط | الوصف |
|--------|-------|
| `/` | الصفحة الرئيسية |
| `/login` | تسجيل الدخول |
| `/register` | تسجيل جديد |
| `/overview` | لوحة التحكم |
| `/invoices` | الفواتير |
| `/compliance` | الامتثال ZATCA |
| `/regulations` | التشريعات |
| `/risk` | إدارة المخاطر |
| `/fraud` | كشف الاحتيال |
| `/health` | صحة النظام |
| `/settings` | الإعدادات |

---

## ملفات التوثيق

| الملف | الاستخدام |
|------|---------|
| START_HERE.md | نقطة البداية |
| README.md | شرح المشروع |
| QUICK_START.md | البدء المحلي |
| PUSH_TO_GITHUB.md | دفع الكود |
| RENDER_DEPLOYMENT.md | الرفع على Render |
| DEPLOYMENT_CHECKLIST.md | قائمة تحقق |
| PROJECT_STATUS.md | حالة المشروع |
| QUICK_REFERENCE.md | هذا الملف |

---

## Render Deployment Steps

```
1. ادفع إلى GitHub
2. سجل على Render.com
3. ربط GitHub
4. أنشئ Database (PostgreSQL)
5. أنشئ API Service (NestJS)
6. أنشئ Web Service (Next.js)
7. اضبط Environment Variables
8. انتظر البناء والتشغيل
```

**الوقت:** 20-30 دقيقة  
**التكلفة:** ~$29/شهر

---

## مفاتيح قوية عشوائية

```bash
# استخدم هذا الأمر لتوليد JWT Secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Docker (اختياري)

```bash
# إذا كنت تفضل Docker بدلاً من PostgreSQL محلي
docker run -d \
  --name finaudit-db \
  -e POSTGRES_PASSWORD=finaudit2026 \
  -e POSTGRES_USER=finaudit \
  -e POSTGRES_DB=finaudit_db \
  -p 5432:5432 \
  postgres:16
```

---

## مفاتيش سريعة

### هل API يعمل؟
```bash
curl http://localhost:3001/api/v1/health
```

### هل Frontend يحمل؟
```bash
open http://localhost:3000
```

### هل قاعدة البيانات جاهزة؟
```bash
psql -U finaudit -d finaudit_db -c "SELECT 1;"
```

---

## خريطة الملفات المهمة

```
finaudit-platform/
├── apps/api/src/
│   ├── auth/           ← تسجيل الدخول
│   ├── invoices/       ← الفواتير
│   ├── ai/             ← الذكاء الاصطناعي
│   └── health/         ← الحالة
├── apps/web/app/
│   ├── (auth)/         ← صفحات التسجيل
│   └── (dashboard)/    ← 15+ صفحة
├── render.yaml         ← تكوين الرفع
├── .env.example        ← متغيرات البيئة
└── docs/               ← التوثيق
```

---

## الإصدارات المطلوبة

```
Node.js: 18+
npm: 10+
PostgreSQL: 16
Git: 2.30+
```

---

## أوقات الاستجابة المتوقعة

| العملية | الوقت |
|--------|-------|
| تسجيل دخول | < 100ms |
| جلب الفواتير | < 200ms |
| حساب ZATCA | < 50ms |
| توليد تقرير | < 500ms |
| AI Analysis | 2-5 ثانية |

---

## قائمة التحقق السريعة

- [ ] Node.js 18+ مثبت
- [ ] PostgreSQL 16 يعمل
- [ ] Git repository مُعد
- [ ] npm install تم
- [ ] .env مُعد
- [ ] API يعمل على 3001
- [ ] Frontend يعمل على 3000
- [ ] GitHub repo مُعد
- [ ] Render account جاهز
- [ ] Environment variables مُضافة

---

## الدعم السريع

**خطأ شائع؟** ابحث عن:
- `DEPLOYMENT_CHECKLIST.md` — استكشاف شامل
- `RENDER_DEPLOYMENT.md` — مشاكل الرفع
- `QUICK_START.md` — مشاكل محلية

---

## الخطوة التالية

**انت الآن:**
1. ✅ فهمت المشروع
2. ✅ لديك جميع الملفات
3. ✅ مستعد للرفع

**الآن:**
👉 اقرأ `START_HERE.md` للخطوة التالية

---

**آخر تحديث:** 6 يونيو 2026  
**Version:** 1.0.0

**اجعل الامتثال المالي سهلاً! 🚀**
