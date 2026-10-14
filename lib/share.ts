/*
 * «Поделиться» страницей. Сначала системное окно «Поделиться» (на телефоне:
 * WhatsApp, Telegram и всё, что установлено), если браузер его даёт. Иначе
 * адрес страницы копируется в буфер обмена, и кнопка показывает «Ссылка
 * скопирована».
 *
 * Окно «Поделиться» и буфер обмена браузеры дают только на защищённом
 * адресе (https или localhost). На сайте в домашней сети по http остаётся
 * запасной способ копирования через выделение текста.
 */

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

/* Адрес текущей страницы без якоря: якорь вроде #callback делиться не должен */
export function pageUrl(): string {
  return (
    window.location.origin + window.location.pathname + window.location.search
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* падаем на запасной способ */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText =
      "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const done = document.execCommand("copy");
    area.remove();
    return done;
  } catch {
    return false;
  }
}

/* mode: share сначала пробует системное окно, copy сразу копирует */
export async function sharePage(mode: "share" | "copy"): Promise<ShareResult> {
  const url = pageUrl();
  if (mode === "share" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: document.title, url });
      return "shared";
    } catch (error) {
      // Человек закрыл окно, не выбрав ничего: это не ошибка
      if (error instanceof DOMException && error.name === "AbortError")
        return "cancelled";
      /* окно не открылось: копируем */
    }
  }
  return (await copyText(url)) ? "copied" : "failed";
}
