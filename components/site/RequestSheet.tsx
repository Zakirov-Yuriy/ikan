"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import { requestStatus } from "@/content/site";
import { sendRequest } from "@/lib/request";
import { Modal, useDesktop } from "./Modal";
import { useSiteSettings } from "./SiteSettings";

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

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed"; message: string };

type Props = {
  /* open: окно показано, closing: окно закрывается */
  state: "open" | "closing";
  form: RequestFormTexts;
  /* Просьба закрыть: крестик, клавиша Escape, нажатие на тёмный фон */
  onClose: () => void;
  /* Окно закрылось, его можно убрать со страницы */
  onClosed: () => void;
};

/* Ссылки на документы в окне на компьютере: голубые, с тонкой линией снизу */
const skyLink =
  "border-b border-sky/45 pb-[2px] font-medium text-sky transition-colors hover:border-accent hover:text-accent";

/*
 * Окно «Оставить заявку». Общая основа (затемнение, появление, закрытие,
 * клавиши) в Modal. На компьютере оно появляется по центру экрана, на
 * телефоне выезжает снизу: размеры, поля и порядок согласий взяты из своих
 * макетов.
 */
export function RequestSheet({ state, form, onClose, onClosed }: Props) {
  const titleId = useId();
  const nameId = useId();
  const phoneId = useId();
  const interestId = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const desktop = useDesktop();
  /* Телефон из админки для подсказки «позвоните нам» после ошибки */
  const { phones } = useSiteSettings();

  /* Заявка уходит на сервер сайта (lib/request.ts), дальше в бэкенд и админку */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending" || status.kind === "sent") return;
    setStatus({ kind: "sending" });
    const error = await sendRequest(event.currentTarget, "popup");
    setStatus(error ? { kind: "failed", message: error } : { kind: "sent" });
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

  return (
    <Modal
      state={state}
      labelledBy={titleId}
      onClose={onClose}
      onClosed={onClosed}
      look={look}
    >
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
        {/* Поле-ловушка для роботов: людям не видно, роботы заполняют */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
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
                <Link href={form.privacyHref} className={`${skyLink} ml-[3px]`}>
                  Политикой конфиденциальности
                </Link>{" "}
                <span className="mt-px block max-w-[240px]">
                  и даю согласие на обработку персональных данных в соответствии
                  с её условиями.
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
                  <Link href={form.privacyHref} className="consent-link-light">
                    Политикой конфиденциальности
                  </Link>
                </span>
                <span className="-mt-px block leading-4">
                  и даю согласие на обработку персональных данных в соответствии
                  с её условиями.
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

        {/*
          После отправки кнопка не выключается через disabled: иначе фокус
          уходит из окна и Escape перестаёт его закрывать. Повторная отправка
          отсекается в onSubmit, вид кнопки приглушён.
        */}
        <button
          type="submit"
          aria-disabled={status.kind !== "idle" && status.kind !== "failed"}
          className={`flex h-12 w-full items-center justify-center gap-[13px] rounded-[10px] bg-navy text-[16px] leading-6 font-medium text-white aria-disabled:opacity-70 ${look.submit}`}
        >
          {status.kind === "sending" ? requestStatus.sending : form.submit}
          <ArrowIcon className={look.arrow} strokeWidth={look.arrowStroke} />
        </button>

        {status.kind === "sent" && (
          <p
            role="status"
            className="mt-3 pb-1 text-[13px] leading-[19px] text-accent"
          >
            {requestStatus.sent}
          </p>
        )}
        {status.kind === "failed" && (
          <p role="alert" className="mt-3 pb-1 text-[12px] leading-[18px] text-muted">
            {requestStatus.failed} {status.message} {requestStatus.retry}{" "}
            {phones.map((item, i) => (
              <span key={item.href}>
                {i > 0 && ", "}
                <a href={item.href} className="whitespace-nowrap text-accent">
                  {item.label}
                </a>
              </span>
            ))}
          </p>
        )}
      </form>
    </Modal>
  );
}
