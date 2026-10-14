import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, PinIcon } from "@/components/ui/icons";

export type ApartmentCardData = {
  name: string;
  /* Ключ жилого комплекса из content/complexes.ts */
  complex: string;
  location: string;
  /*
   * Метка статуса. В макетах она разная: на компьютере жёлтая, на телефоне
   * сиреневая. ready: на компьютере голубая, как «Готово к заселению» на
   * странице апартамента.
   */
  status: { desktop: string; mobile: string; tone?: "building" | "ready" };
  /* Карточка есть только в макете для телефона: на компьютере её не показываем */
  onlyMobile?: boolean;
  text: string;
  kind: string;
  area: string;
  price: string;
  image: { src: string; alt: string };
  /* Фотография для телефона: в макете там другой кадр, высота у карточек разная */
  imageMobile: { src: string; width: number; height: number };
  /* Адрес страницы апартамента */
  href: string;
  more: string;
  /* Подпись кнопки. В макетах она тоже разная */
  button: { desktop: string; mobile: string };
};

type Props = {
  card: ApartmentCardData;
  /* Подписи колонок маленькой таблицы на компьютере: тип, площадь, стоимость */
  columns: string[];
  /* Первая карточка видна сразу при открытии страницы: её фотография грузится без задержки */
  eager?: boolean;
};

/*
 * Карточка апартамента в списке.
 * На компьютере: шапка с названием и статусом, под ней фотография слева,
 * справа описание, таблица в одну строку и кнопка.
 * На телефоне всё идёт столбиком: шапка, фотография, описание, два ряда значений, кнопка.
 */
export function ApartmentCard({ card, columns, eager = false }: Props) {
  const loading = eager ? "eager" : undefined;

  return (
    <article
      className={`overflow-hidden rounded-[14px] border border-[#ebefef] bg-white lg:rounded-[20px] lg:border-[#dfe5e5] ${
        card.onlyMobile ? "lg:hidden" : ""
      }`}
    >
      <header className="relative flex min-h-[75px] items-start justify-between pt-[15.5px] pr-[14px] pb-[15.5px] pl-[14px] lg:h-[96px] lg:items-center lg:pb-0 lg:border-b lg:border-[#dfe5e5] lg:pt-0 lg:pr-[31px] lg:pl-[30px]">
        <div>
          <p className="flex items-center gap-[6px] text-[10px] leading-[15px] text-muted lg:text-[11px] lg:leading-[16.5px]">
            <PinIcon className="ml-[0.75px] size-[13.5px] shrink-0" />
            {card.location}
          </p>
          <h2 className="mt-[5px] font-display text-[21px] leading-[24px] font-medium tracking-[-0.04em] text-ink lg:mt-[5.5px] lg:text-[26px] lg:leading-[28.6px]">
            {card.name}
          </h2>
        </div>
        {/* На телефоне метка стоит в углу отдельно, чтобы длинное название занимало всю ширину под ней */}
        <p className="absolute top-[14.5px] right-[14px] inline-flex h-[25px] items-center rounded-full bg-[#eef0ff] px-[9px] font-display text-[10px] leading-[14px] font-semibold whitespace-nowrap text-[#3a42b0] lg:hidden">
          {card.status.mobile}
        </p>
        <p
          className={`hidden h-[26px] items-center rounded-full font-display text-[10px] leading-[14px] font-semibold lg:inline-flex ${
            card.status.tone === "ready"
              ? "bg-[#edf7fc] px-[12.3px] text-accent"
              : "bg-[#fff5e0] px-[12px] text-[#8b5e00]"
          }`}
        >
          {card.status.desktop}
        </p>
      </header>

      <div className="lg:grid lg:h-[305px] lg:grid-cols-[348px_minmax(0,1fr)]">
        <div className="relative">
          <Image
            src={card.imageMobile.src}
            alt={card.image.alt}
            width={card.imageMobile.width}
            height={card.imageMobile.height}
            sizes="(min-width: 1024px) 1px, 100vw"
            loading={loading}
            className="block h-auto w-full lg:hidden"
          />
          <Image
            src={card.image.src}
            alt={card.image.alt}
            fill
            sizes="(min-width: 1024px) 348px, 1px"
            loading={loading}
            className="object-cover object-top max-lg:hidden"
          />
        </div>

        <div className="px-[11.5px] pt-[18px] pb-[17px] lg:px-0 lg:pt-[29.3px] lg:pb-0 lg:pl-[20px]">
          <p className="text-[13px] leading-[21px] text-muted lg:leading-[21.45px]">
            {card.text}
          </p>

          {/* Компьютер: таблица в одну строку */}
          <div className="mt-[22.25px] hidden w-[552px] overflow-hidden rounded-[12px] border border-[#dfe5e5] lg:block">
            <div
              aria-hidden
              className="grid h-[33px] grid-cols-[186px_92px_minmax(0,1fr)] items-center border-b border-[#dfe5e5] bg-[#f3f1ec] pl-4"
            >
              {columns.map((column) => (
                <p key={column} className="label-th text-muted">
                  {column}
                </p>
              ))}
            </div>
            <div className="grid h-[45px] grid-cols-[186px_92px_minmax(0,1fr)_auto] items-center pt-[3px] pr-[23.5px] pl-4">
              <p className="text-[13px] leading-[19.5px] font-semibold text-ink">
                {card.kind}
              </p>
              <p className="text-[13px] leading-[19.5px] text-ink">
                {card.area}
              </p>
              <p className="relative -top-[1.5px] font-display text-[14px] leading-[21px] font-semibold text-navy">
                {card.price}
              </p>
              <Link
                href={card.href}
                className="relative -top-px flex items-center gap-[7px] text-[12px] leading-[18px] font-semibold text-accent transition-colors hover:text-navy"
              >
                {card.more}
                <ArrowIcon className="size-3" />
              </Link>
            </div>
          </div>

          {/* Телефон: те же значения в два ряда */}
          <div className="mt-[14.5px] rounded-[12px] border border-[#ebefef] pt-[13px] pr-[12px] pb-[20.5px] pl-[13px] lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[13px] leading-[19.5px] font-semibold text-ink">
                {card.kind}
              </p>
              <p className="text-[13px] leading-[19.5px] text-muted">
                {card.area}
              </p>
            </div>
            <div className="mt-[17px] flex items-center justify-between gap-4">
              <p className="font-display text-[15px] leading-[22.5px] font-semibold text-navy">
                {card.price}
              </p>
              <Link
                href={card.href}
                className="relative -top-px mr-[11px] flex items-center gap-[7px] text-[12px] leading-[18px] font-semibold text-accent"
              >
                {card.more}
                <ArrowIcon className="relative top-px size-[11.5px]" />
              </Link>
            </div>
          </div>

          <Link
            href={card.href}
            className="mt-[14px] flex h-12 items-center justify-center gap-[13px] rounded-[10px] bg-navy px-2 text-[16px] leading-6 font-medium text-white transition-colors hover:bg-ink lg:mt-[22.5px] lg:inline-flex lg:px-[15px]"
          >
            <span className="lg:hidden">{card.button.mobile}</span>
            <span className="hidden lg:inline">{card.button.desktop}</span>
            <ArrowIcon
              className="mr-[1.5px] size-[16.5px]"
              strokeWidth={1.07}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
