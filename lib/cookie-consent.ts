/*
 * Сохранённый выбор по cookie. Лежит в localStorage браузера под одним ключом.
 * Пока его никто не читает, кроме самой плашки: счётчиков на сайте нет.
 * Когда появится счётчик, перед его запуском проверять readCookieConsent().
 */

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /* Когда выбор сделан, в формате ISO */
  at: string;
};

const KEY = "ikan-cookie-consent";

const listeners = new Set<() => void>();

/*
 * Выбор, сделанный на этой странице. Нужен на случай, когда браузер не даёт
 * ничего записать (приватный режим): плашка всё равно прячется до
 * следующего захода.
 */
let decidedHere = false;

/* Выбор ещё не сделан, или браузер не даёт читать хранилище */
export function readCookieConsent(): CookieConsent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<CookieConsent>;
    if (
      typeof value.analytics !== "boolean" ||
      typeof value.marketing !== "boolean"
    )
      return null;
    return {
      necessary: true,
      analytics: value.analytics,
      marketing: value.marketing,
      at: String(value.at ?? ""),
    };
  } catch {
    return null;
  }
}

/* Сделан ли выбор: на этой странице или раньше */
export function isCookieConsentDecided(): boolean {
  return decidedHere || readCookieConsent() !== null;
}

/* Следить за выбором, в том числе сделанным в другой вкладке */
export function subscribeCookieConsent(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/* Возвращает false, если браузер не дал записать (приватный режим) */
export function writeCookieConsent(choice: {
  analytics: boolean;
  marketing: boolean;
}): boolean {
  const value: CookieConsent = {
    necessary: true,
    ...choice,
    at: new Date().toISOString(),
  };
  decidedHere = true;
  let saved = true;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    saved = false;
  }
  listeners.forEach((listener) => listener());
  return saved;
}
