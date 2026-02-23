"use client";

import { useMemo, useState } from "react";
import type { BenchmarkDataset } from "@/types/benchmark";
import DatasetCard from "@/components/benchmarks/DatasetCard";

type SortOption = {
  value: string;
  label: string;
};

type DatasetGridProps = {
  title: string;
  datasets: BenchmarkDataset[];
  sortOptions: SortOption[];
  defaultSort: string;
  sortLabel: string;
  filterLabel: string;
  loadMoreLabel: string;
  reportLabel: string;
  categoryLabel: string;
  scoreLabel: string;
  tierLabel: string;
  compareLabel: string;
  shapeLabel: string;
  onCompare: (dataset: BenchmarkDataset) => void;
  onViewShape: (dataset: BenchmarkDataset) => void;
};

export default function DatasetGrid({
  title,
  datasets,
  sortOptions,
  defaultSort,
  sortLabel,
  filterLabel,
  loadMoreLabel,
  reportLabel,
  categoryLabel,
  scoreLabel,
  tierLabel,
  compareLabel,
  shapeLabel,
  onCompare,
  onViewShape,
}: DatasetGridProps) {
  const [sortBy, setSortBy] = useState(defaultSort);
  const [visibleCount, setVisibleCount] = useState(4);

  const sorted = useMemo(() => {
    const next = [...datasets];
    switch (sortBy) {
      case "ranking":
        return next.sort((a, b) => {
          if (a.rankingScore === b.rankingScore) {
            return b.labScore - a.labScore;
          }
          return b.rankingScore - a.rankingScore;
        });
      case "score":
        return next.sort((a, b) => b.labScore - a.labScore);
      case "latency":
        return next.sort((a, b) => a.latency - b.latency);
      case "latest":
      default:
        return next.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [datasets, sortBy]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
          <span className="bench-accent">▦</span>
          <span>{title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sort</span>
            <select
              className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground outline-none ring-accent/20 transition-all focus:border-accent focus:ring-4"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="" disabled>
                {sortLabel}
              </option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted">
            {filterLabel}
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visible.map((dataset) => (
          <DatasetCard
            key={dataset.id}
            dataset={dataset}
            reportLabel={reportLabel}
            categoryLabel={categoryLabel}
            scoreLabel={scoreLabel}
            tierLabel={tierLabel}
            compareLabel={compareLabel}
            shapeLabel={shapeLabel}
            onCompare={onCompare}
            onViewShape={onViewShape}
          />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <button
          className="rounded-full border border-border bg-background px-8 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setVisibleCount((count) => count + 4)}
          disabled={!hasMore}
        >
          {loadMoreLabel}
        </button>
      </div>
    </div>
  );
}
