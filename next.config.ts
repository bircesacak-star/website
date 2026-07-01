import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['iyzipay', '@libsql/client'],

  images: {
    // Vercel'in image optimization'ı: AVIF + WebP öncelikli
    formats: ['image/avif', 'image/webp'],
    // Dışarıdan görsel çekilirse buraya domain ekle, örn:
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'example.com' },
    // ],
  },
};

export default nextConfig;
