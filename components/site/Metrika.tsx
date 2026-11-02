"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { readCookieConsent, subscribeCookieConsent } from "@/lib/cookie-consent";
import { hit, reachGoal, setMetrikaCounter } from "@/lib/metrika";
import { useSiteSettings } from "./SiteSettings";

/*
 * Яндекс Метрика (02.11). Счётчик подключается, когда в админке задан его
 * номер и посетитель разрешил аналитические cookie («Принять все» или
 * «Аналитические» в настройках). Пока согласия нет, на странице нет ни
 * скрипта Метрики, ни её cookie. Согласие, данное на этой же странице,
 * подхватывается сразу, без перезагрузки.
 *
 * Здесь же цели (lib/metrika.ts): «Позвонить» и номера телефонов (ссылки
 * tel:) и иконки соцсетей ловятся по нажатию на любой такой ссылке,
 * открытие окна заявки и отправка заявки отмечаются в самих компонентах.
 */
const TAG = "https://mc.yandex.ru/metrika/tag.js";
const SOCIAL_HOSTS = ["t.me", "telegram.me", "vk.com", "vk.ru", "max.ru"];

export function Metrika() {
  const { metrika } = useSiteSettings();
  const pathname = usePathname();
  const started = useRef(false);
  const firstPath = useRef(true);

  const allowed = useSyncExternalStore(
    subscribeCookieConsent,
    () => readCookieConsent()?.analytics === true,
    () => false,
  );

  const active = metrika.id !== null && allowed;

  // Запуск счётчика: один раз на страницу
  useEffect(() => {
    if (!active || started.current || metrika.id === null) return;
    started.current = true;
    const id = metrika.id;

    /*
     * Стандартный код счётчика из кабинета Метрики, тот же по смыслу, но
     * без вставки HTML: до загрузки tag.js вызовы ym копятся в очереди ym.a.
     */
    const queue = function () {
      // eslint-disable-next-line prefer-rest-params
      (queue.a = queue.a ?? []).push(arguments);
    } as unknown as NonNullable<Window["ym"]>;
    const ym = window.ym ?? queue;
    ym.l = ym.l ?? Date.now();
    window.ym = ym;
    if (!document.querySelector(`script[src="${TAG}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = TAG;
      document.head.appendChild(script);
    }
    ym(id, "init", {
      clickmap: metrika.webvisor,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: metrika.webvisor,
    });
    setMetrikaCounter(id);

    return () => setMetrikaCounter(null);
  }, [active, metrika.id, metrika.webvisor]);

  // Переходы между страницами без перезагрузки
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    hit(window.location.href);
  }, [pathname]);

  // Цели по нажатию: телефоны и соцсети
  useEffect(() => {
    if (!active) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        reachGoal("call", { phone: href.slice(4) });
        return;
      }
      try {
        const host = new URL(link.href).hostname.replace(/^www\./, "");
        if (SOCIAL_HOSTS.includes(host)) reachGoal("social", { host });
      } catch {
        /* относительная или странная ссылка: не соцсеть */
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [active]);

  return null;
}
