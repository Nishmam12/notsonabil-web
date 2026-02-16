import Header from "@/components/Header";
import Footer from "@/components/Footer";

type PageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-neutral-800 dark:bg-[#0b0f1a] dark:text-slate-100">
      <Header />
      <main className="page-grid pb-16 sm:pb-20">
        <section className="container mx-auto w-full px-6 pt-10 sm:px-8 sm:pt-12 lg:px-10">
          <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:px-8 sm:py-10">
            <h1 className="text-3xl font-semibold text-neutral-800 dark:text-slate-100 md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
              {description}
            </p>
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
}
