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
    <div className="min-h-screen bg-[#f7f6f2] text-neutral-800 dark:bg-[#0b0f1a] dark:text-slate-100">
      <Header />
      <main className="page-grid">
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
