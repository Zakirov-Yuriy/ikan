"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/ui/icons";

type Props = {
  form: {
    eyebrow: string;
    title: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    submit: string;
    termsHref: string;
    privacyHref: string;
  };
};

export function CallbackForm({ form }: Props) {
  const [notConnected, setNotConnected] = useState(false);

  /*
   * Отправка заявок пока не подключена: решается, куда они должны приходить.
   * Форма проверяет поля и честно сообщает, что данные никуда не ушли.
   */
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotConnected(true);
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

      <div className="mt-[9px] grid gap-[10px] text-[11px] leading-[17.05px] text-white/66">
        <label className="flex gap-[10px]">
          <input type="checkbox" name="terms" required className="check" />
          <span className="pt-px">
            Я ознакомился(-ась) с{" "}
            {/* В макете линия под этой ссылкой на 7 px длиннее текста */}
            <Link href={form.termsHref} className="consent-link pr-[7px]">
              Условиями использования сайта
            </Link>
          </span>
        </label>
        <label className="flex gap-[10px]">
          <input type="checkbox" name="privacy" required className="check" />
          <span className="pt-px">
            Я ознакомился(-ась) с{" "}
            {/* В макете эта ссылка стоит на 2 px правее первой */}
            <Link href={form.privacyHref} className="consent-link ml-[2px]">
              Политикой конфиденциальности
            </Link>{" "}
            <span className="block max-w-[240px]">
              и даю согласие на обработку персональных данных в соответствии с её условиями.
            </span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="mt-[25px] flex h-12 w-full items-center justify-center gap-[14px] rounded-[10px] bg-sky text-[16px] font-medium text-navy transition-colors hover:bg-white"
      >
        {form.submit}
        <ArrowIcon className="size-4" />
      </button>

      {notConnected && (
        <p role="status" className="mt-3 text-[12px] leading-[18px] text-sky">
          Отправка заявок ещё не подключена, данные никуда не ушли.
        </p>
      )}
    </form>
  );
}
