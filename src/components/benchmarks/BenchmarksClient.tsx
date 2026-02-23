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
  const [selectedMiceIds, setSelectedMiceIds] = useState<(string | "")[]>(["", "", ""]);
  const [subcategory, setSubcategory] = useState("");

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
      const sub = (item.subcategory || "").toLowerCase();
      if (selectedSub && sub !== selectedSub) {
        return false;
      }
      return true;
    });
  }, [datasets, subcategory]);

  const comparisonPool = filtered.length ? filtered : datasets;

  const selectedMice = useMemo(() => {
    return selectedMiceIds
      .map((id) => datasets.find((item) => item.id === id))
      .filter((p): p is BenchmarkDataset => Boolean(p));
  }, [selectedMiceIds, datasets]);

  const latencyData = useMemo(() => {
    return selectedMice.length > 0 ? selectedMice : filtered.slice(-3);
  }, [selectedMice, filtered]);

  const pollingData = useMemo(() => {
    return selectedMice.length > 0 ? selectedMice : filtered.slice(0, 5);
  }, [selectedMice, filtered]);

  const selectedNames = useMemo(() => selectedMice.map(p => p.name), [selectedMice]);


  const addToCompare = (dataset: BenchmarkDataset) => {
    setSelectedMiceIds((prev) => {
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
    <div className="space-y-8">
      <div className="bench-card px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-muted-foreground">
            {description}
          </div>
          <div className="flex w-full items-center gap-1 rounded-full border border-border bg-muted/50 p-1 sm:w-auto">
            <button
              className={`flex-1 rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:flex-none ${mode === "benchmarks"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setMode("benchmarks")}
            >
              Benchmarks
            </button>
            <button
              className={`flex-1 rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:flex-none ${mode === "shape"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setMode("shape")}
            >
              Shape
            </button>
          </div>
        </div>
      </div>

      {mode === "shape" ? (
        <div className="bench-card px-6 py-8">
          <div className="text-sm font-semibold text-foreground">
            Shape comparison runs on EloShapes
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            We open your selected products in a new tab for external shape analysis.
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {selectedMice.length ? (
              selectedMice.map((p) => (
                <span
                  key={p.id}
                  className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {p.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No products selected.</span>
            )}
          </div>
          <button
            className="bench-button mt-6 rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm"
            onClick={() => openShape()}
            disabled={!selectedNames.length}
          >
            Open in EloShapes
          </button>
        </div>
      ) : (
        <>
          <div className="bench-card px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Subcategory
                </span>
                <select
                  className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground outline-none ring-accent/20 transition-all focus:border-accent focus:ring-4"
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                >
                  <option value="">All items</option>
                  {uniqueSubcategories.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <QuickComparison
            title="Quick Comparison Tool"
            products={comparisonPool}
            slotLabels={["Add Product 1", "Add Product 2", "Add Product 3"]}
            latencyLabel="Latency"
            accuracyLabel="Accuracy"
            selectPlaceholder="Choose product"
            selectedIds={selectedMiceIds}
            onChange={setSelectedMiceIds}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <LatencyChart
              title="Click Latency comparison"
              subtitle="Lower is better"
              items={latencyData}
              emptyLabel="Latency data unavailable"
            />
            <PollingChart
              title="Polling Rate Consistency"
              subtitle="Stability at 4000Hz · 8000Hz"
              items={pollingData}
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
            <div className="flex items-center justify-center py-10">
              <div className="text-sm font-medium text-muted-foreground">Loading data...</div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

