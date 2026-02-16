"use client";

import Image from "next/image";
import { useMemo } from "react";
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
  const options = useMemo(
    () => products.map((product) => ({ value: product.id, label: product.name })),
    [products]
  );

  const updateSlot = (index: number, value: string) => {
    const next = [...selectedIds];
    next[index] = value;
    onChange(next);
  };

  return (
    <div className="bench-card rounded-3xl px-6 py-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span className="bench-accent">✦</span>
        <span>{title}</span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {selectedIds.map((value, index) => {
          const selected = products.find((product) => product.id === value);
          const imageSrc = selected?.image || "/window.svg";
          return (
            <div key={`slot-${index}`} className="space-y-3">
              <div
                className={`flex min-h-[10rem] flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center sm:min-h-[11rem] ${
                  selected
                    ? "bench-glass border-slate-200 dark:border-slate-700/40"
                    : "border-slate-200 bg-white/80 dark:border-slate-700/60 dark:bg-[rgba(10,16,30,0.65)]"
                }`}
              >
                {selected ? (
                  <div className="w-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Image
                          className="aspect-square w-10 rounded-xl object-cover sm:w-12"
                          src={imageSrc}
                          alt={selected.name}
                          width={120}
                          height={120}
                          unoptimized
                        />
                        <div>
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {selected.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {selected.subcategory}
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-xs text-slate-500"
                        onClick={() => updateSlot(index, "")}
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-left">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{latencyLabel}</div>
                        <div className="text-lg font-semibold text-blue-300">
                          {selected.latency}ms
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{accuracyLabel}</div>
                        <div className="text-lg font-semibold text-emerald-300">
                          {selected.accuracy}%
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-[rgba(59,130,246,0.1)] text-blue-300 sm:size-10">
                      +
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{slotLabels[index]}</div>
                  </>
                )}
              </div>
              <select
                className="w-full rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-300"
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
