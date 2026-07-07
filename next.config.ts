import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Optimización de imágenes ───
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },

  // ─── Headers de seguridad ───
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // ─── Compresión ───
  compress: true,

  // ─── Fuente de pago Bold (para redirecciones) ───
  async redirects() {
    return [];
  },
};

export default nextConfig;
