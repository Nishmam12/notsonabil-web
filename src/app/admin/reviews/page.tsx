import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminReviewsPage() {
  return (
    <AdminLayout
      title="Reviews"
      description="Manage review content and featured status."
    >
      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="text-sm font-semibold text-slate-200">Review editor</div>
        <div className="mt-2 text-sm text-slate-400">
          Connect review entries to your CMS or future data source.
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-full border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-2 text-sm text-slate-200"
            placeholder="Review title"
          />
          <input
            className="rounded-full border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-2 text-sm text-slate-200"
            placeholder="Category"
          />
          <textarea
            className="md:col-span-2 min-h-[7rem] rounded-2xl border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-3 text-sm text-slate-200 sm:min-h-[9rem]"
            placeholder="Summary"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
