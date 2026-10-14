"use client";

import { PhoneIcon, TelegramIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { sharePage } from "@/lib/share";
import { ShareNotice, useShareNotice } from "./ShareNotice";

/*
 * Полоса с тремя кнопками, закреплённая у нижнего края экрана на телефоне и
 * планшете, на всех страницах: «Позвонить», «Оставить заявку» (ведёт к форме
 * в подвале) и «Поделиться» (квадрат с самолётиком: системное окно
 * «Поделиться», а где его нет, копирование адреса). Размеры и цвета с макета
 * 14.10. На компьютере вместо неё закреплённые кнопки справа (FloatingActions).
 *
 * Высота полосы записана в globals.css переменной --bottom-bar: на неё
 * отступает низ страницы и поднимается плашка cookie. Открытое меню телефона
 * показывает свою полосу поверх этой.
 */
export function MobileBar() {
  const share = useShareNotice();
  return (
    <div
      data-bottom-bar
      className="fixed inset-x-0 bottom-0 z-30 flex gap-[12px] bg-white pt-[10px] pr-[14px] pb-[calc(10px+env(safe-area-inset-bottom))] pl-[10px] shadow-[0_-6px_18px_rgba(8,34,52,0.11)] lg:hidden"
    >
      {/* «Ссылка скопирована» над полосой, если системного окна «Поделиться» нет */}
      <ShareNotice
        text={share.notice}
        className="absolute right-[14px] bottom-full mb-[10px] text-right"
      />
      <a
        href={site.phone.href}
        className="flex h-[46px] flex-1 items-center justify-center gap-[8px] rounded-[10px] bg-[#29ba44] text-[12px] leading-5 font-semibold text-white active:brightness-95"
      >
        <PhoneIcon className="size-[17px]" />
        <span>Позвонить</span>
      </a>
      {/* Прокручивает страницу к форме «Заказать обратный звонок» в подвале */}
      <a
        href={site.callbackHref}
        className="flex h-[46px] flex-1 items-center justify-center rounded-[10px] bg-sky pt-px text-[12px] leading-5 font-semibold text-white active:bg-sky-soft"
      >
        Оставить заявку
      </a>
      <button
        type="button"
        aria-label="Поделиться страницей"
        onClick={async () => share.show(await sharePage("share"))}
        className="grid size-[46px] shrink-0 place-items-center rounded-[10px] bg-sky text-white active:bg-sky-soft"
      >
        <TelegramIcon className="size-6" />
      </button>
    </div>
  );
}
