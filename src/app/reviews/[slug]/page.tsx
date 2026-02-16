import Image from "next/image";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import RatingDots from "@/components/RatingDots";
import TagPill from "@/components/TagPill";
import { reviews } from "@/lib/content";

type PageProps = {
  params: { slug: string };
};

export default function ReviewDetailPage({ params }: PageProps) {
  const item = reviews.find((entry) => entry.slug === params.slug);

  if (!item) {
    notFound();
  }

  const related = reviews.filter(
    (entry) => entry.category === item.category && entry.slug !== item.slug
  );

  return (
    <PageShell title={item.title} description={item.verdict}>
      <section className="container mx-auto w-full max-w-5xl px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              className="h-full w-full object-cover"
              src={item.image}
              alt={item.title}
              width={1600}
              height={900}
              unoptimized
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <TagPill text={item.category} />
            {item.subcategory && <TagPill text={item.subcategory} />}
            <TagPill text={item.brand} />
            <TagPill text={item.year.toString()} />
          </div>
          <div className="mt-4">
            <RatingDots rating={item.rating} />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">Verdict</h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">{item.verdict}</p>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-slate-100">Pros</h4>
                <ul className="mt-2 space-y-2 text-sm text-neutral-500 dark:text-slate-300">
                  {item.pros.map((pro) => (
                    <li key={pro}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-slate-100">Cons</h4>
                <ul className="mt-2 space-y-2 text-sm text-neutral-500 dark:text-slate-300">
                  {item.cons.map((con) => (
                    <li key={con}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">Specs</h3>
              <div className="mt-3 space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-300">
                {item.specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-700 dark:text-slate-100">{spec.label}</span>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-slate-100">
                  Performance notes
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-neutral-500 dark:text-slate-300">
                  {item.performance.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {item.gallery.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="overflow-hidden rounded-xl border border-neutral-200"
              >
                <div className="aspect-[4/3]">
                  <Image
                    className="h-full w-full object-cover"
                    src={src}
                    alt={`${item.title} gallery ${index + 1}`}
                    width={1200}
                    height={800}
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">Related reviews</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => (
                <a
                  key={entry.slug}
                  href={`/reviews/${entry.slug}`}
                  className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      className="h-full w-full object-cover"
                      src={entry.image}
                      alt={entry.title}
                      width={1200}
                      height={800}
                      unoptimized
                    />
                  </div>
                  <div className="mt-3 text-sm font-semibold text-neutral-800 dark:text-slate-100">
                    {entry.title}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-slate-300">{entry.brand}</div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
