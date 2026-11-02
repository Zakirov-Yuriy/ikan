import type { MetadataRoute } from "next";
import { legalDocumentPath, legalDocuments } from "@/content/documents";
import { paths } from "@/content/paths";
import { restaurant } from "@/content/restaurant";
import { getApartmentCards, type Catalog } from "@/lib/api";
import { SITE_URL } from "@/lib/site-url";

/*
 * Карта сайта /sitemap.xml: постоянные страницы, документы и все апартаменты
 * из админки (три каталога, повторы убираются). Собирается при каждом
 * запросе, чтобы новый апартамент попадал в карту сразу. Если бэкенд не
 * отвечает, карта отдаётся без апартаментов, а не с ошибкой.
 */
export const dynamic = "force-dynamic";

const catalogs: Catalog[] = ["living", "renting", "newbuilds"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = [
    "/",
    paths.living,
    paths.renting,
    paths.newBuilds,
    paths.investments,
    restaurant.path,
    paths.restaurantPhotos,
    ...legalDocuments.map((document) => legalDocumentPath(document.slug)),
  ];

  const apartments = new Set<string>();
  await Promise.all(
    catalogs.map(async (catalog) => {
      try {
        for (const card of await getApartmentCards(catalog)) {
          apartments.add(card.href);
        }
      } catch {
        /* Бэкенд не отвечает: карта без этого каталога */
      }
    }),
  );

  const pages = [
    ...fixed,
    ...[...apartments].flatMap((href) => [href, `${href}/foto`]),
  ];

  return pages.map((path) => ({ url: `${SITE_URL}${path}` }));
}
