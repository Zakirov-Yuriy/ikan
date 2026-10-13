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

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Scenarios />
        <About />
        <Directions />
        <Objects />
        <Consultation />
      </main>
      <Footer />
      <FloatingActions phoneHref={site.phone.href} callbackHref={site.callbackHref} />
    </>
  );
}
