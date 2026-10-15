import type { Metadata } from "next";
import { PhotosPage } from "@/components/object/PhotosPage";
import { restaurant, restaurantPage } from "@/content/restaurant";
import { getRestaurant } from "@/lib/api";

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const item = await getRestaurant();
  return item
    ? {
        title: `${item.summary.title}, ${restaurantPage.photosPage.title.toLocaleLowerCase("ru-RU")}: ИКАН`,
      }
    : {};
}

/* Все фотографии ресторана: /restoran/foto */
export default async function RestaurantPhotosPage() {
  const item = await getRestaurant();
  if (!item) {
    throw new Error(
      "В бэкенде нет записи ресторана. Выполните: php artisan db:seed",
    );
  }

  const own = restaurantPage.crumbs[restaurantPage.crumbs.length - 1];

  return (
    <PhotosPage
      crumbs={[
        ...restaurantPage.crumbs.slice(0, -1),
        { label: own.label, href: restaurant.path },
        { label: restaurantPage.photosPage.crumb, href: "" },
      ]}
      eyebrow={item.summary.title}
      title={item.gallery.all.label}
      back={{ label: restaurantPage.photosPage.back, href: restaurant.path }}
      openLabel={restaurantPage.photosPage.open}
      photos={item.photos}
      consultation={{
        title: item.consultation.title,
        image: item.consultation.mobileImage,
      }}
    />
  );
}
