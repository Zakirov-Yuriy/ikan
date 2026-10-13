"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { RequestSheet, type RequestFormTexts } from "./RequestSheet";

type RequestPopup = {
  /*
   * Открыть окно заявки. Когда окно закроется, фокус вернётся на указанный
   * элемент, а если он не указан, туда, где был до открытия.
   */
  open: (returnFocusTo?: HTMLElement | null) => void;
};

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
  const returnFocusTo = useRef<HTMLElement | null>(null);

  const open = useCallback((target?: HTMLElement | null) => {
    const active = document.activeElement;
    returnFocusTo.current =
      target ?? (active instanceof HTMLElement ? active : null);
    setState("open");
  }, []);

  // Окно убрано со страницы: возвращаем фокус на кнопку, которая его открыла
  const onClosed = useCallback(() => {
    setState("closed");
    const target = returnFocusTo.current;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, []);

  const popup = useMemo(() => ({ open }), [open]);

  return (
    <RequestPopupContext value={popup}>
      {children}
      {state !== "closed" && (
        <RequestSheet
          state={state}
          form={form}
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
