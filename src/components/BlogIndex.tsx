"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import TagPill from "@/components/TagPill";
import ContentCard from "@/components/ContentCard";
import type { BlogPost } from "@/lib/content";

type BlogIndexProps = {
  posts: BlogPost[];
};

const pageSize = 4;

export default function BlogIndex({ posts }: BlogIndexProps) {
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const productTypes = Array.from(new Set(posts.map((post) => post.productType)));
  const years = Array.from(new Set(posts.map((post) => post.year))).sort((a, b) => b - a);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return posts
      .slice(1)
      .filter((post) =>
        search
          ? `${post.title} ${post.excerpt}`.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .filter((post) => (selectedCategory ? post.category === selectedCategory : true))
      .filter((post) => (selectedTag ? post.tags.includes(selectedTag) : true))
      .filter((post) => (selectedProduct ? post.productType === selectedProduct : true))
      .filter((post) => (selectedYear ? post.year.toString() === selectedYear : true));
  }, [posts, search, selectedCategory, selectedTag, selectedProduct, selectedYear]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const featured = posts[0];

  return (
    <section className="container mx-auto w-full px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
      <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              className="h-full w-full object-cover"
              src={featured.image}
              alt={featured.title}
              width={1400}
              height={800}
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              <TagPill text={featured.category} />
              <TagPill text={featured.productType} />
              <TagPill text={featured.year.toString()} />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
              {featured.title}
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-300">
              {featured.excerpt}
            </p>
            <a
              href={`/blog/${featured.slug}`}
              className="mt-4 inline-flex w-fit rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
            >
              Read article
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-[22px] border border-neutral-200 bg-white px-6 py-5 text-sm text-neutral-600 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-wrap items-center gap-4">
          <input
            className="w-full rounded-full border border-neutral-200 px-4 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 sm:w-64 lg:w-72"
            placeholder="Search articles"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <select
            className="rounded-full border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="rounded-full border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            value={selectedTag}
            onChange={(event) => {
              setSelectedTag(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <select
            className="rounded-full border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            value={selectedProduct}
            onChange={(event) => {
              setSelectedProduct(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Product type</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="rounded-full border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            value={selectedYear}
            onChange={(event) => {
              setSelectedYear(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((post) => (
          <ContentCard
            key={post.slug}
            href={`/blog/${post.slug}`}
            image={post.image}
            title={post.title}
            description={post.excerpt}
            tags={
              <>
                <TagPill text={post.category} />
                <TagPill text={post.productType} />
                <TagPill text={post.year.toString()} />
              </>
            }
          />
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-3 text-sm text-neutral-500 dark:text-neutral-300">
        <button
          className="rounded-full border border-neutral-200 px-4 py-2 dark:border-neutral-700"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="rounded-full border border-neutral-200 px-4 py-2 dark:border-neutral-700"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        >
          Next
        </button>
      </div>
    </section>
  );
}
