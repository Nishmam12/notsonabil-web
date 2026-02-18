import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import type { Brand } from "@/types/brand";
import { verifyAdminToken, sessionCookieName } from "@/lib/auth";

const getTokenFromRequest = (request: Request) => {
  const cookies = request.headers.get("cookie") ?? "";
  return cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${sessionCookieName}=`))
    ?.split("=")[1];
};

export async function GET() {
  try {
    const brands = await db.brands.getAll();
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { logoUrl?: string; displayOrder?: number }
    | null;

  if (!body || !body.logoUrl || typeof body.logoUrl !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const existing = await db.brands.getAll();
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
    await db.brands.create(brand);
    return NextResponse.json({ data: brand });
  } catch {
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await db.brands.delete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
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
    await db.brands.reorder(sanitized);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to reorder brands" },
      { status: 500 }
    );
  }
}

