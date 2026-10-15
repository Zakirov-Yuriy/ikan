import type { ReactNode } from "react";
import { PageIntro } from "@/components/object/PageIntro";
import type { Crumb } from "@/components/site/Breadcrumbs";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { site } from "@/content/site";

type Props = {
  intro: { crumbs: Crumb[]; title: string; lead: string };
  /* Вид верха страницы: заголовок в две строки, в одну или на тёмном фоне */
  introVariant: "catalog" | "catalogShort" | "dark";
  /* Сам список: по жилым комплексам (ComplexList) или по стадии (StatusTabs) */
  list: ReactNode;
  /* Две закреплённые кнопки справа внизу на компьютере. С 14.10 они на всех страницах */
  floating?: boolean;
  /* Блок «Персональный подбор» со своими настройками для этой страницы */
  children: ReactNode;
};

/*
 * Страница со списком апартаментов. По ней собраны «Квартиры для
 * собственного проживания», «Квартиры для сдачи в аренду» и «Новостройки
 * в Сербии»: макеты у них похожие, отличаются верх, вид списка и тексты.
 */
export function CatalogPage({
  intro,
  introVariant,
  list,
  floating = false,
  children,
}: Props) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper">
        <PageIntro {...intro} variant={introVariant} />
        {/* В макете для телефона поля этих страниц на 2 px шире, чем у остальных */}
        <div className="shell px-[2px] lg:px-0">{list}</div>
        {children}
      </main>
      <Footer />
      {floating && (
        <FloatingActions callbackHref={site.callbackHref} variant="list" />
      )}
    </>
  );
}
