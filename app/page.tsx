import type { Metadata } from "next";
import { About } from "@/components/home/About";
import { Consultation } from "@/components/home/Consultation";
import { Directions } from "@/components/home/Directions";
import { Hero } from "@/components/home/Hero";
import { Objects } from "@/components/home/Objects";
import { Scenarios } from "@/components/home/Scenarios";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { site } from "@/content/site";
import { getHome } from "@/lib/api";

/* Тексты и фотографии из бэкенда при каждом запросе, без сборки заранее */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  return home.meta;
}

/* Главная: все блоки из админки, раздел «Главная сайта» */
export default async function HomePage() {
  const home = await getHome();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero hero={home.hero} />
        <Scenarios scenarios={home.scenarios} />
        <About about={home.about} />
        <Directions directions={home.directions} />
        <Objects objects={home.objects} />
        <Consultation content={home.consultation} />
      </main>
      <Footer />
      <FloatingActions callbackHref={site.callbackHref} />
    </>
  );
}
