"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { ApartmentCardData } from "./ApartmentCard";
import { CardList } from "./CardList";
import type { Complex } from "@/content/complexes";

type Props = {
  complexes: Complex[];
  columns: string[];
  cards: ApartmentCardData[];
  /* Отступ сверху, если в макете страницы он не такой, как в списке «для себя» */
  className?: string;
};

const ALL = "all";

/*
 * Список апартаментов по жилым комплексам. Наверху вкладки: «Все» и по одной
 * на каждый ЖК. При открытии страницы показаны все апартаменты, над каждой
 * группой подпись с названием ЖК. Выбор ЖК оставляет только его карточки.
 * Все карточки есть в разметке, скрипт только прячет лишние: без скриптов
 * видны все, поисковик видит все.
 */
export function ComplexList({
  complexes,
  columns,
  cards,
  className = "pt-[28px] lg:pt-[40.4px]",
}: Props) {
  const [active, setActive] = useState(ALL);
  const id = useId();
  const tabs = [{ key: ALL, name: "Все" }, ...complexes];

  // Стрелки влево и вправо переходят между вкладками по кругу
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
    <div className={className}>
      <div
        role="tablist"
        aria-label="Жилой комплекс"
        className="flex flex-wrap gap-x-[14px] gap-y-1 text-[13px] leading-[19.5px] lg:gap-x-[18px]"
      >
        {tabs.map((tab, index) => {
          const selected = tab.key === active;
          return (
            <button
              key={tab.key}
              id={`${id}-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`cursor-pointer border-b-2 pb-[3px] transition-colors ${
                selected
                  ? "border-navy font-semibold text-navy"
                  : "border-transparent text-muted hover:text-navy"
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        className="mt-[20px] lg:mt-[28px]"
      >
        {complexes.map((complex) => {
          const own = cards.filter((card) => card.complex === complex.key);
          const shown =
            active === ALL ? own.length > 0 : active === complex.key;
          if (!shown) return null;
          return (
            <section
              key={complex.key}
              aria-label={`ЖК ${complex.name}`}
              className="mt-[36px] first:mt-0 lg:mt-[48px]"
            >
              {/* Подпись группы: название ЖК и линия до правого края */}
              <div className="mb-[16px] flex items-center gap-[14px] lg:mb-[22px] lg:gap-[18px]">
                <p className="label-caps shrink-0 text-muted">Жилой комплекс</p>
                <h2 className="shrink-0 font-display text-[20px] leading-[25px] font-medium tracking-[-0.035em] text-navy lg:text-[24px] lg:leading-[27px]">
                  {complex.name}
                </h2>
                <span aria-hidden className="h-px flex-1 bg-[#dfe5e5]" />
              </div>
              {own.length > 0 ? (
                <CardList
                  cards={own}
                  columns={columns}
                  eagerFirst={complex.key === complexes[0].key}
                />
              ) : (
                <p className="rounded-[14px] border border-[#ebefef] bg-white px-[20px] py-[28px] text-center text-[14px] leading-[22px] text-muted lg:rounded-[20px] lg:border-[#dfe5e5]">
                  В этом жилом комплексе пока нет объектов.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
