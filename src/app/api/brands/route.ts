import { NextResponse } from "next/server";
import crypto from "crypto";
import { getBrands, createBrand, deleteBrandById, reorderBrandDisplay } from "@/lib/db";
import type { Brand } from "@/types/brand";
import { requireRole } from "@/lib/permissions";
import { logger, logActivity } from "@/lib/logger";

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
  const session = await requireRole([
    "SUPER_ADMIN",
    "ADMIN",
    "EDITOR",
    "CONTRIBUTOR",
  ]);
  if (!session) {
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

    const url = new URL(request.url);
    const ip =
      url.searchParams.get("ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      null;

    await logActivity({
      userId: session.userId,
      action: "create",
      entityType: "brand",
      entityId: brand.id,
      ipAddress: ip,
    });

    return NextResponse.json({ data: brand });
  } catch (error) {
    logger.error("Failed to create brand", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireRole(["SUPER_ADMIN", "ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await deleteBrandById(id);

    const url = new URL(request.url);
    const ip =
      url.searchParams.get("ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      null;

    await logActivity({
      userId: session.userId,
      action: "delete",
      entityType: "brand",
      entityId: id,
      ipAddress: ip,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Failed to delete brand", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  if (!session) {
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

    const url = new URL(request.url);
    const ip =
      url.searchParams.get("ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      null;

    await logActivity({
      userId: session.userId,
      action: "update",
      entityType: "brand_order",
      entityId: "bulk",
      ipAddress: ip,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Failed to reorder brands", error);
    return NextResponse.json({ error: "Failed to reorder brands" }, { status: 500 });
  }
}

