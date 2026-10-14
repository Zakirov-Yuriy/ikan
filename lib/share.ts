/*
 * «Поделиться» страницей.
 *
 * На телефоне: системное окно «Поделиться» (WhatsApp, Telegram и всё, что
 * установлено), если браузер его даёт. Браузеры дают его только на
 * защищённом адресе, https или localhost; на сайте в домашней сети по http
 * его нет, и тогда открывается своё окно с вариантами (ShareSheet).
 *
 * На компьютере: адрес страницы копируется в буфер обмена, кнопка показывает
 * «Ссылка скопирована».
 */

export type ShareResult =
  "shared" | "copied" | "cancelled" | "failed" | "unavailable";

/* Адрес текущей страницы без якоря: якорь вроде #callback делиться не должен */
export function pageUrl(): string {
  return (
    window.location.origin + window.location.pathname + window.location.search
  );
}

export async function copyText(text: string): Promise<boolean> {
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

/* Скопировать адрес страницы */
export async function copyPageUrl(): Promise<ShareResult> {
  return (await copyText(pageUrl())) ? "copied" : "failed";
}

/*
 * Системное окно «Поделиться». unavailable: браузер его не даёт, нужно своё
 * окно. cancelled: человек закрыл окно, ничего не выбрав.
 */
export async function shareNative(): Promise<ShareResult> {
  if (typeof navigator.share !== "function") return "unavailable";
  try {
    await navigator.share({ title: document.title, url: pageUrl() });
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      return "cancelled";
    return "unavailable";
  }
}

/* Ссылки «поделиться» для своего окна. Приложения на телефоне перехватывают их сами */
export function shareLinks() {
  const url = encodeURIComponent(pageUrl());
  const title = encodeURIComponent(document.title);
  return [
    {
      key: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${url}&text=${title}`,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${title}%20${url}`,
    },
    {
      key: "vk",
      label: "ВКонтакте",
      href: `https://vk.com/share.php?url=${url}&title=${title}`,
    },
    {
      key: "mail",
      label: "Почта",
      href: `mailto:?subject=${title}&body=${url}`,
    },
  ];
}
