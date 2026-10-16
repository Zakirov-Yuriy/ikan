"use client";

import { useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import { requestStatus } from "@/content/site";
import { sendRequest } from "@/lib/request";
import { Consents } from "./Consents";
import { useRequestSent } from "./RequestSent";
import { useSiteSettings } from "./SiteSettings";

type Props = {
  form: {
    eyebrow: string;
    title: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    submit: string;
  };
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed"; message: string };

export function CallbackForm({ form }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  /* Телефон из админки для подсказки «позвоните нам» после ошибки */
  const { phones } = useSiteSettings();
  /* После отправки открывается окно «Заявка отправлена» */
  const sent = useRequestSent();

  /* Заявка уходит на сервер сайта (lib/request.ts), дальше в бэкенд и админку */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    const element = event.currentTarget;
    setStatus({ kind: "sending" });
    const error = await sendRequest(element, "callback");
    if (error) {
      setStatus({ kind: "failed", message: error });
      return;
    }
    element.reset();
    setStatus({ kind: "sent" });
    sent.show();
  }

  const field =
    "h-[42px] w-full rounded-[8px] border border-navy-line bg-navy-field px-[11px] text-[12px] text-white placeholder:text-white/50 focus:border-sky focus:outline-none";

  return (
    <form
      id="callback"
      onSubmit={onSubmit}
      className="rounded-[16px] border border-white/10 bg-navy-card px-4 pt-[16px] pb-[33px] lg:px-[16px]"
    >
      <p className="eyebrow text-sky">{form.eyebrow}</p>
      <h2 className="mt-[2px] font-display text-[18px] leading-[25px] font-medium text-white">
        {form.title}
      </h2>

      <div className="mt-[10px] grid gap-[10px]">
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
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder={form.namePlaceholder}
          aria-label={form.namePlaceholder}
          className={field}
        />
        <input
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder={form.phonePlaceholder}
          aria-label="Телефон"
          className={field}
        />
      </div>

      {/* Три галочки: соглашение и политика, персональные данные, реклама (Саша, 16.10) */}
      <Consents look="dark" />

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="mt-[25px] flex h-12 w-full items-center justify-center gap-[14px] rounded-[10px] bg-sky text-[16px] font-medium text-navy transition-colors hover:bg-white disabled:opacity-70 disabled:hover:bg-sky"
      >
        {status.kind === "sending" ? requestStatus.sending : form.submit}
        <ArrowIcon className="size-4" />
      </button>

      {sent.dialog}
      {status.kind === "failed" && (
        <p role="alert" className="mt-3 text-[12px] leading-[18px] text-white/80">
          {requestStatus.failed} {status.message} {requestStatus.retry}{" "}
          {phones.map((item, i) => (
            <span key={item.href}>
              {i > 0 && ", "}
              <a href={item.href} className="whitespace-nowrap text-sky">
                {item.label}
              </a>
            </span>
          ))}
        </p>
      )}
    </form>
  );
}
