import Link from "next/link";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 pt-6 text-sm md:px-10">
      <nav className="flex flex-wrap items-center gap-6 text-neutral-600 dark:text-slate-300">
        <a className="transition hover:text-neutral-900 dark:hover:text-white" href="#works">
          My works
        </a>
        <a className="transition hover:text-neutral-900 dark:hover:text-white" href="#why-me">
          Why me?
        </a>
        <a className="transition hover:text-neutral-900 dark:hover:text-white" href="#gallery">
          Gallery
        </a>
        <Link className="transition hover:text-neutral-900 dark:hover:text-white" href="/photoshoots">
          Photoshoots
        </Link>
        <Link className="transition hover:text-neutral-900 dark:hover:text-white" href="/reviews">
          Reviews
        </Link>
        <Link className="transition hover:text-neutral-900 dark:hover:text-white" href="/benchmarks">
          Benchmarks
        </Link>
        <Link className="transition hover:text-neutral-900 dark:hover:text-white" href="/affiliate">
          Affiliate
        </Link>
        <Link className="transition hover:text-neutral-900 dark:hover:text-white" href="/blog">
          Blog
        </Link>
        <Link className="transition hover:text-neutral-900 dark:hover:text-white" href="/portfolio">
          Portfolio
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a className="text-[13px] text-orange-500" href="mailto:notsonabil@gmail.com">
          notsonabil@gmail.com
        </a>
      </div>
    </header>
  );
}
