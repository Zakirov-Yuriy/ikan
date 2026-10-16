import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/site/CookieConsent";
import { MobileBar } from "@/components/site/MobileBar";
import { RequestPopupProvider } from "@/components/site/RequestPopup";
import { SiteSettingsProvider } from "@/components/site/SiteSettings";
import { cookieConsent, requestForm } from "@/content/site";
import { getSettings } from "@/lib/api";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
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
      </head>
      <body className="flex min-h-full flex-col">
        <SiteSettingsProvider value={settings}>
          {/* Окно «Оставить заявку» общее для всех страниц */}
          <RequestPopupProvider form={requestForm}>
            {children}
          </RequestPopupProvider>
          {/* Полоса «Позвонить», «Оставить заявку», Telegram внизу экрана на телефоне */}
          <MobileBar />
        </SiteSettingsProvider>
        {/* Плашка «Мы используем cookie», пока человек не сделал выбор */}
        <CookieConsent texts={cookieConsent} />
      </body>
    </html>
  );
}
