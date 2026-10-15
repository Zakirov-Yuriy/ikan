import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { ComplexList } from "@/components/catalog/ComplexList";
import { Consultation } from "@/components/home/Consultation";
import { living } from "@/content/living";
import { getApartmentCards, getComplexes } from "@/lib/api";

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export const metadata: Metadata = living.meta;

/* «Квартиры для собственного проживания»: список из бэкенда при каждом запросе */
export default async function LivingPage() {
  const [complexes, cards] = await Promise.all([
    getComplexes(),
    getApartmentCards("living"),
  ]);

  return (
    <CatalogPage
      intro={living.intro}
      introVariant="catalog"
      floating
      list={
        <ComplexList
          complexes={complexes}
          columns={living.columns}
          cards={cards}
        />
      }
    >
      <Consultation
        titleMobile={living.consultation.titleMobile}
        mobileImage={living.consultation.mobileImage}
        mobileSize="large"
        className="pt-[80px] pb-[30px] lg:pt-[100px] lg:pb-[50px]"
      />
    </CatalogPage>
  );
}
