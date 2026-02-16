import Image from "next/image";

const reviewImage =
  "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1600&q=80";

export default function ReviewHighlight() {
  return (
    <section className="container mx-auto w-full px-6 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="relative rounded-[28px] border border-neutral-200 bg-white px-6 py-8 text-center shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:px-8 sm:py-10">
        <div className="absolute inset-6 -z-10 rounded-[22px] border border-dashed border-neutral-200" />
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
            <Image
              className="h-full w-full object-cover"
              src={reviewImage}
              alt="Review"
              width={1600}
              height={900}
              unoptimized
            />
            <div className="absolute left-6 top-4 text-5xl font-bold text-white drop-shadow">
              X
            </div>
            <div className="absolute right-6 top-4 text-5xl font-bold text-white drop-shadow">
              5
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-white/90 text-red-600 shadow-lg sm:h-12 sm:w-16">
                ▶
              </div>
            </div>
            <div className="absolute bottom-4 left-6 text-3xl font-bold tracking-widest text-white">
              REVIEW
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-slate-100">
              i review tech that you love
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
              I break down the latest phones, gadgets, and gear with honest,
              no-fluff reviews. I&apos;ve reviewed international units before they
              even hit the local market—and built a community of tech lovers who
              trust my insights before making a purchase.
            </p>
            <button className="mt-6 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800">
              Collab with me
            </button>
          </div>
        </div>
        <div className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400 dark:text-slate-500">
          i have worked with
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-neutral-400 dark:text-slate-500">
          <span>BLUSSYTLE</span>
          <span>MECHLANDS</span>
          <span>Royal Kludge</span>
          <span>ALICE</span>
          <span>AJAZZ</span>
          <span>ASUS</span>
        </div>
      </div>
    </section>
  );
}
