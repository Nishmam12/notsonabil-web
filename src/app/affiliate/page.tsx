import Image from "next/image";
import PageShell from "@/components/PageShell";
import TagPill from "@/components/TagPill";
import { affiliates, categories } from "@/lib/content";

export default function AffiliatePage() {
  return (
    <PageShell
      title="Affiliate"
      description="Curated gear with transparent affiliate links and trusted picks."
    >
      <section className="container mx-auto w-full px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-300">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              Filter
            </span>
            {categories.map((category) => (
              <TagPill key={category} text={category} />
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {affiliates.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  className="h-full w-full object-cover"
                  src={item.image}
                  alt={item.title}
                  width={1200}
                  height={800}
                  unoptimized
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <TagPill text={item.category} />
                <TagPill text={item.brand} />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-300">
                {item.description}
              </p>
              <a
                href={item.url}
                className="mt-4 inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
              >
                Get affiliate link
              </a>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-[28px] border border-dashed border-neutral-200 bg-neutral-50 px-8 py-6 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            Affiliate disclosure
          </h3>
          <p className="mt-2">
            Some links on this page are affiliate links. If you purchase through
            them, I may earn a small commission at no extra cost to you.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
