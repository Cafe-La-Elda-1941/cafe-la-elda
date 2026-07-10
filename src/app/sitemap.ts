import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cafe-la-elda.vercel.app";

  const sections = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/#historia", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/#productos", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/#combos", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/#corporativos", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/#origen", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/#proceso", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/#testimonios", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/#aliados", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/#contacto", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/legal/terminos", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/legal/privacidad", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/legal/envios", priority: 0.4, changeFrequency: "yearly" as const },
  ];

  const now = new Date();

  return sections.map((section) => ({
    url: `${baseUrl}${section.url}`,
    lastModified: now,
    changeFrequency: section.changeFrequency,
    priority: section.priority,
  }));
}
