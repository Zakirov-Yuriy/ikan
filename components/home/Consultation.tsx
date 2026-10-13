import Image from "next/image";
import { RequestLink } from "@/components/site/RequestPopup";
import { ArrowIcon } from "@/components/ui/icons";
import { consultation } from "@/content/home";

type Props = {
  /* Заголовок, если на странице он не такой, как на главной */
  title?: string;
  /* Заголовок для телефона, если в макете он там другой */
  titleMobile?: string;
  /*
   * Отдельная фотография для телефона. С ней блок на телефоне сделан точно
   * по макетам страниц: своя фотография, затемнение, размеры текста.
   * Без неё блок остаётся таким, как на главной.
   */
  mobileImage?: string;
  /*
   * Размер блока на телефоне, когда задана mobileImage. В макетах их два:
   * compact: страницы объектов, высота 300, мелкий текст;
   * large: список квартир, высота 340, заголовок и текст крупнее.
   */
  mobileSize?: "compact" | "large";
  /*
   * Та же фотография на компьютере вместо общей. Она светлая, поэтому
   * затемняется здесь же, как в макете страницы апартамента.
   */
  desktopImage?: string;
  /*
   * Кнопка на компьютере. wide: как в макете списка для аренды, она шире,
   * выше и стоит ближе к правому краю, стрелка отодвинута от текста.
   */
  desktopButton?: "wide";
  /*
   * Промежуток между текстом и кнопкой на компьютере. narrow: как в макете
   * страницы инвестиций, там длинный заголовок стоит в одну строку.
   */
  desktopGap?: "narrow";
  /* Отступы блока сверху и снизу, если они не как на главной */
  className?: string;
};

/* Вид блока на телефоне. На компьютере он один. */
const looks = {
  home: {
    shell: "",
    box: "rounded-[20px]",
    mobileImage: "",
    shade: "from-navy/10 to-navy/70",
    title: "mt-[11px]",
    text: "mt-px max-w-[320px] text-[11.5px] leading-[19px] sm:max-w-none sm:text-[14px]",
    button: "mt-[29px] text-[15.5px]",
    desktopButton: "",
  },
  compact: {
    shell: "",
    box: "rounded-[14px] lg:rounded-[20px]",
    mobileImage: "object-left",
    /* Затемнение снято с макета: цвет #041926, сверху 18%, снизу 98% */
    shade: "from-[#041926]/18 to-[#041926]/98",
    title:
      "mt-[12px] max-lg:text-[28px] max-lg:leading-[32px] max-lg:tracking-[-0.04em]",
    text: "max-w-[320px] text-[12px] leading-[19px] sm:max-w-none sm:text-[14px]",
    button: "mt-[29px] text-[16px] lg:text-[15.5px]",
    desktopButton: "",
  },
  large: {
    /* В макете списка квартир поля на телефоне на 2 px шире обычных */
    shell: "max-lg:px-[2px]",
    /*
     * Высота 340 и при заголовке в три строки, как на странице инвестиций:
     * поэтому верхнее поле меньше общего, текст всё равно прижат к низу.
     */
    box: "rounded-[20px] max-lg:min-h-[340px] max-lg:px-[21px] max-lg:pt-[40px] max-lg:pb-[28px]",
    mobileImage: "",
    shade: "from-[#041926]/18 to-[#041926]/98",
    title:
      "mt-[12px] max-lg:text-[30px] max-lg:leading-[34px] max-lg:tracking-[-0.04em]",
    text: "text-[16px] leading-[24px]",
    /* В макете списка квартир текст кнопки 16 px и на компьютере */
    button: "mt-[30px] text-[16px] max-lg:px-3",
    desktopButton: "lg:px-[23px]",
  },
};

export function Consultation({
  title = consultation.title,
  titleMobile,
  mobileImage,
  mobileSize = "compact",
  desktopImage,
  desktopButton,
  desktopGap,
  className = "pt-[26px] pb-[30px] lg:pt-[99px] lg:pb-[106px]",
}: Props) {
  const look = looks[mobileImage ? mobileSize : "home"];
  const wide = desktopButton === "wide";

  return (
    <section className={`bg-paper ${className}`}>
      <div className={`shell ${look.shell}`}>
        <div
          className={`relative flex min-h-[300px] flex-col justify-end overflow-hidden bg-navy px-[18px] pt-[70px] pb-6 text-white lg:min-h-[260px] lg:flex-row lg:items-center lg:justify-between ${desktopGap === "narrow" ? "lg:gap-6" : "lg:gap-10"} lg:py-10 lg:pl-[55px] ${wide ? "lg:pr-[26px]" : "lg:pr-[55px]"} ${look.box}`}
        >
          {desktopImage ? (
            <>
              <Image
                src={desktopImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 1024px, 1px"
                className="object-cover object-[50%_52.5%] max-lg:hidden"
              />
              <span
                aria-hidden
                className="consultation-shade absolute inset-0 max-lg:hidden"
              />
            </>
          ) : (
            <Image
              src={consultation.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className={
                mobileImage ? "object-cover max-lg:hidden" : "object-cover"
              }
            />
          )}
          {mobileImage && (
            <Image
              src={mobileImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 1px, 100vw"
              className={`object-cover lg:hidden ${look.mobileImage}`}
            />
          )}
          {/* На телефоне текст стоит поверх фотографии, поэтому низ затемнён сильнее */}
          <span
            aria-hidden
            className={`absolute inset-0 bg-linear-to-b lg:hidden ${look.shade}`}
          />
          <div className="relative">
            <p className="eyebrow text-sky">{consultation.eyebrow}</p>
            <h2 className={`title-section lg:mt-[14px] ${look.title}`}>
              {titleMobile ? (
                <>
                  <span className="lg:hidden">{titleMobile}</span>
                  <span className="hidden lg:inline">{title}</span>
                </>
              ) : (
                title
              )}
            </h2>
            <p
              className={`text-white/70 lg:mt-0 lg:max-w-none lg:text-[16px] lg:leading-6 ${look.text}`}
            >
              {consultation.text}
            </p>
          </div>
          {/* Открывает окно заявки */}
          <RequestLink
            href={consultation.button.href}
            className={`relative flex h-12 shrink-0 items-center justify-center gap-[14px] rounded-[10px] bg-sky px-[26px] font-medium text-navy transition-colors hover:bg-white lg:mt-0 ${look.button} ${wide ? "lg:h-[50px] lg:w-[284px] lg:justify-between lg:pr-[23.5px] lg:pl-[33.5px]" : look.desktopButton}`}
          >
            {consultation.button.label}
            <ArrowIcon className="size-4" />
          </RequestLink>
        </div>
      </div>
    </section>
  );
}
