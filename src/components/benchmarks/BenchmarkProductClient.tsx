"use client";

import { useEffect, useState } from "react";
import type { BenchmarkDataset } from "@/types/benchmark";
import LatencyChart from "@/components/benchmarks/LatencyChart";
import PollingChart from "@/components/benchmarks/PollingChart";
import DatasetGrid from "@/components/benchmarks/DatasetGrid";
import ProductDetailCard from "@/components/benchmarks/ProductDetailCard";

type BenchmarkProductClientProps = {
  category: string;
  categoryLabel: string;
  productId: string;
};

const buildLatencySeries = (items: BenchmarkDataset[]) => {
  const sorted = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return sorted.slice(-7).map((item) => item.latency);
};

export default function BenchmarkProductClient({
  category,
  categoryLabel,
  productId,
}: BenchmarkProductClientProps) {
  const [datasets, setDatasets] = useState<BenchmarkDataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`/api/benchmarks?category=${category}`);
      const data = (await response.json()) as { data?: BenchmarkDataset[] };
      setDatasets(data.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const current = datasets.find((item) => item.id === productId);
  const related = datasets.filter((item) => item.id !== productId);
  const latencyValues = buildLatencySeries(datasets);
  const pollingEntries = related
    .slice(0, 4)
    .map((item) => ({ label: item.name, value: item.accuracy }));
  const axisLabels = datasets
    .slice(0, 3)
    .map((item) =>
      new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    );

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

  const openShape = (dataset: BenchmarkDataset) => {
    window.open(buildEloShapesUrl([dataset.name]), "_blank", "noopener,noreferrer");
  };

  const openCompare = (dataset: BenchmarkDataset) => {
    if (!current) {
      return;
    }
    window.open(
      buildEloShapesUrl([current.name, dataset.name]),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCompare = (dataset: BenchmarkDataset) => {
    openCompare(dataset);
  };
  const handleViewShape = (dataset: BenchmarkDataset) => {
    openShape(dataset);
  };

  if (!current) {
    return (
      <div className="bench-card rounded-3xl px-6 py-6 text-sm text-slate-600 dark:text-slate-400">
        {loading ? "Loading benchmark..." : "Benchmark not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductDetailCard
        dataset={current}
        metricsLabel="Performance metrics"
        latencyLabel="Latency"
        accuracyLabel="Accuracy"
        pollingLabel="Polling"
        scoreLabel="Lab score"
        emptyValueLabel="N/A"
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
        title={`More ${categoryLabel} benchmarks`}
        datasets={related}
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
        onCompare={handleCompare}
        onViewShape={handleViewShape}
      />
    </div>
  );
}
