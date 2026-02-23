import { useMemo } from "react";
import type { BenchmarkDataset } from "@/types/benchmark";

type PollingChartProps = {
  title: string;
  subtitle: string;
  items: BenchmarkDataset[];
  emptyLabel: string;
};

export default function PollingChart({
  title,
  subtitle,
  items,
  emptyLabel,
}: PollingChartProps) {
  const entries = useMemo(() => {
    // Only show products that have a polling rate > 0
    return items
      .filter((item) => item.pollingRate && item.pollingRate > 0)
      .map((item) => ({
        id: item.id,
        label: item.name,
        value: item.pollingRate,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Show top 5
  }, [items]);

  return (
    <div className="bench-card px-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{subtitle}</div>
        </div>
        <div className="flex size-6 items-center justify-center rounded-full border border-border text-[10px] font-bold text-muted-foreground">
          ?
        </div>
      </div>
      <div className="mt-8 space-y-5">
        {entries.length ? (
          entries.map((entry) => (
            <div key={entry.id} className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-foreground">{entry.label}</span>
                <span className="text-accent">{entry.value}Hz</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${Math.min(100, (entry.value / 8000) * 100)}%` }} // Scaling based on 8000Hz max
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
}
