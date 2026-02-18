import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

type Breadcrumb = {
  label: string;
  href: string;
};

type BenchHeaderProps = {
  breadcrumbs: Breadcrumb[];
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export default function BenchHeader({
  breadcrumbs,
  title,
  description,
  actionLabel,
  actionHref,
}: BenchHeaderProps) {
  return (
    <SectionHeader
      title={title}
      description={description}
      className="bench-card !shadow-none !rounded-3xl"
    >
      <div className="flex flex-col gap-6 lg:items-end">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              <Link
                className="transition hover:text-slate-900 dark:hover:text-slate-200"
                href={crumb.href}
              >
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <span className="text-slate-400 dark:text-slate-600">/</span>
              )}
            </span>
          ))}
        </nav>
        <Link
          className="bench-button whitespace-nowrap rounded-full px-5 py-2 text-center text-sm font-semibold text-white"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      </div>
    </SectionHeader>
  );
}
