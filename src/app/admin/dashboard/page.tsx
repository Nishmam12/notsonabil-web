import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { getBenchmarks } from "@/lib/db";

const formatLabel = (value: string) =>
  value
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function AdminDashboardPage() {
  const benchmarks = await getBenchmarks();
  const totalBenchmarks = benchmarks.length;
  const categories = Array.from(new Set(benchmarks.map((item) => item.category)));
  const recentBenchmarks = [...benchmarks]
    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
    .slice(0, 4);

  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Manage benchmarks, reviews, photoshoots, and blog content."
    >
      <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Quick actions
            </div>
            <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              Choose a workspace to create or update content stored in Supabase.
            </div>
          </div>
          <Link
            className="rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-xs text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            href="/admin/benchmarks"
          >
            Go to Benchmarks
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/benchmarks"
            className="rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
          >
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Benchmarks</div>
            <div className="mt-2 text-sm text-neutral-800 dark:text-neutral-200">
              Add datasets, upload images, and sync to the database.
            </div>
          </Link>
          <Link
            href="/admin/reviews"
            className="rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
          >
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Reviews</div>
            <div className="mt-2 text-sm text-neutral-800 dark:text-neutral-200">
              Draft reviews and manage featured placements.
            </div>
          </Link>
          <Link
            href="/admin/photoshoots"
            className="rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
          >
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Photoshoots</div>
            <div className="mt-2 text-sm text-neutral-800 dark:text-neutral-200">
              Track photo sessions and update galleries.
            </div>
          </Link>
          <Link
            href="/admin/blog"
            className="rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
          >
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Blog</div>
            <div className="mt-2 text-sm text-neutral-800 dark:text-neutral-200">
              Publish editorials and new product guides.
            </div>
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              System status
            </div>
            <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              Live connection status and content totals.
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Database</div>
            <div className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Connected
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Benchmarks</div>
            <div className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {totalBenchmarks} datasets
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Categories</div>
            <div className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {categories.length} active
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Recent benchmarks
            </div>
            <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              Latest updates stored in the database.
            </div>
          </div>
          <Link
            className="rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-xs text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            href="/admin/benchmarks"
          >
            Manage Benchmarks
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {recentBenchmarks.length ? (
            recentBenchmarks.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 px-4 py-3 text-xs text-neutral-600 dark:border-neutral-800/50 dark:text-neutral-300"
              >
                <div>
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    {item.name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatLabel(item.category)} · {item.subcategory}
                  </div>
                </div>
                <div className="rounded-full border border-blue-500/40 px-3 py-1 text-xs text-blue-500 dark:text-blue-300">
                  Score {item.labScore}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              No benchmarks available yet.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
