import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { ComplexList } from "@/components/catalog/ComplexList";
import { Consultation } from "@/components/home/Consultation";
import { renting } from "@/content/renting";
import { getApartmentCards, getComplexes, getPage } from "@/lib/api";

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return (await getPage("renting")).meta;
}

/* «Квартиры для сдачи в аренду»: тексты и список из бэкенда при каждом запросе */
export default async function RentingPage() {
  const [page, complexes, cards] = await Promise.all([
    getPage("renting"),
    getComplexes(),
    getApartmentCards("renting"),
  ]);

  return (
    <CatalogPage
      intro={{ crumbs: renting.crumbs, title: page.title, lead: page.lead }}
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
        title={page.consultation.title}
        titleMobile={page.consultation.titleMobile}
        mobileImage={renting.consultation.image}
        mobileSize="large"
        desktopImage={renting.consultation.image}
        desktopButton="wide"
        className="pt-[80px] pb-[70px] lg:pt-[100px] lg:pb-[105px]"
      />
    </CatalogPage>
  );
}
