import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { ComplexList } from "@/components/catalog/ComplexList";
import { Consultation } from "@/components/home/Consultation";
import { living } from "@/content/living";
import { getApartmentCards, getComplexes, getPage } from "@/lib/api";

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return (await getPage("living")).meta;
}

/* «Квартиры для собственного проживания»: тексты и список из бэкенда при каждом запросе */
export default async function LivingPage() {
  const [page, complexes, cards] = await Promise.all([
    getPage("living"),
    getComplexes(),
    getApartmentCards("living"),
  ]);

  return (
    <CatalogPage
      intro={{ crumbs: living.crumbs, title: page.title, lead: page.lead }}
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
        title={page.consultation.title}
        titleMobile={page.consultation.titleMobile}
        mobileImage={living.consultation.mobileImage}
        mobileSize="large"
        className="pt-[80px] pb-[30px] lg:pt-[100px] lg:pb-[50px]"
      />
    </CatalogPage>
  );
}
