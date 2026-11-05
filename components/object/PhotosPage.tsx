import Link from "next/link";
import { Consultation } from "@/components/home/Consultation";
import { ArrowIcon } from "@/components/ui/icons";
import { Breadcrumbs, type Crumb } from "@/components/site/Breadcrumbs";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { site } from "@/content/site";
import { PhotoGrid } from "./PhotoGrid";

type Photo = { src: string; alt: string };

type Props = {
  crumbs: Crumb[];
  /* Надпись над заголовком: название объекта */
  eyebrow: string;
  /* Заголовок страницы, например «Все 12 фото» */
  title: string;
  /* Ссылка назад на страницу объекта */
  back: { label: string; href: string };
  /* Подпись ссылки на файл фотографии для программ чтения с экрана */
  openLabel: string;
  photos: Photo[];
  consultation: { title: string; image: string };
};

/*
 * «Все N фото»: все фотографии объекта. Макета не было, страница собрана
 * по стилю проекта (Анна, 15.10: «делай по своему усмотрению, придерживаясь
 * стиля проекта»): путь по сайту и заголовок как у страницы апартамента,
 * сетка скруглённых карточек как у списков: одна колонка на телефоне,
 * две на планшете, три на компьютере. Нажатие открывает фото в просмотре
 * поверх страницы с листанием (PhotoGrid, Lightbox; Саша, 05.11).
 */
export function PhotosPage({
  crumbs,
  eyebrow,
  title,
  back,
  openLabel,
  photos,
  consultation,
}: Props) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper">
        <div className="shell pt-[19px] lg:pt-[27px]">
          <Breadcrumbs crumbs={crumbs} strongLast />
        </div>
        <div className="shell flex flex-col gap-4 pt-[22px] sm:flex-row sm:items-end sm:justify-between lg:pt-[28px]">
          <div>
            <p className="eyebrow text-accent">{eyebrow}</p>
            <h1 className="title-section mt-[11px] text-ink lg:mt-[15px]">
              {title}
            </h1>
          </div>
          <Link
            href={back.href}
            className="inline-flex w-fit items-center gap-[12px] text-[13px] leading-5 font-semibold text-navy transition-colors hover:text-accent sm:mb-[7px]"
          >
            <ArrowIcon className="size-4 rotate-180" />
            {back.label}
          </Link>
        </div>

        <PhotoGrid photos={photos} openLabel={openLabel} />

        <Consultation
          title={consultation.title}
          mobileImage={consultation.image}
          desktopImage={consultation.image}
          className="pt-[56px] pb-[54px] lg:pt-[80px] lg:pb-[106px]"
        />
      </main>
      <Footer />
      <FloatingActions callbackHref={site.callbackHref} variant="list" />
    </>
  );
}
