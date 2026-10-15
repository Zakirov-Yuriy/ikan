/*
 * Страница апартамента. Содержание с 15.10 приходит из бэкенда (lib/api.ts,
 * getApartment), здесь форма этого содержания и подписи, одинаковые для всех
 * апартаментов. Тексты подписей взяты из макетов A4.
 */

type Photo = { src: string; alt: string };

export type Apartment = {
  slug: string;
  meta: { title: string; description: string };
  crumbs: { label: string; href: string }[];
  gallery: {
    /* Две большие фотографии сверху и две маленькие снизу, в этом порядке */
    photos: Photo[];
    /* На телефоне в макете одна фотография */
    mobilePhoto: Photo;
    /* «Все N фото»: ведёт на страницу со всеми фотографиями */
    all: { label: string; href: string };
  };
  /* Все фотографии без повторов, для страницы «Все N фото» */
  photos: Photo[];
  summary: {
    status: string;
    location: string;
    title: string;
    text: string;
    textMobile?: string;
    stats: { value: string; label: string }[];
    priceLabel: string;
    price: string;
    request: string;
    call: string;
  };
  info: {
    title: string;
    columns: string[];
    row: string[];
    note: string;
  };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    featuresTitle: string;
    features: { label?: string; value: string }[];
    data: {
      eyebrow: string;
      eyebrowMobile?: string;
      title: string;
      items: { label: string; value: string }[];
      link: string;
    };
  };
  consultation: { title: string; image: string };
};

export const apartmentPage = {
  /* Средняя крошка пути: ведёт на список «для себя» */
  crumb: "Апартаменты",
  /* «Все 12 фото»: подпись кнопки и страница со всеми фотографиями (макета не было) */
  allPhotos: (count: number) => `Все ${count} фото`,
  photosPage: {
    crumb: "Фото",
    title: "Фотографии",
    back: "Назад к апартаменту",
    open: "Открыть в полном размере",
  },
  priceLabel: "Стоимость",
  priceOnRequest: "По запросу",
  request: "Оставить заявку",
  call: "Позвонить",
  infoTitle: "Информация об апартаменте",
  infoColumns: ["Тип", "Площадь", "Стоимость", "Этаж"],
  aboutEyebrow: "Об объекте",
  featuresTitle: "Характеристики",
  dataEyebrow: "Данные",
  /* На телефоне в макете надпись длиннее */
  dataEyebrowMobile: "Данные презентации",
  dataLink: "Уточнить наличие",
  consultationTitle: "Получить консультацию по объекту",
  /* Фотография реки для блока «Персональный подбор», общая со страницей ресторана */
  consultationImage: "/images/restaurant/consultation-mobile.jpg",
};
