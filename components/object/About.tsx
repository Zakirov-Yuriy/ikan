import { ArrowIcon } from "@/components/ui/icons";

type Props = {
  about: {
    eyebrow: string;
    title: string;
    text: string;
    featuresTitle: string;
    /* Подпись у характеристики может отсутствовать: тогда над значением только номер */
    features: { label?: string; value: string }[];
    data: {
      eyebrow: string;
      /* Надпись над карточкой на телефоне, если в макете она там другая */
      eyebrowMobile?: string;
      title: string;
      items: { label: string; value: string }[];
      link: string;
    };
  };
  requestHref: string;
  /*
   * Вид блока на телефоне, на компьютере он один.
   * restaurant: крупный заголовок, карточка «Данные» во всю ширину экрана с кнопкой в рамке;
   * apartment: заголовок как на главной, карточка в общей колонке со ссылкой.
   */
  variant?: "restaurant" | "apartment";
};

const looks = {
  restaurant: {
    section: "pt-[62.85px] lg:pb-[127px]",
    /* В макете для телефона этот заголовок того же размера, что на компьютере */
    title: "mt-[14px] max-lg:text-[2.195625rem] max-lg:leading-[38.9px]",
    text: "mt-[1.2px] leading-[28.5px]",
    featuresTitle: "mt-[34px] lg:mt-[49.5px]",
    features: "mt-[40.9px] auto-rows-[90.5px] grid-rows-[111.5px]",
    feature: "pt-[16px] lg:pt-[15.5px]",
    value: "mt-[9.5px] leading-[19.6px]",
    card: "-mx-[0.875rem] mt-[0.75px] pt-[29.75px] pr-[29px] pl-[30px] md:-mx-6",
    dataTitle: "min-h-[49px]",
    dataItem: "pt-[15px]",
    link: "mt-[0.75px] flex h-[52px] items-center justify-center gap-[11px] rounded-[10px] border border-navy pb-[2px] text-[17px] leading-[26px] lg:pb-0",
  },
  apartment: {
    section: "pt-[64px] lg:pb-[126px]",
    /* На телефоне заголовок в макете мельче, чем такой же на главной */
    title: "mt-[13px] max-lg:text-[29.5px] max-lg:tracking-[-0.05em]",
    text: "mt-[0.3px] leading-[28.8px] lg:leading-[28.5px]",
    featuresTitle: "mt-[34px] lg:mt-[48.5px]",
    features: "mt-[20px] auto-rows-[78px]",
    feature: "pt-[14px] lg:pt-[16.5px]",
    /* Значение может занять две строки, шаг строк 21 px */
    value: "mt-[8px] leading-[21px]",
    card: "mt-[24px] px-[18px] pt-[21px] pb-[24px]",
    dataTitle: "min-h-[49.5px]",
    dataItem: "pt-[14.5px]",
    link: "mt-[9px] inline-flex items-center gap-[11.5px] text-[13px] leading-[19.5px]",
  },
};

/*
 * Описание объекта: текст и список характеристик, рядом карточка с данными.
 * На компьютере характеристики идут в три колонки, карточка стоит справа.
 * На телефоне характеристики идут одним столбцом, карточка под ними.
 */
export function About({ about, requestHref, variant = "restaurant" }: Props) {
  const look = looks[variant];
  const { data } = about;

  return (
    <section
      className={`shell lg:grid lg:grid-cols-[630px_314px] lg:justify-between lg:pt-[101.5px] ${look.section}`}
    >
      <div>
        <p className="eyebrow text-accent">{about.eyebrow}</p>
        <h2 className={`title-section text-ink lg:mt-[15px] ${look.title}`}>
          {about.title}
        </h2>
        <p className={`text-[16px] text-muted lg:mt-[1.5px] ${look.text}`}>
          {about.text}
        </p>

        <h3
          className={`font-display text-[16px] leading-6 font-medium tracking-[-0.01em] text-ink ${look.featuresTitle}`}
        >
          {about.featuresTitle}
        </h3>
        {/*
          Сетка характеристик. На компьютере первая строка в макете выше остальных
          на 20 px, высоты строк заданы так же.
        */}
        <dl
          className={`grid sm:grid-cols-3 lg:mt-[21px] lg:auto-rows-auto lg:grid-rows-[111px_91px] ${look.features}`}
        >
          {about.features.map((feature, index) => (
            <div
              key={index}
              className={`border-t border-[#dfe5e5] ${look.feature}`}
            >
              <dt className="text-[11px] leading-[16.5px] text-muted">
                {feature.label ? (
                  <>
                    {String(index + 1).padStart(2, "0")} — {feature.label}
                  </>
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </dt>
              <dd className={`text-[14px] font-bold text-ink ${look.value}`}>
                {feature.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <aside
        className={`self-start rounded-[16px] bg-white lg:mx-0 lg:mt-px lg:min-h-[398px] lg:px-[30px] lg:pt-[29.5px] lg:pb-[21.5px] ${look.card}`}
      >
        <p className="eyebrow text-accent">
          {data.eyebrowMobile ? (
            <>
              <span className="lg:hidden">{data.eyebrowMobile}</span>
              <span className="hidden lg:inline">{data.eyebrow}</span>
            </>
          ) : (
            data.eyebrow
          )}
        </p>
        {/* Под заголовком в одну строку в макете остаётся место, как под двухстрочным */}
        <h3
          className={`mt-[14px] border-b border-[#d8ddd9] pb-[4px] font-display text-[22px] leading-[28px] font-medium text-ink lg:mt-[15px] lg:min-h-[48.5px] lg:pb-[3.5px] ${look.dataTitle}`}
        >
          <span className="block max-w-[200px]">{data.title}</span>
        </h3>
        <dl>
          {data.items.map((item, index) => (
            <div
              key={index}
              className={`border-b border-[#d8ddd9] pb-[13px] last:border-b-0 last:pb-[12.5px] lg:pt-[15.5px] lg:pb-[12.5px] ${look.dataItem}`}
            >
              <dt className="text-[11px] leading-[16.5px] text-muted">
                {item.label}
              </dt>
              <dd className="mt-[6.5px] text-[16px] leading-6 font-medium text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
        {/* Прокручивает к форме «Заказать обратный звонок» в подвале. В макете ресторана для телефона это кнопка в рамке, в остальных ссылка со стрелкой */}
        <a
          href={requestHref}
          className={`font-semibold text-navy transition-colors hover:text-accent lg:mt-[9px] lg:inline-flex lg:h-auto lg:justify-start lg:gap-[11.5px] lg:rounded-none lg:border-0 lg:text-[13px] lg:leading-[19.5px] ${look.link}`}
        >
          {data.link}
          <ArrowIcon className="size-4" />
        </a>
      </aside>
    </section>
  );
}
