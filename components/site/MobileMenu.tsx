"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/icons";
import { AnchorLink } from "./AnchorLink";
import { useRequestPopup } from "./RequestPopup";

type Props = {
  /* Пункт без адреса (href) показывается надписью и не нажимается */
  nav: { label: string; href?: string }[];
  phone: { label: string; href: string };
};

/*
 * Меню для телефона. По нажатию на три полоски под шапкой раскрывается
 * список разделов, а внизу экрана появляются две кнопки: «Позвонить» и
 * «Оставить заявку». Вторая открывает окно заявки, которое выезжает снизу.
 */
export function MobileMenu({ nav, phone }: Props) {
  const [open, setOpen] = useState(false);
  const request = useRequestPopup();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Закрытие меню по клавише Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  // Меню закрывается, открывается окно заявки. После него фокус вернётся на кнопку меню
  const openSheet = () => {
    setOpen(false);
    request.open(toggleRef.current);
  };

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center text-ink"
      >
        {open ? (
          // В макете открытого меню крестик стоит на 8 px правее и на 1 px ниже трёх полосок
          <CloseIcon
            className="size-[28px] translate-x-2 translate-y-px text-[#17191f]"
            strokeWidth={0.96}
          />
        ) : (
          <MenuIcon />
        )}
      </button>

      {open && (
        <>
          <div
            id={panelId}
            className="absolute inset-x-0 top-full bg-white pt-[10px] pr-[25px] pb-[21px] pl-[14px]"
          >
            <nav aria-label="Основное меню">
              <ul>
                {nav.map((item) => (
                  <li key={item.label} className="border-b border-[#c1cacf] last:border-b-0">
                    {item.href ? (
                      // AnchorLink: «О компании» прокручивает к блоку на главной
                      <AnchorLink
                        href={item.href}
                        onClick={close}
                        className="flex h-[77px] items-center text-[20px] leading-[30px] text-ink"
                      >
                        {item.label}
                      </AnchorLink>
                    ) : (
                      // Пункт без адреса виден, но не нажимается, меню остаётся открытым
                      <span className="flex h-[77px] items-center text-[20px] leading-[30px] text-ink">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Две кнопки у нижнего края экрана */}
          <div className="fixed inset-x-0 bottom-0 flex gap-2 bg-white px-3 pt-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(16,24,40,0.08)]">
            <a
              href={phone.href}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#79d48a] text-[13px] leading-5 font-semibold text-[#29ba44] active:bg-[#29ba44]/10"
            >
              <PhoneIcon className="size-4" />
              <span className="pt-[2px]">Позвонить</span>
            </a>
            <button
              type="button"
              onClick={openSheet}
              className="flex h-12 flex-1 items-center justify-center rounded-[10px] bg-sky pt-[2px] text-[13px] leading-5 font-semibold text-navy active:bg-sky-soft"
            >
              Оставить заявку
            </button>
          </div>
        </>
      )}
    </div>
  );
}
