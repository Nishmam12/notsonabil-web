import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-12 dark:border-slate-800/70 dark:bg-[#0b0f1a]">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-6 text-center md:px-10">
        <a
          className="text-sm font-semibold text-neutral-800 dark:text-slate-100"
          href="mailto:notsonabil@gmail.com"
        >
          notsonabil@gmail.com
        </a>
        <div className="flex items-center gap-4 text-neutral-500 dark:text-slate-400">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-slate-700">
            f
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-slate-700">
            X
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-slate-700">
            ▶
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 dark:text-slate-400">
          <a className="transition hover:text-neutral-800 dark:hover:text-white" href="#works">
            My works
          </a>
          <a className="transition hover:text-neutral-800 dark:hover:text-white" href="#why-me">
            Why me?
          </a>
          <a className="transition hover:text-neutral-800 dark:hover:text-white" href="#gallery">
            Gallery
          </a>
          <Link className="transition hover:text-neutral-800 dark:hover:text-white" href="/photoshoots">
            Photoshoots
          </Link>
          <Link className="transition hover:text-neutral-800 dark:hover:text-white" href="/reviews">
            Reviews
          </Link>
          <Link className="transition hover:text-neutral-800 dark:hover:text-white" href="/benchmarks">
            Benchmarks
          </Link>
          <Link className="transition hover:text-neutral-800 dark:hover:text-white" href="/affiliate">
            Affiliate
          </Link>
          <Link className="transition hover:text-neutral-800 dark:hover:text-white" href="/blog">
            Blog
          </Link>
          <Link className="transition hover:text-neutral-800 dark:hover:text-white" href="/portfolio">
            Portfolio
          </Link>
        </nav>
        <span className="text-xs text-neutral-400 dark:text-slate-500">
          Made with love &amp; lots of coffee ☕
        </span>
      </div>
    </footer>
  );
}
