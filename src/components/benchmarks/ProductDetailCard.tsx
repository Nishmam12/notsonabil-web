import Image from "next/image";
import type { BenchmarkDataset } from "@/types/benchmark";

type ProductDetailCardProps = {
  dataset: BenchmarkDataset;
  metricsLabel: string;
  latencyLabel: string;
  accuracyLabel: string;
  pollingLabel: string;
  scoreLabel: string;
  emptyValueLabel: string;
};

export default function ProductDetailCard({
  dataset,
  metricsLabel,
  latencyLabel,
  accuracyLabel,
  pollingLabel,
  scoreLabel,
  emptyValueLabel,
}: ProductDetailCardProps) {
  const imageSrc = dataset.image || "/window.svg";
  return (
    <div className="bench-card rounded-3xl px-8 py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <Image
          className="aspect-square w-28 rounded-3xl object-cover sm:w-32 md:w-36"
          src={imageSrc}
          alt={dataset.name}
          width={220}
          height={220}
          unoptimized
        />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {dataset.subcategory}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {dataset.name}
          </h2>
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">{metricsLabel}</div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="bench-glass rounded-2xl px-4 py-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">{latencyLabel}</div>
              <div className="text-lg font-semibold text-blue-300">
                {dataset.latency}ms
              </div>
            </div>
            <div className="bench-glass rounded-2xl px-4 py-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">{accuracyLabel}</div>
              <div className="text-lg font-semibold text-emerald-300">
                {dataset.accuracy}%
              </div>
            </div>
            <div className="bench-glass rounded-2xl px-4 py-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">{pollingLabel}</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {dataset.pollingRate ? `${dataset.pollingRate}Hz` : emptyValueLabel}
              </div>
            </div>
            <div className="bench-glass rounded-2xl px-4 py-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">{scoreLabel}</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {dataset.labScore}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
