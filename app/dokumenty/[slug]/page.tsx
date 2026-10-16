import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/site/LegalPage";
import { legalDocuments } from "@/content/documents";

/* Шапка и подвал берут телефоны из бэкенда при каждом запросе */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function find(slug: string) {
  return legalDocuments.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const document = find((await params).slug);
  return document ? { title: `${document.title}: ИКАН` } : {};
}

/* Юридические документы: /dokumenty/politika-konfidencialnosti и другие */
export default async function DocumentPage({ params }: Props) {
  const document = find((await params).slug);
  if (!document) notFound();
  return <LegalPage document={document} />;
}
