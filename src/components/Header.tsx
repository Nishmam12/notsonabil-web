import Link from "next/link";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { NAV_LINKS, CONTACT_EMAIL } from "@/lib/navigation";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 pt-6 text-sm md:px-10">
      <nav className="flex flex-wrap items-center gap-6 text-neutral-600 dark:text-neutral-400">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            className="transition hover:text-neutral-900 dark:hover:text-neutral-100"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a className="text-[13px] text-orange-500" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </div>
    </header>
  );
}
