import { notFound } from "next/navigation";
import BenchLayout from "@/components/benchmarks/BenchLayout";
import BenchHeader from "@/components/benchmarks/BenchHeader";
import BenchSidebar from "@/components/benchmarks/BenchSidebar";
import BenchmarksClient from "@/components/benchmarks/BenchmarksClient";
import { fetchBenchmarks } from "@/lib/sheets";

type PageProps = {
  params: { category: string };
};

const formatLabel = (value: string) =>
  value
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function BenchmarkCategoryPage({ params }: PageProps) {
  const data = await fetchBenchmarks();
  const categories = Array.from(new Set(data.map((item) => item.category))).map((id) => ({
    id,
    label: formatLabel(id),
    description: `Performance benchmarks for ${formatLabel(id)} devices.`,
  }));
  const category = categories.find((item) => item.id === params.category);

  if (!category) {
    notFound();
  }

  return (
    <BenchLayout>
      <BenchHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Benchmarks", href: "/benchmarks" },
          { label: category.label, href: `/benchmarks/${category.id}` },
        ]}
        title="Performance Benchmarks"
        description={category.description}
        actionLabel="Download Methodology PDF"
        actionHref="#"
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(14rem,18rem)_1fr] xl:grid-cols-[minmax(16rem,20rem)_1fr]">
        <BenchSidebar
          title="Device categories"
          categories={categories}
          activeCategory={category.id}
        />
        <BenchmarksClient
          category={category.id}
          categoryLabel={category.label}
          description={category.description}
        />
      </div>
    </BenchLayout>
  );
}
