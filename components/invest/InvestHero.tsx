import { RequestLink } from "@/components/site/RequestPopup";
import { ArrowIcon, PhoneIcon } from "@/components/ui/icons";
import type { Investments } from "@/content/investments";
import { RateCard } from "./RateCard";

type Props = {
  hero: Investments["hero"];
  rate: Investments["rate"];
  requestHref: string;
  phoneHref: string;
};

/*
 * Верх страницы инвестиций: заголовок, две кнопки и тёмная карточка
 * с доходностью. На компьютере карточка стоит справа, на телефоне под кнопками.
 */
export function InvestHero({ hero, rate, requestHref, phoneHref }: Props) {
  return (
    <section className="bg-white">
      {/* В макете для телефона поля этой страницы на 2 px шире обычных */}
      <div className="shell px-[2px] pt-[45px] pb-[46.5px] lg:flex lg:items-start lg:justify-between lg:gap-10 lg:px-0 lg:pt-[68px] lg:pb-[69px]">
        <div className="min-w-0 lg:max-w-[540px] lg:pt-[18px]">
          <p className="eyebrow text-accent">{hero.eyebrow}</p>
          <h1 className="title-promo mt-[15px] text-navy lg:mt-[14px]">
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-[18.5px] text-[16px] leading-[27.2px] text-muted lg:mt-[19px]">
            {hero.lead}
          </p>
          <div className="mt-[28.5px] flex flex-col gap-2 sm:flex-row lg:gap-3">
            {/* Открывает окно заявки */}
            <RequestLink
              href={requestHref}
              className="flex h-[50px] items-center justify-center gap-[12px] rounded-[10px] bg-navy px-6 text-[13px] font-medium text-white transition-colors hover:bg-ink lg:h-12 lg:gap-[13px] lg:text-[16px]"
            >
              {hero.request}
              <ArrowIcon className="size-4" />
            </RequestLink>
            <a
              href={phoneHref}
              className="flex h-[50px] items-center justify-center gap-[12px] rounded-[10px] border border-[#647480] px-[22px] text-[13px] font-medium text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white lg:h-12 lg:gap-[11px] lg:border-navy lg:text-[16px]"
            >
              <PhoneIcon className="size-4" />
              {hero.call}
            </a>
          </div>
        </div>
        <RateCard rate={rate} />
      </div>
    </section>
  );
}
