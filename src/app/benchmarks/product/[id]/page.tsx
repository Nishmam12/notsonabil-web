import { notFound } from "next/navigation";
import BenchLayout from "@/components/benchmarks/BenchLayout";
import BenchHeader from "@/components/benchmarks/BenchHeader";
import BenchmarkProductClient from "@/components/benchmarks/BenchmarkProductClient";
import { getBenchmarks } from "@/lib/db";

type PageProps = {
    params: Promise<{ id: string }>;
};

const formatLabel = (value: string) =>
    value
        .split(/[_-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

export default async function BenchmarkProductPage({ params }: PageProps) {
    const { id } = await params;
    const data = await getBenchmarks();

    // Find the product and its category
    const product = data.find(p => p.id === id);

    if (!product) {
        notFound();
    }

    const categoryLabel = formatLabel(product.category);

    return (
        <BenchLayout>
            <BenchHeader
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Benchmarks", href: "/benchmarks" },
                    { label: categoryLabel, href: "/benchmarks" }, // Points back to main benchmarks page
                    { label: product.name, href: `/benchmarks/product/${id}` },
                ]}
                title="Performance Benchmarks"
                description={`${categoryLabel} dataset`}
                actionLabel="Download Methodology PDF"
                actionHref="#"
            />
            <div className="mt-8">
                <BenchmarkProductClient
                    category={product.category}
                    categoryLabel={categoryLabel}
                    productId={id}
                />
            </div>
        </BenchLayout>
    );
}
