"use client";

import { useId, useState } from "react";
import type { cookieConsent } from "@/content/site";
import { Modal, useDesktop } from "./Modal";

export type CookieChoice = { analytics: boolean; marketing: boolean };

type Props = {
  texts: (typeof cookieConsent)["dialog"];
  /* Окно закрыто без выбора: плашка остаётся */
  onClose: () => void;
  /* Выбор сделан: плашка прячется */
  onSave: (choice: CookieChoice) => void;
};

/*
 * Окно «Настройки cookie»: три вида cookie с переключателями. Необходимые
 * выключить нельзя. Макета у этого окна не было, оно собрано по образцу
 * окна заявки: те же размеры, поля, кнопка закрытия и появление.
 */
export function CookieSettings({ texts, onClose, onSave }: Props) {
  const titleId = useId();
  const desktop = useDesktop();
  const [state, setState] = useState<"open" | "closing">("open");
  const [choice, setChoice] = useState<CookieChoice>({
    analytics: false,
    marketing: false,
  });

  const close = () => setState("closing");

  const look = desktop
    ? {
        wrap: "items-center p-4",
        panel:
          "modal-panel max-h-full max-w-[460px] rounded-[20px] px-10 pt-[39px] pb-[32px]",
        close: "top-[18px] right-[18px] size-[38px]",
        title: "mt-[22px] text-[30px] leading-[33px]",
        lead: "mt-5 leading-[21.45px]",
        list: "mt-[22px]",
        buttons: "mt-[24px]",
      }
    : {
        wrap: "items-end",
        panel:
          "sheet-panel max-h-[calc(100dvh-16px)] rounded-t-[20px] px-5 pt-[26.5px] pb-[calc(16px+env(safe-area-inset-bottom))] sm:max-w-[480px]",
        close: "top-3 right-3 size-11",
        title: "mt-[17px] text-[26px] leading-[28.6px]",
        lead: "mt-4 leading-[21px]",
        list: "mt-[18px]",
        buttons: "mt-[20px]",
      };

  return (
    <Modal
      state={state}
      labelledBy={titleId}
      onClose={close}
      onClosed={onClose}
      look={look}
    >
      <p className="eyebrow text-accent">{texts.eyebrow}</p>
      <h2
        id={titleId}
        className={`font-display font-medium tracking-[-0.04em] text-ink ${look.title}`}
      >
        {texts.title}
      </h2>
      <p className={`text-[13px] text-muted ${look.lead}`}>{texts.lead}</p>

      <ul
        className={`divide-y divide-[#ebefef] border-y border-[#ebefef] ${look.list}`}
      >
        {texts.categories.map((category) => {
          const on = category.required
            ? true
            : choice[category.key as keyof CookieChoice];
          const labelId = `${titleId}-${category.key}`;
          return (
            <li
              key={category.key}
              className="flex items-center justify-between gap-5 py-[13px]"
            >
              <div className="min-w-0">
                <p
                  id={labelId}
                  className="text-[14px] leading-[20px] font-medium text-ink"
                >
                  {category.label}
                </p>
                <p className="mt-[2px] text-[11px] leading-[16px] text-muted">
                  {category.text}
                </p>
              </div>
              {/* Переключатель. У необходимых cookie он всегда включён и не нажимается */}
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-labelledby={labelId}
                disabled={category.required}
                onClick={() =>
                  setChoice((current) => ({
                    ...current,
                    [category.key]:
                      !current[category.key as keyof CookieChoice],
                  }))
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-default ${
                  on ? "bg-navy disabled:bg-navy/40" : "bg-[#dfe5e5]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute top-[2px] left-[2px] size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(8,34,52,0.3)] transition-transform ${
                    on ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div className={`grid gap-[8px] ${look.buttons}`}>
        <button
          type="button"
          onClick={() => onSave(choice)}
          className="flex h-12 w-full items-center justify-center rounded-[10px] bg-navy text-[16px] leading-6 font-medium text-white transition-colors hover:bg-ink"
        >
          {texts.save}
        </button>
        <button
          type="button"
          onClick={() => onSave({ analytics: true, marketing: true })}
          className="flex h-12 w-full items-center justify-center rounded-[10px] border border-navy text-[16px] leading-6 font-medium text-navy transition-colors hover:bg-navy hover:text-white"
        >
          {texts.acceptAll}
        </button>
      </div>
    </Modal>
  );
}
