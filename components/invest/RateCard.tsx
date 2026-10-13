import type { Investments } from "@/content/investments";

/* Тёмная карточка «Ожидаемая доходность»: крупная ставка, пояснение и два показателя */
export function RateCard({ rate }: { rate: Investments["rate"] }) {
  return (
    <div className="mt-[29px] rounded-[20px] border border-[#3e5361] bg-navy px-[20px] pt-[18.5px] pb-[19.5px] text-white lg:mt-0 lg:w-[420px] lg:shrink-0 lg:px-[35px] lg:pt-[34px] lg:pb-[35.5px]">
      <p className="eyebrow tracking-[0.12em] text-sky">{rate.eyebrow}</p>
      <p className="mt-[13px] flex items-baseline gap-[11px] lg:mt-[14px] lg:gap-[13px]">
        <span className="font-display text-[53.5px] leading-[60px] font-medium tracking-[-0.06em] lg:text-[79px] lg:leading-[84px]">
          {rate.value}
        </span>
        <span className="relative -top-[11px] font-display text-[15px] leading-[20px] font-medium text-white/70 lg:-top-[7px]">
          {rate.unit}
        </span>
      </p>
      <p className="mt-[12px] text-[12px] leading-[21.6px] text-[#909ba3] lg:mt-[14px] lg:leading-[1.65]">
        {rate.text}
      </p>
      <dl className="mt-[19px] grid grid-cols-2 gap-x-[12px] border-t border-[#354a59] pt-[18.5px] lg:mt-[21px] lg:pt-[19px]">
        {rate.facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-[10px] leading-[15px] tracking-[0.06em] text-[#7a8892] uppercase">
              {fact.label}
            </dt>
            <dd className="mt-[4px] font-display text-[18px] leading-[24px] font-medium">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
