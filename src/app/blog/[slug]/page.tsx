import Image from "next/image";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import TagPill from "@/components/TagPill";
import { blogPosts } from "@/lib/content";

type PageProps = {
  params: { slug: string };
};

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts.find((entry) => entry.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <PageShell title={post.title} description={post.excerpt}>
      <section className="container mx-auto w-full max-w-4xl px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              className="h-full w-full object-cover"
              src={post.image}
              alt={post.title}
              width={1400}
              height={900}
              unoptimized
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <TagPill text={post.category} />
            <TagPill text={post.productType} />
            <TagPill text={post.year.toString()} />
            {post.tags.map((tag) => (
              <TagPill key={tag} text={tag} />
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="space-y-6">
              {post.sections.map((section) => (
                <div key={section.id} id={section.id}>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-slate-100">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
                    {section.body}
                  </p>
                </div>
              ))}
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-6 dark:border-slate-800/70 dark:bg-[#0b1220]">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">
                  Embedded media
                </h3>
                <div className="mt-4 aspect-video rounded-xl border border-neutral-200 bg-white text-sm text-neutral-400 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-500">
                  <div className="flex h-full items-center justify-center">
                    Video / audio embed placeholder
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-slate-800/70 dark:bg-[#0b1220]">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-slate-500">
                Table of contents
              </div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-slate-300">
                {post.sections.map((section) => (
                  <li key={section.id}>
                    <a className="transition hover:text-neutral-900 dark:hover:text-white" href={`#${section.id}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-slate-800/70 dark:bg-[#0f172a]">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">
              Comment section
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-200"
                placeholder="Name"
              />
              <input
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-200"
                placeholder="Email"
              />
            </div>
            <textarea
              className="mt-4 min-h-[7rem] w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-200 sm:min-h-[9rem]"
              placeholder="Share your thoughts"
            />
            <button className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
              Post comment
            </button>
            <div className="mt-6 space-y-4 text-sm text-neutral-500 dark:text-slate-300">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-slate-700 dark:bg-[#0b1220]">
                <div className="font-semibold text-neutral-700 dark:text-slate-100">Maya</div>
                <div>Love the way you break down the tuning options.</div>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-slate-700 dark:bg-[#0b1220]">
                <div className="font-semibold text-neutral-700 dark:text-slate-100">Vikram</div>
                <div>This helped me pick my next monitor. Thanks!</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
