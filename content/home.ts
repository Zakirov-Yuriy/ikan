/*
 * Главная страница. С 15.10 все тексты и фотографии приходят из бэкенда
 * (lib/api.ts, getHome), в админке раздел «Главная сайта». Здесь формы
 * данных, с которыми работают блоки, и значения блока «Персональный
 * подбор», общие для остальных страниц сайта: на них этот блок стоит с
 * теми же надписью, текстом и кнопкой, что в макетах.
 */

export type FeatureIcon = "chart" | "shield" | "key";

export type HeroData = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  lead: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  sideLabel: string;
  sideItems: string[];
};

/* Строка направления: номер, текст, ссылка, фотография справа */
export type ScenarioData = {
  title: string;
  text: string;
  link: { label: string; href: string };
  image: {
    src: string;
    alt: string;
    /*
     * Другой кадр для компьютера, если задан: там фотография в покое занимает
     * 342 px и при наведении на ссылку сдвигается вправо.
     */
    wide: { src: string } | null;
  };
};

export type AboutData = {
  eyebrow: string;
  title: string;
  text: string;
  featuresLabel: string;
  features: { icon: FeatureIcon; label: string }[];
};

/* «Наши направления». Карточка нажимается целиком, вместе с круглой стрелкой */
export type DirectionsData = {
  label: string;
  items: { title: string; text: string; href: string; image: string }[];
};

export type ObjectsData = {
  eyebrow: string;
  title: string;
  all: { label: string; href: string };
  more: string;
  items: {
    title: string;
    status: string;
    location: string;
    meta: string;
    price: string;
    href: string;
    image: string;
  }[];
};

export type ConsultationData = {
  eyebrow: string;
  title: string;
  text: string;
  button: { label: string; href: string };
  image: string;
};

export type HomeData = {
  meta: { title?: string; description?: string };
  hero: HeroData;
  scenarios: ScenarioData[];
  about: AboutData;
  directions: DirectionsData;
  objects: ObjectsData;
  consultation: ConsultationData;
};

/*
 * Блок «Персональный подбор» на остальных страницах и запасные значения
 * для главной, если поле в админке пустое. Кнопка прокручивает страницу
 * к форме «Заказать обратный звонок» в подвале.
 */
export const consultation: ConsultationData = {
  eyebrow: "Персональный подбор",
  title: "Подберём объект под ваши цели",
  text: "Подберём объект или инвестиционную стратегию под ваш бюджет и цели.",
  button: { label: "Получить консультацию", href: "#callback" },
  image: "/images/home/consultation.jpg",
};
