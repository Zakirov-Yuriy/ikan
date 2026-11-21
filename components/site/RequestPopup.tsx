"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { reachGoal } from "@/lib/metrika";
import type { RequestSource } from "@/lib/request";
import { RequestSheet, type RequestFormTexts } from "./RequestSheet";

type RequestPopup = {
  /*
   * Открыть окно заявки. Когда окно закроется, фокус вернётся на указанный
   * элемент, а если он не указан, туда, где был до открытия. source:
   * popup_auto, если окно открылось само по таймеру (AutoRequestPopup).
   */
  open: (returnFocusTo?: HTMLElement | null, source?: RequestSource) => void;
};

/* Отметка на визит (sessionStorage): окно заявки уже открывалось, само больше не откроется */
export const POPUP_OPENED_KEY = "ikan-request-popup";

const RequestPopupContext = createContext<RequestPopup | null>(null);

/*
 * Общее окно «Оставить заявку» на весь сайт. Стоит в общей обёртке страниц,
 * поэтому открыть его может любая кнопка на любой странице.
 */
export function RequestPopupProvider({
  form,
  children,
}: {
  form: RequestFormTexts;
  children: ReactNode;
}) {
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");
  const [source, setSource] = useState<RequestSource>("popup");
  const returnFocusTo = useRef<HTMLElement | null>(null);

  const open = useCallback(
    (target?: HTMLElement | null, from: RequestSource = "popup") => {
      const active = document.activeElement;
      returnFocusTo.current =
        target ?? (active instanceof HTMLElement ? active : null);
      setSource(from);
      setState("open");
      try {
        sessionStorage.setItem(POPUP_OPENED_KEY, "1");
      } catch {
        /* без sessionStorage отметки нет */
      }
      /* Цель для Метрики: окно заявки открыто (02.11), source popup или popup_auto */
      reachGoal("request_open", { source: from });
    },
    [],
  );

  // Окно убрано со страницы: возвращаем фокус на кнопку, которая его открыла
  const onClosed = useCallback(() => {
    setState("closed");
    const target = returnFocusTo.current;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, []);

  const popup = useMemo(() => ({ open }), [open]);

  /*
   * Кнопки, которые ведут к форме «Заказать обратный звонок» (#callback),
   * открывают окно заявки, если формы на этой странице и этом экране не
   * видно (подвал страницы инвестиций на телефоне). Если форма видна, они
   * прокручивают к ней, как раньше.
   */
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.hash !== "#callback" || url.pathname !== window.location.pathname)
        return;
      const form = document.getElementById("callback");
      if (form && form.getClientRects().length > 0) return;
      event.preventDefault();
      open(link);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  return (
    <RequestPopupContext value={popup}>
      {children}
      {state !== "closed" && (
        <RequestSheet
          state={state}
          form={form}
          source={source}
          onClose={() => setState("closing")}
          onClosed={onClosed}
        />
      )}
    </RequestPopupContext>
  );
}

export function useRequestPopup() {
  const popup = useContext(RequestPopupContext);
  if (!popup)
    throw new Error(
      "useRequestPopup работает только внутри RequestPopupProvider",
    );
  return popup;
}

/*
 * Кнопка, которая открывает окно заявки. По разметке это обычная ссылка на
 * форму в подвале: если скрипты в браузере не работают, она просто прокрутит
 * страницу к этой форме.
 */
export function RequestLink({ onClick, ...props }: ComponentProps<"a">) {
  const popup = useRequestPopup();

  return (
    <a
      {...props}
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        // Нажатие с Ctrl, Shift и подобными клавишами оставляем браузеру
        const plain = !(
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        );
        if (event.defaultPrevented || event.button !== 0 || !plain) return;
        event.preventDefault();
        popup.open(event.currentTarget);
      }}
    />
  );
}
