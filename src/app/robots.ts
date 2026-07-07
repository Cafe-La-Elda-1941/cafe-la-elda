import type { MetadataRoute } from "next";

// ⚠️ Cambiar esta URL cuando tengas tu dominio de producción
const SITE_URL = "https://cafelaelda.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/pago/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
