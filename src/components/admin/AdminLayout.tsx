import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "./AdminSidebar";
import SignOutButton from "./SignOutButton";

type AdminLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AdminLayout({ title, description, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 md:px-10">
        <div className="rounded-3xl border border-neutral-200 bg-white px-8 py-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h1>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          <AdminSidebar />
          <div className="space-y-6">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
