import type { Metadata } from "next";
import { CardList } from "@/components/catalog/CardList";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { StatusTabs } from "@/components/catalog/StatusTabs";
import { Consultation } from "@/components/home/Consultation";
import { newBuilds } from "@/content/newbuilds";
import { getApartmentCards } from "@/lib/api";

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export const metadata: Metadata = newBuilds.meta;

/*
 * «Новостройки в Сербии»: карточки из бэкенда при каждом запросе, вкладки
 * «Все», «Строится», «Готово» отбирают их по стадии, заданной в админке.
 */
export default async function NewBuildsPage() {
  const cards = await getApartmentCards("newbuilds");
  const byTab = (key: string) =>
    key === "all" ? cards : cards.filter((card) => card.status.tone === key);

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
            content:
              byTab(tab.key).length > 0 ? (
                <CardList
                  cards={byTab(tab.key)}
                  columns={newBuilds.columns}
                  eagerFirst={index === 0}
                />
              ) : (
                <p className="rounded-[14px] border border-[#ebefef] bg-white px-[20px] py-[28px] text-center text-[14px] leading-[22px] text-muted lg:rounded-[20px] lg:border-[#dfe5e5]">
                  {newBuilds.empty}
                </p>
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
