import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  getBrands,
  createBrand,
  deleteBrandById,
  reorderBrandDisplay,
} from "@/lib/db";
import type { Brand } from "@/types/brand";
import { requireAdmin } from "@/lib/permissions";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const brands = await getBrands();
    const sorted = [...brands].sort((a, b) => {
      if (a.displayOrder === b.displayOrder) {
        return a.createdAt.localeCompare(b.createdAt);
      }
      return a.displayOrder - b.displayOrder;
    });
    const response = NextResponse.json({ data: sorted });
    response.headers.set(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );
    return response;
  } catch (error) {
    logger.error("Failed to fetch brands", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = requireAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { logoUrl?: string; displayOrder?: number }
    | null;

  if (!body || !body.logoUrl || typeof body.logoUrl !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const existing = await getBrands();
    const maxOrder = existing.reduce(
      (max, item) => (item.displayOrder > max ? item.displayOrder : max),
      0
    );
    const displayOrder =
      typeof body.displayOrder === "number" && body.displayOrder > 0
        ? body.displayOrder
        : maxOrder + 1;
    const brand: Brand = {
      id: crypto.randomUUID(),
      logoUrl: body.logoUrl,
      createdAt: new Date().toISOString(),
      displayOrder,
    };
    await createBrand(brand);
    return NextResponse.json({ data: brand });
  } catch (error) {
    logger.error("Failed to create brand", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAdmin = requireAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await deleteBrandById(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Failed to delete brand", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAdmin = requireAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { order?: { id: string; displayOrder: number }[] }
    | null;

  const updates = body?.order ?? [];
  if (!Array.isArray(updates) || !updates.length) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const sanitized = updates
    .map((item) => ({
      id: String(item.id),
      displayOrder: Number(item.displayOrder),
    }))
    .filter((item) => item.id && Number.isFinite(item.displayOrder));

  if (!sanitized.length) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await reorderBrandDisplay(sanitized);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Failed to reorder brands", error);
    return NextResponse.json({ error: "Failed to reorder brands" }, { status: 500 });
  }
}

