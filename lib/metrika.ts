/*
 * Яндекс Метрика (02.11, переделано 12.11). Номер счётчика задаётся в админке
 * («Настройки»). Код счётчика стоит в head каждой страницы (app/layout.tsx,
 * metrikaSnippet ниже) и запускается сразу при загрузке, как на обычных
 * сайтах: так Яндекс видит счётчик на сайте, а Директ получает переходы и
 * цели с рекламы. Раньше счётчик включался только после согласия на
 * аналитические cookie в плашке, и Яндекс его на сайте не находил, а
 * переходы с рекламы без согласия не считались (звонок из поддержки Яндекса,
 * 12.11). Теперь посетитель может выключить счётчик в настройках плашки
 * («Аналитические»), и тогда на следующих страницах он не запускается, а на
 * текущей снимается (components/site/Metrika.tsx).
 *
 * Цели для рекламы. В Метрике их нужно создать как «JavaScript-событие» с
 * такими же идентификаторами:
 *   call          нажали «Позвонить» или на номер телефона
 *   request_open  открыли окно «Оставить заявку»
 *   request       отправили заявку (параметр source: popup или callback)
 *   social        нажали иконку MAX, Telegram или ВКонтакте
 * reachGoal можно звать всегда: без счётчика или при выключенной аналитике ничего не происходит.
 */

export type MetrikaGoal = "call" | "request_open" | "request" | "social";

export const METRIKA_TAG = "https://mc.yandex.ru/metrika/tag.js";

/* Ключ плашки cookie в localStorage, тот же, что в lib/cookie-consent.ts */
const CONSENT_KEY = "ikan-cookie-consent";

/* Параметры init, общие для кода в head и для повторного запуска из Metrika.tsx */
export function metrikaOptions(webvisor: boolean) {
  return {
    ssr: true,
    clickmap: webvisor,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor,
  };
}

/*
 * Стандартный код счётчика из кабинета Метрики для вставки в head страницы,
 * одной строкой. Отличие от кабинета одно: перед запуском он смотрит выбор
 * в плашке cookie и не запускается, если посетитель выключил аналитику.
 * Для робота Яндекса и для нового посетителя выбора нет, счётчик запускается.
 */
export function metrikaSnippet(id: number, webvisor: boolean): string {
  const options = JSON.stringify(metrikaOptions(webvisor));
  return (
    `(function(){try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})||"null");if(c&&c.analytics===false)return;}catch(e){}` +
    `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();` +
    `for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}` +
    `k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})` +
    `(window,document,"script","${METRIKA_TAG}?id=${id}","ym");` +
    `ym(${id},"init",${options});})();`
  );
}

/* Картинка для браузеров без JavaScript, как в коде из кабинета */
export function metrikaNoscript(id: number): string {
  return `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`;
}

type Ym = (id: number, method: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    ym?: Ym & { a?: unknown[]; l?: number };
  }
}

/* Счётчик, который сейчас запущен на странице; null, пока его нет */
let counter: number | null = null;

export function setMetrikaCounter(id: number | null): void {
  counter = id;
}

export function reachGoal(goal: MetrikaGoal, params?: Record<string, string>): void {
  if (counter === null || typeof window === "undefined" || !window.ym) return;
  try {
    window.ym(counter, "reachGoal", goal, params);
  } catch {
    /* Счётчик заблокирован расширением браузера: цели не считаем */
  }
}

/* Переход на другую страницу сайта без перезагрузки: Метрике нужно сказать об этом самим */
export function hit(url: string): void {
  if (counter === null || typeof window === "undefined" || !window.ym) return;
  try {
    window.ym(counter, "hit", url);
  } catch {
    /* как выше */
  }
}
