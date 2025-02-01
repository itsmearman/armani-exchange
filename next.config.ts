import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';

// پیکربندی next-intl
const withNextIntl = createNextIntlPlugin();

// پیکربندی next-pwa
const nextPWAConfig = withPWA({
  dest: 'public', // مسیر ذخیره فایل‌های PWA
  disable: process.env.NODE_ENV === 'development', // غیرفعال کردن در محیط توسعه
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // سایر تنظیمات Next.js
};

// ترکیب پلاگین‌ها
export default withNextIntl(nextPWAConfig);