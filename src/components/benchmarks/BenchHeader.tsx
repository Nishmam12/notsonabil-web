import Link from "next/link";

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
    <div className="bench-card rounded-3xl px-6 py-5 sm:px-8 sm:py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-2">
                <Link className="transition hover:text-slate-900 dark:hover:text-slate-200" href={crumb.href}>
                  {crumb.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="text-slate-400 dark:text-slate-600">/</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
        <Link
          className="bench-button w-full rounded-full px-5 py-2 text-center text-sm font-semibold text-white sm:w-auto"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
