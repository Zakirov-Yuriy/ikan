import { ArrowIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";

type Props = {
  summary: {
    status: string;
    location: string;
    title: string;
    text: string;
    /* Короткий текст для телефона, если в макете он там другой */
    textMobile?: string;
    stats: { value: string; label: string }[];
    priceLabel: string;
    price: string;
    request: string;
    call: string;
  };
  requestHref: string;
  phoneHref: string;
  /*
   * Вид карточки. На компьютере он почти одинаковый, на телефоне макеты разные:
   * restaurant: белая, во всю ширину экрана, три цифры в ряд, без цены и кнопок;
   * apartment: в рамке, цифры столбиком, ниже цена и кнопка заявки.
   */
  variant?: "restaurant" | "apartment";
};

const looks = {
  restaurant: {
    card: "-mx-[0.875rem] self-start pt-[28px] pr-[27px] pl-[28px] md:-mx-6 lg:mx-0 lg:border lg:px-[28px] lg:pt-[29px] lg:pb-[20px]",
    location: "mt-[15.5px] lg:mt-[14.5px]",
    title: "mt-[10px] lg:mt-[11px]",
    text: "mt-[13px]",
    stats:
      "mt-[23.4px] grid grid-cols-[36.74%_36.74%_minmax(0,1fr)] border-y pt-[18.5px] pb-[17px] lg:mt-[22.5px] lg:grid-cols-3 lg:pt-[19.5px] lg:pb-[17.4px]",
    stat: "",
    statLabel: "mt-[6px] lg:mt-[4px]",
    /* Цена и кнопки: только на компьютере */
    bottom: "hidden lg:block",
    priceLabel: "mt-[22px]",
    price: "mt-[8.5px]",
    request: "mt-[27.1px]",
    call: "flex",
  },
  apartment: {
    /* Рамка и линии на телефоне в макете светлее, чем на компьютере */
    card: "mt-[12px] border px-[15.5px] pt-[20px] pb-[18.3px] max-lg:border-[#ebefef] lg:mt-0 lg:px-[28px] lg:pt-[29px] lg:pb-[20px]",
    location: "mt-[16px] lg:mt-[14.5px]",
    title: "mt-[9px] max-lg:text-[30px] max-lg:tracking-[-0.04em] lg:mt-[11px]",
    text: "mt-[15px] lg:mt-[13px]",
    stats:
      "mt-[17px] border-y pt-[9px] pb-[9.5px] max-lg:border-[#ebefef] lg:mt-[22.5px] lg:grid lg:grid-cols-3 lg:pt-[19.5px] lg:pb-[17.4px]",
    /* Третья строка в макете стоит на 1 px ниже первых двух */
    stat: "border-[#ebefef] pt-[4.5px] pb-[3.5px] max-lg:not-first:border-t max-lg:last:pt-[5.5px] max-lg:last:pb-[2.2px] lg:p-0",
    statLabel: "mt-[5.5px] lg:mt-[4px]",
    bottom: "",
    priceLabel: "mt-[17.5px] lg:mt-[22px]",
    /* Цена цифрами: Manrope 600, на компьютере 30 px, на телефоне 27 px */
    price:
      "mt-[8.8px] text-[27px] font-semibold tracking-normal lg:mt-[8.5px] lg:text-[30px]",
    request: "mt-[29px] lg:mt-[29.3px]",
    /* «Позвонить»: только на компьютере */
    call: "hidden lg:flex",
  },
};

/* Карточка объекта: статус, название, описание, три цифры, цена и кнопки */
export function SummaryCard({
  summary,
  requestHref,
  phoneHref,
  variant = "restaurant",
}: Props) {
  const look = looks[variant];
  /* На странице апартамента это главный заголовок страницы, на странице ресторана он стоит выше */
  const Title = variant === "apartment" ? "h1" : "h2";

  return (
    <aside className={`rounded-[16px] border-[#dfe5e5] bg-white ${look.card}`}>
      <p className="inline-flex h-[26px] items-center rounded-full bg-[#edf7fc] px-[12.3px] font-display text-[10px] leading-[14px] font-semibold text-accent">
        {summary.status}
      </p>
      <p
        className={`flex items-center gap-[6px] text-[11px] leading-[16.5px] text-muted ${look.location}`}
      >
        <PinIcon className="-ml-[0.5px] size-[15px] shrink-0" />
        {summary.location}
      </p>
      <Title className={`title-card text-ink ${look.title}`}>
        {summary.title}
      </Title>
      <p className={`text-[13px] leading-[21.45px] text-muted ${look.text}`}>
        {summary.textMobile ? (
          <>
            <span className="lg:hidden">{summary.textMobile}</span>
            <span className="hidden lg:inline">{summary.text}</span>
          </>
        ) : (
          summary.text
        )}
      </p>

      <dl className={`border-[#dfe5e5] ${look.stats}`}>
        {summary.stats.map((stat) => (
          <div key={stat.label} className={`flex flex-col ${look.stat}`}>
            <dt
              className={`order-2 text-[9px] leading-[13.5px] text-muted ${look.statLabel}`}
            >
              {stat.label}
            </dt>
            <dd className="order-1 text-[14px] leading-[19.6px] font-bold text-ink">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className={look.bottom}>
        <p
          className={`text-[11px] leading-[16.5px] text-muted ${look.priceLabel}`}
        >
          {summary.priceLabel}
        </p>
        <p className={`title-price text-ink ${look.price}`}>{summary.price}</p>

        {/* Прокручивает страницу к форме «Заказать обратный звонок» в подвале */}
        <a
          href={requestHref}
          className={`flex h-12 items-center justify-center gap-[13px] rounded-[10px] bg-navy text-[16px] leading-6 font-medium text-white transition-colors hover:bg-ink ${look.request}`}
        >
          {summary.request}
          <ArrowIcon className="mr-[1.5px] size-[16.5px]" strokeWidth={1.07} />
        </a>
        <a
          href={phoneHref}
          className={`mt-2 h-12 items-center justify-center gap-[12.5px] rounded-[10px] border border-navy text-[16px] leading-6 font-medium text-navy transition-colors hover:bg-navy hover:text-white ${look.call}`}
        >
          <PhoneIcon className="size-[14.5px]" />
          {summary.call}
        </a>
      </div>
    </aside>
  );
}
