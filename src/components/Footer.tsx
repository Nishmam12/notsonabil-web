import Link from "next/link";
import { NAV_LINKS, CONTACT_EMAIL } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-6 text-center md:px-10">
        <a
          className="text-sm font-semibold text-neutral-800 dark:text-neutral-100"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
        <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700">
            f
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700">
            X
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700">
            ▶
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              className="transition hover:text-neutral-800 dark:hover:text-neutral-100"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          Made with love &amp; lots of coffee ☕
        </span>
      </div>
    </footer>
  );
}
