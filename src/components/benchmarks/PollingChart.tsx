import type { PollingEntry } from "@/types/benchmark";

type PollingChartProps = {
  title: string;
  subtitle: string;
  entries: PollingEntry[];
  emptyLabel: string;
};

export default function PollingChart({
  title,
  subtitle,
  entries,
  emptyLabel,
}: PollingChartProps) {
  return (
    <div className="bench-card rounded-3xl px-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</div>
          <div className="text-xs text-slate-600 dark:text-slate-500">{subtitle}</div>
        </div>
        <button className="text-xs text-slate-500 dark:text-slate-400">i</button>
      </div>
      <div className="mt-6 space-y-4">
        {entries.length ? (
          entries.map((entry) => (
            <div key={entry.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{entry.label}</span>
                <span>{entry.value}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[rgba(148,163,184,0.15)]">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  style={{ width: `${entry.value}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-slate-500">{emptyLabel}</div>
        )}
      </div>
    </div>
  );
}
