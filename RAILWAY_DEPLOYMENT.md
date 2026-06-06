# 🚂 Railway.app Deployment Guide

## **المميزات:**
- ✅ مجاني تماماً للبدء
- ✅ $5 رصيد شهري مجاني
- ✅ بناء Docker أسرع من Render
- ✅ GitHub integration سهل
- ✅ يدعم PostgreSQL مباشرة

---

## **الخطوات:**

### **1️⃣ إنشاء حساب**
```
1. اذهب إلى: https://railway.app
2. اضغط "Start Free"
3. سجل دخول عبر GitHub
```

### **2️⃣ إنشاء Project**
```
1. اضغط "New Project"
2. اختر "Deploy from GitHub repo"
3. اختر: moustafa177/finaudit-platform
```

### **3️⃣ إضافة Database**
```
1. في Project، اضغط "Add"
2. ابحث عن "PostgreSQL"
3. اختر النسخة الأخيرة
4. سيتم إنشاؤها تلقائياً
```

### **4️⃣ إنشاء Web Service للـ API**
```
1. اضغط "Add"
2. اختر "GitHub Repo"
3. اختر الـ repo الخاص بك
4. Railway سيكتشف الـ Dockerfile تلقائياً
```

### **5️⃣ تكوين Environment Variables**
```
للـ API service:

NODE_ENV = production
DATABASE_URL = (يتم ملؤه من PostgreSQL تلقائياً)
JWT_SECRET = (سيتم توليده)
JWT_REFRESH_SECRET = (سيتم توليده)
API_PORT = 3001
API_PREFIX = api/v1
ZATCA_ENV = sandbox
```

### **6️⃣ تكوين الـ Web Service**
```
اضغط "Add" → GitHub Repo → اختر الـ repo
Railway سيكتشف next.config.js تلقائياً
```

---

## **المميزات التلقائية:**

✅ SSL/HTTPS تلقائي
✅ Domain عشوائي
✅ Auto-redeploy على كل push
✅ GitHub integration
✅ Environment variables سهلة
✅ Database backups
✅ Logs في الـ dashboard

---

## **المتوقع:**

```
⏱️ وقت البناء: ~5-10 دقائق
🎯 النتيجة: كلا الخدمتين LIVE
💾 Database: PostgreSQL 16 يعمل
```

---

## **بعد النشر:**

```
API URL: https://[PROJECT]-api.up.railway.app
Web URL: https://[PROJECT]-web.up.railway.app
Database: Managed by Railway
```

---

## **ملاحظات:**

- Railway أسرع في البناء من Render
- $5 رصيد شهري كافي لـ API + Web + DB
- يمكن ترقية لاحقاً إذا احتجت

---

## **المشاكل المحتملة:**

إذا حدثت مشكلة:
1. تحقق من GitHub logs
2. تأكد من environment variables
3. اطلب المساعدة من Railway support

---

**دعني أساعدك! اكتمل الخطوات أعلاه وأخبرني 👇**
