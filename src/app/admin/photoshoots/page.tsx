import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminPhotoshootsPage() {
  return (
    <AdminLayout
      title="Photoshoots"
      description="Organize product photoshoots and gallery assets."
    >
      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="text-sm font-semibold text-slate-200">Photoshoot editor</div>
        <div className="mt-2 text-sm text-slate-400">
          Upload hero images and manage product galleries.
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-full border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-2 text-sm text-slate-200"
            placeholder="Project name"
          />
          <input
            className="rounded-full border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-2 text-sm text-slate-200"
            placeholder="Product category"
          />
          <textarea
            className="md:col-span-2 min-h-[7rem] rounded-2xl border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-3 text-sm text-slate-200 sm:min-h-[9rem]"
            placeholder="Shoot notes"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
