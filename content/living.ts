/*
 * Страница «Квартиры для собственного проживания». Заголовок, подзаголовок,
 * заголовки блока подбора и поля для поисковиков с 15.10 приходят из
 * бэкенда (lib/api.ts, getPage), в админке раздел «Страницы списков».
 * Карточки апартаментов тоже из бэкенда. Здесь то, что не меняется.
 */

import { cardColumns } from "./apartment-cards";
import { paths } from "./paths";

export const living = {
  /* Адрес страницы на сайте */
  path: paths.living,
  crumbs: [
    { label: "Главная", href: "/" },
    { label: "Для собственного проживания", href: "" },
  ],
  /* Вкладки по ЖК и карточки с 15.10 приходят из бэкенда (lib/api.ts) */
  columns: cardColumns,
  /* Блок «Персональный подбор»: заголовки из админки, фотография для телефона здесь */
  consultation: {
    mobileImage: "/images/restaurant/consultation-mobile.jpg",
  },
};
