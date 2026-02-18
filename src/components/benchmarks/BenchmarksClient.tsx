"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import QuickComparison from "@/components/benchmarks/QuickComparison";
import LatencyChart from "@/components/benchmarks/LatencyChart";
import PollingChart from "@/components/benchmarks/PollingChart";
import DatasetGrid from "@/components/benchmarks/DatasetGrid";
import type { BenchmarkDataset, PollingEntry } from "@/types/benchmark";

type BenchmarksClientProps = {
  category: string;
  categoryLabel: string;
  description: string;
};

const buildAxisLabels = (items: BenchmarkDataset[]) => {
  return items
    .slice(0, 3)
    .map((item) =>
      new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    );
};

const buildLatencySeries = (items: BenchmarkDataset[]) => {
  const sorted = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return sorted.slice(-7).map((item) => item.latency);
};

const buildPollingEntries = (items: BenchmarkDataset[]): PollingEntry[] => {
  const ranked = [...items]
    .filter((item) => item.accuracy > 0)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 4);
  return ranked.map((item) => ({ label: item.name, value: item.accuracy }));
};

const buildEloShapesUrl = (names: string[]) => {
  if (names.length >= 2) {
    const params = new URLSearchParams();
    params.set("mouse1", names[0]);
    params.set("mouse2", names[1]);
    if (names[2]) {
      params.set("mouse3", names[2]);
    }
    return `https://www.eloshapes.com/compare?${params.toString()}`;
  }
  const params = new URLSearchParams();
  if (names[0]) {
    params.set("q", names[0]);
  }
  return `https://www.eloshapes.com/search?${params.toString()}`;
};

export default function BenchmarksClient({
  category,
  categoryLabel,
  description,
}: BenchmarksClientProps) {
  const [datasets, setDatasets] = useState<BenchmarkDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"benchmarks" | "shape">("benchmarks");
  const [selectedIds, setSelectedIds] = useState<(string | "")[]>(["", "", ""]);
  const [subcategory, setSubcategory] = useState("");
  const [connection, setConnection] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) {
        params.set("category", category);
      }
      const response = await fetch(`/api/benchmarks?${params.toString()}`);
      const data = (await response.json()) as { data?: BenchmarkDataset[] };
      setDatasets(data.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const filtered = useMemo(() => {
    const selectedSub = subcategory.toLowerCase();
    return datasets.filter((item) => {
      const sub = item.subcategory.toLowerCase();
      if (selectedSub && sub !== selectedSub) {
        return false;
      }
      if (connection === "wired" && !sub.includes("wired")) {
        return false;
      }
      if (
        connection === "wireless" &&
        !sub.includes("wireless") &&
        !sub.includes("2.4")
      ) {
        return false;
      }
      return true;
    });
  }, [datasets, subcategory, connection]);

  const comparisonPool = filtered.length ? filtered : datasets;

  const selectedNames = selectedIds
    .map((id) => datasets.find((item) => item.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const latencyValues = buildLatencySeries(filtered);
  const pollingEntries = buildPollingEntries(filtered);
  const axisLabels = buildAxisLabels(filtered);

  const addToCompare = (dataset: BenchmarkDataset) => {
    setSelectedIds((prev) => {
      if (prev.includes(dataset.id)) {
        return prev;
      }
      const next = [...prev];
      const emptyIndex = next.findIndex((value) => value === "");
      if (emptyIndex === -1) {
        next[0] = dataset.id;
      } else {
        next[emptyIndex] = dataset.id;
      }
      return next;
    });
  };

  const openShape = useCallback(
    (dataset?: BenchmarkDataset) => {
      const names = dataset ? [dataset.name] : selectedNames;
      if (!names.length) {
        return;
      }
      window.open(buildEloShapesUrl(names), "_blank", "noopener,noreferrer");
    },
    [selectedNames]
  );

  useEffect(() => {
    if (mode === "shape" && selectedNames.length) {
      openShape();
    }
  }, [mode, selectedNames, openShape]);

  const uniqueSubcategories = Array.from(
    new Set(datasets.map((item) => item.subcategory).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      <div className="bench-card rounded-3xl px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-slate-700 dark:text-neutral-200">
            {description}
          </div>
          <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1 text-xs text-slate-600 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-400 sm:w-auto">
            <button
              className={`flex-1 rounded-full px-4 py-1 sm:flex-none ${
                mode === "benchmarks" ? "bg-blue-500/80 text-white" : "text-slate-600 dark:text-neutral-300"
              }`}
              onClick={() => setMode("benchmarks")}
            >
              Benchmarks
            </button>
            <button
              className={`flex-1 rounded-full px-4 py-1 sm:flex-none ${
                mode === "shape" ? "bg-blue-500/80 text-white" : "text-slate-600 dark:text-neutral-300"
              }`}
              onClick={() => setMode("shape")}
            >
              Shape
            </button>
          </div>
        </div>
      </div>

      {mode === "shape" ? (
        <div className="bench-card rounded-3xl px-6 py-8">
          <div className="text-sm font-semibold text-slate-800 dark:text-neutral-100">
            Shape comparison runs on EloShapes
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
            We open your selected products in a new tab for external shape analysis.
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-neutral-300">
            {selectedNames.length ? (
              selectedNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 dark:border-neutral-800/60 dark:text-neutral-300"
                >
                  {name}
                </span>
              ))
            ) : (
              <span className="text-slate-500 dark:text-neutral-500">No products selected.</span>
            )}
          </div>
          <button
            className="bench-button mt-5 rounded-full px-5 py-2 text-sm font-semibold text-white"
            onClick={() => openShape()}
            disabled={!selectedNames.length}
          >
            Open in EloShapes
          </button>
        </div>
      ) : (
        <>
          <div className="bench-card rounded-3xl px-6 py-5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-neutral-400">
              <select
                className="w-full rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-300 sm:w-auto"
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
              >
                <option value="">All subcategories</option>
                {uniqueSubcategories.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-300 sm:w-auto"
                value={connection}
                onChange={(event) => setConnection(event.target.value)}
              >
                <option value="all">All connections</option>
                <option value="wired">Wired</option>
                <option value="wireless">2.4GHz</option>
              </select>
            </div>
          </div>

          <QuickComparison
            title="Quick Comparison Tool"
            products={comparisonPool}
            slotLabels={["Add Product 1", "Add Product 2", "Add Product 3"]}
            latencyLabel="Latency"
            accuracyLabel="Accuracy"
            selectPlaceholder="Choose product"
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <LatencyChart
              title="Average Click Latency (ms)"
              subtitle="Lower is better · Last 30 days"
              wiredLabel="Wired"
              wirelessLabel="2.4GHz"
              wiredSeries={{ label: "Wired", values: latencyValues }}
              wirelessSeries={{ label: "2.4GHz", values: latencyValues }}
              axisLabels={axisLabels}
              emptyLabel="Latency data unavailable"
            />
            <PollingChart
              title="Polling Rate Consistency"
              subtitle="Stability at 4000Hz · 8000Hz"
              entries={pollingEntries}
              emptyLabel="No polling data available"
            />
          </div>
          <DatasetGrid
            title={`Recent ${categoryLabel || "Device"} Benchmarks`}
            datasets={filtered}
            sortOptions={[
              { value: "ranking", label: "Sort by Ranking" },
              { value: "score", label: "Sort by Score" },
              { value: "latency", label: "Sort by Latency" },
              { value: "latest", label: "Sort by Latest" },
            ]}
            defaultSort="ranking"
            sortLabel="Sort by"
            filterLabel="More Filters"
            loadMoreLabel="Load More Datasets"
            reportLabel="Full Report"
            categoryLabel={categoryLabel}
            scoreLabel="Lab Score"
            tierLabel="Tier"
            compareLabel="Compare"
            shapeLabel="View Shape"
            onCompare={addToCompare}
            onViewShape={openShape}
          />
          {loading ? (
            <div className="text-sm text-slate-600 dark:text-neutral-400">Loading data...</div>
          ) : null}
        </>
      )}
    </div>
  );
}
