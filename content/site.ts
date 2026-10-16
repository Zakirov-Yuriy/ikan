/*
 * Общие данные сайта: меню, подвал, тексты форм. Телефон с 15.10 приходит
 * из бэкенда (lib/api.ts, getSettings; в админке «Настройки»), здесь только
 * запасное значение на случай, если бэкенд его не отдал.
 */

import { legalDocumentPath } from "./documents";
import { paths } from "./paths";
import { restaurant } from "./restaurant";

/* Страницы, которые ещё не свёрстаны. Адрес появится вместе со страницей. */
const SOON = "#";

/*
 * Галочки под формами заявки, тексты Саши от 16.10. name уходит в заявку:
 * terms (consent_terms), privacy (consent_privacy), ads (consent_ads).
 * В частях текста ссылки на документы из content/documents.ts по адресу.
 */
type ConsentPart = string | { label: string; document: string };
export const consents: {
  name: string;
  required: boolean;
  parts: ConsentPart[];
}[] = [
  {
    name: "terms",
    required: true,
    parts: [
      "Я принимаю условия ",
      {
        label: "Пользовательского соглашения",
        document: "polzovatelskoe-soglashenie",
      },
      " и ",
      {
        label: "Политики конфиденциальности",
        document: "politika-konfidencialnosti",
      },
      ".",
    ],
  },
  {
    name: "privacy",
    required: true,
    parts: [
      "Я даю ",
      {
        label: "согласие на обработку моих персональных данных",
        document: "soglasie-na-obrabotku-personalnyh-dannyh",
      },
      ".",
    ],
  },
  {
    name: "ads",
    required: false,
    parts: [
      "Я согласен на получение ",
      {
        label: "рекламных и информационных сообщений",
        document: "soglasie-na-reklamu",
      },
      ".",
    ],
  },
];

/* Сообщения форм заявки после отправки, общие для подвала и окна */
export const requestStatus = {
  sending: "Отправляем...",
  /* Окно после отправки (16.10): заголовок, текст, кнопка */
  sentTitle: "Заявка отправлена",
  sentText:
    "Спасибо! Мы получили вашу заявку и перезвоним вам в ближайшее время.",
  sentButton: "Хорошо",
  failed: "Не получилось отправить заявку.",
  retry: "Попробуйте ещё раз или позвоните нам:",
};

/* Телефон как он написан на сайте и как ссылка «позвонить» */
export type SitePhone = { label: string; href: string };

/* Ссылки иконок подвала из админки, null: иконку не показывать */
export type SiteSocials = {
  max: string | null;
  telegram: string | null;
  vk: string | null;
};

/*
 * Общие настройки из админки. phone: главный телефон, на него звонят кнопки
 * «Позвонить». phones: все телефоны для текста (главный и второй, 16.10).
 */
export type SiteSettings = {
  phone: SitePhone;
  phones: SitePhone[];
  socials: SiteSocials;
};

export const site = {
  name: "ИКАН",
  /* Запасной телефон: такой же, как по умолчанию в бэкенде */
  phone: {
    label: "+7 (991) 255-29-00",
    href: "tel:+79912552900",
  } satisfies SitePhone,
  /* Запасные значения, такие же, как по умолчанию в бэкенде */
  phones: [
    { label: "+7 (991) 255-29-00", href: "tel:+79912552900" },
    { label: "+7 (991) 587-24-57", href: "tel:+79915872457" },
  ] satisfies SitePhone[],
  socials: {
    max: "https://max.ru/u/f9LHodD0cOKw4NzKJl7VwikboHE9YRgKRd8GrqCCE2A1VsGgQ56KcSluPHc",
    telegram: "https://t.me/ikan_serbia",
    vk: "https://vk.ru/probizvip",
  } satisfies SiteSocials,
  /*
   * Форма «Заказать обратный звонок» в подвале. К ней прокручивают почти все
   * кнопки заявки; у трёх кнопок с окном заявки это запасной адрес на
   * случай, если скрипты в браузере не работают.
   */
  callbackHref: "#callback",
};

/*
 * Меню в шапке и в меню для телефона. Пункт без адреса (href) показывался бы
 * обычной надписью и не нажимался. «О компании» с 15.10 ведёт к блоку
 * «О компании» посередине главной (Анна, 15.10).
 */
export const mainNav: { label: string; href?: string }[] = [
  { label: "Главная", href: "/" },
  { label: "Для себя", href: paths.living },
  { label: "Для аренды", href: paths.renting },
  { label: "Новостройки", href: paths.newBuilds },
  { label: "Инвестиции", href: paths.investments },
  { label: "О компании", href: paths.about },
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
};

/*
 * Плашка «Мы используем cookie» и окно её настроек.
 * Сейчас на сайте нет ни счётчиков, ни рекламных скриптов, поэтому выбор
 * только запоминается в браузере. Когда появится счётчик, его подключение
 * должно смотреть на сохранённый выбор (lib/cookie-consent.ts).
 */
export const cookieConsent = {
  title: "Мы используем cookie",
  text: "Необходимые cookie обеспечивают работу сайта. Аналитические и маркетинговые cookie включаются только с вашего согласия.",
  acceptAll: "Принять все",
  settings: "Настроить",
  /* Окно настроек. Макета не было, сделано в духе окна заявки */
  dialog: {
    eyebrow: "Конфиденциальность",
    title: "Настройки cookie",
    lead: "Выберите, какие cookie сайт может использовать. Выбор можно изменить в любой момент.",
    categories: [
      {
        key: "necessary",
        label: "Необходимые",
        text: "Нужны для работы сайта и запоминают ваш выбор. Отключаются только в настройках браузера.",
        required: true,
      },
      {
        key: "analytics",
        label: "Аналитические",
        text: "Помогают понять, какие страницы и объекты интересны посетителям.",
        required: false,
      },
      {
        key: "marketing",
        label: "Маркетинговые",
        text: "Позволяют показывать наши предложения на других сайтах.",
        required: false,
      },
    ],
    save: "Сохранить выбор",
    acceptAll: "Принять все",
  },
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
  /*
   * Иконки соцсетей и мессенджеров, в том порядке, как в макете.
   * Instagram и WhatsApp убраны 14.10 по просьбе Анны, их файлы остались
   * в public/images/social на случай возврата.
   * Ссылки с 16.10 из админки («Настройки»), по ключу key.
   */
  socials: [
    { key: "max", label: "MAX", icon: "/images/social/max.svg" },
    { key: "telegram", label: "Telegram", icon: "/images/social/telegram.svg" },
    { key: "vk", label: "ВКонтакте", icon: "/images/social/vk.svg" },
  ] as const,
  /* Пункты «Недвижимость» с 15.10 ведут туда же, куда меню в шапке (Анна, 15.10) */
  columns: [
    {
      title: "Недвижимость",
      links: [
        { label: "Для собственного проживания", href: paths.living },
        { label: "Для сдачи в аренду", href: paths.renting },
        { label: "Новостройки", href: paths.newBuilds },
        { label: "Инвестиции", href: paths.investments },
        { label: "Ресторан", href: restaurant.path },
      ],
    },
    {
      title: "Компания",
      links: [
        { label: "О компании", href: paths.about },
        { label: "Контакты", href: SOON },
      ],
    },
    {
      title: "Документы",
      links: [
        {
          label: "Политика конфиденциальности",
          href: legalDocumentPath("politika-konfidencialnosti"),
        },
      ],
    },
  ],
  form: {
    eyebrow: "Мы перезвоним",
    title: "Заказать обратный звонок",
    namePlaceholder: "Ваше имя",
    phonePlaceholder: "+7 000 000 00 00",
    submit: "Отправить",
  },
  /* Нижние строки подвала, как в макете от 13.10; последняя строка с телефоном из админки */
  legal: [
    "ООО ИКК ИКАН. Все права защищены.",
    "Владелец сайта: ООО ИКК ИКАН",
    "Информация о недвижимости и ценах носит ознакомительный характер. Актуальные условия уточняйте у представителя проекта.",
  ],
  /* Строка документов под ними ссылками (16.10): пять документов от Саши, про cookie документа нет */
  documents: [
    { label: "Политика конфиденциальности", slug: "politika-konfidencialnosti" },
    { label: "Пользовательское соглашение", slug: "polzovatelskoe-soglashenie" },
    {
      label: "Согласие на обработку персональных данных",
      slug: "soglasie-na-obrabotku-personalnyh-dannyh",
    },
    { label: "Согласие на рекламу", slug: "soglasie-na-reklamu" },
    { label: "Публичная оферта", slug: "oferta" },
  ],
  contacts: { label: "Контакты:", email: "email@ik-ikan.ru" },
};
