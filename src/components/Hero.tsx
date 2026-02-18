import Image from "next/image";

const keyboardImage =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80";

export default function Hero() {
  return (
    <section className="relative container mx-auto mt-6 w-full px-6 pb-12 sm:mt-8 sm:px-8 sm:pb-16 lg:px-10">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-semibold tracking-tight text-neutral-700 dark:text-neutral-100">
          not so nabil
        </h1>
        <div className="relative mt-6 w-full max-w-3xl">
          <Image
            className="h-auto w-full rounded-2xl object-cover shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            src={keyboardImage}
            alt="Keyboard"
            width={1400}
            height={700}
            unoptimized
          />
          <div className="float-note absolute right-[-0.75rem] top-6 hidden aspect-square w-14 rotate-[-6deg] rounded-lg bg-[#f7e27e] px-3 py-2 text-left text-[11px] font-semibold text-neutral-700 shadow-[0_12px_24px_rgba(0,0,0,0.12)] sm:right-[-1rem] sm:w-16 md:block lg:right-[-1.5rem] lg:w-20">
            need more
            <br />
            coffee
          </div>
        </div>
        <div className="mt-8 max-w-2xl sm:mt-10">
          <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
            tech reviews without the bs
          </p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Honest tech reviews that help you buy smarter, not louder.
            <br />
            Skip the hype. Watch what actually matters.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
              Collab with me
            </button>
            <button className="text-sm font-semibold text-orange-500">
              See my reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
