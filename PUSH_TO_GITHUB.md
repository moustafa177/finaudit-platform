# 📤 دليل رفع المشروع إلى GitHub

هذا الدليل يشرح خطوات دفع مشروع **الامتثال المالي** إلى GitHub تحضيراً للرفع على Render.

---

## الخطوة 1️⃣: إعداد Git locally

### 1.1 - تحقق من حالة المشروع

```bash
# اذهب إلى جذر المشروع
cd /path/to/finaudit-platform

# تحقق من حالة Git
git status
```

إذا رأيت `fatal: not a git repository`، اكتب:

```bash
git init
```

### 1.2 - إضافة gitignore صحيح

```bash
# تأكد من وجود ملف .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
dist/
.next/
out/

# Environment
.env
.env.local
.env.*.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*.iml

# OS
.DS_Store
Thumbs.db

# Build
.turbo/
*.tsbuildinfo

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Optional npm cache
.npm/

# Optional REPL history
.node_repl_history

# Misc
.cache/
.coverage/
EOF
```

---

## الخطوة 2️⃣: إعداد GitHub

### 2.1 - إنشاء مستودع جديد

1. اذهب إلى [github.com](https://github.com)
2. اضغط **+** الزاوية العلوية اليمين → **New repository**
3. ملء البيانات:
   - **Repository name:** finaudit-platform
   - **Description:** Financial Compliance & Audit Platform
   - **Visibility:** Public (أم Private حسب الرغبة)
   - **Initialize with:** لا تختر شيء (سيتم دفع الكود الموجود)
4. اضغط **Create repository**

### 2.2 - نسخ رابط الـ HTTPS

في صفحة المستودع الجديد، سترى زر أخضر "Code":
1. اضغط على **Code**
2. اختر **HTTPS**
3. انسخ الرابط (شبه هذا):
```
https://github.com/YOUR_USERNAME/finaudit-platform.git
```

---

## الخطوة 3️⃣: الدفع الأول (Initial Commit)

### 3.1 - إضافة جميع الملفات

```bash
cd C:\Users\huawei\OneDrive\المستندات\Desktop\project.my\finaudit-platform

# أضف جميع الملفات
git add .

# تحقق مما سيتم دفعه
git status

# يجب أن ترى جميع الملفات مع `new file:` أمامها
```

### 3.2 - إنشاء Commit الأول

```bash
git commit -m "Initial commit: FinAudit Platform v1.0.0

- Core Architecture: Auth, Multi-tenant, Database
- Invoice Management: CRUD, ZATCA Validation
- AI Features: RPA, Data Cleansing, Forecasting, Fraud Detection
- Dashboard: KPIs, Charts, Reports
- Financial Regulations Tracker
- Risk Management Matrix
- System Health Center
- Full Arabic RTL Support
- Ready for Render Deployment"
```

### 3.3 - ربط المستودع البعيد

```bash
# أضف origin (استبدل YOUR_USERNAME بـ GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/finaudit-platform.git

# تحقق من الربط
git remote -v

# يجب أن ترى:
# origin  https://github.com/YOUR_USERNAME/finaudit-platform.git (fetch)
# origin  https://github.com/YOUR_USERNAME/finaudit-platform.git (push)
```

### 3.4 - الدفع إلى GitHub

```bash
# أنسب branch main
git branch -M main

# ادفع الـ main branch
git push -u origin main

# إذا طُلب منك كلمة المرور:
# - استخدم Personal Access Token (PAT) بدلاً من كلمة المرور
# - أنشِ token جديد على: github.com/settings/tokens
```

---

## الخطوة 4️⃣: التحقق من GitHub

بعد اكتمال الدفع:

```bash
# يجب أن تكون النتيجة:
# Total X commits (first time)
# ...
# To https://github.com/YOUR_USERNAME/finaudit-platform.git
#  * [new branch]      main -> main
```

### التحقق على الويب:

1. اذهب إلى `https://github.com/YOUR_USERNAME/finaudit-platform`
2. يجب أن ترى جميع الملفات والمجلدات:
   - `apps/` → api, web
   - `packages/` → shared-types, zatca-validator
   - `render.yaml` ✅
   - `RENDER_DEPLOYMENT.md` ✅
   - `QUICK_START.md` ✅
   - `README.md` ✅
   - `.env.example` ✅

---

## الخطوة 5️⃣: إنشاء GitHub Personal Access Token (اختياري لكن موصى به)

للرفع المستقبلي دون كلمة المرور:

1. اذهب إلى [github.com/settings/tokens](https://github.com/settings/tokens)
2. اضغط **Generate new token** → **Generate new token (classic)**
3. ملء البيانات:
   - **Token name:** finaudit-deployment
   - **Expiration:** 90 days (أم أكثر)
   - **Scopes:** اختر `repo` (full control)
4. اضغط **Generate token**
5. **انسخ الـ token** (لن تستطيع رؤيته مرة أخرى!)
6. استخدمه عند الدفع:
```bash
git push -u origin main
# Username: YOUR_USERNAME
# Password: [paste your token here]
```

---

## الخطوة 6️⃣: التحديثات المستقبلية

بعد كل تعديل على المشروع:

```bash
# رؤية التعديلات
git status

# إضافة التعديلات
git add .

# إنشاء commit
git commit -m "Update: [description of changes]"

# الدفع إلى GitHub
git push origin main
```

---

## أوامر Git المفيدة

### عرض السجل

```bash
# آخر 5 commits
git log --oneline -5

# سجل كامل مع التفاصيل
git log --oneline --all --graph
```

### التراجع عن التعديلات

```bash
# إذا أضفت ملف بالخطأ:
git reset HEAD filename

# إذا أضفت تعديل بالخطأ:
git checkout -- filename

# التراجع عن آخر commit (قبل الدفع):
git reset --soft HEAD~1
```

### Branches

```bash
# عرض جميع الـ branches
git branch -a

# إنشاء branch جديد
git checkout -b feature/new-feature

# دفع الـ branch الجديد
git push -u origin feature/new-feature
```

---

## استكشاف الأخطاء

### خطأ: "fatal: 'origin' does not appear to be a 'git' repository"

```bash
# الحل:
git remote add origin https://github.com/YOUR_USERNAME/finaudit-platform.git
git branch -M main
git push -u origin main
```

### خطأ: "Permission denied (publickey)"

```bash
# استخدم HTTPS بدلاً من SSH:
git remote set-url origin https://github.com/YOUR_USERNAME/finaudit-platform.git
```

### خطأ: "Your branch is ahead of 'origin/main' by X commits"

```bash
# هذا يعني أن لديك commits محلية لم يتم دفعها:
git push origin main
```

---

## التحقق من الاتصال

بعد الدفع، تحقق من أن Render يمكنه رؤية المشروع:

1. اذهب إلى [render.com](https://render.com)
2. Dashboard → **New +** → **Web Service**
3. اختر **Build and deploy from a Git repository**
4. يجب أن ترى `finaudit-platform` في القائمة

---

## Quick Reference

```bash
# اكتمال العملية بـ أوامر سريعة:
cd /path/to/finaudit-platform
git init
git add .
git commit -m "Initial commit: FinAudit Platform v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/finaudit-platform.git
git branch -M main
git push -u origin main

# تحقق من النجاح:
git log --oneline -1
git remote -v
```

---

## التالي

بعد الدفع إلى GitHub بنجاح:

1. ✅ اتبع دليل Render في `RENDER_DEPLOYMENT.md`
2. ✅ أنشئ الخدمات على Render Dashboard
3. ✅ ربط GitHub repo مع Render
4. ✅ ضبط متغيرات البيئة

---

## الدعم

- [GitHub Docs](https://docs.github.com)
- [GitHub Issues](https://github.com/YOUR_USERNAME/finaudit-platform/issues)
- [Render + GitHub Integration](https://render.com/docs/github)

---

**آخر تحديث:** 6 يونيو 2026  
**Ready for Deployment:** ✅

**هل انتهيت من الدفع؟ اتجه الآن إلى `RENDER_DEPLOYMENT.md`! 🚀**
