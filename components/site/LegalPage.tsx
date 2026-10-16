import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import {
  legalDocumentPath,
  legalDocuments,
  type LegalDocument,
} from "@/content/documents";
import { site } from "@/content/site";

/*
 * Страница юридического документа (Саша, 16.10). Макета нет, по стилю
 * сайта: путь, надпись «Документы», заголовок, текст колонкой для чтения,
 * справа на компьютере список остальных документов.
 */
export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper pb-[60px] lg:pb-[100px]">
        <div className="shell pt-[19px] lg:pt-[27px]">
          <Breadcrumbs
            crumbs={[
              { label: "Главная", href: "/" },
              { label: document.title, href: "" },
            ]}
            strongLast
          />
        </div>
        <div className="shell pt-[22px] lg:pt-[28px]">
          <p className="eyebrow text-accent">Документы</p>
          <h1 className="title-section mt-[11px] max-w-[900px] text-ink lg:mt-[15px]">
            {document.title}
          </h1>
        </div>

        <div className="shell mt-[24px] grid gap-8 lg:mt-[36px] lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <article
            className="legal-text rounded-[16px] border border-[#e9eeed] bg-white px-5 py-6 lg:px-10 lg:py-9"
            dangerouslySetInnerHTML={{ __html: document.html }}
          />
          <nav aria-label="Документы" className="self-start lg:sticky lg:top-6">
            <p className="text-[11px] leading-[16.5px] font-semibold tracking-[0.08em] text-muted uppercase">
              Все документы
            </p>
            <ul className="mt-3 grid gap-2">
              {legalDocuments.map((item) => (
                <li key={item.slug}>
                  {item.slug === document.slug ? (
                    <span
                      aria-current="page"
                      className="text-[13px] leading-[19.5px] font-semibold text-ink"
                    >
                      {item.title}
                    </span>
                  ) : (
                    <Link
                      href={legalDocumentPath(item.slug)}
                      className="text-[13px] leading-[19.5px] text-navy transition-colors hover:text-accent"
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
      <FloatingActions callbackHref={site.callbackHref} variant="list" />
    </>
  );
}
