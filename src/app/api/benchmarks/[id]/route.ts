import { NextResponse } from "next/server";
import type { BenchmarkDataset } from "@/types/benchmark";
import {
  updateBenchmarkById,
  deleteBenchmarkById,
} from "@/lib/db";
import { requireAdmin } from "@/lib/permissions";
import { logger } from "@/lib/logger";

export async function PUT(request: Request) {
  const isAdmin = requireAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as BenchmarkDataset & {
    sheetId?: string;
    sheetTab?: string;
  };

  // Import validation
  const { validateBenchmark } = await import("@/lib/validation");
  const validation = validateBenchmark(body);

  if (!validation.valid) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: validation.errors.reduce(
          (acc, err) => ({ ...acc, [err.field]: err.message }),
          {}
        ),
      },
      { status: 400 }
    );
  }

  try {
    await updateBenchmarkById(body, {
      sheetId: body.sheetId,
      sheetTab: body.sheetTab,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Failed to update benchmark", error);
    const message = error instanceof Error ? error.message : "Failed to update benchmark";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const isAdmin = requireAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const url = new URL(request.url);
    const sheetId = url.searchParams.get("sheetId") ?? undefined;
    const sheetTab = url.searchParams.get("sheetTab") ?? undefined;
    await deleteBenchmarkById(id, {
      sheetId,
      sheetTab,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete benchmark" }, { status: 500 });
  }
}
