import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchBenchmarks } from "@/lib/googleSheets";

const formatLabel = (value: string) =>
  value
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function AdminDashboardPage() {
  const benchmarks = await fetchBenchmarks();
  const totalBenchmarks = benchmarks.length;
  const categories = Array.from(new Set(benchmarks.map((item) => item.category)));
  const recentBenchmarks = [...benchmarks]
    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
    .slice(0, 4);
  const sheetsConnected = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_SHEETS_ID
  );

  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Manage benchmarks, reviews, photoshoots, and blog content."
    >
      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Quick actions
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Choose a workspace to create or update content.
            </div>
          </div>
          <Link
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-300"
            href="/admin/benchmarks"
          >
            Go to Benchmarks
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/benchmarks"
            className="bench-glass rounded-2xl px-4 py-4 transition hover:-translate-y-0.5"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400">Benchmarks</div>
            <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">
              Add datasets, upload images, and sync to Google Sheets.
            </div>
          </Link>
          <Link
            href="/admin/reviews"
            className="bench-glass rounded-2xl px-4 py-4 transition hover:-translate-y-0.5"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400">Reviews</div>
            <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">
              Draft reviews and manage featured placements.
            </div>
          </Link>
          <Link
            href="/admin/photoshoots"
            className="bench-glass rounded-2xl px-4 py-4 transition hover:-translate-y-0.5"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400">Photoshoots</div>
            <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">
              Track photo sessions and update galleries.
            </div>
          </Link>
          <Link
            href="/admin/blog"
            className="bench-glass rounded-2xl px-4 py-4 transition hover:-translate-y-0.5"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400">Blog</div>
            <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">
              Publish editorials and new product guides.
            </div>
          </Link>
        </div>
      </div>
      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              System status
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Live connection status and content totals.
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="bench-glass rounded-2xl px-4 py-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">Sheets sync</div>
            <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {sheetsConnected ? "Connected" : "Needs setup"}
            </div>
          </div>
          <div className="bench-glass rounded-2xl px-4 py-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">Benchmarks</div>
            <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {totalBenchmarks} datasets
            </div>
          </div>
          <div className="bench-glass rounded-2xl px-4 py-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">Categories</div>
            <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {categories.length} active
            </div>
          </div>
        </div>
      </div>
      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Recent benchmarks
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Latest updates ready to sync to Google Sheets.
            </div>
          </div>
          <Link
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-300"
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
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-xs text-slate-600 dark:border-slate-800/50 dark:text-slate-300"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatLabel(item.category)} · {item.subcategory}
                  </div>
                </div>
                <div className="rounded-full border border-blue-500/40 px-3 py-1 text-xs text-blue-500 dark:text-blue-300">
                  Score {item.labScore}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              No benchmarks available yet.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
