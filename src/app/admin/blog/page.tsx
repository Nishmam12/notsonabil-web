import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminBlogPage() {
  return (
    <AdminLayout
      title="Blog"
      description="Draft, edit, and publish blog posts."
    >
      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="text-sm font-semibold text-slate-200">Blog editor</div>
        <div className="mt-2 text-sm text-slate-400">
          Compose articles and schedule publishing.
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-full border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-2 text-sm text-slate-200"
            placeholder="Post title"
          />
          <input
            className="rounded-full border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-2 text-sm text-slate-200"
            placeholder="Tags"
          />
          <textarea
            className="md:col-span-2 min-h-[7rem] rounded-2xl border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-3 text-sm text-slate-200 sm:min-h-[9rem]"
            placeholder="Excerpt"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
