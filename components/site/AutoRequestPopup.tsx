"use client";

import { useEffect } from "react";
import { REQUEST_SENT_KEY } from "@/lib/request";
import { POPUP_OPENED_KEY, useRequestPopup } from "./RequestPopup";
import { useSiteSettings } from "./SiteSettings";

/*
 * Окно «Оставить заявку» открывается само через заданное в админке время
 * после захода на сайт (Саша, 21.11). Настройки приходят из «Настроек»
 * админки (`popup.enabled`, `popup.delay` в секундах, по умолчанию 10).
 *
 * Правила, чтобы окно не надоедало:
 * - один раз за визит (отметка в sessionStorage ставится при любом открытии
 *   окна, в том числе по кнопке; переходы между страницами визит не прерывают,
 *   таймер при них не сбрасывается, он живёт в общей обёртке страниц);
 * - не показывается тем, кто уже отправлял заявку с этого браузера
 *   (отметка в localStorage из lib/request.ts);
 * - не показывается поверх другого открытого окна (просмотр фото, настройки
 *   cookie, окно «Поделиться»): в этом случае просто пропускается.
 */
export function AutoRequestPopup() {
  const { popup } = useSiteSettings();
  const { open } = useRequestPopup();

  useEffect(() => {
    if (!popup.enabled || alreadyShown()) return;
    const timer = window.setTimeout(() => {
      if (alreadyShown()) return;
      if (document.querySelector('[role="dialog"]')) return;
      open(null, "popup_auto");
    }, popup.delay * 1000);
    return () => window.clearTimeout(timer);
  }, [popup.enabled, popup.delay, open]);

  return null;
}

function alreadyShown(): boolean {
  try {
    return (
      sessionStorage.getItem(POPUP_OPENED_KEY) === "1" ||
      localStorage.getItem(REQUEST_SENT_KEY) === "1"
    );
  } catch {
    return false;
  }
}
