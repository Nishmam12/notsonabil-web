"use client";

import { useMemo, useState } from "react";
import type { BenchmarkDataset } from "@/types/benchmark";

const emptyForm: BenchmarkDataset = {
  id: "",
  name: "",
  category: "",
  subcategory: "",
  brand: "",
  latency: 0,
  latency_wired_1: 0,
  latency_wired_2: 0,
  latency_wired_3: 0,
  latency_24g_1: 0,
  latency_24g_2: 0,
  latency_24g_3: 0,
  accuracy: 0,
  pollingRate: 0,
  labScore: 0,
  tier: "",
  image: "",
  createdAt: "",
  rankingScore: 0,
  testDate: "",
  notes: "",
};

type BenchmarksAdminPanelProps = {
  initialBenchmarks: BenchmarkDataset[];
  initialError?: string;
  sheetsConnected?: boolean;
};

export default function BenchmarksAdminPanel({
  initialBenchmarks,
  initialError,
}: BenchmarksAdminPanelProps) {
  const [benchmarks, setBenchmarks] = useState<BenchmarkDataset[]>(initialBenchmarks);
  const [form, setForm] = useState<BenchmarkDataset>(emptyForm);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(benchmarks.map((item) => item.category))),
    [benchmarks]
  );

  const refresh = async () => {
    const response = await fetch("/api/benchmarks");
    if (!response.ok) {
      setStatus("Failed to fetch benchmarks");
      return;
    }
    const data = (await response.json()) as { data: BenchmarkDataset[] };
    setBenchmarks(data.data ?? []);
  };

  const handleFile = async (file: File | null) => {
    if (!file) {
      return;
    }
    setUploading(true);
    setStatus("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, publicUrl } = await response.json();

      if (uploadUrl && publicUrl) {
        // Direct upload to R2
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload to storage");
        }

        setForm((prev) => ({ ...prev, image: publicUrl }));
        setStatus("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (uploading) return;
    setStatus("Saving to database...");

    const formattedDate = form.testDate
      ? new Date(form.testDate).toISOString().split("T")[0]
      : null;

    const payload = {
      ...form,
      createdAt: form.createdAt || new Date().toISOString(),
      testDate: formattedDate,
      latency_wired_1: Number(form.latency_wired_1),
      latency_wired_2: Number(form.latency_wired_2),
      latency_wired_3: Number(form.latency_wired_3),
      latency_24g_1: Number(form.latency_24g_1),
      latency_24g_2: Number(form.latency_24g_2),
      latency_24g_3: Number(form.latency_24g_3),
      accuracy: Number(form.accuracy),
      pollingRate: Number(form.pollingRate),
      labScore: Number(form.labScore),
      rankingScore: Number(form.rankingScore),
    };
    // Remove old latency field
    // @ts-ignore
    delete payload.latency;

    console.log("Insert payload:", payload);

    try {
      const response = await fetch("/api/benchmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        console.error("Supabase insert error:", resData.error);
        alert(resData.error || "Failed to save benchmark");
        setStatus(resData.error || "Failed to save benchmark");
        return;
      }

      setStatus("Saved to database successfully");
      setForm(emptyForm);
      refresh();
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.message || "Error saving benchmark");
      setStatus("Error saving benchmark");
    }
  };

  const update = async () => {
    if (uploading) return;
    if (!form.id) {
      setStatus("No benchmark selected for update");
      return;
    }
    setStatus("Updating database...");

    const formattedDate = form.testDate
      ? new Date(form.testDate).toISOString().split("T")[0]
      : null;

    const payload = {
      ...form,
      testDate: formattedDate,
      latency_wired_1: Number(form.latency_wired_1),
      latency_wired_2: Number(form.latency_wired_2),
      latency_wired_3: Number(form.latency_wired_3),
      latency_24g_1: Number(form.latency_24g_1),
      latency_24g_2: Number(form.latency_24g_2),
      latency_24g_3: Number(form.latency_24g_3),
      accuracy: Number(form.accuracy),
      pollingRate: Number(form.pollingRate),
      labScore: Number(form.labScore),
      rankingScore: Number(form.rankingScore),
    };
    // @ts-ignore
    delete payload.latency;

    try {
      const response = await fetch(`/api/benchmarks/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        setStatus(resData.error || "Failed to update benchmark");
        return;
      }

      setStatus("Updated successfully");
      setForm(emptyForm);
      refresh();
    } catch (error) {
      setStatus("Error updating benchmark");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this benchmark?")) return;

    setStatus("Deleting...");
    try {
      const response = await fetch(`/api/benchmarks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setStatus("Failed to delete benchmark");
        return;
      }

      setStatus("Deleted successfully");
      refresh();
    } catch (error) {
      setStatus("Error deleting benchmark");
    }
  };

  return (
    <>
      {initialError ? (
        <div className="bench-card rounded-3xl border border-amber-500/30 px-6 py-4 text-sm text-amber-700 dark:text-amber-200">
          {initialError}
        </div>
      ) : null}

      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-neutral-200">
              Manage Benchmarks
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-neutral-400">
              <span>Supabase Cloud integration active.</span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                Connected
              </span>
            </div>
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 transition hover:bg-slate-50 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-300 dark:hover:bg-neutral-900"
            onClick={refresh}
          >
            Refresh List
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Product ID (UUID or custom)
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                placeholder="Leave blank for auto-UUID"
                value={form.id}
                onChange={(event) => setForm({ ...form, id: event.target.value })}
              />
            </label>

            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Product name
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                placeholder="e.g. Razer DeathAdder V3 Pro"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Category
                <input
                  list="category-options"
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  placeholder="Category"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                />
                <datalist id="category-options">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>

              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Subcategory
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  placeholder="Subcategory"
                  value={form.subcategory}
                  onChange={(event) => setForm({ ...form, subcategory: event.target.value })}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Brand
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                placeholder="Brand"
                value={form.brand}
                onChange={(event) => setForm({ ...form, brand: event.target.value })}
              />
            </label>

            <div className="space-y-4">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Image URL
                <input
                  className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(event) => setForm({ ...form, image: event.target.value })}
                />
              </label>

              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                  Quick Image Upload
                  <input
                    className="mt-1 text-xs text-slate-600 dark:text-neutral-300"
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
                  />
                </label>
                {uploading && (
                  <div className="mt-2 text-[10px] animate-pulse text-blue-500">Uploading to R2...</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-4 rounded-2xl bg-slate-50/50 p-4 dark:bg-neutral-900/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Wired Latency (ms)
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  step="0.01"
                  placeholder="S1"
                  value={form.latency_wired_1}
                  onChange={(event) => setForm({ ...form, latency_wired_1: Number(event.target.value) })}
                />
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  step="0.01"
                  placeholder="S2"
                  value={form.latency_wired_2}
                  onChange={(event) => setForm({ ...form, latency_wired_2: Number(event.target.value) })}
                />
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  step="0.01"
                  placeholder="S3"
                  value={form.latency_wired_3}
                  onChange={(event) => setForm({ ...form, latency_wired_3: Number(event.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-slate-50/50 p-4 dark:bg-neutral-900/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                2.4GHz Latency (ms)
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  step="0.01"
                  placeholder="S1"
                  value={form.latency_24g_1}
                  onChange={(event) => setForm({ ...form, latency_24g_1: Number(event.target.value) })}
                />
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  step="0.01"
                  placeholder="S2"
                  value={form.latency_24g_2}
                  onChange={(event) => setForm({ ...form, latency_24g_2: Number(event.target.value) })}
                />
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  step="0.01"
                  placeholder="S3"
                  value={form.latency_24g_3}
                  onChange={(event) => setForm({ ...form, latency_24g_3: Number(event.target.value) })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Accuracy (%)
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  step="0.01"
                  value={form.accuracy}
                  onChange={(event) => setForm({ ...form, accuracy: Number(event.target.value) })}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Polling rate (Hz)
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  value={form.pollingRate}
                  onChange={(event) => setForm({ ...form, pollingRate: Number(event.target.value) })}
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Lab score (0-100)
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  value={form.labScore}
                  onChange={(event) => setForm({ ...form, labScore: Number(event.target.value) })}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Ranking Score
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  type="number"
                  step="0.01"
                  value={form.rankingScore}
                  onChange={(event) => setForm({ ...form, rankingScore: Number(event.target.value) })}
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Tier (S, A, B, C)
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                  placeholder="S"
                  value={form.tier}
                  onChange={(event) => setForm({ ...form, tier: event.target.value })}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Test Date
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                type="date"
                value={form.testDate}
                onChange={(event) => setForm({ ...form, testDate: event.target.value })}
              />
            </label>

            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Internal Notes
              <textarea
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                placeholder="Product notes, testing conditions..."
                rows={3}
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
              />
            </label>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                className="bench-button rounded-full px-8 py-3 text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
                onClick={submit}
              >
                Save Benchmark
              </button>
              <button
                className="rounded-full border border-slate-200 bg-white/50 px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-neutral-700/60 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-800 active:scale-95"
                onClick={update}
              >
                Update Selected
              </button>
            </div>

            {status && (
              <div className="mt-4 text-xs font-bold text-emerald-500 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2">
                {status}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bench-card rounded-3xl px-6 py-6 font-bold">
        <div className="text-sm uppercase tracking-wider text-foreground">
          Existing datasets
        </div>
        <div className="mt-6 space-y-3">
          {[...benchmarks]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-muted/20 px-4 py-4 transition-colors hover:bg-muted/40"
              >
                <div>
                  <div className="text-sm font-bold text-foreground">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {item.category} · {item.subcategory}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="rounded-full border border-border bg-background px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-muted"
                    onClick={() => setForm(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500/10"
                    onClick={() => remove(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          {benchmarks.length === 0 && (
            <div className="py-12 text-center text-xs text-muted-foreground bg-muted/10 rounded-2xl border border-dashed border-border">
              No benchmarks available in the database yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
