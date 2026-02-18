"use client";

import TagPill from "@/components/TagPill";
import RatingDots from "@/components/RatingDots";
import SectionHeader from "@/components/SectionHeader";
import ContentCard from "@/components/ContentCard";
import type { ContentItem, ReviewItem } from "@/lib/content";
import { useMemo, useState } from "react";

type FilterableIndexProps = {
  title: string;
  description: string;
  items: ContentItem[] | ReviewItem[];
  basePath: string;
  showRating?: boolean;
  showScore?: boolean;
};

const isReviewItem = (item: ContentItem | ReviewItem): item is ReviewItem => "rating" in item;

const hasScore = (
  item: ContentItem | ReviewItem
): item is ContentItem & { score: number } => {
  return "score" in item && typeof (item as { score?: unknown }).score === "number";
};

export default function FilterableIndex({
  title,
  description,
  items,
  basePath,
  showRating,
  showScore,
}: FilterableIndexProps) {
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const subcategories = Array.from(
    new Set(items.map((item) => item.subcategory).filter(Boolean))
  ) as string[];
  const brands = Array.from(new Set(items.map((item) => item.brand)));
  const years = Array.from(new Set(items.map((item) => item.year))).sort(
    (a, b) => b - a
  );
  const maxYear = Math.max(...years);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [latestOnly, setLatestOnly] = useState(false);

  const toggleString = (
    value: string,
    list: string[],
    setter: (next: string[]) => void
  ) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const toggleNumber = (
    value: number,
    list: number[],
    setter: (next: number[]) => void
  ) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    return items
      .filter((item) =>
        selectedCategories.length ? selectedCategories.includes(item.category) : true
      )
      .filter((item) =>
        selectedSubcategories.length && item.subcategory
          ? selectedSubcategories.includes(item.subcategory)
          : selectedSubcategories.length
            ? false
            : true
      )
      .filter((item) => (selectedBrands.length ? selectedBrands.includes(item.brand) : true))
      .filter((item) => (selectedYears.length ? selectedYears.includes(item.year) : true))
      .filter((item) => (featuredOnly ? item.featured : true))
      .filter((item) => (latestOnly ? item.year === maxYear : true))
      .sort((a, b) => b.year - a.year);
  }, [
    items,
    selectedCategories,
    selectedSubcategories,
    selectedBrands,
    selectedYears,
    featuredOnly,
    latestOnly,
    maxYear,
  ]);

  const SidebarContent = (
    <div className="space-y-6 text-sm text-neutral-600 dark:text-neutral-300">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Category
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleString(category, selectedCategories, setSelectedCategories)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>
      {subcategories.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
            Subcategory
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {subcategories.map((subcategory) => (
              <label key={subcategory} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSubcategories.includes(subcategory)}
                  onChange={() =>
                    toggleString(subcategory, selectedSubcategories, setSelectedSubcategories)
                  }
                />
                <span>{subcategory}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Brand
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleString(brand, selectedBrands, setSelectedBrands)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Year
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {years.map((year) => (
            <label key={year} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedYears.includes(year)}
                onChange={() => toggleNumber(year, selectedYears, setSelectedYears)}
              />
              <span>{year}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Featured
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={() => setFeaturedOnly(!featuredOnly)}
            />
            <span>Featured only</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={latestOnly}
              onChange={() => setLatestOnly(!latestOnly)}
            />
            <span>Latest year</span>
          </label>
        </div>
      </div>
      <button
        className="w-full rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-200"
        onClick={() => {
          setSelectedCategories([]);
          setSelectedSubcategories([]);
          setSelectedBrands([]);
          setSelectedYears([]);
          setFeaturedOnly(false);
          setLatestOnly(false);
        }}
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <section className="container mx-auto w-full px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(14rem,18rem)_1fr]">
        <div className="space-y-6">
          <SectionHeader title={title} description={description} variant="section" className="!shadow-none !border-none !px-0 !py-0 !bg-transparent" />
          <div className="hidden rounded-[22px] border border-neutral-200 bg-white px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_18px_40px_rgba(0,0,0,0.4)] lg:block">
            {SidebarContent}
          </div>
          <details className="rounded-[22px] border border-neutral-200 bg-white px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_18px_40px_rgba(0,0,0,0.4)] lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-neutral-700 dark:text-neutral-100">
              Filters
            </summary>
            <div className="mt-4">{SidebarContent}</div>
          </details>
        </div>
        <div>
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {filtered.map((item) => (
              <ContentCard
                key={item.slug}
                href={`${basePath}/${item.slug}`}
                image={item.image}
                title={item.title}
                description={item.summary}
                className="mb-6 break-inside-avoid"
                tags={
                  <>
                    <TagPill text={item.category} />
                    {item.subcategory && <TagPill text={item.subcategory} />}
                    <TagPill text={item.brand} />
                    <TagPill text={item.year.toString()} />
                  </>
                }
                footer={
                  <>
                    {showRating && isReviewItem(item) && (
                      <RatingDots rating={item.rating} />
                    )}
                    {showScore && hasScore(item) && (
                      <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-600">
                          Score {item.score}
                        </span>
                        <span>Benchmarked {item.year}</span>
                      </div>
                    )}
                  </>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
