/*
 * Яндекс Метрика (02.11). Номер счётчика задаётся в админке («Настройки»),
 * сам счётчик подключает components/site/Metrika.tsx, и только после того,
 * как посетитель разрешил аналитические cookie.
 *
 * Цели для рекламы. В Метрике их нужно создать как «JavaScript-событие» с
 * такими же идентификаторами:
 *   call          нажали «Позвонить» или на номер телефона
 *   request_open  открыли окно «Оставить заявку»
 *   request       отправили заявку (параметр source: popup или callback)
 *   social        нажали иконку MAX, Telegram или ВКонтакте
 * reachGoal можно звать всегда: без счётчика или без согласия ничего не происходит.
 */

export type MetrikaGoal = "call" | "request_open" | "request" | "social";

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
