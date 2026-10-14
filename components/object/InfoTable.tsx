type Props = {
  title: string;
  columns: string[];
  row: string[];
  /* Значения для телефона, если в макете они там записаны иначе */
  rowMobile?: string[];
  /* Кнопка заявки внутри карточки на телефоне. Если текста нет, кнопки нет */
  request?: string;
  requestHref: string;
  note: string;
  /*
   * Вид блока. На компьютере у страниц разные места колонок,
   * на телефоне разные отступы и высота строки примечания.
   */
  variant?: "restaurant" | "apartment";
};

/* Стили четырёх значений, по порядку колонок, как в макете для компьютера */
const cell = [
  "text-[13px] leading-[19.5px] font-semibold text-ink",
  "text-[13px] leading-[19.5px] text-ink",
  "relative -top-px font-display text-[14px] leading-[21px] font-semibold text-navy",
  "text-[12px] leading-[18px] text-muted",
];

const looks = {
  restaurant: {
    section: "pt-[34.5px] lg:pt-[95px]",
    /* В макете подписи колонок стоят на пару пикселей иначе, чем значения под ними */
    headGrid: "grid-cols-[275px_154px_189px_minmax(0,1fr)]",
    rowGrid: "grid-cols-[273px_156px_187px_minmax(0,1fr)]",
    card: "mt-[16.5px] border-[#e6ebea] pt-[14.5px] pb-[13.5px]",
    cellMobile: [
      "text-[13px] leading-[19.5px] font-semibold text-ink",
      "text-[13px] leading-[19.5px] text-ink",
      "font-display text-[15px] leading-[22.5px] font-semibold text-navy",
      "text-[12px] leading-[18px] text-muted",
    ],
    secondRow: "mt-[7px]",
    note: "mt-[14.25px] leading-[22.75px] lg:mt-[24px] lg:leading-[20px]",
  },
  apartment: {
    section: "pt-[33px] lg:pt-[116px]",
    headGrid: "grid-cols-[276px_137px_206px_minmax(0,1fr)]",
    rowGrid: "grid-cols-[274px_138px_207px_minmax(0,1fr)]",
    card: "mt-[18.5px] border-[#e9eded] pt-[13.5px] pb-[16px]",
    cellMobile: [
      "text-[13px] leading-[19.5px] font-semibold text-ink",
      "text-[13px] leading-[19.5px] text-muted",
      "font-display text-[15px] leading-[22.5px] font-semibold text-navy",
      "relative -top-px text-[12px] leading-[18px] text-muted",
    ],
    secondRow: "mt-[8px]",
    note: "mt-[15px] leading-[20px] lg:mt-[24px]",
  },
};

/*
 * Сведения об объекте.
 * На компьютере это таблица: шапка с подписями колонок и одна строка под ней.
 * На телефоне в макете это карточка: значения в два ряда, в макете ресторана
 * ещё и кнопка заявки.
 */
export function InfoTable({
  title,
  columns,
  row,
  rowMobile = row,
  request,
  requestHref,
  note,
  variant = "restaurant",
}: Props) {
  const look = looks[variant];

  /* Значение с подписью колонки, которую видят только программы чтения с экрана */
  const mobileValue = (index: number) => (
    <p className={look.cellMobile[index]}>
      <span className="sr-only">{columns[index]}: </span>
      {rowMobile[index]}
    </p>
  );

  return (
    <section className={`shell ${look.section}`}>
      <h2 className="title-block text-ink">{title}</h2>

      {/* Компьютер */}
      <div className="mt-[24px] hidden overflow-hidden rounded-[12px] border border-[#dfe5e5] lg:block">
        <div
          aria-hidden
          className={`grid h-[33px] items-center border-b border-[#dfe5e5] bg-[#f3f1ec] pl-[16px] ${look.headGrid}`}
        >
          {columns.map((column) => (
            <p key={column} className="label-th text-muted">
              {column}
            </p>
          ))}
        </div>
        <dl className={`grid h-[66px] items-center pl-[16px] ${look.rowGrid}`}>
          {row.map((value, index) => (
            <div key={columns[index]}>
              <dt className="sr-only">{columns[index]}</dt>
              <dd className={cell[index]}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Телефон и планшет */}
      <div
        className={`rounded-[12px] border px-[13.5px] lg:hidden ${look.card}`}
      >
        <div className="flex items-end justify-between gap-4">
          {mobileValue(0)}
          {mobileValue(1)}
        </div>
        <div
          className={`flex items-center justify-between gap-4 ${look.secondRow}`}
        >
          {mobileValue(2)}
          {mobileValue(3)}
        </div>
        {request && (
          // Прокручивает страницу к форме «Заказать обратный звонок» в подвале
          <a
            href={requestHref}
            className="mt-[7.5px] flex h-11 items-center justify-center rounded-[10px] bg-navy pb-[2px] text-[12px] leading-[18px] font-medium text-white transition-colors hover:bg-ink"
          >
            {request}
          </a>
        )}
      </div>

      <p className={`text-[13px] text-muted ${look.note}`}>{note}</p>
    </section>
  );
}
