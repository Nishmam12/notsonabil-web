import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ReviewHighlight from "@/components/ReviewHighlight";
import TrustSection from "@/components/TrustSection";
import WorkSection from "@/components/WorkSection";

export default function Home() {
  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100">
      <Header />
      <main className="page-grid flex flex-col gap-16 pb-16 pt-8 sm:gap-20 sm:pb-20 lg:gap-24">
        <Hero />
        <Marquee />
        <ReviewHighlight />
        <TrustSection />
        <WorkSection />
        <GallerySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
