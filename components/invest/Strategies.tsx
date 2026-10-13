import { RequestLink } from "@/components/site/RequestPopup";
import { ArrowIcon } from "@/components/ui/icons";
import type { Investments } from "@/content/investments";

type Props = {
  strategies: Investments["strategies"];
  requestHref: string;
};

/* «Три стратегии»: три белые карточки на тёмно-синем фоне */
export function Strategies({ strategies, requestHref }: Props) {
  return (
    <section className="bg-navy">
      <div className="shell px-[2px] pt-[55.5px] pb-[57px] lg:px-0 lg:pt-[99.5px] lg:pb-[100px]">
        <p className="eyebrow text-white">{strategies.eyebrow}</p>
        <h2 className="title-section mt-[14.5px] text-white max-lg:text-[30px] lg:mt-[14px]">
          {strategies.title}
        </h2>
        <ol className="mt-[39px] grid gap-[18px] lg:mt-[38px] lg:grid-cols-3">
          {strategies.items.map((item, index) => (
            <li
              key={item.name}
              className="rounded-[20px] border border-[#dfe5e5] bg-white px-[30px] pt-[34px] pb-[34.5px] lg:pb-[36px]"
            >
              <p className="font-display text-[12px] leading-[18px] font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-[20px] text-[13px] leading-[19.5px] text-muted lg:mt-[40px]">
                {strategies.yieldLabel}
              </p>
              <p className="mt-[28px] font-display text-[48px] leading-[54px] font-medium tracking-[-0.05em] text-ink">
                {item.yield}
              </p>
              <h3 className="mt-[28.5px] font-display text-[21px] leading-[28px] font-medium tracking-[-0.02em] text-ink">
                {item.name}
              </h3>
              <p className="mt-[11.5px] text-[13px] leading-[1.65] text-muted">
                {item.text}
              </p>
              {/* Открывает окно заявки */}
              <RequestLink
                href={requestHref}
                className="mt-[28.5px] flex w-fit items-center gap-[12px] text-[13px] leading-[19.5px] font-semibold text-navy transition-colors hover:text-accent lg:mt-[28px]"
              >
                {strategies.link}
                <ArrowIcon className="size-4" />
              </RequestLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
