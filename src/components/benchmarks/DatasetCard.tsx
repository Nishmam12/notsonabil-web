import Image from "next/image";
import Link from "next/link";
import type { BenchmarkDataset } from "@/types/benchmark";

type DatasetCardProps = {
  dataset: BenchmarkDataset;
  reportLabel: string;
  categoryLabel: string;
  scoreLabel: string;
  tierLabel: string;
  compareLabel: string;
  shapeLabel: string;
  onCompare: (dataset: BenchmarkDataset) => void;
  onViewShape: (dataset: BenchmarkDataset) => void;
};

const tierStyles: Record<string, string> = {
  S: "bg-emerald-500/20 text-emerald-200",
  A: "bg-amber-500/20 text-amber-200",
  B: "bg-blue-500/20 text-blue-200",
  C: "bg-slate-500/20 text-slate-200",
};

export default function DatasetCard({
  dataset,
  reportLabel,
  categoryLabel,
  scoreLabel,
  tierLabel,
  compareLabel,
  shapeLabel,
  onCompare,
  onViewShape,
}: DatasetCardProps) {
  const tierStyle = tierStyles[dataset.tier] ?? tierStyles.C;
  const imageSrc = dataset.image || "/window.svg";

  return (
    <div className="bench-card rounded-2xl p-4 transition hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tierStyle}`}>
          {tierLabel} {dataset.tier}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">
          {dataset.subcategory}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <Image
          className="aspect-square w-16 rounded-full object-cover sm:w-20"
          src={imageSrc}
          alt={dataset.name}
          width={160}
          height={160}
          unoptimized
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        <span>{categoryLabel}</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {dataset.name}
      </div>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {scoreLabel}{" "}
        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {dataset.labScore}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
        <Link href={`/benchmarks/${dataset.category}/${dataset.id}`} className="text-blue-500 dark:text-blue-300">
          {reportLabel}
        </Link>
        <button
          className="rounded-full border border-slate-300 px-3 py-1 text-slate-600 dark:border-slate-700/60 dark:text-slate-300"
          onClick={() => onCompare(dataset)}
        >
          {compareLabel}
        </button>
        <button
          className="rounded-full border border-blue-500/40 px-3 py-1 text-blue-500 dark:text-blue-300"
          onClick={() => onViewShape(dataset)}
        >
          {shapeLabel}
        </button>
      </div>
    </div>
  );
}
