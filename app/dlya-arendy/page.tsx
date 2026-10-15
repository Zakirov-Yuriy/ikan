import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { ComplexList } from "@/components/catalog/ComplexList";
import { Consultation } from "@/components/home/Consultation";
import { renting } from "@/content/renting";
import { getApartmentCards, getComplexes } from "@/lib/api";

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export const metadata: Metadata = renting.meta;

/* «Квартиры для сдачи в аренду»: список из бэкенда при каждом запросе */
export default async function RentingPage() {
  const [complexes, cards] = await Promise.all([
    getComplexes(),
    getApartmentCards("renting"),
  ]);

  return (
    <CatalogPage
      intro={renting.intro}
      introVariant="catalogShort"
      list={
        <ComplexList
          complexes={complexes}
          columns={renting.columns}
          cards={cards}
          className="pt-[27.5px] lg:pt-[40.4px]"
        />
      }
      floating
    >
      <Consultation
        title={renting.consultation.title}
        titleMobile={renting.consultation.titleMobile}
        mobileImage={renting.consultation.image}
        mobileSize="large"
        desktopImage={renting.consultation.image}
        desktopButton="wide"
        className="pt-[80px] pb-[70px] lg:pt-[100px] lg:pb-[105px]"
      />
    </CatalogPage>
  );
}
