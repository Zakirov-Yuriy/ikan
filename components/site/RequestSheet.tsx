"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type AnimationEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { ArrowIcon, CloseIcon } from "@/components/ui/icons";

export type RequestFormTexts = {
  eyebrow: string;
  title: string;
  lead: string;
  name: { label: string; placeholder: string };
  /* В макетах подсказка в поле телефона разная: на телефоне одна, на компьютере другая */
  phone: { label: string; placeholder: string; placeholderDesktop: string };
  interest: { label: string; placeholder: string };
  submit: string;
  termsHref: string;
  privacyHref: string;
};

type Props = {
  /* open: окно показано, closing: окно закрывается */
  state: "open" | "closing";
  form: RequestFormTexts;
  /* Просьба закрыть: крестик, клавиша Escape, нажатие на тёмный фон */
  onClose: () => void;
  /* Окно закрылось, его можно убрать со страницы */
  onClosed: () => void;
};

const FOCUSABLE = "a[href], button:not([disabled]), input, textarea, select";

/* С этой ширины окно выглядит как на компьютере: по центру экрана */
const DESKTOP = "(min-width: 1024px)";

/* Ссылки на документы в окне на компьютере: голубые, с тонкой линией снизу */
const skyLink =
  "border-b border-sky/45 pb-[2px] font-medium text-sky transition-colors hover:border-accent hover:text-accent";

function watchDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/*
 * Окно «Оставить заявку» поверх затемнённой и размытой страницы.
 * На компьютере оно появляется по центру экрана, на телефоне выезжает снизу:
 * размеры, поля и порядок согласий взяты из своих макетов.
 * Пока окно открыто, страница под ним не прокручивается, а клавиша Tab
 * ходит только по полям окна.
 */
export function RequestSheet({ state, form, onClose, onClosed }: Props) {
  const titleId = useId();
  const nameId = useId();
  const phoneId = useId();
  const interestId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [notConnected, setNotConnected] = useState(false);
  const desktop = useSyncExternalStore(
    watchDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );

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

  /*
   * Отправка заявок пока не подключена: решается, куда они должны приходить.
   * Форма проверяет поля и честно сообщает, что данные никуда не ушли.
   */
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotConnected(true);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;

    // Tab с последнего поля возвращает на первое, Shift+Tab наоборот
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

  /* Два набора размеров: слева окно на компьютере, справа на телефоне */
  const look = desktop
    ? {
        wrap: "items-center p-4",
        panel:
          "modal-panel max-h-full max-w-[460px] rounded-[20px] px-10 pt-[39px] pb-[28.5px]",
        close: "top-[18px] right-[18px] size-[38px]",
        title: "mt-[22px] text-[30px] leading-[33px]",
        lead: "mt-5 leading-[21.45px]",
        form: "mt-[24.5px]",
        labelGap: "mt-[15px]",
        field:
          "mt-[7px] rounded-[11px] border-[#dfe5e5] px-3 text-[13px] leading-[19.5px]",
        input: "h-[50px]",
        textarea: "h-[88.5px] pt-[12.5px] pb-3",
        submit: "mt-[19px] transition-colors hover:bg-ink",
        arrow: "mr-[1.5px] size-[16.5px]",
        arrowStroke: 1.07,
      }
    : {
        wrap: "items-end",
        panel:
          "sheet-panel max-h-[calc(100dvh-16px)] rounded-t-[20px] px-5 pt-[26.5px] pb-[calc(10px+env(safe-area-inset-bottom))] sm:max-w-[480px]",
        close: "top-3 right-3 size-11",
        title: "mt-[17px] text-[26px] leading-[28.6px]",
        lead: "mt-4 max-w-[330px] leading-[21px]",
        form: "mt-[21px]",
        labelGap: "mt-[10.5px]",
        field:
          "mt-[7.5px] rounded-[10px] border-[#ebefef] px-[12px] text-[16px] leading-6",
        input: "h-[50px] pb-[2px]",
        textarea: "h-[102px] py-[12px]",
        submit: "mt-[16.5px] active:bg-ink",
        arrow: "size-[18px]",
        arrowStroke: 1.275,
      };

  const label = "block text-[10px] leading-[15px] text-muted";
  const field = `block w-full border bg-[#fafbf9] text-navy placeholder:text-navy/48 focus:border-accent focus:outline-none ${look.field}`;

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
        aria-labelledby={titleId}
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

        <p className="eyebrow text-accent">{form.eyebrow}</p>
        <h2
          id={titleId}
          className={`font-display font-medium tracking-[-0.04em] text-ink ${look.title}`}
        >
          {form.title}
        </h2>
        <p className={`text-[13px] text-muted ${look.lead}`}>{form.lead}</p>

        <form onSubmit={onSubmit} className={look.form}>
          <label htmlFor={nameId} className={label}>
            {form.name.label}
          </label>
          <input
            id={nameId}
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder={form.name.placeholder}
            className={`${field} ${look.input}`}
          />

          <label htmlFor={phoneId} className={`${label} ${look.labelGap}`}>
            {form.phone.label}
          </label>
          <input
            id={phoneId}
            type="tel"
            name="phone"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder={
              desktop ? form.phone.placeholderDesktop : form.phone.placeholder
            }
            className={`${field} ${look.input}`}
          />

          <label htmlFor={interestId} className={`${label} ${look.labelGap}`}>
            {form.interest.label}
          </label>
          <textarea
            id={interestId}
            name="interest"
            placeholder={form.interest.placeholder}
            className={`${field} resize-none ${look.textarea}`}
          />

          {desktop ? (
            /* Компьютер: согласия как в форме подвала, только на белом фоне */
            <div className="mt-[6.5px] grid gap-1 text-[11px] leading-[17.05px] text-[#1e1e1e]">
              <label className="flex gap-[10px]">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="check-light size-5 rounded-[5px] border-[#d0d0d0]"
                />
                <span className="pt-px">
                  Я ознакомился(-ась) с{" "}
                  {/* В макете линия под этой ссылкой на 8 px длиннее текста */}
                  <Link href={form.termsHref} className={`${skyLink} pr-[8px]`}>
                    Условиями использования сайта
                  </Link>
                </span>
              </label>
              <label className="flex gap-[10px]">
                <input
                  type="checkbox"
                  name="privacy"
                  required
                  className="check-light size-5 rounded-[5px] border-[#d0d0d0]"
                />
                <span>
                  Я ознакомился(-ась) с{" "}
                  {/* В макете эта ссылка стоит на 3 px правее первой */}
                  <Link
                    href={form.privacyHref}
                    className={`${skyLink} ml-[3px]`}
                  >
                    Политикой конфиденциальности
                  </Link>{" "}
                  <span className="mt-px block max-w-[240px]">
                    и даю согласие на обработку персональных данных в
                    соответствии с её условиями.
                  </span>
                </span>
              </label>
            </div>
          ) : (
            <div className="mt-[11.5px] grid gap-[13px] text-[10px] text-muted">
              <label className="flex gap-[10px]">
                <input
                  type="checkbox"
                  name="privacy"
                  required
                  className="check-light"
                />
                <span>
                  <span className="block leading-[13px]">
                    Я ознакомился(-ась) с{" "}
                    <Link
                      href={form.privacyHref}
                      className="consent-link-light"
                    >
                      Политикой конфиденциальности
                    </Link>
                  </span>
                  <span className="-mt-px block leading-4">
                    и даю согласие на обработку персональных данных в
                    соответствии с её условиями.
                  </span>
                </span>
              </label>
              <label className="flex gap-[10px]">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="check-light"
                />
                <span className="leading-[13px]">
                  Я ознакомился(-ась) с{" "}
                  <Link href={form.termsHref} className="consent-link-light">
                    Условиями использования сайта
                  </Link>
                  .
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            className={`flex h-12 w-full items-center justify-center gap-[13px] rounded-[10px] bg-navy text-[16px] leading-6 font-medium text-white ${look.submit}`}
          >
            {form.submit}
            <ArrowIcon className={look.arrow} strokeWidth={look.arrowStroke} />
          </button>

          {notConnected && (
            <p
              role="status"
              className="mt-3 pb-1 text-[12px] leading-[18px] text-accent"
            >
              Отправка заявок ещё не подключена, данные никуда не ушли.
            </p>
          )}
        </form>
      </div>
    </div>,
    document.body,
  );
}
