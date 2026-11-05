"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxPhoto } from "./Lightbox";

type Props = {
  photos: LightboxPhoto[];
  /* Подпись кнопки для программ чтения с экрана, например «Открыть фото» */
  openLabel: string;
};

/*
 * Сетка всех фотографий объекта на странице «Все N фото». Нажатие открывает
 * фото в просмотре поверх страницы с этого места, дальше листание (Саша,
 * 05.11; раньше открывался файл в новой вкладке).
 */
export function PhotoGrid({ photos, openLabel }: Props) {
  const [opened, setOpened] = useState<number | null>(null);

  return (
    <>
      <ul className="shell mt-[24px] grid gap-[10px] md:grid-cols-2 lg:mt-[32px] lg:grid-cols-3">
        {photos.map((item, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => setOpened(index)}
              aria-label={`${openLabel}: ${item.alt || `фото ${index + 1}`}`}
              className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[12px] bg-line focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading={index < 3 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute right-[12px] bottom-[12px] flex h-[26px] items-center rounded-full bg-white/95 px-3 font-display text-[10px] leading-[14px] font-semibold text-navy">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(photos.length).padStart(2, "0")}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {opened !== null && (
        <Lightbox
          photos={photos}
          index={opened}
          onClose={() => setOpened(null)}
        />
      )}
    </>
  );
}
