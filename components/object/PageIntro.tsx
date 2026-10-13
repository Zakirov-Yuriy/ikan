import { Breadcrumbs, type Crumb } from "@/components/site/Breadcrumbs";

type Props = {
  crumbs: Crumb[];
  title: string;
  lead: string;
  /*
   * Вид блока. В макетах он у страниц разный:
   * restaurant: на компьютере белый фон и заголовок в одну строку,
   * catalog: серый фон на всех экранах, заголовок в две-три строки, на телефоне мелкий текст,
   * catalogShort: то же, но заголовок на компьютере в одну строку и блок ниже,
   * dark: как catalogShort, но фон тёмно-синий, а текст светлый.
   */
  variant?: "restaurant" | "catalog" | "catalogShort" | "dark";
};

/* Текст на компьютере у коротких блоков стоит от верха, а не от низа заголовка */
const shortLead =
  "mt-[13.5px] text-[13px] leading-[21px] lg:-mr-[8px] lg:self-start lg:pt-[42.7px] lg:text-[16px] lg:leading-[27.2px]";

const looks = {
  restaurant: {
    section:
      "border-[#e9eeed] bg-[#f4f4f4] lg:h-[251px] lg:border-line lg:bg-white",
    shell: "px-[2.5px] pt-[33px] pb-[34.14px]",
    title: "mt-[20px] text-navy lg:mt-[90.5px]",
    lead: "mt-[22px] max-w-[286px] text-[16px] leading-[27.2px] text-muted lg:pb-[2.8px]",
    crumbs: "muted",
  },
  catalog: {
    section: "border-[#edf0ef] bg-[#f4f4f4] lg:h-[239px] lg:border-[#e1e6e6]",
    shell: "px-[2px] pt-[32px] pb-[38px]",
    title: "mt-[20px] leading-[39px] text-navy lg:mt-[28.3px] lg:leading-[1.1]",
    lead: "mt-[13.5px] text-[13px] leading-[21px] text-muted lg:pb-[5.7px] lg:text-[16px] lg:leading-[27.2px]",
    crumbs: "muted",
  },
  catalogShort: {
    section: "border-[#edf0ef] bg-[#f4f4f4] lg:h-[224px] lg:border-[#e1e6e6]",
    shell: "px-[2px] pt-[32px] pb-[38px]",
    title: "mt-[20px] leading-[39px] text-navy lg:mt-[63.8px] lg:leading-[1.1]",
    /* На компьютере первая строка текста в макете чуть шире колонки, поэтому текст выпущен вправо на 8 px */
    lead: `text-muted ${shortLead}`,
    crumbs: "muted",
  },
  dark: {
    section: "border-[#edf0ef] bg-navy lg:h-[224px] lg:border-[#e1e6e6]",
    shell: "px-[2px] pt-[32px] pb-[38px]",
    title:
      "mt-[20px] leading-[39px] text-white lg:mt-[63.8px] lg:leading-[1.1]",
    lead: `text-[#d8d8d8] ${shortLead}`,
    crumbs: "light",
  },
} as const;

/*
 * Верх страницы: путь по сайту, крупный заголовок и короткий текст.
 * На компьютере текст стоит справа от заголовка, на телефоне идёт под ним.
 */
export function PageIntro({
  crumbs,
  title,
  lead,
  variant = "restaurant",
}: Props) {
  const look = looks[variant];

  return (
    <section className={`border-b ${look.section}`}>
      <div
        className={`shell lg:grid lg:grid-cols-[738px_minmax(0,1fr)] lg:items-end lg:px-0 lg:pt-[46px] lg:pb-0 ${look.shell}`}
      >
        <div>
          <Breadcrumbs crumbs={crumbs} tone={look.crumbs} />
          <h1 className={`title-page ${look.title}`}>{title}</h1>
        </div>
        <p className={`lg:mt-0 lg:max-w-none ${look.lead}`}>{lead}</p>
      </div>
    </section>
  );
}
