import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { ComplexList } from "@/components/catalog/ComplexList";
import { complexes } from "@/content/complexes";
import { Consultation } from "@/components/home/Consultation";
import { living } from "@/content/living";

export const metadata: Metadata = living.meta;

/* «Квартиры для собственного проживания»: список апартаментов */
export default function LivingPage() {
  return (
    <CatalogPage
      intro={living.intro}
      introVariant="catalog"
      floating
      list={
        <ComplexList
          complexes={complexes}
          columns={living.columns}
          cards={living.cards}
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
