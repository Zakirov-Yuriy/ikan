import { ArrowIcon } from "@/components/ui/icons";
import type { Investments } from "@/content/investments";

/*
 * «Как это работает»: пять шагов. На компьютере они стоят в ряд со стрелками
 * между ними, на телефоне идут столбиком, каждый под своей линией.
 */
export function Process({ process }: { process: Investments["process"] }) {
  return (
    <section className="bg-white">
      <div className="shell px-[2px] pt-[96px] pb-[94.5px] lg:px-0 lg:pt-[95px] lg:pb-[128.5px]">
        <p className="eyebrow text-accent">{process.eyebrow}</p>
        <h2 className="title-section mt-[13px] text-ink max-lg:text-[30px] lg:mt-[13.5px]">
          {process.title}
        </h2>
        <ol className="mt-[38px] border-[#e4e8e5] max-lg:border-b lg:grid lg:grid-cols-5 lg:border-t lg:border-[#d3d9d5] lg:pt-[22px]">
          {process.steps.map((step, index) => (
            <li
              key={step}
              className="flex min-h-[88px] items-center border-t border-[#e4e8e5] pb-[2px] lg:relative lg:block lg:min-h-0 lg:border-0 lg:pb-0"
            >
              <span className="relative -top-[1.5px] w-[52px] shrink-0 font-display text-[12px] leading-[18px] font-medium tracking-[0.04em] text-accent lg:static lg:block lg:w-auto">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="block max-w-[150px] text-[13px] leading-[19px] font-bold text-ink lg:mt-[19px]">
                {step}
              </span>
              {index < process.steps.length - 1 && (
                <ArrowIcon className="absolute top-px right-[21px] size-4 text-[#9aa7a2] max-lg:hidden" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
