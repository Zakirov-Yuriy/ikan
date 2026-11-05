"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/ui/icons";

export type LightboxPhoto = { src: string; alt: string };

type Props = {
  photos: LightboxPhoto[];
  /* С какой фотографии открыть */
  index: number;
  onClose: () => void;
};

/* Сдвиг, после которого отпущенное фото считается перелистнутым */
const SWIPE = 40;

/*
 * Просмотр фотографий поверх страницы (Саша, 05.11). Раньше нажатие на фото
 * открывало файл в новой вкладке, и чтобы увидеть следующее, вкладку
 * приходилось закрывать. Теперь фото открывается на тёмном фоне и листается
 * перетаскиванием: пальцем на телефоне, мышкой на компьютере, а также
 * клавишами влево и вправо. Листается как лента: тянешь влево, справа
 * въезжает следующее фото, тянешь вправо, слева въезжает предыдущее (Саша:
 * без стрелок, «по классике»). Внизу точки по числу фото, текущее выделено,
 * нажатие на точку открывает её фото. Закрывается крестиком, клавишей
 * Escape или нажатием на фон. Пока просмотр открыт, страница под ним не
 * прокручивается.
 *
 * Как устроена лента: в ряд стоят три кадра, предыдущее, текущее и следующее
 * фото, лента сдвинута на один кадр влево, так что виден средний. При
 * перетаскивании лента едет за пальцем, при отпускании доезжает до соседнего
 * кадра с анимацией, после чего текущим становится соседнее фото, и лента
 * без анимации возвращается в среднее положение. Снаружи это выглядит как
 * непрерывное листание.
 */
export function Lightbox({ photos, index, onClose }: Props) {
  const total = photos.length;
  const [current, setCurrent] = useState(index);
  /* Какой кадр ленты показан: 0 предыдущий, 1 текущий, 2 следующий */
  const [slot, setSlot] = useState(1);
  /* true, пока лента возвращается в середину без анимации */
  const [instant, setInstant] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragStart = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const prev = (current - 1 + total) % total;
  const next = (current + 1) % total;

  /* Поехать к соседнему кадру; пока лента в движении, повторные команды ждут */
  const go = useCallback(
    (step: 1 | -1) => {
      if (total < 2) return;
      setSlot((value) => (value === 1 ? (step === 1 ? 2 : 0) : value));
    },
    [total],
  );

  /* Лента доехала до соседнего кадра: он становится текущим, лента в середину */
  const onTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || slot === 1) return;
    setCurrent(slot === 2 ? next : prev);
    setInstant(true);
    setSlot(1);
  };

  useEffect(() => {
    if (!instant) return;
    const frame = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(frame);
  }, [instant]);

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

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (slot !== 1) return;
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    setDragX(total > 1 ? event.clientX - dragStart.current : 0);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    dragStart.current = null;
    setDragX(0);
    if (start === null) return;
    const delta = event.clientX - start;
    if (Math.abs(delta) >= SWIPE) {
      go(delta < 0 ? 1 : -1);
    } else if (Math.abs(delta) < 5 && event.target === event.currentTarget) {
      /* Нажатие мимо фото без сдвига закрывает просмотр */
      onClose();
    }
  };

  const photo = photos[current];
  if (!photo) return null;
  const counter = `${current + 1} / ${total}`;
  const strip = total > 1 ? [photos[prev], photo, photos[next]] : [photo];
  const shift = total > 1 ? slot : 0;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Фотография ${counter}${photo.alt ? `: ${photo.alt}` : ""}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-[rgba(3,20,29,0.94)] outline-none select-none"
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
          className="grid size-[40px] place-items-center text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
        >
          <CloseIcon className="size-[20px]" strokeWidth={1.6} />
        </button>
      </div>

      {/* Лента из трёх кадров: тянется пальцем или мышкой, нажатие мимо фото закрывает просмотр */}
      <div
        className="relative min-h-0 flex-1 cursor-grab overflow-hidden touch-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="pointer-events-none absolute inset-0 flex"
          style={{
            transform: `translateX(calc(${-100 * shift}% + ${dragX}px))`,
            transition:
              dragX || instant ? "none" : "transform 260ms ease-out",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {strip.map((item, i) => (
            <div key={`${i}-${item.src}`} className="relative h-full w-full shrink-0">
              <div className="absolute inset-x-[16px] inset-y-0 lg:inset-x-[92px]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority={i === shift}
                  draggable={false}
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Точки по числу фото и подпись */}
      <div className="flex shrink-0 flex-col items-center gap-[10px] px-[16px] pt-[8px] pb-[18px] lg:pb-[22px]">
        {total > 1 && (
          <div
            role="tablist"
            aria-label="Фотографии"
            className="flex max-w-full flex-wrap justify-center gap-[7px]"
          >
            {photos.map((item, i) => (
              <button
                key={`${i}-${item.src}`}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Фото ${i + 1}`}
                onClick={() => {
                  if (slot === 1) setCurrent(i);
                }}
                className="grid size-[20px] place-items-center"
              >
                <span
                  className={`block size-[8px] rounded-full transition-colors ${
                    i === current ? "bg-white" : "bg-white/35 hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
        <div className="min-h-[16px] text-center text-[12px] leading-[16px] text-white/75 lg:text-[13px]">
          {photo.alt}
        </div>
      </div>
    </div>,
    document.body,
  );
}
