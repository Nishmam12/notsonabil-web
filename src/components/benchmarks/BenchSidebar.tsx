import Link from "next/link";
import type { BenchmarkCategory } from "@/types/benchmark";

type CategoryItem = {
  id: BenchmarkCategory;
  label: string;
  description: string;
};

type BenchSidebarProps = {
  title: string;
  categories: CategoryItem[];
  activeCategory: BenchmarkCategory;
};

const iconMap: Record<BenchmarkCategory, string> = {
  mice:
    "M12 4.5c2.9 0 5.25 2.35 5.25 5.25v4.5c0 2.9-2.35 5.25-5.25 5.25s-5.25-2.35-5.25-5.25v-4.5C6.75 6.85 9.1 4.5 12 4.5z M12 6.6c-1.7 0-3.1 1.4-3.1 3.15v1.1h6.2v-1.1c0-1.75-1.4-3.15-3.1-3.15z",
  keyboards:
    "M5 7.5h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z M7.5 10h2.5v2H7.5v-2z M11 10h2.5v2H11v-2z M14.5 10h2.5v2h-2.5v-2z",
  audio:
    "M9 7.5h6a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2z M8 12.5h-2v3h2v-3z M18 12.5h-2v3h2v-3z",
  monitors:
    "M5 6.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6v2h2v1.5H9v-1.5h2v-2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z",
  gpus:
    "M5.5 8h13a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 18.5 17h-13A1.5 1.5 0 0 1 4 15.5v-6A1.5 1.5 0 0 1 5.5 8z M7.5 10.5h4v4h-4v-4z M13.5 10.5h3v4h-3v-4z",
  motherboards:
    "M6 5.5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z M8 8h4v4H8V8z M14 8h3v1.5h-3V8z M14 11h3v1.5h-3V11z",
};

export default function BenchSidebar({
  title,
  categories,
  activeCategory,
}: BenchSidebarProps) {
  return (
    <aside className="bench-card rounded-3xl px-5 py-5 sm:py-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {title}
      </div>
      <div className="mt-4 space-y-2">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;
          const icon = iconMap[category.id as keyof typeof iconMap] ?? iconMap.mice;
          return (
            <Link
              key={category.id}
              href={`/benchmarks/${category.id}`}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                isActive
                  ? "bg-[rgba(59,130,246,0.15)] text-slate-900 dark:text-slate-100"
                  : "text-slate-600 hover:bg-[rgba(148,163,184,0.08)] hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <div
                className={`flex size-8 items-center justify-center rounded-xl sm:size-9 ${
                  isActive
                    ? "bg-blue-100 dark:bg-[rgba(59,130,246,0.18)]"
                    : "bg-slate-200/70 dark:bg-[rgba(15,23,42,0.7)]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 ${isActive ? "text-blue-500 dark:text-blue-300" : "text-slate-500 dark:text-slate-400"}`}
                  fill="currentColor"
                >
                  <path d={icon} />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold">{category.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{category.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
