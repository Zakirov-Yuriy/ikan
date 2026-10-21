"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/*
 * Счётчик просмотров для «Статистики» в админке (21.10). На каждой новой
 * странице сообщает её адрес, адрес предыдущей страницы сайта (так видно,
 * с какого экрана открыли карточку апартамента) и сайт, с которого пришли.
 * Без cookie и без хранения чего-либо в браузере.
 */
export function PageViews() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || previous.current === pathname) return;

    let from = previous.current;
    let referrer = "";
    if (from === null && document.referrer) {
      try {
        const url = new URL(document.referrer);
        /* Пришли с этого же сайта (новая вкладка, обновление): это предыдущая страница */
        if (url.host === window.location.host) from = url.pathname;
        else referrer = document.referrer;
      } catch {
        /* непонятный адрес источника пропускается */
      }
    }
    previous.current = pathname;

    const body = JSON.stringify({ path: pathname, from, referrer });
    try {
      const sent =
        typeof navigator.sendBeacon === "function" &&
        navigator.sendBeacon(
          "/api/view",
          new Blob([body], { type: "application/json" }),
        );
      if (!sent) {
        void fetch("/api/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* статистика не должна мешать сайту */
    }
  }, [pathname]);

  return null;
}
