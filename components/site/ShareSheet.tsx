"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { TelegramIcon } from "@/components/ui/icons";
import { copyPageUrl, shareLinks, type ShareResult } from "@/lib/share";
import { Modal } from "./Modal";

type Props = {
  /* Окно закрыто: ссылка скопирована или человек передумал */
  onClose: (result: ShareResult | null) => void;
};

/* Иконки из подвала: такие же, как присланные для соцсетей */
const icons: Record<string, string> = {
  telegram: "/images/social/telegram.svg",
  whatsapp: "/images/social/whatsapp.svg",
  vk: "/images/social/vk.svg",
};

/*
 * Своё окно «Поделиться» для телефона, когда браузер не даёт системного
 * (сайт по http в домашней сети, старые браузеры). Выезжает снизу, как окно
 * заявки: Telegram, WhatsApp, ВКонтакте, почта и «Скопировать ссылку».
 */
export function ShareSheet({ onClose }: Props) {
  const titleId = useId();
  const [state, setState] = useState<"open" | "closing">("open");
  const [result, setResult] = useState<ShareResult | null>(null);
  const links = shareLinks();

  const close = (value: ShareResult | null = null) => {
    setResult(value);
    setState("closing");
  };

  const row =
    "flex h-[56px] w-full items-center gap-[14px] rounded-[12px] px-[12px] text-left text-[16px] leading-6 font-medium text-ink transition-colors hover:bg-[#f3f1ec] active:bg-[#f3f1ec]";

  return (
    <Modal
      state={state}
      labelledBy={titleId}
      onClose={() => close()}
      onClosed={() => onClose(result)}
      look={{
        wrap: "items-end lg:items-center lg:p-4",
        panel:
          "sheet-panel max-h-[calc(100dvh-16px)] rounded-t-[20px] px-3 pt-[26.5px] pb-[calc(12px+env(safe-area-inset-bottom))] sm:max-w-[480px] lg:modal-panel lg:max-w-[420px] lg:rounded-[20px] lg:px-6 lg:pb-6",
        close: "top-3 right-3 size-11",
      }}
    >
      <h2
        id={titleId}
        className="px-[12px] font-display text-[26px] leading-[28.6px] font-medium tracking-[-0.04em] text-ink"
      >
        Поделиться
      </h2>
      <p className="mt-[10px] px-[12px] text-[13px] leading-[21px] text-muted">
        Отправить ссылку на эту страницу
      </p>
      <ul className="mt-[14px]">
        {links.map((link) => (
          <li key={link.key}>
            <a
              href={link.href}
              target={link.key === "mail" ? undefined : "_blank"}
              rel="noopener"
              onClick={() => close("shared")}
              className={row}
            >
              {icons[link.key] ? (
                <Image
                  src={icons[link.key]}
                  alt=""
                  width={28}
                  height={28}
                  unoptimized
                  className="size-7"
                />
              ) : (
                <span className="grid size-7 place-items-center rounded-full bg-navy text-white">
                  <MailGlyph />
                </span>
              )}
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={async () => close(await copyPageUrl())}
            className={row}
          >
            <span className="grid size-7 place-items-center rounded-full bg-sky text-white">
              <TelegramIcon className="size-4" />
            </span>
            Скопировать ссылку
          </button>
        </li>
      </ul>
    </Modal>
  );
}

/* Конверт для строки «Почта», в стиле иконок сайта */
function MailGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="2" />
      <path d="M2.5 4.5 8 8.75l5.5-4.25" />
    </svg>
  );
}
