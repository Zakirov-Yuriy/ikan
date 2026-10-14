import type { Metadata } from "next";
import { Consultation } from "@/components/home/Consultation";
import { InvestHero } from "@/components/invest/InvestHero";
import { Process } from "@/components/invest/Process";
import { Strategies } from "@/components/invest/Strategies";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { investments } from "@/content/investments";
import { site } from "@/content/site";

export const metadata: Metadata = investments.meta;

/* «Капитал работает. Вы живёте.»: страница инвестиций в строительство */
export default function InvestmentsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper">
        <InvestHero
          hero={investments.hero}
          rate={investments.rate}
          requestHref={site.callbackHref}
          phoneHref={site.phone.href}
        />
        <Strategies
          strategies={investments.strategies}
          requestHref={site.callbackHref}
        />
        <Process process={investments.process} />
        {/* В макете блок стоит вплотную к белому блоку над ним, без отступа сверху */}
        <Consultation
          title={investments.consultation.title}
          mobileImage={investments.consultation.image}
          mobileSize="large"
          desktopImage={investments.consultation.image}
          desktopGap="narrow"
          className="pb-[64px] lg:pb-[43px]"
        />
      </main>
      <Footer />
      {/* Закреплённые кнопки справа на компьютере: с 14.10 на всех страницах */}
      <FloatingActions
        phoneHref={site.phone.href}
        callbackHref={site.callbackHref}
        variant="list"
      />
    </>
  );
}
