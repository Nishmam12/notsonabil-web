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

// This db.ts serve as an abstraction layer. 
// For now it wraps Google Sheets, but can be easily swapped for a real DB later.

export const db = {
    benchmarks: {
        getAll: fetchBenchmarks,
        create: appendBenchmark,
        update: updateBenchmark,
        delete: deleteBenchmark,
    },
    brands: {
        getAll: fetchBrands,
        create: appendBrand,
        delete: deleteBrand,
        reorder: reorderBrands,
    },
};

export default db;
