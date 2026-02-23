import { NextResponse } from "next/server";
import type { BenchmarkDataset } from "@/types/benchmark";
import { updateBenchmarkById, deleteBenchmarkById } from "@/lib/db";
import { requireRole } from "@/lib/permissions";
import { logger, logActivity } from "@/lib/logger";

export async function PUT(request: Request) {
  const session = await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as BenchmarkDataset;

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
    await updateBenchmarkById(body);

    const url = new URL(request.url);
    const ip =
      url.searchParams.get("ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      null;

    await logActivity({
      userId: session.userId,
      action: "update",
      entityType: "benchmark",
      entityId: body.id,
      ipAddress: ip,
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
  const session = await requireRole(["SUPER_ADMIN", "ADMIN"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await deleteBenchmarkById(id);

    const url = new URL(request.url);
    const ip =
      url.searchParams.get("ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      null;

    await logActivity({
      userId: session.userId,
      action: "delete",
      entityType: "benchmark",
      entityId: id,
      ipAddress: ip,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete benchmark";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
