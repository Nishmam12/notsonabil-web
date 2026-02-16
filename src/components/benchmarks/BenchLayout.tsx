import Header from "@/components/Header";
import Footer from "@/components/Footer";

type BenchLayoutProps = {
  children: React.ReactNode;
};

export default function BenchLayout({ children }: BenchLayoutProps) {
  return (
    <div className="bench-shell min-h-screen">
      <Header />
      <main className="container mx-auto w-full px-6 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
