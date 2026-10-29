import { cache } from "react";
import type { ApartmentCardData } from "@/components/catalog/ApartmentCard";
import { cardLabels } from "@/content/apartment-cards";
import type { Apartment } from "@/content/apartments";
import { apartmentPage } from "@/content/apartments";
import type { Complex } from "@/content/complexes";
import type {
  AboutData,
  DirectionsData,
  FeatureIcon,
  HeroData,
  HomeData,
  ObjectsData,
  ScenarioData,
} from "@/content/home";
import { consultation as consultationDefaults } from "@/content/home";
import { paths } from "@/content/paths";
import { restaurantPage } from "@/content/restaurant";
import { site, type SiteSettings } from "@/content/site";

/*
 * Данные с бэкенда (backend-ikan, Laravel). Адрес в .env.local:
 *   BACKEND_URL=http://localhost:8000
 * Сайт запрашивает API при каждом открытии страницы, без кэша: всё, что
 * сохранили в админке, видно на сайте при следующем обновлении страницы.
 * Запросы идут с сервера сайта, браузер посетителя к бэкенду не обращается.
 *
 * Здесь же ответы API переводятся в те формы, с которыми работают блоки
 * сайта (карточка, страница апартамента, страница ресторана), поэтому сами
 * блоки при переходе на бэкенд не менялись.
 */

export const BACKEND_URL = (
  process.env.BACKEND_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

type ApiPhoto = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

type ApiComplex = { slug: string; name: string };

type ApiCard = {
  slug: string;
  name: string;
  url: string;
  complex: ApiComplex;
  status: "building" | "ready";
  status_label: string;
  city: string | null;
  floor: string | null;
  type: string | null;
  area: number | null;
  price: number | null;
  card_text: string | null;
  catalogs: { living: boolean; renting: boolean; newbuilds: boolean };
  photos: { card: ApiPhoto | null; card_mobile: ApiPhoto | null };
};

type ApiApartment = ApiCard & {
  meta: { title: string | null; description: string | null };
  description: string | null;
  description_short: string | null;
  info_note: string | null;
  about: { title: string | null; text: string | null; features: string[] };
  data_items: { label: string; value: string }[];
  consultation_title: string | null;
  gallery: ApiPhoto[];
  photo_mobile: ApiPhoto | null;
};

type ApiRestaurant = {
  title: string;
  lead: string | null;
  meta: { title: string | null; description: string | null };
  status: string | null;
  name: string;
  city: string | null;
  floor: string | null;
  type: string | null;
  area: number | null;
  price_text: string | null;
  description: string | null;
  info: {
    type: string | null;
    purpose: string | null;
    price: string | null;
    floor: string | null;
    note: string | null;
  };
  about: {
    title: string | null;
    text: string | null;
    features: { label: string; value: string }[];
  };
  data_items: { label: string; value: string }[];
  consultation_title: string | null;
  gallery: ApiPhoto[];
  photo_mobile: ApiPhoto | null;
};

type ApiHome = {
  meta: { title: string | null; description: string | null };
  hero: {
    eyebrow: string | null;
    title: string;
    title_accent: string | null;
    lead: string | null;
    primary_label: string;
    secondary_label: string;
    side_label: string | null;
    side_items: string[];
  };
  scenarios: {
    title: string;
    text: string | null;
    link: { label: string | null; href: string | null };
    photo: ApiPhoto | null;
    photo_wide: ApiPhoto | null;
  }[];
  about: {
    eyebrow: string | null;
    title: string | null;
    text: string | null;
    features_label: string | null;
    features: { icon: string; label: string }[];
  };
  directions: {
    label: string | null;
    items: {
      title: string;
      text: string | null;
      href: string | null;
      photo: ApiPhoto | null;
    }[];
  };
  objects: {
    eyebrow: string | null;
    title: string | null;
    all: { label: string | null; href: string | null };
    more: string | null;
    items: ApiCard[];
  };
  consultation: {
    eyebrow: string | null;
    title: string | null;
    text: string | null;
    button_label: string | null;
    photo: ApiPhoto | null;
  };
};

type ApiPage = {
  key: string;
  url: string;
  title: string;
  lead: string | null;
  meta: { title: string | null; description: string | null };
  consultation: { title: string | null; title_mobile: string | null };
};

export type Catalog = "living" | "renting" | "newbuilds";

/* Ключи страниц списков в бэкенде: /api/pages/living и так далее */
export type PageKey = Catalog;

/* Вступление страницы списка: заголовок, подзаголовок, блок подбора */
export type PageData = {
  title: string;
  lead: string;
  meta: { title: string; description: string };
  consultation: { title: string | undefined; titleMobile: string | undefined };
};

/* Запрос к API. null, когда записи нет (404). Остальные ошибки наружу */
async function api<T>(path: string): Promise<T | null> {
  const url = `${BACKEND_URL}/api${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch (error) {
    /*
     * При сборке Next сам прерывает запрос без кэша особой ошибкой, чтобы
     * отдать страницу при каждом обращении, а не собрать заранее. Её нужно
     * пропустить дальше, иначе сборка падает на страницах без force-dynamic.
     */
    if (isNextBailout(error)) throw error;
    throw new Error(
      `Бэкенд не отвечает по адресу ${BACKEND_URL}. Запустите его: php artisan serve`,
    );
  }
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Бэкенд ответил ${response.status} на ${path}`);
  }
  const body = (await response.json()) as { data: T };
  return body.data;
}

function isNextBailout(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const { digest, name } = error as { digest?: unknown; name?: unknown };
  return (
    digest === "DYNAMIC_SERVER_USAGE" ||
    name === "DynamicServerError" ||
    (typeof digest === "string" && digest.startsWith("NEXT_"))
  );
}

/* Список ЖК для вкладок, включая пустые */
export async function getComplexes(): Promise<Complex[]> {
  const list = (await api<ApiComplex[]>("/complexes")) ?? [];
  return list.map((item) => ({ key: item.slug, name: item.name }));
}

/* Карточки апартаментов каталога, в порядке из админки */
export async function getApartmentCards(
  catalog: Catalog,
): Promise<ApartmentCardData[]> {
  const list = (await api<ApiCard[]>(`/apartments?catalog=${catalog}`)) ?? [];
  return list.map(toCard);
}

/* Страница апартамента. null, если такого адреса нет */
export async function getApartment(slug: string): Promise<Apartment | null> {
  const item = await api<ApiApartment>(
    `/apartments/${encodeURIComponent(slug)}`,
  );
  return item ? toApartment(item) : null;
}

export type RestaurantData = ReturnType<typeof toRestaurant>;

/* Страница ресторана. null, пока записи нет */
export async function getRestaurant(): Promise<RestaurantData | null> {
  const item = await api<ApiRestaurant>("/restaurant");
  return item ? toRestaurant(item) : null;
}

/*
 * Общие настройки из админки: телефон. Нужны шапке, подвалу и app/layout.tsx
 * на каждой странице, поэтому ответ запоминается на время одного запроса
 * (cache из React): к бэкенду уходит один вызов, а не три.
 */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const item = await api<Partial<SiteSettings>>("/site");
  const phone = item?.phone ?? site.phone;
  return {
    phone,
    /* Старый бэкенд без phones: один главный телефон */
    phones: item?.phones?.length ? item.phones : item ? [phone] : site.phones,
    socials: item?.socials ?? site.socials,
  };
});

/*
 * Главная страница целиком. Тексты загружаются в бэкенд командой
 * php artisan db:seed --class=HomeSeeder; пока их нет, страница не открывается.
 */
export async function getHome(): Promise<HomeData> {
  const item = await api<ApiHome>("/home");
  if (!item) {
    throw new Error(
      "Тексты главной ещё не загружены в бэкенд. Выполните в его папке: php artisan db:seed --class=HomeSeeder",
    );
  }
  return toHome(item);
}

/* Вступление страницы списка, загружается тем же HomeSeeder */
export async function getPage(key: PageKey): Promise<PageData> {
  const item = await api<ApiPage>(`/pages/${key}`);
  if (!item) {
    throw new Error(
      `Тексты страницы «${key}» ещё не загружены в бэкенд. Выполните в его папке: php artisan db:seed --class=HomeSeeder`,
    );
  }
  return {
    title: item.title,
    lead: item.lead ?? "",
    meta: {
      title: item.meta.title ?? `${item.title}: ИКАН`,
      description: item.meta.description ?? item.lead ?? "",
    },
    consultation: {
      title: item.consultation.title ?? undefined,
      titleMobile: item.consultation.title_mobile ?? undefined,
    },
  };
}

/* Заглушка вместо фотографии, которой ещё нет */
const noPhoto = {
  src: "/images/no-photo.jpg",
  alt: "",
  width: 800,
  height: 600,
};

/*
 * Адрес фотографии для сайта. Бэкенд присылает полный адрес
 * {APP_URL}/media/..., сайт оставляет от него только путь /media/...: такой
 * адрес next/image запрашивает у самого сайта, а сайт берёт файл с бэкенда
 * по BACKEND_URL (app/media/[...path]/route.ts). Поэтому на хостинге
 * бэкенд может быть закрыт снаружи, а APP_URL в нём любым: посетитель видит
 * фото только с адреса сайта. Адрес не с /media (другое хранилище картинок)
 * остаётся как есть.
 */
export function mediaSrc(url: string): string {
  try {
    const parsed = new URL(url, BACKEND_URL);
    if (parsed.pathname.startsWith("/media/")) {
      return parsed.pathname + parsed.search;
    }
  } catch {
    /* Адрес не разбирается: отдаём как есть */
  }
  return url;
}

function photo(item: ApiPhoto | null) {
  if (!item) return noPhoto;
  return {
    src: mediaSrc(item.url),
    alt: item.alt,
    width: item.width ?? noPhoto.width,
    height: item.height ?? noPhoto.height,
  };
}

/* «28 м²», «52,5 м²» */
export function formatArea(area: number | null): string {
  if (area === null) return "";
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(area)} м²`;
}

/* «75 500 €», с неразрывными пробелами, чтобы цена не переносилась */
export function formatPrice(price: number | null): string {
  if (price === null) return "";
  return `${new Intl.NumberFormat("ru-RU").format(price)} €`;
}

/* «Златибор · Приземье» */
function location(city: string | null, floor: string | null): string {
  return [city, floor].filter(Boolean).join(" · ");
}

/* «апартамент A4» из «Апартамент A4»: для подписи кнопки на телефоне */
function lowerFirst(text: string): string {
  return text.charAt(0).toLocaleLowerCase("ru-RU") + text.slice(1);
}

/* «A4» из «Апартамент A4»: короткий код для таблицы в карточке и крошек */
function code(name: string): string {
  return name.replace(/^апартаменты?\s+/iu, "").trim() || name;
}

function toCard(item: ApiCard): ApartmentCardData {
  const card = photo(item.photos.card ?? item.photos.card_mobile);
  const mobile = photo(item.photos.card_mobile ?? item.photos.card);
  return {
    name: item.name,
    complex: item.complex.slug,
    location: location(item.city, item.floor),
    status: {
      desktop: item.status_label,
      mobile: item.status_label,
      tone: item.status,
    },
    text: item.card_text ?? "",
    kind: [code(item.name), item.type].filter(Boolean).join(" · "),
    area: formatArea(item.area),
    price: formatPrice(item.price),
    image: { src: card.src, alt: card.alt },
    imageMobile: {
      src: mobile.src,
      width: mobile.width,
      height: mobile.height,
    },
    href: paths.apartment(item.slug),
    more: cardLabels.more,
    button: {
      desktop: cardLabels.button.desktop,
      mobile: `${cardLabels.button.mobile} ${lowerFirst(item.name)}`,
    },
  };
}

/*
 * Галерея страницы: на компьютере ровно четыре места. Если фотографий
 * меньше, они повторяются; если нет совсем, стоит фото карточки или заглушка.
 */
function gallery(photos: ApiPhoto[], fallback: ApiPhoto | null, href: string) {
  const list = photos.length > 0 ? photos : fallback ? [fallback] : [];
  const four = Array.from({ length: 4 }, (_, i) =>
    list.length > 0 ? photo(list[i % list.length]) : noPhoto,
  );
  return {
    photos: four.map(({ src, alt }) => ({ src, alt })),
    all: { label: apartmentPage.allPhotos(list.length), href },
    /* Все фотографии без повторов, для страницы «Все N фото» */
    list: (list.length > 0 ? list.map(photo) : [noPhoto]).map(
      ({ src, alt }) => ({ src, alt }),
    ),
  };
}

function toApartment(item: ApiApartment): Apartment {
  const { list, ...base } = gallery(
    item.gallery,
    item.photos.card,
    paths.apartmentPhotos(item.slug),
  );
  const mobile = photo(
    item.photo_mobile ??
      item.gallery[0] ??
      item.photos.card_mobile ??
      item.photos.card,
  );
  const price = formatPrice(item.price);
  const stats = [
    { value: item.type ?? "", label: "тип" },
    { value: formatArea(item.area), label: "площадь" },
    { value: item.floor ?? "", label: "этаж" },
  ].filter((stat) => stat.value !== "");

  return {
    slug: item.slug,
    meta: {
      title: item.meta.title ?? `${item.name}: ИКАН`,
      description: item.meta.description ?? item.description ?? "",
    },
    crumbs: [
      { label: "Главная", href: "/" },
      { label: apartmentPage.crumb, href: paths.living },
      { label: code(item.name), href: "" },
    ],
    gallery: {
      ...base,
      mobilePhoto: { src: mobile.src, alt: mobile.alt },
    },
    photos: list,
    summary: {
      status: item.status_label,
      location: location(item.city, item.floor),
      title: item.name,
      text: item.description ?? "",
      textMobile: item.description_short ?? undefined,
      stats,
      priceLabel: apartmentPage.priceLabel,
      price: price || apartmentPage.priceOnRequest,
      request: apartmentPage.request,
      call: apartmentPage.call,
    },
    info: {
      title: apartmentPage.infoTitle,
      columns: apartmentPage.infoColumns,
      row: [
        item.type ?? "",
        formatArea(item.area),
        price || apartmentPage.priceOnRequest,
        item.floor ?? "",
      ],
      note: item.info_note ?? "",
    },
    about: {
      eyebrow: apartmentPage.aboutEyebrow,
      title: item.about.title ?? item.name,
      text: item.about.text ?? "",
      featuresTitle: apartmentPage.featuresTitle,
      features: item.about.features.map((value) => ({ value })),
      data: {
        eyebrow: apartmentPage.dataEyebrow,
        eyebrowMobile: apartmentPage.dataEyebrowMobile,
        title: item.name,
        items: item.data_items,
        link: apartmentPage.dataLink,
      },
    },
    consultation: {
      title: item.consultation_title ?? apartmentPage.consultationTitle,
      image: apartmentPage.consultationImage,
    },
  };
}

function toRestaurant(item: ApiRestaurant) {
  const { list, ...base } = gallery(item.gallery, null, paths.restaurantPhotos);
  const mobile = photo(item.photo_mobile ?? item.gallery[0] ?? null);
  const priceText = item.price_text ?? restaurantPage.priceOnRequest;

  return {
    meta: {
      title: item.meta.title ?? `${item.title}: ИКАН`,
      description: item.meta.description ?? item.lead ?? "",
    },
    intro: {
      crumbs: restaurantPage.crumbs,
      title: item.title,
      lead: item.lead ?? "",
    },
    gallery: {
      ...base,
      mobilePhoto: { src: mobile.src, alt: mobile.alt },
    },
    photos: list,
    summary: {
      status: item.status ?? "",
      location: location(item.city, item.floor),
      title: item.name,
      text: item.description ?? "",
      stats: [
        { value: item.type ?? "", label: "тип" },
        { value: formatArea(item.area), label: "площадь" },
        { value: item.floor ?? "", label: "этаж" },
      ].filter((stat) => stat.value !== ""),
      priceLabel: restaurantPage.priceLabel,
      price: priceText,
      request: restaurantPage.request,
      call: restaurantPage.call,
    },
    info: {
      title: restaurantPage.infoTitle,
      columns: restaurantPage.infoColumns,
      row: [
        item.info.type ?? "",
        item.info.purpose ?? "",
        item.info.price ?? priceText,
        item.info.floor ?? item.floor ?? "",
      ],
      request: restaurantPage.request,
      note: item.info.note ?? "",
    },
    about: {
      eyebrow: restaurantPage.aboutEyebrow,
      title: item.about.title ?? item.name,
      text: item.about.text ?? "",
      featuresTitle: restaurantPage.featuresTitle,
      features: item.about.features,
      data: {
        eyebrow: restaurantPage.dataEyebrow,
        title: item.info.type ?? item.name,
        items: item.data_items,
        link: restaurantPage.dataLink,
      },
    },
    consultation: {
      title: item.consultation_title ?? restaurantPage.consultationTitle,
      mobileImage: restaurantPage.consultationImage,
    },
  };
}

const featureIcons: FeatureIcon[] = ["chart", "shield", "key"];

function toHero(item: ApiHome["hero"]): HeroData {
  return {
    eyebrow: item.eyebrow ?? "",
    title: item.title,
    titleAccent: item.title_accent ?? "",
    lead: item.lead ?? "",
    /* Тёмная кнопка ведёт к «Актуальным объектам», светлая открывает окно заявки */
    primary: { label: item.primary_label, href: "#objects" },
    secondary: { label: item.secondary_label, href: "#callback" },
    sideLabel: item.side_label ?? "",
    sideItems: item.side_items,
  };
}

function toScenario(item: ApiHome["scenarios"][number]): ScenarioData {
  const image = photo(item.photo ?? item.photo_wide);
  return {
    title: item.title,
    text: item.text ?? "",
    link: { label: item.link.label ?? "", href: item.link.href ?? "#" },
    image: {
      src: image.src,
      alt: image.alt,
      wide: item.photo_wide ? { src: mediaSrc(item.photo_wide.url) } : null,
    },
  };
}

function toAbout(item: ApiHome["about"]): AboutData {
  return {
    eyebrow: item.eyebrow ?? "",
    title: item.title ?? "",
    text: item.text ?? "",
    featuresLabel: item.features_label ?? "",
    features: item.features.map((feature) => ({
      icon: featureIcons.includes(feature.icon as FeatureIcon)
        ? (feature.icon as FeatureIcon)
        : "chart",
      label: feature.label,
    })),
  };
}

function toDirections(item: ApiHome["directions"]): DirectionsData {
  return {
    label: item.label ?? "",
    items: item.items.map((card) => ({
      title: card.title,
      text: card.text ?? "",
      href: card.href ?? "#",
      image: photo(card.photo).src,
    })),
  };
}

/* Карточка «Актуальных объектов»: те же апартаменты, что в списках, короче */
function toObjects(item: ApiHome["objects"]): ObjectsData {
  return {
    eyebrow: item.eyebrow ?? "",
    title: item.title ?? "",
    all: { label: item.all.label ?? "", href: item.all.href ?? "#" },
    more: item.more ?? "",
    items: item.items.map((card) => ({
      title: card.name,
      status: card.status_label,
      location: location(card.city, card.floor),
      meta: [card.type, formatArea(card.area), card.floor]
        .filter(Boolean)
        .join(" · "),
      price: formatPrice(card.price),
      href: paths.apartment(card.slug),
      image: photo(card.photos.card ?? card.photos.card_mobile).src,
    })),
  };
}

function toHome(item: ApiHome): HomeData {
  return {
    /* Пустые поля для поисковиков: остаются общие из app/layout.tsx */
    meta: {
      title: item.meta.title ?? undefined,
      description: item.meta.description ?? undefined,
    },
    hero: toHero(item.hero),
    scenarios: item.scenarios.map(toScenario),
    about: toAbout(item.about),
    directions: toDirections(item.directions),
    objects: toObjects(item.objects),
    consultation: {
      eyebrow: item.consultation.eyebrow ?? consultationDefaults.eyebrow,
      title: item.consultation.title ?? consultationDefaults.title,
      text: item.consultation.text ?? consultationDefaults.text,
      button: {
        label:
          item.consultation.button_label ?? consultationDefaults.button.label,
        href: consultationDefaults.button.href,
      },
      image: item.consultation.photo
        ? mediaSrc(item.consultation.photo.url)
        : consultationDefaults.image,
    },
  };
}
