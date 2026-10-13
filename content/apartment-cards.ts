/*
 * Карточки апартаментов для списков «Для собственного проживания» и
 * «Для сдачи в аренду». В макетах оба списка показывают одни и те же
 * апартаменты, поэтому карточки записаны один раз.
 * Сейчас всё записано здесь, позже эти значения будут приходить из админки.
 * Фотографии карточек в макетах для компьютера и для телефона разные (другой
 * кадр и другая высота), поэтому у каждой карточки их две: image для
 * компьютера, imageMobile для телефона.
 */

import type { ApartmentCardData } from "@/components/catalog/ApartmentCard";
import { paths } from "./paths";

/* Страницы, которые ещё не сделаны */
const SOON = "#";

/* Общий текст карточек: в макете он одинаковый, меняется только начало */
const byPresentation =
  "Цена и характеристики указаны по презентации проекта SVETOGORSKA 27.";

/*
 * В макетах метка статуса и подпись кнопки на компьютере и на телефоне
 * разные. Пока сделано как в каждом макете.
 */
const status = { desktop: "Строится", mobile: "Статус уточняется" };

/* Подписи колонок маленькой таблицы в карточке на компьютере */
export const cardColumns = ["Тип", "Площадь", "Стоимость"];

export const apartmentCards: ApartmentCardData[] = [
  {
    name: "Апартамент A4",
    location: "Златибор · Приземье",
    status,
    text: `Студия, 28 м². ${byPresentation}`,
    kind: "A4 · Студия",
    area: "28 м²",
    price: "75 500 €",
    image: {
      src: "/images/apartments/a4-card.jpg",
      alt: "Гостиная с диваном, телевизором и обеденным столом",
    },
    imageMobile: {
      src: "/images/apartments/a4-card-mobile.jpg",
      width: 369,
      height: 261,
    },
    href: paths.apartment("a4"),
    more: "Подробнее",
    button: { desktop: "Смотреть объект", mobile: "Смотреть апартамент A4" },
  },
  {
    name: "Апартамент A6",
    location: "Златибор · 1-й этаж",
    status,
    text: `Однокомнатный, 37 м². ${byPresentation}`,
    kind: "A6 · Однокомнатный",
    area: "37 м²",
    price: "98 500 €",
    image: {
      src: "/images/apartments/a6-card.jpg",
      alt: "Прихожая со шкафом, кухня и вид на гостиную",
    },
    imageMobile: {
      src: "/images/apartments/a6-card-mobile.jpg",
      width: 369,
      height: 261,
    },
    /* Страницы этого апартамента ещё нет: макета не было */
    href: SOON,
    more: "Подробнее",
    button: { desktop: "Смотреть объект", mobile: "Смотреть апартамент A6" },
  },
  {
    name: "Апартамент A10",
    location: "Златибор · 2-й этаж",
    status,
    text: `Однокомнатный, 37 м². ${byPresentation}`,
    kind: "A10 · Однокомнатный",
    area: "37 м²",
    price: "98 500 €",
    image: {
      src: "/images/apartments/a10-card.jpg",
      alt: "Гостиная с диваном, креслом и журнальным столиком",
    },
    imageMobile: {
      src: "/images/apartments/a10-card-mobile.jpg",
      width: 369,
      height: 250,
    },
    /* Страницы этого апартамента ещё нет: макета не было */
    href: SOON,
    more: "Подробнее",
    button: { desktop: "Смотреть объект", mobile: "Смотреть апартамент A10" },
  },
];
