import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotosPage } from "@/components/object/PhotosPage";
import { apartmentPage } from "@/content/apartments";
import { paths } from "@/content/paths";
import { getApartment } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apartment = await getApartment(slug);
  return apartment
    ? {
        title: `${apartment.summary.title}, ${apartmentPage.photosPage.title.toLocaleLowerCase("ru-RU")}: ИКАН`,
      }
    : {};
}

/* Все фотографии апартамента: /apartamenty/a4/foto */
export default async function ApartmentPhotosPage({ params }: Props) {
  const { slug } = await params;
  const apartment = await getApartment(slug);
  if (!apartment) notFound();

  const own = apartment.crumbs[apartment.crumbs.length - 1];

  return (
    <PhotosPage
      crumbs={[
        ...apartment.crumbs.slice(0, -1),
        { label: own.label, href: paths.apartment(slug) },
        { label: apartmentPage.photosPage.crumb, href: "" },
      ]}
      eyebrow={apartment.summary.title}
      title={apartment.gallery.all.label}
      back={{
        label: apartmentPage.photosPage.back,
        href: paths.apartment(slug),
      }}
      openLabel={apartmentPage.photosPage.open}
      photos={apartment.photos}
      consultation={apartment.consultation}
    />
  );
}
