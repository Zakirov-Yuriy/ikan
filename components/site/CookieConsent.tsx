"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  isCookieConsentDecided,
  subscribeCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";
import type { cookieConsent as CookieTexts } from "@/content/site";
import { CookieSettings, type CookieChoice } from "./CookieSettings";

type Props = { texts: typeof CookieTexts };

/*
 * Плашка «Мы используем cookie» внизу экрана.
 * Показывается, пока человек не нажал «Принять все» или не сохранил выбор в
 * окне «Настроить». Выбор запоминается в браузере, и плашка больше не
 * появляется. Если браузер не даёт ничего запоминать (приватный режим),
 * плашка всё равно прячется до следующего захода.
 *
 * Пока плашка на экране, она сообщает свою высоту странице через
 * переменную --cookie-banner: закреплённые кнопки справа поднимаются над ней.
 */
export function CookieConsent({ texts }: Props) {
  /*
   * Пока страница собирается на сервере, выбор считается сделанным: плашка
   * появляется только в браузере, когда скрипт прочитал хранилище.
   */
  const decided = useSyncExternalStore(
    subscribeCookieConsent,
    isCookieConsentDecided,
    () => true,
  );
  const visible = !decided;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  // Высота плашки для закреплённых кнопок
  useLayoutEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const panel = panelRef.current;
    if (!panel) return;
    const update = () =>
      root.style.setProperty("--cookie-banner", `${panel.offsetHeight + 16}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--cookie-banner");
    };
  }, [visible]);

  const decide = (choice: CookieChoice) => {
    setSettingsOpen(false);
    writeCookieConsent(choice);
  };

  if (!visible) return null;

  return (
    <>
      <section
        ref={panelRef}
        aria-label={texts.title}
        className="fixed inset-x-[10px] bottom-[calc(10px+var(--bottom-bar,0px))] z-40 rounded-[12px] border border-[#ebefef] bg-white px-[15px] pt-[14px] pb-[3px] shadow-[0_16px_44px_rgba(8,34,52,0.2)] lg:inset-x-[44px] lg:bottom-[24px] lg:flex lg:h-[107px] lg:items-start lg:justify-between lg:gap-8 lg:border-[#dfe5e5] lg:pt-[18px] lg:pr-[30px] lg:pb-0 lg:pl-[20px]"
      >
        <div className="min-w-0">
          <p className="font-display text-[16px] leading-[22px] font-semibold text-ink">
            {texts.title}
          </p>
          <p className="mt-[10px] text-[10px] leading-[16px] text-muted lg:mt-[9px] lg:max-w-[600px] lg:text-[11px] lg:leading-[17px]">
            {texts.text}
          </p>
        </div>
        <div className="mt-[18px] flex flex-col lg:mt-[14.5px] lg:shrink-0 lg:flex-row lg:items-center lg:gap-[21px]">
          <button
            type="button"
            onClick={() => decide({ analytics: true, marketing: true })}
            className="flex h-[46px] items-center justify-center rounded-[10px] bg-navy text-[11px] font-medium text-white transition-colors hover:bg-ink lg:h-[40px] lg:w-[219px] lg:text-[12px]"
          >
            {texts.acceptAll}
          </button>
          <button
            ref={settingsButtonRef}
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="mt-[7px] flex h-[44px] items-center justify-center rounded-[10px] px-[20px] text-[12px] font-semibold text-navy transition-colors hover:text-accent lg:mt-0 lg:h-[40px]"
          >
            {texts.settings}
          </button>
        </div>
      </section>
      {settingsOpen && (
        <CookieSettings
          texts={texts.dialog}
          onClose={() => {
            setSettingsOpen(false);
            settingsButtonRef.current?.focus({ preventScroll: true });
          }}
          onSave={decide}
        />
      )}
    </>
  );
}
