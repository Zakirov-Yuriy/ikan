"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon, CloseIcon } from "@/components/ui/icons";

export type LightboxPhoto = { src: string; alt: string };

type Props = {
  photos: LightboxPhoto[];
  /* С какой фотографии открыть */
  index: number;
  onClose: () => void;
};

/*
 * Просмотр фотографий поверх страницы (Саша, 05.11). Раньше нажатие на фото
 * открывало файл в новой вкладке, и чтобы увидеть следующее, вкладку
 * приходилось закрывать. Теперь фото открывается на тёмном фоне, листается
 * стрелками по краям, клавишами влево и вправо и свайпом на телефоне,
 * закрывается крестиком, клавишей Escape или нажатием на фон.
 * Пока просмотр открыт, страница под ним не прокручивается.
 */
export function Lightbox({ photos, index, onClose }: Props) {
  const [current, setCurrent] = useState(index);
  const total = photos.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (step: number) => {
      setCurrent((value) => (value + step + total) % total);
    },
    [total],
  );

  useEffect(() => {
    rootRef.current?.focus();
    const body = document.body;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const onTouchStart = (event: TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (start === null || total < 2) return;
    const delta = (event.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(delta) < 40) return;
    go(delta < 0 ? 1 : -1);
  };

  const photo = photos[current];
  if (!photo) return null;
  const counter = `${current + 1} / ${total}`;
  /* Соседние фото грузятся заранее, чтобы листание было без задержки */
  const neighbours =
    total > 1
      ? [photos[(current + 1) % total], photos[(current - 1 + total) % total]]
      : [];
  const arrow =
    "absolute top-1/2 z-10 grid size-[44px] -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-white lg:size-[52px]";

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Фотография ${counter}${photo.alt ? `: ${photo.alt}` : ""}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-[rgba(3,20,29,0.94)] outline-none select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Верхняя строка: счётчик и крестик */}
      <div className="flex h-[60px] shrink-0 items-center justify-between px-[16px] lg:px-[28px]">
        <span className="font-display text-[13px] leading-[18px] font-semibold text-white/90 tabular-nums">
          {counter}
        </span>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="grid size-[40px] place-items-center rounded-full bg-white/95 text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-white"
        >
          <CloseIcon className="size-[14px]" strokeWidth={1.8} />
        </button>
      </div>

      {/* Фотография. Нажатие мимо неё закрывает просмотр */}
      <div
        className="relative min-h-0 flex-1"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="pointer-events-none absolute inset-x-[16px] inset-y-0 lg:inset-x-[92px]">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
        </div>
        <div aria-hidden className="absolute size-px overflow-hidden opacity-0">
          {neighbours.map((item, i) => (
            <Image key={`${i}-${item.src}`} src={item.src} alt="" fill sizes="100vw" />
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={() => go(-1)}
              className={`${arrow} left-[12px] lg:left-[28px]`}
            >
              <ArrowIcon className="size-[18px] rotate-180" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={() => go(1)}
              className={`${arrow} right-[12px] lg:right-[28px]`}
            >
              <ArrowIcon className="size-[18px]" strokeWidth={1.6} />
            </button>
          </>
        )}
      </div>

      {/* Подпись фотографии */}
      <div className="flex h-[56px] shrink-0 items-center justify-center px-[60px] text-center text-[12px] leading-[16px] text-white/75 lg:text-[13px]">
        {photo.alt}
      </div>
    </div>,
    document.body,
  );
}
