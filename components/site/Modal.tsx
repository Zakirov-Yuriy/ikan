"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type AnimationEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/ui/icons";

const FOCUSABLE = "a[href], button:not([disabled]), input, textarea, select";

/* С этой ширины окна выглядят как на компьютере: по центру экрана */
const DESKTOP = "(min-width: 1024px)";

function watchDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/* true на ширине компьютера; при сборке страницы на сервере всегда false */
export function useDesktop() {
  return useSyncExternalStore(
    watchDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );
}

type Props = {
  /* open: окно показано, closing: окно закрывается */
  state: "open" | "closing";
  /* id заголовка окна, для программ чтения с экрана */
  labelledBy: string;
  /* Просьба закрыть: крестик, клавиша Escape, нажатие на тёмный фон */
  onClose: () => void;
  /* Окно закрылось, его можно убрать со страницы */
  onClosed: () => void;
  /* Классы обёртки, самого окна и крестика: у каждого окна свои размеры */
  look: { wrap: string; panel: string; close: string };
  children: ReactNode;
};

/*
 * Общая основа окон поверх затемнённой и размытой страницы: окно заявки и
 * настройки cookie. На компьютере окно появляется по центру экрана, на
 * телефоне выезжает снизу. Пока окно открыто, страница под ним не
 * прокручивается, а клавиша Tab ходит только по элементам окна.
 */
export function Modal({
  state,
  labelledBy,
  onClose,
  onClosed,
  look,
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();

    /*
     * Страница под окном не прокручивается. На компьютере при этом пропадает
     * полоса прокрутки, и без поправки вся страница сдвинулась бы вправо на её
     * ширину. Поэтому на место полосы ставится такой же отступ.
     */
    const root = document.documentElement;
    const body = document.body;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.overflow = "hidden";
    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
      root.style.setProperty("--scrollbar-gap", `${scrollbar}px`);
    }
    return () => {
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      root.style.removeProperty("--scrollbar-gap");
    };
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;

    // Tab с последнего элемента возвращает на первый, Shift+Tab наоборот
    const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && state === "closing") onClosed();
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex justify-center ${look.wrap}`}
      onKeyDown={onKeyDown}
    >
      {/* Затемнение снято с макета: цвет #03141d, плотность 76.5%, размытие 4 px */}
      <div
        aria-hidden
        data-state={state}
        onClick={onClose}
        className="sheet-backdrop absolute inset-0 bg-[rgba(3,20,29,0.765)] backdrop-blur-[4px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        data-state={state}
        onAnimationEnd={onAnimationEnd}
        className={`relative w-full overflow-y-auto overscroll-contain bg-white outline-none ${look.panel}`}
      >
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className={`absolute grid place-items-center rounded-full bg-[#f3f1ec] text-ink ${look.close}`}
        >
          <CloseIcon className="size-[13px]" strokeWidth={1.8} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
