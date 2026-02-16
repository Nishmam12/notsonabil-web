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

const extractSheetId = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const directMatch = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (directMatch) {
    return directMatch[1];
  }
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (idMatch) {
    return idMatch[1];
  }
  return trimmed;
};

export default function BenchmarksAdminPanel({
  initialBenchmarks,
  initialError,
  sheetsConnected,
}: BenchmarksAdminPanelProps) {
  const [benchmarks, setBenchmarks] = useState<BenchmarkDataset[]>(initialBenchmarks);
  const [form, setForm] = useState<BenchmarkDataset>(emptyForm);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sheetId, setSheetId] = useState("");
  const [sheetTab, setSheetTab] = useState("");

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
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as { url?: string };
    const nextUrl = data.url ?? "";
    if (nextUrl) {
      setForm((prev) => ({ ...prev, image: nextUrl }));
    }
    setUploading(false);
  };

  const submit = async () => {
    setStatus("");
    const normalizedSheetId = sheetId.trim();
    const normalizedSheetTab = (sheetTab.trim() || form.category).trim();
    const payload = {
      ...form,
      createdAt: form.testDate || form.createdAt,
      latency: Number(form.latency),
      accuracy: Number(form.accuracy),
      pollingRate: Number(form.pollingRate),
      labScore: Number(form.labScore),
      rankingScore: Number(form.rankingScore),
      sheetId: normalizedSheetId || undefined,
      sheetTab: normalizedSheetTab || undefined,
    };
    const response = await fetch("/api/benchmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      setStatus("Failed to save benchmark");
      return;
    }
    setStatus("Saved");
    setForm(emptyForm);
    refresh();
  };

  const update = async () => {
    setStatus("");
    const normalizedSheetId = sheetId.trim();
    const normalizedSheetTab = (sheetTab.trim() || form.category).trim();
    const payload = {
      ...form,
      createdAt: form.testDate || form.createdAt,
      latency: Number(form.latency),
      accuracy: Number(form.accuracy),
      pollingRate: Number(form.pollingRate),
      labScore: Number(form.labScore),
      rankingScore: Number(form.rankingScore),
      sheetId: normalizedSheetId || undefined,
      sheetTab: normalizedSheetTab || undefined,
    };
    const response = await fetch(`/api/benchmarks/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      setStatus("Failed to update benchmark");
      return;
    }
    setStatus("Updated");
    setForm(emptyForm);
    refresh();
  };

  const remove = async (id: string) => {
    setStatus("");
    const params = new URLSearchParams();
    const normalizedSheetId = sheetId.trim();
    const normalizedSheetTab = (sheetTab.trim() || form.category).trim();
    if (normalizedSheetId) {
      params.set("sheetId", normalizedSheetId);
    }
    if (normalizedSheetTab) {
      params.set("sheetTab", normalizedSheetTab);
    }
    const query = params.toString();
    const response = await fetch(`/api/benchmarks/${id}${query ? `?${query}` : ""}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setStatus("Failed to delete benchmark");
      return;
    }
    setStatus("Deleted");
    refresh();
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
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Manage Benchmarks
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Syncs directly to Google Sheets.</span>
              <span className="rounded-full border border-blue-500/40 px-2 py-0.5 text-[10px] text-blue-500 dark:text-blue-300">
                {sheetsConnected ? "Sheets connected" : "Sheets not configured"}
              </span>
            </div>
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-300"
            onClick={refresh}
          >
            Refresh
          </button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              Product ID
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                placeholder="ID"
                value={form.id}
                onChange={(event) => setForm({ ...form, id: event.target.value })}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              Product name
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                placeholder="Product name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                Category
                <input
                  list="category-options"
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                  placeholder="Category"
                  value={form.category}
                  onChange={(event) => {
                    const value = event.target.value;
                    setForm({ ...form, category: value });
                    if (!sheetTab) {
                      setSheetTab(value);
                    }
                  }}
                />
                <datalist id="category-options">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>
              <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                Subcategory
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                  placeholder="Subcategory"
                  value={form.subcategory}
                  onChange={(event) => setForm({ ...form, subcategory: event.target.value })}
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              Brand
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                placeholder="Brand"
                value={form.brand}
                onChange={(event) => setForm({ ...form, brand: event.target.value })}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              Image URL
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                placeholder="Image URL"
                value={form.image}
                onChange={(event) => setForm({ ...form, image: event.target.value })}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              Test date
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                type="date"
                value={form.testDate}
                onChange={(event) => setForm({ ...form, testDate: event.target.value })}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              Tier
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                placeholder="Tier (S/A/B)"
                value={form.tier}
                onChange={(event) => setForm({ ...form, tier: event.target.value })}
              />
            </label>
          </div>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                Latency (ms)
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                  placeholder="Latency"
                  type="number"
                  step="0.01"
                  value={form.latency}
                  onChange={(event) =>
                    setForm({ ...form, latency: Number(event.target.value) })
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                Accuracy (%)
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                  placeholder="Accuracy"
                  type="number"
                  step="0.01"
                  value={form.accuracy}
                  onChange={(event) =>
                    setForm({ ...form, accuracy: Number(event.target.value) })
                  }
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                Polling rate (Hz)
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                  placeholder="Polling rate"
                  type="number"
                  step="1"
                  value={form.pollingRate}
                  onChange={(event) =>
                    setForm({ ...form, pollingRate: Number(event.target.value) })
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                Lab score
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                  placeholder="Lab score"
                  type="number"
                  step="1"
                  value={form.labScore}
                  onChange={(event) =>
                    setForm({ ...form, labScore: Number(event.target.value) })
                  }
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                Ranking score
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                  placeholder="Ranking score"
                  type="number"
                  step="0.01"
                  value={form.rankingScore}
                  onChange={(event) =>
                    setForm({ ...form, rankingScore: Number(event.target.value) })
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                Notes
                <input
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                  placeholder="Notes"
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                />
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 text-xs text-slate-600 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-300">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Sheet settings
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  Sheet URL or ID
                  <input
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetId}
                    onChange={(event) => setSheetId(extractSheetId(event.target.value))}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  Sheet tab (category)
                  <input
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-200"
                    placeholder="Benchmarks"
                    value={sheetTab}
                    onChange={(event) => setSheetTab(event.target.value)}
                  />
                </label>
              </div>
            </div>
            <label className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
              Upload image
              <input
                className="text-xs text-slate-600 dark:text-slate-300"
                type="file"
                accept="image/*"
                onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
              />
            </label>
            {uploading ? (
              <div className="text-xs text-slate-500 dark:text-slate-400">Uploading...</div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button
                className="bench-button rounded-full px-4 py-2 text-xs font-semibold text-white"
                onClick={submit}
              >
                Save to Sheets
              </button>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-600 dark:border-slate-700/60 dark:text-slate-300"
                onClick={update}
              >
                Update Sheet
              </button>
            </div>
            {status ? (
              <div className="text-xs text-slate-500 dark:text-slate-400">{status}</div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Existing datasets
        </div>
        <div className="mt-4 space-y-3">
          {benchmarks.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 text-xs text-slate-600 dark:border-slate-800/50 dark:text-slate-300"
            >
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {item.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {item.category} · {item.subcategory}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-700/60 dark:text-slate-300"
                  onClick={() => setForm(item)}
                >
                  Edit
                </button>
                <button
                  className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-500 dark:text-red-200"
                  onClick={() => remove(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {benchmarks.length === 0 ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              No benchmarks available.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
