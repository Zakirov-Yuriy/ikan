/*
 * Страница «Ресторан». Содержание с 15.10 приходит из бэкенда (lib/api.ts,
 * getRestaurant), здесь адрес страницы и подписи, которые не меняются.
 * Тексты подписей взяты из макетов для компьютера и для телефона.
 */

export const restaurant = {
  /* Адрес страницы на сайте */
  path: "/restoran",
};

export const restaurantPage = {
  crumbs: [
    { label: "Главная", href: "/" },
    { label: "Ресторан", href: "" },
  ],
  priceLabel: "Стоимость",
  priceOnRequest: "По запросу",
  request: "Оставить заявку",
  call: "Позвонить",
  infoTitle: "Информация о ресторане",
  infoColumns: ["Тип", "Назначение", "Стоимость", "Этаж"],
  aboutEyebrow: "Об объекте",
  featuresTitle: "Характеристики",
  dataEyebrow: "Данные",
  dataLink: "Уточнить наличие",
  consultationTitle: "Получить консультацию по объекту",
  /* Блок «Персональный подбор»: в макете он есть только на телефоне */
  consultationImage: "/images/restaurant/consultation-mobile.jpg",
};
