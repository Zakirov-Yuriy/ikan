/*
 * Общие данные сайта: телефон, меню, подвал.
 * Сейчас всё записано здесь, позже эти значения будут приходить из админки.
 */

import { paths } from "./paths";
import { restaurant } from "./restaurant";

/* Страницы, которые ещё не свёрстаны. Адрес появится вместе со страницей. */
const SOON = "#";

export const site = {
  name: "ИКАН",
  phone: {
    label: "+7 700 123 45 67",
    href: "tel:+77001234567",
  },
  /*
   * Кнопки «Оставить заявку», «Обсудить задачу» и подобные открывают окно
   * заявки. Этот адрес у них запасной: форма в подвале, на случай, если
   * скрипты в браузере не работают.
   */
  callbackHref: "#callback",
};

/*
 * Меню в шапке и в меню для телефона. Пункт без адреса (href) показывается
 * обычной надписью и не нажимается: страницы «О компании» пока нет.
 * Когда она появится, достаточно вписать сюда её адрес.
 */
export const mainNav: { label: string; href?: string }[] = [
  { label: "Главная", href: "/" },
  { label: "Для себя", href: paths.living },
  { label: "Для аренды", href: paths.renting },
  { label: "Новостройки", href: paths.newBuilds },
  { label: "Инвестиции", href: paths.investments },
  { label: "О компании" },
];

/* Окно «Оставить заявку»: на компьютере по центру экрана, на телефоне выезжает снизу */
export const requestForm = {
  eyebrow: "Персональная консультация",
  title: "Оставить заявку",
  lead: "Подберём объект или инвестиционную стратегию под ваши цели.",
  name: { label: "Имя", placeholder: "Как к вам обращаться?" },
  /* Подсказка в поле телефона в макетах разная, пока сделано как в каждом */
  phone: {
    label: "Телефон",
    placeholder: "Ваш телефон",
    placeholderDesktop: "+7 000 000 00 00",
  },
  interest: {
    label: "Что вас интересует",
    placeholder: "Жильё для себя, для сдачи или инвестиции",
  },
  submit: "Оставить заявку",
  termsHref: SOON,
  privacyHref: SOON,
};

export const footer = {
  about: [
    "Недвижимость и инвестиции",
    "в перспективном рынке Сербии.",
    "Апартаменты SVETOGORSKA 27",
    "в Златиборе, Сербия.",
  ],
  office: {
    label: "Адрес офиса:",
    lines: ["г. Москва, ул Бутлерова 17 БЦ", "Neo-Geo, офис 5065"],
  },
  /* Телефон в подвале. В макете он другой, чем в шапке */
  phone: {
    label: "+7 (991) 255-29-00",
    href: "tel:+79912552900",
  },
  /*
   * Иконки соцсетей и мессенджеров, в том порядке, как в макете.
   * Адресов пока нет: когда появятся, вписать их вместо SOON.
   */
  socials: [
    { label: "MAX", icon: "/images/social/max.svg", href: SOON },
    { label: "Instagram", icon: "/images/social/instagram.svg", href: SOON },
    { label: "WhatsApp", icon: "/images/social/whatsapp.svg", href: SOON },
    { label: "Telegram", icon: "/images/social/telegram.svg", href: SOON },
    { label: "ВКонтакте", icon: "/images/social/vk.svg", href: SOON },
  ],
  columns: [
    {
      title: "Недвижимость",
      links: [
        { label: "Для собственного проживания", href: SOON },
        { label: "Для сдачи в аренду", href: SOON },
        { label: "Новостройки", href: SOON },
        { label: "Инвестиции", href: SOON },
        { label: "Ресторан", href: restaurant.path },
      ],
    },
    {
      title: "Компания",
      links: [
        { label: "О компании", href: SOON },
        { label: "Контакты", href: SOON },
      ],
    },
    {
      title: "Документы",
      links: [{ label: "Политика конфиденциальности", href: SOON }],
    },
  ],
  form: {
    eyebrow: "Мы перезвоним",
    title: "Заказать обратный звонок",
    namePlaceholder: "Ваше имя",
    phonePlaceholder: "+7 000 000 00 00",
    submit: "Отправить",
    termsHref: SOON,
    privacyHref: SOON,
  },
  /* Нижние строки подвала, как в макете от 13.10 */
  legal: [
    "ООО ИКК ИКАН. Все права защищены.",
    "Владелец сайта: ООО ИКК ИКАН",
    "Информация о недвижимости и ценах носит ознакомительный характер. Актуальные условия уточняйте у представителя проекта.",
    "Политика конфиденциальности · Пользовательское соглашение · Политика обработки персональных данных · Политика использования файлов cookie",
    "Контакты: email@ik-ikan.ru · +7 (991) 255-29-00",
  ],
};
