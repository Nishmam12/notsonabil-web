import {
  fetchBenchmarks,
  appendBenchmark,
  updateBenchmark,
  deleteBenchmark,
  fetchBrands,
  appendBrand,
  deleteBrand,
  reorderBrands,
} from "./sheets";
import type { BenchmarkDataset } from "@/types/benchmark";
import type { Brand } from "@/types/brand";

export const getBenchmarks = async (): Promise<BenchmarkDataset[]> => {
  return fetchBenchmarks();
};

export const createBenchmark = async (
  benchmark: BenchmarkDataset,
  options?: { sheetId?: string; sheetTab?: string }
) => {
  await appendBenchmark(benchmark, {
    spreadsheetId: options?.sheetId,
    sheetTab: options?.sheetTab,
  });
};

export const updateBenchmarkById = async (
  benchmark: BenchmarkDataset,
  options?: { sheetId?: string; sheetTab?: string }
) => {
  await updateBenchmark(benchmark, {
    spreadsheetId: options?.sheetId,
    sheetTab: options?.sheetTab,
  });
};

export const deleteBenchmarkById = async (
  id: string,
  options?: { sheetId?: string; sheetTab?: string }
) => {
  await deleteBenchmark(id, {
    spreadsheetId: options?.sheetId,
    sheetTab: options?.sheetTab,
  });
};

export const getBrands = async (): Promise<Brand[]> => {
  return fetchBrands();
};

export const createBrand = async (brand: Brand) => {
  await appendBrand(brand);
};

export const deleteBrandById = async (id: string) => {
  await deleteBrand(id);
};

export const reorderBrandDisplay = async (
  updates: { id: string; displayOrder: number }[]
) => {
  await reorderBrands(updates);
};

export const db = {
  benchmarks: {
    getAll: getBenchmarks,
    create: createBenchmark,
    update: updateBenchmarkById,
    delete: deleteBenchmarkById,
  },
  brands: {
    getAll: getBrands,
    create: createBrand,
    delete: deleteBrandById,
    reorder: reorderBrandDisplay,
  },
};

export default db;
