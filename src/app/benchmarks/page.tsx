import BenchLayout from "@/components/benchmarks/BenchLayout";
import BenchHeader from "@/components/benchmarks/BenchHeader";
import BenchSidebar from "@/components/benchmarks/BenchSidebar";
import BenchmarksClient from "@/components/benchmarks/BenchmarksClient";
import BenchmarksPageClient from "@/components/benchmarks/BenchmarksPageClient";
import { getBenchmarks } from "@/lib/db";

const formatLabel = (value: string) =>
  value
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function BenchmarksPage() {
  const data = await getBenchmarks();
  const categories = Array.from(new Set(data.map((item) => item.category))).map((id) => ({
    id,
    label: formatLabel(id),
    description: `Performance benchmarks for ${formatLabel(id)} devices.`,
  }));
  const defaultCategory = categories[0];

  if (!defaultCategory) {
    return (
      <BenchLayout>
        <BenchHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Benchmarks", href: "/benchmarks" },
          ]}
          title="Performance Benchmarks"
          description="Real-time laboratory-grade telemetry and standardized hardware analysis."
          actionLabel="Download Methodology PDF"
          actionHref="#"
        />
        <div className="mt-8 text-sm text-slate-600 dark:text-slate-400">
          No benchmarks available yet.
        </div>
      </BenchLayout>
    );
  }

  return (
    <BenchLayout>
      <BenchHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Benchmarks", href: "/benchmarks" },
        ]}
        title="Performance Benchmarks"
        description="Real-time laboratory-grade telemetry and standardized hardware analysis. Our data is refreshed monthly across top current components."
        actionLabel="Download Methodology PDF"
        actionHref="#"
      />
      <BenchmarksPageClient
        categories={categories}
        initialCategory={defaultCategory.id as any}
      />
    </BenchLayout>
  );
}
