import type { Metadata } from "next";
import { CardList } from "@/components/catalog/CardList";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { StatusTabs } from "@/components/catalog/StatusTabs";
import { Consultation } from "@/components/home/Consultation";
import { newBuilds } from "@/content/newbuilds";

export const metadata: Metadata = newBuilds.meta;

/* «Новостройки в Сербии»: список апартаментов с вкладками «Все», «Строится», «Готово» */
export default function NewBuildsPage() {
  return (
    <CatalogPage
      intro={newBuilds.intro}
      introVariant="dark"
      list={
        <StatusTabs
          label={newBuilds.tabsLabel}
          tabs={newBuilds.tabs.map((tab, index) => ({
            key: tab.key,
            label: tab.label,
            content: (
              <CardList
                cards={tab.cards}
                columns={newBuilds.columns}
                eagerFirst={index === 0}
              />
            ),
          }))}
        />
      }
      floating
    >
      <Consultation
        title={newBuilds.consultation.title}
        mobileImage={newBuilds.consultation.image}
        mobileSize="large"
        desktopImage={newBuilds.consultation.image}
        className="pt-[80px] pb-[64px] lg:pt-[100px] lg:pb-[83px]"
      />
    </CatalogPage>
  );
}
