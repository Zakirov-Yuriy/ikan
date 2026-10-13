"use client";

import { type KeyboardEvent, type ReactNode, useId, useState } from "react";

type Props = {
  /* Название набора вкладок для программ чтения с экрана */
  label: string;
  tabs: { key: string; label: string; content: ReactNode }[];
};

/*
 * Вкладки над списком новостроек: «Все», «Строится», «Готово».
 * На компьютере это надписи с подчёркиванием у выбранной, на телефоне
 * переключатель из трёх равных кнопок, выбранная на белой плашке.
 * Списки всех вкладок уже есть на странице, нажатие показывает нужный.
 */
export function StatusTabs({ label, tabs }: Props) {
  const id = useId();
  const [active, setActive] = useState(tabs[0].key);

  /* Стрелки влево и вправо переходят между вкладками, как принято у вкладок */
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    setActive(next.key);
    document.getElementById(`${id}-tab-${next.key}`)?.focus();
  }

  return (
    <div className="pt-[27px] lg:pt-[42px]">
      <div
        role="tablist"
        aria-label={label}
        className="grid grid-cols-3 gap-[5px] rounded-[12px] border border-[#e6eae9] bg-[#f3f1ec] p-[4px] lg:flex lg:gap-[27.4px] lg:rounded-none lg:border-0 lg:border-b lg:border-[#dfe5e5] lg:bg-transparent lg:p-0"
      >
        {tabs.map((tab, index) => {
          const selected = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`${id}-tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`h-[44px] cursor-pointer rounded-[10px] text-[13px] leading-[19.5px] transition-colors lg:h-auto lg:rounded-none lg:border-b-2 lg:px-[4.5px] lg:pt-[10px] lg:pb-[13.5px] lg:text-[14px] lg:leading-[21px] ${
                selected
                  ? "bg-white font-semibold text-navy shadow-[0_2px_6px_rgba(16,43,59,0.08)] lg:border-navy lg:bg-transparent lg:shadow-none"
                  : "text-muted hover:text-navy lg:border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${id}-panel-${tab.key}`}
          aria-labelledby={`${id}-tab-${tab.key}`}
          hidden={tab.key !== active}
          className="mt-[19.5px] lg:mt-[34.3px]"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
