import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, PinIcon } from "@/components/ui/icons";
import type { ObjectsData } from "@/content/home";

/*
 * «Актуальные объекты»: апартаменты с галочкой «На главной» в админке,
 * карточка берёт фото, цену и описание апартамента.
 */
export function Objects({ objects }: { objects: ObjectsData }) {
  return (
    <section id="objects" className="bg-paper pt-[30px] lg:pt-[99px]">
      <div className="shell">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-accent">{objects.eyebrow}</p>
            <h2 className="title-section mt-[11px] text-ink lg:mt-[15px]">
              {objects.title}
            </h2>
          </div>
          <Link
            href={objects.all.href}
            className="mb-[7px] hidden shrink-0 items-center gap-[14px] text-[13px] leading-5 font-semibold text-navy transition-colors hover:text-accent sm:inline-flex"
          >
            {objects.all.label}
            <ArrowIcon className="size-4" />
          </Link>
        </div>

        <ul className="mt-[37px] grid gap-[15px] md:grid-cols-2 md:gap-[10px] lg:mt-[36px] lg:grid-cols-3">
          {objects.items.map((item) => (
            <li
              key={item.href}
              className="overflow-hidden rounded-[16px] border border-[#e9eeed] bg-white"
            >
              <div className="relative aspect-[374/220] overflow-hidden md:aspect-[334/220] rounded-t-[15px] bg-line">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 334px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute top-[13px] left-[13px] flex h-[26px] items-center rounded-full bg-white/95 px-3 font-display text-[10px] leading-[14px] font-semibold text-navy">
                  {item.status}
                </span>
              </div>
              <div className="px-5 pt-[21px] pb-[29px] lg:pt-[22px] lg:pb-[31px]">
                <p className="flex items-center gap-[6px] text-[11px] leading-[16.5px] text-muted">
                  <PinIcon className="size-[14px] shrink-0" />
                  {item.location}
                </p>
                <h3 className="mt-3 font-display text-[20px] leading-6 font-semibold tracking-[-0.025em] text-ink lg:mt-[11px]">
                  {item.title}
                </h3>
                <p className="-mt-px text-[12px] leading-[18px] text-muted lg:-mt-[2px]">{item.meta}</p>
                {/*
                 * Линия над ценой в макете имеет свою ширину, 333 px от левого края текста.
                 * На компьютере она доходит до правого края карточки и обрезается им.
                 */}
                <p className="mt-[17px] w-[333px] border-t border-[#ebefef] pt-[15.5px] font-display text-[20px] leading-[27px] font-semibold text-ink">
                  {/* Цена в макете стоит на 3.67 px левее остального текста карточки */}
                  <span className="lg:-ml-[3.67px]">{item.price}</span>
                </p>
                <Link
                  href={item.href}
                  className="mt-[20.5px] inline-flex items-center gap-[12px] text-[13px] leading-[19.5px] font-semibold text-navy transition-colors hover:text-accent"
                >
                  {objects.more}
                  <ArrowIcon className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
