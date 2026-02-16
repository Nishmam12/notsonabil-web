import AdminLayout from "@/components/admin/AdminLayout";
import BenchmarksAdminPanel from "@/components/admin/BenchmarksAdminPanel";
import { fetchBenchmarks } from "@/lib/googleSheets";
import type { BenchmarkDataset } from "@/types/benchmark";

export default async function AdminBenchmarksPage() {
  let initialBenchmarks: BenchmarkDataset[] = [];
  let initialError = "";
  try {
    initialBenchmarks = await fetchBenchmarks();
  } catch {
    initialError =
      "Benchmarks data is unavailable. Check Google Sheets environment variables.";
  }
  const sheetsConnected = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_SHEETS_ID
  );

  return (
    <AdminLayout
      title="Benchmarks"
      description="Create, edit, and sync benchmark datasets."
    >
      <BenchmarksAdminPanel
        initialBenchmarks={initialBenchmarks}
        initialError={initialError}
        sheetsConnected={sheetsConnected}
      />
    </AdminLayout>
  );
}
