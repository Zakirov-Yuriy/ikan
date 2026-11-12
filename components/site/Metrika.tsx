"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { readCookieConsent, subscribeCookieConsent } from "@/lib/cookie-consent";
import {
  METRIKA_TAG,
  hit,
  metrikaOptions,
  reachGoal,
  setMetrikaCounter,
} from "@/lib/metrika";
import { useSiteSettings } from "./SiteSettings";

/*
 * Яндекс Метрика (02.11, переделано 12.11). Сам счётчик запускает код в head
 * страницы (app/layout.tsx, lib/metrika.ts), сразу при загрузке, как на
 * обычных сайтах: так его видит Яндекс и считает Директ. Здесь остальное:
 *
 * 1. Переходы между страницами без перезагрузки (ym 'hit').
 * 2. Цели (lib/metrika.ts): «Позвонить» и номера телефонов (ссылки tel:) и
 *    иконки соцсетей ловятся по нажатию на любой такой ссылке, открытие
 *    окна заявки и отправка заявки отмечаются в самих компонентах.
 * 3. Выбор в плашке cookie. Если посетитель выключил «Аналитические»,
 *    счётчик снимается со страницы (ym 'destruct'), а на следующих
 *    страницах код в head его не запускает. Если включил обратно, счётчик
 *    запускается здесь без перезагрузки.
 */
const SOCIAL_HOSTS = ["t.me", "telegram.me", "vk.com", "vk.ru", "max.ru"];

export function Metrika() {
  const { metrika } = useSiteSettings();
  const pathname = usePathname();
  /* Счётчик сейчас работает на странице */
  const running = useRef(false);
  /* Счётчик был снят на этой странице (посетитель выключил аналитику) */
  const destructed = useRef(false);
  const firstPath = useRef(true);

  const optedOut = useSyncExternalStore(
    subscribeCookieConsent,
    () => readCookieConsent()?.analytics === false,
    () => false,
  );

  const active = metrika.id !== null && !optedOut;

  // Запуск и остановка счётчика по выбору в плашке
  useEffect(() => {
    if (metrika.id === null) return;
    const id = metrika.id;
    /*
     * Выбор читается здесь заново, а не берётся из active: при гидрации
     * React сначала подставляет серверное значение (выбора нет), и по нему
     * счётчик запустился бы у посетителя, который его выключил.
     */
    const enabled = readCookieConsent()?.analytics !== false;

    if (enabled) {
      if (!running.current) {
        if (window.ym) {
          /*
           * Код в head уже запустил счётчик (обычный случай) или счётчик
           * был снят на этой же странице и его нужно запустить заново.
           */
          if (!document.querySelector(`script[src^="${METRIKA_TAG}"]`)) {
            loadTag(id);
          }
          if (destructed.current) {
            window.ym(id, "init", metrikaOptions(metrika.webvisor));
            destructed.current = false;
          }
        } else {
          /* Код в head не запускался (аналитика была выключена): запускаем сами */
          const queue = function () {
            // eslint-disable-next-line prefer-rest-params
            (queue.a = queue.a ?? []).push(arguments);
          } as unknown as NonNullable<Window["ym"]>;
          queue.l = Date.now();
          window.ym = queue;
          loadTag(id);
          queue(id, "init", metrikaOptions(metrika.webvisor));
        }
        running.current = true;
      }
      setMetrikaCounter(id);
      return;
    }

    if (running.current && window.ym) {
      try {
        window.ym(id, "destruct");
      } catch {
        /* старая версия tag.js без destruct: счётчик доживёт до перехода */
      }
      destructed.current = true;
      running.current = false;
    }
    setMetrikaCounter(null);
  }, [optedOut, metrika.id, metrika.webvisor]);

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

/* Подключить tag.js, если его ещё нет на странице */
function loadTag(id: number) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `${METRIKA_TAG}?id=${id}`;
  document.head.appendChild(script);
}
