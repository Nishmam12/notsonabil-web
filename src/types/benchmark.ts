export type BenchmarkCategory = string;

export type BenchmarkDataset = {
  id: string;
  name: string;
  category: BenchmarkCategory;
  subcategory: string;
  brand: string;
  latency: number;
  latency_wired_1: number;
  latency_wired_2: number;
  latency_wired_3: number;
  latency_24g_1: number;
  latency_24g_2: number;
  latency_24g_3: number;
  accuracy: number;
  pollingRate: number;
  labScore: number;
  tier: string;
  image: string;
  createdAt: string;
  rankingScore: number;
  testDate: string;
  notes: string;
  rankingPosition?: number;
};

export type LatencySeries = {
  label: string;
  values: number[];
};

export type PollingEntry = {
  id: string;
  label: string;
  value: number;
};
