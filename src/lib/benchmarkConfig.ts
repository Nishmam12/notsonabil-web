import type { BenchmarkCategory } from "@/types/benchmark";

export const benchmarkCategories: {
  id: BenchmarkCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "mice",
    label: "Mice",
    description: "Click latency, sensor accuracy, and tracking stability.",
  },
  {
    id: "keyboards",
    label: "Keyboards",
    description: "Switch response, debounce, and acoustic consistency.",
  },
  {
    id: "audio",
    label: "Audio",
    description: "Latency, imaging accuracy, and noise isolation.",
  },
  {
    id: "monitors",
    label: "Monitors",
    description: "Response time, color accuracy, and uniformity.",
  },
  {
    id: "gpus",
    label: "GPUs",
    description: "Frame pacing, thermal response, and efficiency.",
  },
  {
    id: "motherboards",
    label: "Motherboards",
    description: "I/O throughput, latency, and power delivery.",
  },
];
