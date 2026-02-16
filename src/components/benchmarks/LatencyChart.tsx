"use client";

import { useMemo, useState } from "react";
import type { LatencySeries } from "@/types/benchmark";

type LatencyChartProps = {
  title: string;
  subtitle: string;
  wiredLabel: string;
  wirelessLabel: string;
  wiredSeries: LatencySeries;
  wirelessSeries: LatencySeries;
  axisLabels: string[];
  emptyLabel: string;
};

const buildPath = (values: number[], width: number, height: number) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const step = width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

export default function LatencyChart({
  title,
  subtitle,
  wiredLabel,
  wirelessLabel,
  wiredSeries,
  wirelessSeries,
  axisLabels,
  emptyLabel,
}: LatencyChartProps) {
  const [mode, setMode] = useState<"wired" | "wireless">("wired");
  const series = mode === "wired" ? wiredSeries.values : wirelessSeries.values;

  const path = useMemo(
    () => (series.length > 1 ? buildPath(series, 260, 120) : ""),
    [series]
  );

  return (
    <div className="bench-card rounded-3xl px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</div>
          <div className="text-xs text-slate-600 dark:text-slate-500">{subtitle}</div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1 text-xs text-slate-600 dark:bg-[rgba(15,23,42,0.9)] dark:text-slate-400">
          <button
            className={`rounded-full px-3 py-1 ${
              mode === "wired" ? "bg-blue-500/80 text-white" : ""
            }`}
            onClick={() => setMode("wired")}
          >
            {wiredLabel}
          </button>
          <button
            className={`rounded-full px-3 py-1 ${
              mode === "wireless" ? "bg-blue-500/80 text-white" : ""
            }`}
            onClick={() => setMode("wireless")}
          >
            {wirelessLabel}
          </button>
        </div>
      </div>
      <div className="mt-6">
        {series.length > 1 ? (
          <>
            <svg viewBox="0 0 260 120" className="h-24 w-full sm:h-28 lg:h-32">
              <path
                d={path}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bench-soft-glow"
              />
            </svg>
            <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {axisLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-[6rem] items-center justify-center text-xs text-slate-500 sm:min-h-[7rem] lg:min-h-[8rem]">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
}
