"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Brand } from "@/types/brand";

export default function BrandGrid() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/brands");
        if (!response.ok) {
          setError("Failed to load brands");
          return;
        }
        const data = (await response.json()) as { data?: Brand[] };
        setBrands(data.data ?? []);
      } catch {
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading && !brands.length) {
    return (
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-50 dark:bg-neutral-950"
          />
        ))}
      </div>
    );
  }

  if (error && !brands.length) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-50/90 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-transform duration-150 hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-neutral-950/90 dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="relative h-10 w-24 sm:h-12 sm:w-28 md:h-14 md:w-32">
            <Image
              src={brand.logoUrl}
              alt=""
              fill
              sizes="(min-width: 1280px) 160px, (min-width: 1024px) 140px, (min-width: 640px) 120px, 100px"
              className="object-contain"
            />
          </div>
        </div>
      ))}
      {!brands.length && !loading ? (
        <div className="col-span-full text-sm text-neutral-500 dark:text-neutral-400">
          No brands available yet.
        </div>
      ) : null}
    </div>
  );
}

