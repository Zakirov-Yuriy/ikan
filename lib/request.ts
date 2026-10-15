/*
 * Отправка заявки с формы сайта на свой адрес /api/request (дальше её
 * передаёт сервер сайта). Возвращает текст ошибки или null, если принято.
 */
export type RequestSource = "callback" | "popup";

export async function sendRequest(
  form: HTMLFormElement,
  source: RequestSource,
): Promise<string | null> {
  const data = new FormData(form);
  const payload = {
    name: String(data.get("name") ?? ""),
    phone: String(data.get("phone") ?? ""),
    interest: String(data.get("interest") ?? ""),
    source,
    page: window.location.pathname,
    consent_terms: data.get("terms") ? true : false,
    consent_privacy: data.get("privacy") ? true : false,
    /* Поле-ловушка для роботов, у людей оно пустое */
    website: String(data.get("website") ?? ""),
  };

  try {
    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };
    if (response.ok && result.ok) return null;
    return result.message ?? "Не удалось отправить заявку.";
  } catch {
    return "Нет связи. Проверьте интернет и попробуйте ещё раз.";
  }
}
