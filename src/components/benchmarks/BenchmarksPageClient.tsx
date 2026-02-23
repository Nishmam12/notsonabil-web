"use client";

import { useState } from "react";
import BenchHeader from "@/components/benchmarks/BenchHeader";
import BenchSidebar from "@/components/benchmarks/BenchSidebar";
import BenchmarksClient from "@/components/benchmarks/BenchmarksClient";
import type { BenchmarkCategory } from "@/types/benchmark";

type CategoryItem = {
    id: BenchmarkCategory;
    label: string;
    description: string;
};

type BenchmarksPageClientProps = {
    categories: CategoryItem[];
    initialCategory: BenchmarkCategory;
};

export default function BenchmarksPageClient({
    categories,
    initialCategory,
}: BenchmarksPageClientProps) {
    const [activeCategory, setActiveCategory] = useState<BenchmarkCategory>(initialCategory);

    const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];

    return (
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[260px_1fr]">
            <BenchSidebar
                title="Device categories"
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />
            <BenchmarksClient
                category={activeCategory}
                categoryLabel={currentCategory.label}
                description={currentCategory.description}
            />
        </div>
    );
}
