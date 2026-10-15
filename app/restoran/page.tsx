import type { Metadata } from "next";
import { Consultation } from "@/components/home/Consultation";
import { About } from "@/components/object/About";
import { Gallery } from "@/components/object/Gallery";
import { InfoTable } from "@/components/object/InfoTable";
import { PageIntro } from "@/components/object/PageIntro";
import { SummaryCard } from "@/components/object/SummaryCard";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { site } from "@/content/site";
import { getRestaurant, getSettings } from "@/lib/api";

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const restaurant = await getRestaurant();
  return restaurant ? restaurant.meta : {};
}

/* «Ресторан»: содержание страницы из бэкенда при каждом запросе */
export default async function RestaurantPage() {
  const [restaurant, { phone }] = await Promise.all([
    getRestaurant(),
    getSettings(),
  ]);
  if (!restaurant) {
    throw new Error(
      "В бэкенде нет записи ресторана. Выполните: php artisan db:seed",
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-paper">
        <PageIntro {...restaurant.intro} />
        {/*
        Фотографии и карточка. На компьютере это две колонки, 681 и 320 px
        с промежутком 23 px, на узком экране они сжимаются в той же пропорции.
        На телефоне карточка идёт сразу под фотографией, без промежутка.
      */}
        <div className="shell grid pt-[14px] lg:grid-cols-[minmax(0,681fr)_minmax(0,320fr)] lg:gap-x-[23px] lg:pt-[28px]">
          <Gallery {...restaurant.gallery} />
          <SummaryCard
            summary={restaurant.summary}
            requestHref={site.callbackHref}
            phoneHref={phone.href}
          />
        </div>
        <InfoTable {...restaurant.info} requestHref={site.callbackHref} />
        <About about={restaurant.about} requestHref={site.callbackHref} />
        {/* В макете этот блок есть только на телефоне */}
        <Consultation
          title={restaurant.consultation.title}
          mobileImage={restaurant.consultation.mobileImage}
          className="pt-[22px] pb-[54px] lg:hidden"
        />
      </main>
      <Footer />
      {/* Закреплённые кнопки справа на компьютере: с 14.10 на всех страницах */}
      <FloatingActions callbackHref={site.callbackHref} variant="list" />
    </>
  );
}
