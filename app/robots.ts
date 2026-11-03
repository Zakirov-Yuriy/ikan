import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/*
 * robots.txt для поисковиков: сайт индексировать можно, кроме служебных
 * адресов. /admin и /admin_front это админка бэкенда на том же домене,
 * /site-api служебные адреса сайта, /api бэкенд, если его вывели наружу. Ссылка на карту сайта (app/sitemap.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/site-api/", "/api/", "/admin", "/admin_front/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
