/*
 * Тексты и картинки главной страницы.
 * Сейчас всё записано здесь, позже эти значения будут приходить из админки.
 * Тексты взяты из макета для компьютера.
 */

import { paths } from "./paths";
import { restaurant } from "./restaurant";

/* Страницы, которые ещё не свёрстаны. Адрес появится вместе со страницей. */
const SOON = "#";

export type FeatureIcon = "chart" | "shield" | "key";

export const hero = {
  eyebrow: "Недвижимость в Сербии",
  title: "Пространство для жизни.",
  titleAccent: "Актив для будущего.",
  lead: "Подбираем квартиры для собственного проживания, сдачи в аренду и инвестиций в строительство.",
  primary: { label: "Смотреть объекты", href: "#objects" },
  secondary: { label: "Обсудить задачу", href: "#callback" },
  sideLabel: "Работаем на вашей стороне",
  sideItems: [
    "Локальная экспертиза",
    "Юридическая проверка",
    "Сопровождение сделки",
  ],
};

export const scenarios = [
  {
    title: "Покупка жилья для себя",
    text: "Подберём готовую квартиру для собственного проживания в подходящем районе Сербии.",
    link: { label: "Смотреть квартиры для жизни", href: paths.living },
    image: {
      src: "/images/home/scenario-01.jpg",
      width: 300,
      height: 228,
      alt: "Гостиная с креслом и кухней",
      /*
       * Широкая фотография для компьютера: там она в покое занимает 342 px
       * и при наведении на ссылку сдвигается вправо. У остальных строк широких
       * фотографий пока нет, обычная растягивается до той же ширины.
       */
      wide: {
        src: "/images/home/scenario-01-wide.jpg",
        width: 342,
        height: 228,
      },
    },
  },
  {
    title: "Покупка жилья для сдачи",
    text: "Найдём ликвидную квартиру для сдачи в аренду и стабильного дохода в евро.",
    link: { label: "Смотреть объекты для аренды", href: paths.renting },
    image: {
      src: "/images/home/scenario-02.jpg",
      width: 300,
      height: 220,
      alt: "Гостиная с телевизором и журнальным столиком",
    },
  },
  {
    title: "Покупка и перепродажа недвижимости",
    text: "Приобретите недвижимость на перспективном этапе и продайте дороже после роста её стоимости.",
    link: { label: "Выбрать объект для инвестиций", href: paths.newBuilds },
    image: {
      src: "/images/home/scenario-03.jpg",
      width: 300,
      height: 228,
      alt: "Вид с балкона на Златибор",
    },
  },
  {
    title: "Инвестиции в недвижимость",
    text: "Инвестируйте определённую сумму в перспективные проекты и участвуйте в росте стоимости недвижимости.",
    link: { label: "Узнать об инвестициях", href: paths.investments },
    image: {
      src: "/images/home/scenario-04.jpg",
      width: 300,
      height: 228,
      alt: "Кухня и выход на балкон",
    },
  },
  {
    title: "Ресторан в аренду",
    text: "Готовое пространство для вашего ресторанного бизнеса. Узнайте условия аренды и подробности предложения.",
    link: { label: "Подробнее о ресторане", href: restaurant.path },
    image: {
      src: "/images/home/scenario-05.jpg",
      width: 300,
      height: 228,
      alt: "Обеденный стол со стульями",
    },
  },
];

export const about = {
  eyebrow: "О компании",
  title: "Недвижимость и инвестиции в\u00a0Сербии",
  text: "Подбираем квартиры для собственного проживания, сдачи в аренду и инвестирования в строительство.",
  featuresLabel: "Почему инвестируют в Сербию",
  features: [
    { icon: "chart", label: "Высокий туристический спрос" },
    { icon: "shield", label: "Европейское качество" },
    { icon: "key", label: "Рост стоимости активов" },
    { icon: "chart", label: "Доходность до\u00a030% годовых" },
  ] satisfies { icon: FeatureIcon; label: string }[],
};

/*
 * «Наши направления». Карточка нажимается целиком, вместе с круглой стрелкой,
 * и ведёт туда же, куда ссылка в строке того же направления выше на главной.
 */
export const directions = {
  label: "Наши направления",
  items: [
    {
      title: "Жильё для себя",
      text: "Покупка квартиры для собственного проживания",
      href: paths.living,
      image: "/images/home/direction-01.jpg",
    },
    {
      title: "Жильё для сдачи",
      text: "Покупка квартиры с арендным потенциалом",
      href: paths.renting,
      image: "/images/home/direction-02.jpg",
    },
    {
      title: "Новостройки",
      text: "На этапе строительства и готовые объекты",
      href: paths.newBuilds,
      image: "/images/home/direction-03.jpg",
    },
    {
      title: "Инвестирование",
      text: "12% годовых · от $5 000 · в валюте",
      href: paths.investments,
      image: "/images/home/direction-04.jpg",
    },
  ],
};

export const objects = {
  eyebrow: "Проверенная недвижимость",
  title: "Актуальные объекты",
  all: { label: "Весь каталог", href: SOON },
  more: "Подробнее",
  items: [
    {
      title: "Апартамент A4",
      status: "Статус уточняется",
      location: "Златибор · Приземье",
      meta: "Студия · 28 м² · Приземье",
      price: "75 500 €",
      href: SOON,
      image: "/images/home/object-a4.jpg",
    },
    {
      title: "Апартамент A6",
      status: "Статус уточняется",
      location: "Златибор · 1-й этаж",
      meta: "Однокомнатный · 37 м² · 1-й этаж",
      price: "98 500 €",
      href: SOON,
      image: "/images/home/object-a6.jpg",
    },
    {
      title: "Апартамент A9",
      status: "Статус уточняется",
      location: "Златибор · 1-й этаж",
      meta: "Однокомнатный · 36 м² · 1-й этаж",
      price: "98 500 €",
      href: SOON,
      image: "/images/home/object-a9.jpg",
    },
  ],
};

export const consultation = {
  eyebrow: "Персональный подбор",
  title: "Подберём объект под ваши цели",
  text: "Подберём объект или инвестиционную стратегию под ваш бюджет и цели.",
  button: { label: "Получить консультацию", href: "#callback" },
  image: "/images/home/consultation.jpg",
};
