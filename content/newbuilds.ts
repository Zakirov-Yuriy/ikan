/*
 * Тексты страницы «Новостройки в Сербии» и состав её вкладок.
 * Сейчас всё записано здесь, позже эти значения будут приходить из админки.
 *
 * Списки вкладок записаны так, как нарисованы в макетах, а там они
 * противоречат друг другу: A4 и A6 стоят и в «Строится», и в «Готово»,
 * A10 на компьютере есть только во «Все», а на телефоне во всех трёх.
 * Когда у апартаментов появится настоящий статус, вкладки должны
 * отбирать карточки по нему, а эти списки надо убрать.
 */

import type { ApartmentCardData } from "@/components/catalog/ApartmentCard";
import { apartmentCards, cardColumns } from "./apartment-cards";
import { paths } from "./paths";

const [a4, a6, a10] = apartmentCards;

/* На компьютере у готового апартамента голубая метка «Готово к заселению» */
const ready = (card: ApartmentCardData): ApartmentCardData => ({
  ...card,
  status: { ...card.status, desktop: "Готово к заселению", tone: "ready" },
});

/* Карточка, которая в этой вкладке есть только в макете для телефона */
const onlyMobile = (card: ApartmentCardData): ApartmentCardData => ({
  ...card,
  onlyMobile: true,
});

export const newBuilds = {
  /* Адрес страницы на сайте */
  path: paths.newBuilds,
  meta: {
    title: "Новостройки в Сербии: ИКАН",
    description:
      "Квартиры на стадии строительства и готовые объекты от надёжных девелоперов.",
  },
  intro: {
    crumbs: [
      { label: "Главная", href: "/" },
      { label: "Новостройки", href: "" },
    ],
    title: "Новостройки в Сербии",
    lead: "Квартиры на стадии строительства и готовые объекты от надёжных девелоперов.",
  },
  columns: cardColumns,
  /* Название набора вкладок для программ чтения с экрана */
  tabsLabel: "Стадия готовности",
  tabs: [
    { key: "all", label: "Все", cards: [a4, a6, a10] },
    { key: "building", label: "Строится", cards: [a4, a6, onlyMobile(a10)] },
    {
      key: "ready",
      label: "Готово",
      cards: [ready(a4), ready(a6), onlyMobile(a10)],
    },
  ],
  /* Блок «Персональный подбор»: фотография реки та же, что на странице апартамента */
  consultation: {
    title: "Войти в проект на выгодном этапе",
    image: "/images/restaurant/consultation-mobile.jpg",
  },
};
