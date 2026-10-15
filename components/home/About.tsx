import { ChartIcon, KeyIcon, ShieldIcon } from "@/components/ui/icons";
import type { AboutData, FeatureIcon } from "@/content/home";

const icons: Record<FeatureIcon, typeof ChartIcon> = {
  chart: ChartIcon,
  shield: ShieldIcon,
  key: KeyIcon,
};

/* «О компании» и преимущества. Тексты и значки из админки */
export function About({ about }: { about: AboutData }) {
  return (
    /* id="about": сюда ведёт «О компании» в шапке, меню телефона и подвале */
    <section id="about" className="bg-white pt-[44px] lg:pt-[77px]">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-[552px_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="eyebrow text-accent">{about.eyebrow}</p>
            <h2 className="title-section mt-[14px] max-w-[470px] text-ink lg:mt-[15px]">
              {about.title}
            </h2>
          </div>
          <p className="mt-4 max-w-[340px] text-[13px] leading-[22px] text-muted lg:max-w-none lg:mt-0 lg:pb-[5px] lg:text-[13px] lg:leading-[21px]">
            {about.text}
          </p>
        </div>

        <p className="label-caps mt-[39px] text-muted lg:mt-[48px]">
          {about.featuresLabel}
        </p>
        <ul className="mt-[18px] grid grid-cols-2 border-t border-[#e3e5e1] lg:mt-[18px] lg:grid-cols-4">
          {about.features.map((feature, index) => {
            const Icon = icons[feature.icon];
            return (
              <li
                key={index}
                className="relative flex min-h-[115px] items-start border-b border-[#e3e5e1] py-5 pr-4 pl-3 max-lg:odd:border-r max-lg:odd:pl-0 lg:min-h-[125px] lg:items-center lg:border-r lg:border-b-0 lg:pt-7 lg:pr-6 lg:pb-6 lg:pl-6 lg:first:pl-0 lg:last:border-r-0"
              >
                <span className="absolute right-[14px] bottom-[9px] text-[9.5px] leading-3 text-faint lg:top-[20px] lg:right-[15px] lg:bottom-auto">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex items-start gap-[15px]">
                  <Icon className="mt-px h-[21px] w-[21px] shrink-0 text-accent" />
                  {/* Ширина 165 px из макета: по ней подписи сами делятся на строки так же, как там */}
                  <span className="text-[14px] leading-[19.6px] font-bold text-ink lg:mt-px lg:w-[165px]">
                    {feature.label}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
