"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { BenchmarkDataset } from "@/types/benchmark";

type QuickComparisonProps = {
  title: string;
  products: BenchmarkDataset[];
  slotLabels: string[];
  latencyLabel: string;
  accuracyLabel: string;
  selectPlaceholder: string;
  selectedIds: (string | "")[];
  onChange: (next: (string | "")[]) => void;
};

export default function QuickComparison({
  title,
  products,
  slotLabels,
  latencyLabel,
  accuracyLabel,
  selectPlaceholder,
  selectedIds,
  onChange,
}: QuickComparisonProps) {
  const [connection, setConnection] = useState<"wired" | "wireless">("wired");

  const options = useMemo(
    () => products.map((product) => ({ value: product.id, label: product.name })),
    [products]
  );

  const calculateAvg = (p: BenchmarkDataset) => {
    const samples = connection === "wired"
      ? [p.latency_wired_1, p.latency_wired_2, p.latency_wired_3]
      : [p.latency_24g_1, p.latency_24g_2, p.latency_24g_3];
    const valid = samples.filter(s => s != null && s > 0);
    if (valid.length === 0) return null;
    const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
    return Number(avg.toFixed(3));
  };

  const updateSlot = (index: number, value: string) => {
    const next = [...selectedIds];
    next[index] = value;
    onChange(next);
  };

  return (
    <div className="bench-card px-6 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
          <span className="bench-accent">✦</span>
          <span>{title}</span>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
          <button
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${connection === "wired"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setConnection("wired")}
          >
            Wired
          </button>
          <button
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${connection === "wireless"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setConnection("wireless")}
          >
            2.4GHz
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {selectedIds.map((value, index) => {
          const selected = products.find((product) => product.id === value);
          const imageSrc = selected?.image || "/window.svg";
          const avgLatency = selected ? calculateAvg(selected) : 0;

          return (
            <div key={`slot-${index}`} className="group space-y-3">
              <div
                className={`flex min-h-[11rem] flex-col items-center justify-center rounded-2xl border transition-all duration-300 px-5 py-6 ${selected
                  ? "border-accent/20 bg-accent/5 ring-1 ring-accent/5"
                  : "border-dashed border-border bg-muted/30"
                  }`}
              >
                {selected ? (
                  <div className="w-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white sm:size-12">
                          <Image
                            className="object-cover"
                            src={imageSrc}
                            alt={selected.name}
                            fill
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-foreground">
                            {selected.name}
                          </div>
                          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {selected.subcategory}
                          </div>
                        </div>
                      </div>
                      <button
                        className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={() => updateSlot(index, "")}
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {latencyLabel}
                        </div>
                        <div className="text-xl font-black text-accent">
                          {avgLatency !== null ? avgLatency.toFixed(3) : "N/A"}
                          {avgLatency !== null && <span className="ml-0.5 text-xs font-medium">ms</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {accuracyLabel}
                        </div>
                        <div className="text-xl font-black text-emerald-500 dark:text-emerald-400">
                          {selected.accuracy > 0 ? selected.accuracy : "N/A"}
                          {selected.accuracy > 0 && <span className="ml-0.5 text-xs font-medium">%</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                      <span className="text-xl font-light">+</span>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {slotLabels[index]}
                    </div>
                  </>
                )}
              </div>
              <select
                className="w-full rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground outline-none ring-accent/20 transition-all focus:border-accent focus:ring-4"
                value={value}
                onChange={(event) => updateSlot(index, event.target.value)}
              >
                <option value="">{selectPlaceholder}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
