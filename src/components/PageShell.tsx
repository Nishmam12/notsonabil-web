import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

type PageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Header />
      <main className="page-grid flex flex-col gap-10 pb-16 pt-10 sm:gap-12 sm:pb-20 sm:pt-12 lg:gap-16">
        <section className="container mx-auto px-6 sm:px-8 lg:px-10">
          <SectionHeader title={title} description={description} />
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
}
