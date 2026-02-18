"use client";

import { useState } from "react";
import type { Brand } from "@/types/brand";

type BrandsAdminPanelProps = {
  initialBrands: Brand[];
  initialError?: string;
  sheetsConnected?: boolean;
};

export default function BrandsAdminPanel({
  initialBrands,
  initialError,
  sheetsConnected,
}: BrandsAdminPanelProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [logoUrl, setLogoUrl] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const refresh = async () => {
    setStatus("");
    const response = await fetch("/api/brands");
    if (!response.ok) {
      setStatus("Failed to fetch brands");
      return;
    }
    const data = (await response.json()) as { data?: Brand[] };
    setBrands(data.data ?? []);
  };

  const handleFile = async (file: File | null) => {
    if (!file) {
      return;
    }
    setUploading(true);
    setStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }
      const { uploadUrl, publicUrl } = (await response.json()) as {
        uploadUrl?: string;
        publicUrl?: string;
      };
      if (uploadUrl && publicUrl) {
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload to storage");
        }
        setLogoUrl(publicUrl);
        setStatus("Logo uploaded");
      } else {
        throw new Error("Invalid upload response");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addBrand = async () => {
    if (!logoUrl) {
      setStatus("Logo URL required");
      return;
    }
    setStatus("Saving brand...");
    const response = await fetch("/api/brands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ logoUrl }),
    });
    if (!response.ok) {
      setStatus("Failed to save brand");
      return;
    }
    const data = (await response.json()) as { data?: Brand };
    if (data.data) {
      setBrands((prev) =>
        [...prev, data.data as Brand].sort((a, b) => a.displayOrder - b.displayOrder)
      );
      setLogoUrl("");
      setStatus("Brand added");
    } else {
      setStatus("Failed to save brand");
    }
  };

  const removeBrand = async (id: string) => {
    const response = await fetch(`/api/brands?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setStatus("Failed to delete brand");
      return;
    }
    setBrands((prev) => prev.filter((item) => item.id !== id));
    setStatus("Brand deleted");
  };

  const persistOrder = async (next: Brand[]) => {
    const order = next.map((item, index) => ({
      id: item.id,
      displayOrder: index + 1,
    }));
    const response = await fetch("/api/brands", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order }),
    });
    if (!response.ok) {
      setStatus("Failed to save order");
      return;
    }
    setStatus("Order updated");
  };

  const moveBrand = async (id: string, direction: "up" | "down") => {
    const index = brands.findIndex((item) => item.id === id);
    if (index === -1) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= brands.length) {
      return;
    }
    const next = [...brands];
    const [removed] = next.splice(index, 1);
    next.splice(targetIndex, 0, removed);
    const withOrder = next.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));
    setBrands(withOrder);
    await persistOrder(withOrder);
  };

  return (
    <>
      {initialError ? (
        <div className="bench-card rounded-3xl border border-amber-500/30 px-6 py-4 text-sm text-amber-700 dark:text-amber-200">
          {initialError}
        </div>
      ) : null}
      <div className="bench-card rounded-3xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-neutral-200">
              Manage brands
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-neutral-400">
              <span>Controls the brand logo grid on the portfolio page.</span>
              <span className="rounded-full border border-blue-500/40 px-2 py-0.5 text-[10px] text-blue-500 dark:text-blue-300">
                {sheetsConnected ? "Sheets connected" : "Sheets not configured"}
              </span>
            </div>
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-300"
            onClick={refresh}
          >
            Refresh
          </button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-neutral-400">
              Upload logo
              <input
                className="text-xs text-slate-600 dark:text-neutral-300"
                type="file"
                accept="image/*"
                onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
              />
            </label>
            {uploading ? (
              <div className="text-xs text-slate-500 dark:text-neutral-400">
                Uploading...
              </div>
            ) : null}
            <label className="flex flex-col gap-2 text-xs text-slate-600 dark:text-neutral-400">
              Logo URL
              <input
                className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-200"
                placeholder="https://"
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
              />
            </label>
            <button
              className="bench-button mt-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
              onClick={addBrand}
            >
              Add brand
            </button>
            {status ? (
              <div className="text-xs text-slate-500 dark:text-neutral-400">
                {status}
              </div>
            ) : null}
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-400">
              Brand order
            </div>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-xs text-slate-600 dark:border-neutral-800/50 dark:text-neutral-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-20 overflow-hidden rounded-xl bg-neutral-900/80">
                      <img
                        src={brand.logoUrl}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-neutral-400">
                      Position {brand.displayOrder}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-600 dark:border-neutral-700/60 dark:text-neutral-300"
                      onClick={() => moveBrand(brand.id, "up")}
                    >
                      Up
                    </button>
                    <button
                      className="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-600 dark:border-neutral-700/60 dark:text-neutral-300"
                      onClick={() => moveBrand(brand.id, "down")}
                    >
                      Down
                    </button>
                    <button
                      className="rounded-full border border-red-500/40 px-3 py-1 text-[11px] text-red-500 dark:text-red-200"
                      onClick={() => removeBrand(brand.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {brands.length === 0 ? (
                <div className="text-xs text-slate-500 dark:text-neutral-400">
                  No brands added yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

