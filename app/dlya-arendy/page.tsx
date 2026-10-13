import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { LevelList } from "@/components/catalog/LevelList";
import { Consultation } from "@/components/home/Consultation";
import { renting } from "@/content/renting";

export const metadata: Metadata = renting.meta;

/* «Квартиры для сдачи в аренду»: список апартаментов */
export default function RentingPage() {
  return (
    <CatalogPage
      intro={renting.intro}
      introVariant="catalogShort"
      list={
        <LevelList
          levels={renting.levels}
          dimLevels
          columns={renting.columns}
          cards={renting.cards}
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
