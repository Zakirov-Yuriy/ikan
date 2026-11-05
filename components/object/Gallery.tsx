"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

type Photo = { src: string; alt: string };

type Props = {
  photos: Photo[];
  mobilePhoto: Photo;
  all: { label: string; href: string };
  /* Все фотографии объекта без повторов: по ним листает просмотр */
  allPhotos: Photo[];
  /*
   * Высота двух маленьких фотографий на компьютере. В макете ресторана они
   * 176 px, в макете апартамента 185 px.
   */
  smallHeight?: 176 | 185;
};

const allLink =
  "absolute flex h-[39px] items-center rounded-[8px] bg-white px-[13.5px] text-[12px] leading-[18px] font-semibold text-ink transition-colors hover:text-accent";

const openLabel = "Открыть фото";

/*
 * Фотографии объекта. Нажатие на любую фотографию открывает её в просмотре
 * поверх страницы (Lightbox, Саша 05.11), с этого фото, листать можно все
 * фотографии объекта. Кнопка «Все N фото» по-прежнему ведёт на страницу со
 * всеми фотографиями. Поверх каждого фото лежит прозрачная кнопка, кнопка
 * «Все N фото» остаётся сверху.
 *
 * На телефоне в макете одна фотография во всю ширину.
 * На компьютере две большие сверху в общей рамке и две маленькие снизу,
 * кадрирование как в макете: левая большая прижата к левому краю, правая к правому.
 */
export function Gallery({
  photos,
  mobilePhoto,
  all,
  allPhotos,
  smallHeight = 176,
}: Props) {
  const [first, second, third, fourth] = photos;
  /* Какое фото открыто в просмотре; null, когда просмотр закрыт */
  const [opened, setOpened] = useState<number | null>(null);
  const list = allPhotos.length > 0 ? allPhotos : photos;
  /* Четыре места галереи заполняются по кругу, слот i показывает фото i % list.length */
  const open = (slot: number) => setOpened(slot % list.length);
  const overlay =
    "absolute inset-0 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-accent";
  const tall = smallHeight === 185;
  const small = `relative overflow-hidden rounded-[12px] bg-line ${
    tall ? "aspect-[336/185]" : "aspect-[336/176]"
  }`;
  /* Высокие фотографии обрезаются снизу, кнопка на них стоит на той же высоте от верха */
  const smallPhoto = tall ? "object-cover object-top" : "object-cover";
  const allSpot = tall
    ? "top-[131px] right-[15px]"
    : "right-[15px] bottom-[6px]";

  return (
    <div>
      {/* Телефон и планшет */}
      <div className="relative aspect-[374/310] overflow-hidden rounded-[12px] bg-line lg:hidden">
        <Image
          src={mobilePhoto.src}
          alt={mobilePhoto.alt}
          fill
          loading="eager"
          sizes="(min-width: 1024px) 1px, 100vw"
          className="object-cover object-left"
        />
        <button
          type="button"
          aria-label={`${openLabel} 1`}
          onClick={() => open(0)}
          className={overlay}
        />
        <Link
          href={all.href}
          className={`${allLink} right-[8px] bottom-[13px]`}
        >
          {all.label}
        </Link>
      </div>

      {/* Компьютер */}
      <div className="hidden lg:block">
        <div className="grid h-[430px] grid-cols-[390fr_283fr] gap-2 overflow-hidden rounded-[12px] bg-[#f5f5f5]">
          <div className="relative">
            <Image
              src={first.src}
              alt={first.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 390px, 1px"
              className="object-cover object-left"
            />
            <button
              type="button"
              aria-label={`${openLabel} 1`}
              onClick={() => open(0)}
              className={overlay}
            />
          </div>
          <div className="relative">
            <Image
              src={second.src}
              alt={second.alt}
              fill
              sizes="(min-width: 1024px) 283px, 1px"
              className="object-cover object-right"
            />
            <button
              type="button"
              aria-label={`${openLabel} 2`}
              onClick={() => open(1)}
              className={overlay}
            />
          </div>
        </div>

        <div className="mt-[10px] grid grid-cols-2 gap-[9px]">
          <div className={small}>
            <Image
              src={third.src}
              alt={third.alt}
              fill
              sizes="(min-width: 1024px) 336px, 1px"
              className={smallPhoto}
            />
            <button
              type="button"
              aria-label={`${openLabel} 3`}
              onClick={() => open(2)}
              className={overlay}
            />
          </div>
          <div className={small}>
            <Image
              src={fourth.src}
              alt={fourth.alt}
              fill
              sizes="(min-width: 1024px) 336px, 1px"
              className={smallPhoto}
            />
            <button
              type="button"
              aria-label={`${openLabel} 4`}
              onClick={() => open(3)}
              className={overlay}
            />
            <Link href={all.href} className={`${allLink} ${allSpot}`}>
              {all.label}
            </Link>
          </div>
        </div>
      </div>

      {opened !== null && (
        <Lightbox
          photos={list}
          index={opened}
          onClose={() => setOpened(null)}
        />
      )}
    </div>
  );
}
