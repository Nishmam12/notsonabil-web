"use client";

import { useMemo, useState } from "react";
import type { BenchmarkDataset } from "@/types/benchmark";

type LatencyChartProps = {
  title: string;
  subtitle: string;
  items: BenchmarkDataset[];
  emptyLabel: string;
};

const COLORS = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7", "#ec4899"];

export default function LatencyChart({
  title,
  subtitle,
  items,
  emptyLabel,
}: LatencyChartProps) {
  const [latencyConnectionType, setLatencyConnectionType] = useState<"wired" | "wireless">("wired");

  // Helper to get samples for a dataset based on connection type
  const getSamples = (item: BenchmarkDataset) => {
    return latencyConnectionType === "wired"
      ? [item.latency_wired_1, item.latency_wired_2, item.latency_wired_3]
      : [item.latency_24g_1, item.latency_24g_2, item.latency_24g_3];
  };

  // Helper to calculate average rounded to 3 decimal places
  const calculateAvg = (samples: number[]) => {
    const valid = samples.filter((s) => s != null && s > 0);
    if (valid.length === 0) return 0;
    const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
    return Number(avg.toFixed(3));
  };

  // Process data based on selection count
  const { chartData, isSingle, productAverages } = useMemo(() => {
    // We only care about the LATEST benchmark for each unique product name in the current selection
    const latestByProduct: Record<string, BenchmarkDataset> = {};
    items.forEach((item) => {
      if (!latestByProduct[item.name] || new Date(item.testDate) > new Date(latestByProduct[item.name].testDate)) {
        latestByProduct[item.name] = item;
      }
    });

    const products = Object.values(latestByProduct);
    const productList = products.map((p, i) => ({
      name: p.name,
      avg: calculateAvg(getSamples(p)),
      color: COLORS[i % COLORS.length]
    })).filter(p => p.avg > 0);

    if (productList.length === 1) {
      const p = products[0];
      const samples = getSamples(p);
      const avg = calculateAvg(samples);
      const data = [
        { label: "Run 1", latency: samples[0], type: "run" },
        { label: "Run 2", latency: samples[1], type: "run" },
        { label: "Run 3", latency: samples[2], type: "run" },
        { label: "Average", latency: avg, type: "avg" },
      ].filter(d => d.latency > 0);

      return { chartData: data, isSingle: true, productAverages: productList };
    } else {
      const data = productList.map(p => ({
        label: p.name,
        latency: p.avg,
        type: "avg",
        color: p.color
      }));
      return { chartData: data, isSingle: false, productAverages: productList };
    }
  }, [items, latencyConnectionType]);

  const { maxVal, minVal, range, width, height, margin, padding } = useMemo(() => {
    const values = chartData.map((d) => d.latency).filter(v => v > 0);
    const max = values.length > 0 ? Math.max(...values) : 10;
    const min = values.length > 0 ? Math.min(...values) : 0;

    // Professional Dynamic Scaling
    const span = max - min;
    const paddingVal = span === 0 ? max * 0.15 : span * 0.15;
    const vMax = max + paddingVal;
    const vMin = Math.max(0, min - paddingVal);

    return {
      maxVal: vMax,
      minVal: vMin,
      range: vMax - vMin || 1,
      width: 400,
      height: 200,
      margin: { top: 20, right: 50, left: 15, bottom: 20 },
      padding: { left: 20, right: 30 }
    };
  }, [chartData]);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const chartLeft = margin.left + padding.left;
  const chartRight = width - margin.right - padding.right;
  const availableWidth = chartRight - chartLeft;

  const step = availableWidth / (chartData.length > 1 ? chartData.length - 1 : 1);

  const points = chartData.map((d, i) => ({
    x: chartData.length === 1 ? chartLeft + availableWidth / 2 : chartLeft + i * step,
    y: margin.top + innerHeight - ((d.latency - minVal) / range) * innerHeight,
    ...d
  }));

  const path = points.length > 1
    ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    : "";

  return (
    <div className="bench-card px-6 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {subtitle}
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
          <button
            className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${latencyConnectionType === "wired"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setLatencyConnectionType("wired")}
          >
            Wired
          </button>
          <button
            className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${latencyConnectionType === "wireless"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setLatencyConnectionType("wireless")}
          >
            2.4GHz
          </button>
        </div>
      </div>

      <div className="mt-8">
        {chartData.length > 0 ? (
          <>
            <div className="relative h-56 w-full overflow-hidden">
              <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                  <line
                    key={p}
                    x1={margin.left}
                    y1={margin.top + innerHeight * p}
                    x2={width - margin.right}
                    y2={margin.top + innerHeight * p}
                    className="stroke-muted/10"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Main Path for Single Mouse View or Connection View */}
                {isSingle && path && (
                  <path
                    d={path}
                    fill="none"
                    stroke="var(--color-accent, #f97316)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-50 bench-soft-glow"
                  />
                )}

                {/* Points */}
                {points.map((p, i) => (
                  <g key={i} className="group/point" style={{ overflow: "visible" }}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={p.type === "avg" ? "6" : "4"}
                      fill={isSingle ? (p.type === "avg" ? "var(--color-accent, #f97316)" : "currentColor") : (p as any).color}
                      className={isSingle ? (p.type === "avg" ? "text-accent" : "text-muted-foreground/40") : ""}
                    />
                    {/* Tooltip-like label on hover */}
                    <text
                      x={p.x}
                      y={p.y}
                      dy={-12}
                      textAnchor="middle"
                      style={{ fontSize: "14px" }}
                      className="hidden group-hover/point:block font-bold fill-foreground"
                    >
                      {Number(p.latency.toFixed(3))} ms
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Bottom Axis Labels */}
            <div className={`mt-6 relative h-6 w-full text-xs font-bold uppercase tracking-widest text-muted-foreground/60 transition-opacity ${isSingle ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
              {points.map((p, i) => (
                <span
                  key={i}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${(p.x / width) * 100}%`, fontSize: "12px" }}
                >
                  {p.label}
                </span>
              ))}
            </div>

            {/* Legend / Detailed list */}
            <div className="mt-8 space-y-3">
              {productAverages.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-2xl bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color || "var(--color-accent, #f97316)" }} />
                    <span className="truncate text-xs font-bold text-foreground">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-accent">{Number(p.avg.toFixed(3))}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ms</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-[10rem] items-center justify-center text-xs text-slate-500">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
}
