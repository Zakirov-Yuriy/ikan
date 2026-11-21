/*
 * Отправка заявки с формы сайта на свой адрес /site-api/request (дальше её
 * передаёт сервер сайта). Возвращает текст ошибки или null, если принято.
 */
import { reachGoal } from "./metrika";
import { isOnlyPrefix } from "./phone-prefix";

/* popup_auto: окно заявки, которое открылось само по таймеру из настроек (21.11) */
export type RequestSource = "callback" | "popup" | "popup_auto";

/* Отметка в браузере, что заявка уже отправлялась: автоматическое окно больше не показывается */
export const REQUEST_SENT_KEY = "ikan-request-sent";

export async function sendRequest(
  form: HTMLFormElement,
  source: RequestSource,
): Promise<string | null> {
  const data = new FormData(form);
  const payload = {
    name: String(data.get("name") ?? ""),
    /* Только «+7» без номера уходит как пустое поле: бэкенд ответит «укажите телефон» */
    phone: isOnlyPrefix(String(data.get("phone") ?? ""))
      ? ""
      : String(data.get("phone") ?? ""),
    /* Почта по желанию (19.11): пустая уходит пустой, бэкенд её не требует */
    email: String(data.get("email") ?? "").trim(),
    interest: String(data.get("interest") ?? ""),
    source,
    page: window.location.pathname,
    consent_terms: data.get("terms") ? true : false,
    consent_privacy: data.get("privacy") ? true : false,
    /* Согласие на рекламу по желанию (16.10) */
    consent_ads: data.get("ads") ? true : false,
    /* Поле-ловушка для роботов, у людей оно пустое */
    website: String(data.get("website") ?? ""),
  };

  try {
    const response = await fetch("/site-api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };
    if (response.ok && result.ok) {
      /* Цель для Метрики: заявка отправлена, source: popup, popup_auto или callback (02.11) */
      reachGoal("request", { source });
      try {
        localStorage.setItem(REQUEST_SENT_KEY, "1");
      } catch {
        /* приватный режим: отметки нет, окно может показаться ещё раз */
      }
      return null;
    }
    return result.message ?? "Не удалось отправить заявку.";
  } catch {
    return "Нет связи. Проверьте интернет и попробуйте ещё раз.";
  }
}
