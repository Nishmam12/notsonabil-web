import AdminLayout from "@/components/admin/AdminLayout";
import BenchmarksAdminPanel from "@/components/admin/BenchmarksAdminPanel";
import { getBenchmarks } from "@/lib/db";
import type { BenchmarkDataset } from "@/types/benchmark";

export default async function AdminBenchmarksPage() {
  let initialBenchmarks: BenchmarkDataset[] = [];
  let initialError = "";
  try {
    initialBenchmarks = await getBenchmarks();
  } catch {
    initialError = "Benchmarks data is unavailable.";
  }

  return (
    <AdminLayout
      title="Benchmarks"
      description="Create, edit, and sync benchmark datasets."
    >
      <BenchmarksAdminPanel
        initialBenchmarks={initialBenchmarks}
        initialError={initialError}
        sheetsConnected={false}
      />
    </AdminLayout>
  );
}
