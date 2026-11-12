import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/site/CookieConsent";
import { Metrika } from "@/components/site/Metrika";
import { MobileBar } from "@/components/site/MobileBar";
import { PageViews } from "@/components/site/PageViews";
import { RequestPopupProvider } from "@/components/site/RequestPopup";
import { SiteSettingsProvider } from "@/components/site/SiteSettings";
import { cookieConsent, requestForm } from "@/content/site";
import { getSettings } from "@/lib/api";
import { metrikaNoscript, metrikaSnippet } from "@/lib/metrika";
import { fontVariables } from "./fonts";
import "./globals.css";

/*
 * Общие метаданные сайта. Это функция, а не константа, потому что коды
 * подтверждения для Яндекс Вебмастера и Google Search Console берутся из
 * «Настроек» админки (05.11): Саша вставляет код в админке, и на всех
 * страницах появляется <meta name="yandex-verification" content="...">
 * без пересборки сайта. getSettings запоминает ответ на время запроса,
 * так что к бэкенду уходит один вызов на страницу вместе с RootLayout.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { verification } = await getSettings();

  return {
    ...baseMetadata,
    verification: {
      yandex: verification.yandex ?? undefined,
      google: verification.google ?? undefined,
    },
  };
}

const baseMetadata: Metadata = {
  title: "ИКАН: недвижимость и инвестиции в Сербии",
  description:
    "Подбираем квартиры для собственного проживания, сдачи в аренду и инвестиций в строительство.",
  /*
   * Превью ссылки в Telegram, WhatsApp, ВКонтакте (16.10): картинка
   * app/opengraph-image.png (логотип на тёмно-синем, 1200 на 630) на всех
   * страницах. Заголовок и описание превью берутся у каждой страницы свои.
   * Адрес картинки должен быть полным: SITE_URL, если задан, иначе Vercel
   * подставляет адрес сайта сам.
   */
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  /*
   * Канонический адрес каждой страницы: тот же путь на SITE_URL. Так
   * www.ik-ikan.ru и ik-ikan.ru для поисковиков одна страница, а не две копии.
   */
  alternates: { canonical: "./" },
  openGraph: { siteName: "ИКАН", locale: "ru_RU", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#082234",
};

/*
 * Обновление страницы всегда открывает её с самого верха.
 * Браузер после обновления сам возвращает страницу на то место, где человек
 * её оставил, и шапка оказывается за краем экрана. Запретить это заранее
 * нельзя: настройка history.scrollRestoration на текущее обновление уже не
 * действует. Поэтому скрипт дожидается, когда браузер прокрутит страницу,
 * и тут же, до показа кадра, возвращает её наверх.
 *
 * Работает только при обновлении страницы. На кнопку «Назад» и на адрес
 * с якорем (#objects) правило не действует. Скрипт выключается, как только
 * человек сам тронул страницу, и через 0.6 секунды после загрузки.
 */
const startAtTopOnReload = `(function(){try{var n=performance.getEntriesByType("navigation")[0];if(!n||n.type!=="reload"||location.hash)return;var on=true;function up(){if(on&&(scrollY>0||scrollX>0))scrollTo({top:0,left:0,behavior:"instant"})}function tick(){if(on){up();requestAnimationFrame(tick)}}function stop(){on=false;removeEventListener("scroll",up)}addEventListener("scroll",up,{passive:true});requestAnimationFrame(tick);["wheel","touchstart","keydown","mousedown"].forEach(function(e){addEventListener(e,stop,{once:true,passive:true})});addEventListener("load",function(){up();setTimeout(stop,600)})}catch(e){}})();`;

/* Телефон из админки нужен на каждой странице: шапке, подвалу, полосе внизу */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    /*
     * data-scroll-behavior нужен Next: на сайте включена плавная прокрутка,
     * и без этой отметки новая страница после перехода плавно ехала бы вверх.
     * С отметкой она открывается сразу с начала.
     */
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: startAtTopOnReload }} />
        {/*
          Код Яндекс Метрики прямо в HTML каждой страницы (12.11): номер из
          админки, запускается сразу, чтобы Яндекс видел счётчик на сайте и
          Директ считал переходы и цели. Посетитель, выключивший аналитику в
          плашке cookie, счётчика не получает (проверка внутри кода).
        */}
        {settings.metrika.id !== null && (
          <script
            dangerouslySetInnerHTML={{
              __html: metrikaSnippet(settings.metrika.id, settings.metrika.webvisor),
            }}
          />
        )}
      </head>
      <body className="flex min-h-full flex-col">
        {settings.metrika.id !== null && (
          <noscript
            dangerouslySetInnerHTML={{ __html: metrikaNoscript(settings.metrika.id) }}
          />
        )}
        <SiteSettingsProvider value={settings}>
          {/* Окно «Оставить заявку» общее для всех страниц */}
          <RequestPopupProvider form={requestForm}>
            {children}
          </RequestPopupProvider>
          {/* Полоса «Позвонить», «Оставить заявку», Telegram внизу экрана на телефоне */}
          <MobileBar />
          {/* Яндекс Метрика: переходы между страницами, цели, выключение по выбору в плашке cookie */}
          <Metrika />
        </SiteSettingsProvider>
        {/* Просмотры страниц для «Статистики» в админке, без cookie (21.10) */}
        <PageViews />
        {/* Плашка «Мы используем cookie», пока человек не сделал выбор */}
        <CookieConsent texts={cookieConsent} />
      </body>
    </html>
  );
}
