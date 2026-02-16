export type BenchmarkCategory = string;

export type BenchmarkDataset = {
  id: string;
  name: string;
  category: BenchmarkCategory;
  subcategory: string;
  brand: string;
  latency: number;
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
  label: string;
  value: number;
};
