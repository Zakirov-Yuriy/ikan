import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApartmentPage } from "@/components/object/ApartmentPage";
import { getApartment } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

/* Данные из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apartment = await getApartment(slug);
  return apartment ? apartment.meta : {};
}

/* Страница апартамента: /apartamenty/a4, содержание из бэкенда при каждом запросе */
export default async function ApartmentBySlugPage({ params }: Props) {
  const { slug } = await params;
  const apartment = await getApartment(slug);
  if (!apartment) notFound();

  return <ApartmentPage apartment={apartment} />;
}
