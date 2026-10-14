"use client";

import { useEffect, useState } from "react";
import { PhoneIcon, TelegramIcon } from "@/components/ui/icons";
import { copyPageUrl } from "@/lib/share";
import { ShareNotice, useShareNotice } from "./ShareNotice";

type Props = {
  phoneHref: string;
  callbackHref: string;
  /*
   * В макетах кнопки нарисованы по-разному:
   * home: главная, 50 px от правого края, зелёный #11BB17;
   * list: список квартир для аренды, 24 px от края, зелёный #29BA44.
   */
  variant?: "home" | "list";
};

const looks = {
  home: {
    box: "right-[calc(50px+var(--scrollbar-gap,0px))]",
    call: "bg-call",
    shadow: "shadow-[0_10px_24px_-8px_rgba(8,34,52,0.35)]",
  },
  list: {
    box: "right-[calc(24px+var(--scrollbar-gap,0px))]",
    call: "bg-[#29ba44]",
    shadow: "shadow-[0_6px_20px_rgba(8,34,52,0.27)]",
  },
};

/*
 * Две кнопки, закреплённые в правом нижнем углу окна на компьютере.
 * Когда на экране появляется подвал с формой, кнопки прячутся,
 * чтобы не перекрывать саму форму.
 * Пока открыто окно заявки, полоса прокрутки пропадает, и кнопки отодвигаются
 * на её ширину (--scrollbar-gap), чтобы остаться на месте.
 */
export function FloatingActions({ phoneHref, callbackHref, variant = "home" }: Props) {
  const look = looks[variant];
  const [hidden, setHidden] = useState(false);
  const share = useShareNotice();

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-6 z-30 hidden flex-col gap-2 transition-[opacity,bottom] duration-200 lg:flex lg:bottom-[calc(24px+var(--cookie-banner,0px))] ${look.box} ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* «Ссылка скопирована» над кнопками */}
      <ShareNotice text={share.notice} className="absolute right-0 bottom-full mb-2 text-right" />
      {/*
        «Поделиться», с 14.10, первая сверху: копирует адрес страницы (без якоря) и показывает
        «Ссылка скопирована». Вид по присланной кнопке: голубая, белый текст
        Onest Medium 12, самолётик 14 px.
      */}
      <button
        type="button"
        tabIndex={hidden ? -1 : undefined}
        onClick={async () => share.show(await copyPageUrl())}
        className={`flex h-[46px] w-[150px] items-center justify-center gap-[10px] rounded-[10px] bg-sky text-[12px] font-medium text-white transition-colors hover:bg-sky-soft ${look.shadow}`}
      >
        <TelegramIcon className="size-[14px]" />
        Поделиться
      </button>
      <a
        href={phoneHref}
        tabIndex={hidden ? -1 : undefined}
        className={`flex h-[46px] w-[150px] items-center justify-center gap-[9px] rounded-[10px] text-[13.5px] font-medium text-white transition-[filter] hover:brightness-110 ${look.call} ${look.shadow}`}
      >
        <PhoneIcon className="size-4" />
        Позвонить
      </a>
      {/* Прокручивает страницу к форме «Заказать обратный звонок» в подвале */}
      <a
        href={callbackHref}
        tabIndex={hidden ? -1 : undefined}
        className={`flex h-[46px] w-[150px] items-center justify-center rounded-[10px] bg-sky text-[13.5px] font-medium text-navy transition-colors hover:bg-white ${look.shadow}`}
      >
        Оставить заявку
      </a>
    </div>
  );
}
