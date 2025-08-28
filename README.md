# Behzad HSE (Electron + Vite + React)

این پروژه شامل فرم FMEA، ماتریکس PPE، تولید SOP و Emergency Plan است و برای ساخت نصاب ویندوز با **GitHub Actions** آماده شده.

## ساخت نصب‌کننده (.exe) با GitHub
1. محتویات این پوشه را به یک مخزن جدید در GitHub آپلود کنید.
2. به تب **Actions** بروید، Workflow با نام **Build Behzad HSE Installer** را باز و **Run workflow** را اجرا کنید.
3. پس از پایان اجرا، از بخش **Artifacts** فایل ZIP را دانلود کنید. داخل آن نصاب `.exe` قرار دارد.

## اجرای محلی (اختیاری برای توسعه)
```bash
npm install
npm run dev
```
