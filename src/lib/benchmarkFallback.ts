import type { BenchmarkDataset } from "@/types/benchmark";
import { computeRankingScore } from "@/lib/benchmarkRanking";

const buildBenchmark = (data: Omit<BenchmarkDataset, "rankingScore">): BenchmarkDataset => ({
  ...data,
  rankingScore: computeRankingScore(data.latency, data.accuracy, data.pollingRate),
});

const fallbackBenchmarks: BenchmarkDataset[] = [
  buildBenchmark({
    id: "arc-mouse-pro",
    name: "Arc Mouse Pro",
    category: "mice",
    subcategory: "Wireless 2.4GHz",
    brand: "Ajazz",
    latency: 1.6,
    accuracy: 98.4,
    pollingRate: 8000,
    labScore: 92,
    tier: "S",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2025-01-14",
    testDate: "2025-01-14",
    notes: "Flagship wireless tuning profile.",
  }),
  buildBenchmark({
    id: "nova-kb-60",
    name: "Nova KB 60",
    category: "keyboards",
    subcategory: "Mechanical",
    brand: "Mechlands",
    latency: 4.2,
    accuracy: 96.1,
    pollingRate: 1000,
    labScore: 86,
    tier: "A",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-11-22",
    testDate: "2024-11-22",
    notes: "Consistent debounce and key chatter control.",
  }),
  buildBenchmark({
    id: "halo-iem-s1",
    name: "Halo IEM S1",
    category: "audio",
    subcategory: "In-ear Monitor",
    brand: "Blusstyle",
    latency: 7.8,
    accuracy: 93.2,
    pollingRate: 0,
    labScore: 81,
    tier: "A",
    image:
      "https://images.unsplash.com/photo-1518445691929-8d8b42a98b01?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-09-09",
    testDate: "2024-09-09",
    notes: "High imaging accuracy in reference tests.",
  }),
  buildBenchmark({
    id: "eclipse-27",
    name: "Eclipse 27",
    category: "monitors",
    subcategory: "240Hz IPS",
    brand: "ALICE",
    latency: 2.9,
    accuracy: 95.4,
    pollingRate: 0,
    labScore: 88,
    tier: "A",
    image:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2025-02-02",
    testDate: "2025-02-02",
    notes: "Excellent motion clarity at 240Hz.",
  }),
  buildBenchmark({
    id: "volt-gpu-4080",
    name: "Volt GPU 4080",
    category: "gpus",
    subcategory: "RTX 4080",
    brand: "Volt",
    latency: 3.5,
    accuracy: 94.1,
    pollingRate: 0,
    labScore: 90,
    tier: "S",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-10-18",
    testDate: "2024-10-18",
    notes: "Stable frame pacing under sustained load.",
  }),
  buildBenchmark({
    id: "zen-mobo-x",
    name: "Zen Mobo X",
    category: "motherboards",
    subcategory: "X670E",
    brand: "Royal Kludge",
    latency: 4.8,
    accuracy: 92.5,
    pollingRate: 0,
    labScore: 84,
    tier: "B",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-08-14",
    testDate: "2024-08-14",
    notes: "Strong I/O throughput and stable power delivery.",
  }),
];

export const getFallbackBenchmarks = () => fallbackBenchmarks;
