/*
 * Адреса страниц, на которые ссылаются сразу несколько файлов содержания.
 * Вынесены отдельно, чтобы эти файлы не зависели друг от друга по кругу.
 */
export const paths = {
  /* «Квартиры для собственного проживания» */
  living: "/dlya-sebya",
  /* «Квартиры для сдачи в аренду» */
  renting: "/dlya-arendy",
  /* «Новостройки в Сербии» */
  newBuilds: "/novostroyki",
  /* «Инвестиции в строительство» */
  investments: "/investitsii",
  /* Страница одного апартамента и страница со всеми его фотографиями */
  apartment: (slug: string) => `/apartamenty/${slug}`,
  apartmentPhotos: (slug: string) => `/apartamenty/${slug}/foto`,
  /* Все фотографии ресторана */
  restaurantPhotos: "/restoran/foto",
  /* Блок «О компании» посередине главной */
  about: "/#about",
};
