import { supabaseServer } from "@/lib/supabase-server";
import type { BenchmarkDataset } from "@/types/benchmark";
import type { Brand } from "@/types/brand";
import { logger } from "@/lib/logger";

interface BenchmarkRow {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string | null;
  latency_wired_1: number | null;
  latency_wired_2: number | null;
  latency_wired_3: number | null;
  latency_24g_1: number | null;
  latency_24g_2: number | null;
  latency_24g_3: number | null;
  accuracy: number | null;
  polling_rate: number | null;
  lab_score: number | null;
  ranking_score: number | null;
  tier: string | null;
  image_url: string | null;
  test_date: string | null;
  internal_notes: string | null;
  published: boolean;
  created_at: string;
}

const mapBenchmarkRowToDataset = (row: BenchmarkRow) => {
  const lw1 = row.latency_wired_1 || 0;
  const lw2 = row.latency_wired_2 || 0;
  const lw3 = row.latency_wired_3 || 0;
  const l24g1 = row.latency_24g_1 || 0;
  const l24g2 = row.latency_24g_2 || 0;
  const l24g3 = row.latency_24g_3 || 0;

  // Calculate average for backward compatibility
  const samples = [lw1, lw2, lw3, l24g1, l24g2, l24g3].filter(v => v > 0);
  const latency = samples.length > 0 ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;

  const accuracy = typeof row.accuracy === "number" ? row.accuracy : 0;
  const pollingRate =
    typeof row.polling_rate === "number" ? row.polling_rate : 0;
  const labScore = typeof row.lab_score === "number" ? row.lab_score : 0;
  const image = row.image_url || "";
  const createdAt = row.created_at;
  const dataset: BenchmarkDataset = {
    id: row.id,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    brand: row.brand || "",
    latency,
    latency_wired_1: lw1,
    latency_wired_2: lw2,
    latency_wired_3: lw3,
    latency_24g_1: l24g1,
    latency_24g_2: l24g2,
    latency_24g_3: l24g3,
    accuracy,
    pollingRate,
    labScore,
    tier: row.tier || "",
    image,
    createdAt,
    rankingScore: typeof row.ranking_score === "number" ? row.ranking_score : 0,
    testDate: row.test_date || row.created_at,
    notes: row.internal_notes || "",
  };
  return dataset;
};

export const getBenchmarks = async (): Promise<BenchmarkDataset[]> => {
  try {
    const { data, error } = await supabaseServer
      .from("benchmarks")
      .select(
        "id, name, category, subcategory, brand, latency_wired_1, latency_wired_2, latency_wired_3, latency_24g_1, latency_24g_2, latency_24g_3, accuracy, polling_rate, lab_score, ranking_score, tier, image_url, test_date, internal_notes, published, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch benchmarks", error);
      return [];
    }

    return (data || []).map(mapBenchmarkRowToDataset);
  } catch (err) {
    logger.error("Unexpected error fetching benchmarks", err);
    return [];
  }
};

export const createBenchmark = async (benchmark: BenchmarkDataset) => {
  try {
    const { error } = await supabaseServer.from("benchmarks").insert({
      id: benchmark.id || crypto.randomUUID(),
      name: benchmark.name,
      category: benchmark.category,
      subcategory: benchmark.subcategory,
      brand: benchmark.brand,
      latency_wired_1: Number(benchmark.latency_wired_1),
      latency_wired_2: Number(benchmark.latency_wired_2),
      latency_wired_3: Number(benchmark.latency_wired_3),
      latency_24g_1: Number(benchmark.latency_24g_1),
      latency_24g_2: Number(benchmark.latency_24g_2),
      latency_24g_3: Number(benchmark.latency_24g_3),
      accuracy: Number(benchmark.accuracy),
      polling_rate: Number(benchmark.pollingRate),
      lab_score: Number(benchmark.labScore),
      ranking_score: Number(benchmark.rankingScore),
      tier: benchmark.tier,
      image_url: benchmark.image,
      test_date: benchmark.testDate ? new Date(benchmark.testDate).toISOString().split("T")[0] : null,
      internal_notes: benchmark.notes,
      published: true,
    });
    if (error) throw error;
  } catch (err) {
    logger.error("Failed to create benchmark", err);
    throw err;
  }
};

export const updateBenchmarkById = async (benchmark: BenchmarkDataset) => {
  try {
    const { error } = await supabaseServer
      .from("benchmarks")
      .update({
        name: benchmark.name,
        category: benchmark.category,
        subcategory: benchmark.subcategory,
        brand: benchmark.brand,
        latency_wired_1: Number(benchmark.latency_wired_1),
        latency_wired_2: Number(benchmark.latency_wired_2),
        latency_wired_3: Number(benchmark.latency_wired_3),
        latency_24g_1: Number(benchmark.latency_24g_1),
        latency_24g_2: Number(benchmark.latency_24g_2),
        latency_24g_3: Number(benchmark.latency_24g_3),
        accuracy: Number(benchmark.accuracy),
        polling_rate: Number(benchmark.pollingRate),
        lab_score: Number(benchmark.labScore),
        ranking_score: Number(benchmark.rankingScore),
        tier: benchmark.tier,
        image_url: benchmark.image,
        test_date: benchmark.testDate ? new Date(benchmark.testDate).toISOString().split("T")[0] : null,
        internal_notes: benchmark.notes,
        published: true,
      })
      .eq("id", benchmark.id);
    if (error) throw error;
  } catch (err) {
    logger.error("Failed to update benchmark", err);
  }
};

export const deleteBenchmarkById = async (id: string) => {
  try {
    const { error } = await supabaseServer.from("benchmarks").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    logger.error("Failed to delete benchmark", err);
  }
};

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const { data, error } = await supabaseServer
      .from("brands")
      .select("id, logo_url, display_order, created_at")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      logger.error("Failed to fetch brands", error);
      return [];
    }

    if (!data) return [];
    return data.map((row) => ({
      id: row.id,
      logoUrl: row.logo_url,
      displayOrder: row.display_order,
      createdAt: row.created_at,
    }));
  } catch (err) {
    logger.error("Unexpected error fetching brands", err);
    return [];
  }
};

export const createBrand = async (brand: Brand) => {
  try {
    const { error } = await supabaseServer.from("brands").insert({
      id: brand.id,
      logo_url: brand.logoUrl,
      display_order: brand.displayOrder,
    });
    if (error) throw error;
  } catch (err) {
    logger.error("Failed to create brand", err);
  }
};

export const deleteBrandById = async (id: string) => {
  try {
    const { error } = await supabaseServer.from("brands").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    logger.error("Failed to delete brand", err);
  }
};

export const reorderBrandDisplay = async (
  updates: { id: string; displayOrder: number }[],
) => {
  try {
    if (!updates.length) return;
    const payload = updates.map((item) => ({
      id: item.id,
      display_order: item.displayOrder,
    }));
    const { error } = await supabaseServer.from("brands").upsert(payload);
    if (error) throw error;
  } catch (err) {
    logger.error("Failed to reorder brands", err);
  }
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
