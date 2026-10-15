import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import type { ScenarioData } from "@/content/home";

/*
 * Строки направлений: текст слева, фотография справа. На телефоне фотография
 * сверху. Строки, их порядок и фотографии задаются в админке.
 */
export function Scenarios({ scenarios }: { scenarios: ScenarioData[] }) {
  /*
   * overflow-x-clip: при наведении строка чуть увеличивается и выходит за края
   * окна; без обрезки появилась бы горизонтальная прокрутка. Тень сверху и
   * снизу остаётся видна, clip не трогает вертикаль.
   *
   * На компьютере строка под курсором «выдвигается вперёд»: чуть
   * увеличивается, приподнимается и получает тень. При уходе курсора
   * возвращается. Сдвиг фотографии при наведении на ссылку остался.
   */
  return (
    <section aria-label="Что мы предлагаем" className="overflow-x-clip border-t border-line bg-white">
      <ol>
        {scenarios.map((item, index) => (
          <li
            key={index}
            className="group/row scenario-row relative border-b border-line bg-white transition-[translate,scale,box-shadow] duration-300 ease-out motion-reduce:transition-none md:grid md:min-h-[229px] md:grid-cols-[minmax(0,1fr)_300px] lg:hover:z-10 lg:hover:-translate-y-[6px] lg:hover:scale-[1.012] lg:hover:shadow-[0_18px_40px_rgba(8,34,52,0.14)]"
          >
            {/*
              Фотография. На компьютере она в покое на 42 px шире своей колонки и
              выступает влево. При наведении на ссылку строки, при нажатии и при
              выборе с клавиатуры фотография уезжает на эти 42 px вправо, её правый
              край обрезается правым краем кадра строки (.scenario-row в
              globals.css): до ширины макета это край окна, как в макете.
            */}
            <div className="relative aspect-[402/228] md:order-2 md:aspect-auto">
              <div className="absolute inset-y-0 right-0 left-0 overflow-hidden lg:-left-[42px]">
                <div className="relative h-full bg-navy transition-transform duration-300 ease-out motion-reduce:transition-none lg:group-has-[a:hover]/row:translate-x-[42px] lg:group-has-[a:focus-visible]/row:translate-x-[42px] lg:group-has-[a:active]/row:translate-x-[42px]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 342px, (min-width: 768px) 300px, 100vw"
                    className={`object-cover ${item.image.wide ? "lg:hidden" : ""}`}
                  />
                  {item.image.wide && (
                    <Image
                      src={item.image.wide.src}
                      alt={item.image.alt}
                      fill
                      sizes="342px"
                      className="hidden object-cover lg:block"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="scenario-text pt-[21px] pr-[14px] pb-[9px] md:order-1 md:pt-[40px] md:pr-8 md:pb-[29px]">
              <p className="font-display text-[11px] leading-[15px] font-bold tracking-[0.16em] text-sky-soft">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-display text-[20px] leading-[25px] font-medium tracking-[-0.035em] text-navy md:text-[26px] md:leading-[28.6px]">
                {item.title}
              </h2>
              <p className="mt-[10px] max-w-[540px] text-[14px] leading-[23.1px] text-muted md:mt-[13px]">
                {item.text}
              </p>
              {/*
                Ссылка-кнопка. В покое это синий текст со стрелкой. При наведении,
                нажатии и выборе с клавиатуры появляется тёмная плашка, а текст
                сдвигается на 10 px вправо, как в макете. Сама плашка стоит на месте
                и двигается только текст внутри, поэтому под курсором ничего не дёргается.
              */}
              <Link
                href={item.link.href}
                className="group mt-2 inline-flex rounded-[10px] px-[10px] pt-[9px] pb-[10px] font-display text-[13px] leading-[18px] font-semibold text-accent transition-colors duration-200 hover:bg-navy hover:text-white focus-visible:bg-navy focus-visible:text-white active:bg-navy active:text-white md:mt-[7px]"
              >
                <span className="inline-flex -translate-x-[10px] items-center gap-[10px] transition-transform duration-200 group-hover:translate-x-0 group-focus-visible:translate-x-0 group-active:translate-x-0">
                  {item.link.label}
                  <ArrowIcon className="size-[14px]" />
                </span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
