import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import type { DirectionsData } from "@/content/home";

/* «Наши направления»: карточки из админки, каждая ведёт на выбранную страницу */
export function Directions({ directions }: { directions: DirectionsData }) {
  return (
    <section className="bg-white pt-[55px] pb-[34px] lg:pt-[55px] lg:pb-[90px]">
      <div className="shell">
        <h2 className="label-caps text-muted">
          {directions.label}
        </h2>
        <ul className="mt-[17px] grid gap-2 sm:grid-cols-2 lg:mt-[18px] lg:grid-cols-4 lg:gap-[13px]">
          {directions.items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                /*
                  На компьютере карточка под курсором «выдвигается вперёд»:
                  увеличивается, приподнимается и получает тень. Увеличение
                  фотографии и белый кружок при наведении остались.
                  Тёмного фона у карточки нет (Анна, 16.10): он проступал
                  тонкой тёмной линией по скруглённым углам, а при наведении
                  по всему краю. Текст читается за счёт затемнения поверх фото.
                */
                className="group relative flex h-[121px] items-center overflow-hidden rounded-[20px] text-white transition-[translate,scale,box-shadow] duration-300 ease-out motion-reduce:transition-none lg:h-[324px] lg:items-end lg:hover:z-10 lg:hover:-translate-y-[6px] lg:hover:scale-[1.03] lg:hover:shadow-[0_18px_40px_rgba(8,34,52,0.28)]"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 246px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {/* Затемнение, чтобы белый текст читался поверх фотографии */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-r from-navy/85 via-navy/55 to-navy/30 lg:bg-linear-to-b lg:from-navy/0 lg:from-25% lg:via-navy/55 lg:via-60% lg:to-navy/95"
                />
                <span className="relative flex w-full items-center justify-between gap-4 px-4 lg:block lg:pr-[18px] lg:pb-5 lg:pl-[22px]">
                  <span className="block">
                    <span className="hidden text-[10px] leading-4 text-sky lg:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="block font-display text-[17px] leading-6 font-medium tracking-[-0.01em] lg:mt-[9px] lg:text-[21.5px] lg:leading-7">
                      {item.title}
                    </span>
                    <span className="mt-[2px] block text-[11.5px] leading-[17px] text-white/75 lg:mt-[10px] lg:min-h-[36px] lg:text-[12px] lg:leading-[18px]">
                      {item.text}
                    </span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/45 transition-colors group-hover:bg-white group-hover:text-navy lg:mt-[23px]">
                    <ArrowIcon className="size-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
