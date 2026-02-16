import { notFound } from "next/navigation";
import BenchLayout from "@/components/benchmarks/BenchLayout";
import BenchHeader from "@/components/benchmarks/BenchHeader";
import BenchmarkProductClient from "@/components/benchmarks/BenchmarkProductClient";
import { fetchBenchmarks } from "@/lib/googleSheets";

type PageProps = {
  params: { category: string; product: string };
};

const formatLabel = (value: string) =>
  value
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function BenchmarkProductPage({ params }: PageProps) {
  const data = await fetchBenchmarks();
  const categories = Array.from(new Set(data.map((item) => item.category))).map((id) => ({
    id,
    label: formatLabel(id),
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
          { label: params.product, href: `/benchmarks/${category.id}/${params.product}` },
        ]}
        title="Performance Benchmarks"
        description={`${category.label} dataset`}
        actionLabel="Download Methodology PDF"
        actionHref="#"
      />
      <div className="mt-8">
        <BenchmarkProductClient
          category={category.id}
          categoryLabel={category.label}
          productId={params.product}
        />
      </div>
    </BenchLayout>
  );
}
