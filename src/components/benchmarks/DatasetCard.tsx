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
  S: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  A: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  B: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  C: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
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
    <div className="bench-card bench-card-hover group relative flex flex-col p-5">
      <div className="flex items-center justify-between">
        <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tierStyle}`}>
          {tierLabel} {dataset.tier}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          {dataset.subcategory}
        </span>
      </div>

      <div className="relative my-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-accent/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
        <div className="relative size-20 overflow-hidden rounded-full border border-border bg-white sm:size-24">
          <Image
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={imageSrc}
            alt={dataset.name}
            fill
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          {categoryLabel}
        </div>
        <div className="mt-1 text-base font-bold text-foreground transition-colors group-hover:text-accent">
          {dataset.name}
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {scoreLabel}
          </div>
          <div className="text-2xl font-black text-foreground">
            {dataset.labScore}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/50 pt-5">
          <Link
            href={`/benchmarks/product/${dataset.id}`}
            className="text-[11px] font-bold uppercase tracking-wider text-accent transition-colors hover:brightness-110"
          >
            {reportLabel}
          </Link>
          <button
            className="rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-muted"
            onClick={() => onCompare(dataset)}
          >
            {compareLabel}
          </button>
          <button
            className="rounded-full border border-accent/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent/10"
            onClick={() => onViewShape(dataset)}
          >
            {shapeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
