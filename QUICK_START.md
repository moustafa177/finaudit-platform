# 🚀 البدء السريع — الامتثال المالي

## المتطلبات

- **Node.js 18+** — [تحميل](https://nodejs.org)
- **PostgreSQL 16** — [تحميل](https://www.postgresql.org/download) أو Docker
- **npm أو yarn**

---

## التثبيت المحلي (5 دقائق)

### 1️⃣ استنساخ المستودع

```bash
git clone https://github.com/your-username/finaudit-platform.git
cd finaudit-platform
```

### 2️⃣ تثبيت المكتبات

```bash
npm install --legacy-peer-deps
# أو
yarn install
```

### 3️⃣ إعداد قاعدة البيانات

#### على Windows:

```powershell
# تحقق من تثبيت PostgreSQL
psql --version

# اتصل بـ PostgreSQL (استخدم كلمة المرور الافتراضية "postgres")
psql -U postgres

# في الـ prompt، اكتب:
CREATE USER finaudit WITH PASSWORD 'finaudit2026';
CREATE DATABASE finaudit_db OWNER finaudit;
GRANT ALL PRIVILEGES ON DATABASE finaudit_db TO finaudit;
\q
```

#### على macOS:

```bash
# استخدم Homebrew
brew install postgresql

# ابدأ الخدمة
brew services start postgresql

# اتبع نفس الخطوات أعلاه
```

#### على Linux (Ubuntu/Debian):

```bash
sudo apt update && sudo apt install postgresql

# ابدأ الخدمة
sudo systemctl start postgresql

# اتبع نفس الخطوات أعلاه
```

### 4️⃣ متغيرات البيئة

```bash
# انسخ الملف النموذجي
cp .env.example .env

# عدّل القيم إذا لزم (في العادة القيم الافتراضية تعمل):
# DATABASE_URL=postgresql://finaudit:finaudit2026@localhost:5432/finaudit_db
```

### 5️⃣ تشغيل المشروع

#### في جهاز واحد (شرح الخطوات):

```bash
# في Terminal 1 — شغّل الـ API
cd apps/api
npm run dev
# سيبدأ على http://localhost:3001

# في Terminal 2 — شغّل الـ Frontend
cd apps/web
npm run dev
# سيبدأ على http://localhost:3000
```

#### أو استخدم السكريبت المُعد (Windows):

```powershell
# من جذر المشروع
.\start.ps1
```

---

## 🧪 اختبر التطبيق

### تسجيل مستخدم جديد

```
الرابط: http://localhost:3000/register

البيانات:
اسم الشركة:     اختبر شركة
الرقم الضريبي:  310122519900003
رقم السجل:      1010123456
الاسم:          محمد التجريبي
البريد:         test@finaudit.sa
كلمة المرور:    Test@2026
```

### تسجيل دخول

```
الرابط: http://localhost:3000/login

البيانات:
البريد:     test@finaudit.sa
كلمة المرور: Test@2026
```

---

## 📍 الصفحات الرئيسية

| الرابط | الوصف |
|--------|-------|
| http://localhost:3000 | الصفحة الرئيسية |
| http://localhost:3000/overview | لوحة التحكم |
| http://localhost:3000/invoices | قائمة الفواتير |
| http://localhost:3000/compliance | الامتثال ZATCA |
| http://localhost:3000/regulations | التشريعات المالية |
| http://localhost:3000/risk | إدارة المخاطر |
| http://localhost:3000/fraud | اكتشاف الاحتيال |
| http://localhost:3000/health | صحة النظام |
| http://localhost:3000/settings | الإعدادات |

---

## 🛠️ الأوامر المفيدة

### الـ API

```bash
cd apps/api

# تطوير (مع auto-reload)
npm run dev

# بناء الإنتاج
npm run build

# تشغيل الإنتاج
npm start

# الاختبار
npm run test
```

### الـ Frontend

```bash
cd apps/web

# تطوير (مع hot-reload)
npm run dev

# بناء الإنتاج
npm run build

# تشغيل الإنتاج
npm start

# فحص الأخطاء
npm run lint
```

---

## 🔧 استكشاف الأخطاء الشائعة

### خطأ: "Cannot find module 'node-postgres'"
```bash
حل: npm install --legacy-peer-deps
```

### خطأ: "Port 3000 already in use"
```bash
# على Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# على macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### خطأ: "Database connection refused"
```bash
# تحقق من أن PostgreSQL يعمل:
psql -U postgres -c "SELECT 1"

# إذا لم يعمل، ابدأ الخدمة:
# Windows: services.msc → PostgreSQL → Start
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

---

## 📚 الموارد الإضافية

- [دليل الرفع على Render](./RENDER_DEPLOYMENT.md)
- [دليل التطوير](./docs/DEVELOPMENT.md) (قريباً)
- [API Documentation](./docs/API.md) (قريباً)

---

## 💡 نصائح التطوير

1. **استخدم VS Code مع Extensions:**
   - REST Client (لاختبار API)
   - Thunder Client أو Postman (لـ API testing)

2. **مراقبة السجلات:**
   ```bash
   # نافذة منفصلة:
   docker logs finaudit-api -f
   ```

3. **إعادة تعيين قاعدة البيانات (في التطوير فقط):**
   ```bash
   cd apps/api
   npm run db:reset
   ```

4. **تفعيل Claude AI (اختياري):**
   - احصل على مفتاح API من [console.anthropic.com](https://console.anthropic.com)
   - أضفه في `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

---

## 🎯 التالي

بعد التثبيت الناجح:
- [ ] اقرأ [دليل الرفع على Render](./RENDER_DEPLOYMENT.md)
- [ ] استكشف الميزات الأساسية
- [ ] أنشئ فاتورة اختبار في `/invoices/new`
- [ ] فحص لوحة الصحة في `/health`

---

## ❓ الدعم والمساعدة

للمزيد من المعلومات:
- [GitHub Issues](https://github.com/your-username/finaudit-platform/issues)
- [Documentation](./docs)
- [Community Discussions](https://github.com/your-username/finaudit-platform/discussions)

---

**Happy coding! 🚀**
