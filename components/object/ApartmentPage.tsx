import { Consultation } from "@/components/home/Consultation";
import { About } from "@/components/object/About";
import { Gallery } from "@/components/object/Gallery";
import { InfoTable } from "@/components/object/InfoTable";
import { SummaryCard } from "@/components/object/SummaryCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import type { Apartment } from "@/content/apartments";
import { site } from "@/content/site";

type Props = {
  apartment: Apartment;
};

/*
 * Страница одного апартамента целиком. Содержание приходит снаружи, поэтому
 * страница следующего апартамента это ещё одна запись в content/apartments.ts
 * и короткий файл в app/apartamenty.
 */
export function ApartmentPage({ apartment }: Props) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper">
        <div className="shell pt-[19px] lg:pt-[27px]">
          <Breadcrumbs crumbs={apartment.crumbs} strongLast />
        </div>
        {/*
          Фотографии и карточка. На компьютере это две колонки, 681 и 320 px
          с промежутком 23 px, карточка по высоте равна фотографиям.
          На телефоне карточка идёт под фотографией.
        */}
        <div className="shell grid pt-[14px] lg:grid-cols-[minmax(0,681fr)_minmax(0,320fr)] lg:gap-x-[23px] lg:pt-[20px]">
          <Gallery {...apartment.gallery} smallHeight={185} />
          <SummaryCard
            summary={apartment.summary}
            requestHref={site.callbackHref}
            phoneHref={site.phone.href}
            variant="apartment"
          />
        </div>
        <InfoTable
          {...apartment.info}
          requestHref={site.callbackHref}
          variant="apartment"
        />
        <About
          about={apartment.about}
          requestHref={site.callbackHref}
          variant="apartment"
        />
        <Consultation
          title={apartment.consultation.title}
          mobileImage={apartment.consultation.image}
          desktopImage={apartment.consultation.image}
          className="pt-[56px] pb-[54px] lg:pt-0 lg:pb-[106px]"
        />
      </main>
      <Footer />
      {/* Закреплённые кнопки справа на компьютере: с 14.10 на всех страницах */}
      <FloatingActions
        phoneHref={site.phone.href}
        callbackHref={site.callbackHref}
        variant="list"
      />
    </>
  );
}
