import { RequestLink } from "@/components/site/RequestPopup";
import { ArrowIcon } from "@/components/ui/icons";
import type { HeroData } from "@/content/home";

/* Первый экран. Тексты из админки, раздел «Главная сайта» */
export function Hero({ hero }: { hero: HeroData }) {
  return (
    <section className="bg-paper">
      <div className="shell flex flex-col pt-[35px] pb-[31px] lg:flex-row lg:items-end lg:justify-between lg:pt-[75px] lg:pb-[67px]">
        <div className="lg:max-w-[664px]">
          <p className="eyebrow text-accent">{hero.eyebrow}</p>
          <h1 className="title-hero mt-[14px] text-navy">
            {hero.title} <span className="block text-accent">{hero.titleAccent}</span>
          </h1>
          <p className="mt-[18px] max-w-[590px] text-[14px] leading-[22px] text-muted lg:mt-[27px] lg:text-[15px] lg:leading-[25.5px]">
            {hero.lead}
          </p>
          <div className="mt-[23px] flex flex-col gap-2 sm:flex-row sm:gap-[11px] lg:mt-[29px]">
            <a
              href={hero.primary.href}
              className="flex h-[50px] items-center justify-center gap-[13px] rounded-[10px] bg-navy px-6 text-[14px] leading-6 font-medium text-white transition-colors hover:bg-ink lg:h-12 lg:text-[16px]"
            >
              {hero.primary.label}
              <ArrowIcon className="size-4" />
            </a>
            {/* Открывает окно заявки */}
            <RequestLink
              href={hero.secondary.href}
              className="flex h-[50px] items-center justify-center rounded-[10px] border border-navy px-[23px] text-[14px] leading-6 font-medium text-navy transition-colors hover:bg-navy hover:text-white lg:h-12 lg:text-[16px]"
            >
              {hero.secondary.label}
            </RequestLink>
          </div>
        </div>

        <div className="mt-[27px] border-t-2 border-sky lg:mt-0 lg:w-[280px] lg:shrink-0">
          <p className="flex h-[51px] items-center pb-[9px] text-[11px] text-muted lg:h-[55px] lg:pb-0">
            {hero.sideLabel}
          </p>
          <ol>
            {hero.sideItems.map((item, index) => (
              <li
                key={item}
                className="flex h-11 items-center border-t border-line text-[13px] font-medium text-navy lg:h-12"
              >
                <span className="w-[46px] shrink-0 text-[10px] font-normal text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
