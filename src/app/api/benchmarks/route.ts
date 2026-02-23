import { NextResponse } from "next/server";
import { getBenchmarks, createBenchmark } from "@/lib/db";
import type { BenchmarkDataset } from "@/types/benchmark";
import { requireRole } from "@/lib/permissions";
import { logger, logActivity } from "@/lib/logger";

const filterBenchmarks = (data: BenchmarkDataset[], params: URLSearchParams) => {
  const category = params.get("category")?.toLowerCase();
  const subcategory = params.get("subcategory")?.toLowerCase();
  const query = params.get("query")?.toLowerCase();
  return data.filter((item) => {
    if (category && item.category.toLowerCase() !== category) {
      return false;
    }
    if (subcategory && item.subcategory.toLowerCase() !== subcategory) {
      return false;
    }
    if (query && !item.name.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });
};

const sortBenchmarks = (data: BenchmarkDataset[], sort: string | null) => {
  const next = [...data];
  if (sort === "latency") {
    return next.sort((a, b) => a.latency - b.latency);
  }
  if (sort === "accuracy") {
    return next.sort((a, b) => b.accuracy - a.accuracy);
  }
  if (sort === "latest") {
    return next.sort(
      (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
    );
  }
  return next.sort((a, b) => {
    if (a.rankingScore === b.rankingScore) {
      return b.labScore - a.labScore;
    }
    return b.rankingScore - a.rankingScore;
  });
};

export async function GET(request: Request) {
  try {
    const data = await getBenchmarks();
    const url = new URL(request.url);
    const filtered = filterBenchmarks(data, url.searchParams);
    const sorted = sortBenchmarks(filtered, url.searchParams.get("sort"));
    const ranked = sorted.map((item, index) => ({
      ...item,
      rankingPosition: index + 1,
    }));
    const response = NextResponse.json({ data: ranked });
    response.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch {
    logger.error("Failed to fetch benchmarks");
    return NextResponse.json({ error: "Failed to fetch benchmarks" }, { status: 500 });
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

  const body = (await request.json()) as BenchmarkDataset;
  console.log("API Insert payload:", body);

  // Temporarily bypass validation to debug Supabase errors
  /*
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
  */

  try {
    await createBenchmark(body);

    const url = new URL(request.url);
    const ip =
      url.searchParams.get("ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      null;

    await logActivity({
      userId: session.userId,
      action: "create",
      entityType: "benchmark",
      entityId: body.id,
      ipAddress: ip,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) { // Add type annotation for error to access .message
    logger.error("Failed to create benchmark", error);
    return NextResponse.json({ error: error.message || "Failed to save benchmark" }, { status: 500 });
  }
}
