import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { BenchmarkDataset } from "@/types/benchmark";
import { verifyAdminToken, sessionCookieName } from "@/lib/auth";

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
    const data = await db.benchmarks.getAll();
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
    return NextResponse.json(
      { error: "Failed to fetch benchmarks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookies = request.headers.get("cookie") ?? "";
  const token = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${sessionCookieName}=`))
    ?.split("=")[1];

  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as BenchmarkDataset & {
    sheetId?: string;
    sheetTab?: string;
  };

  // Import validation at the top
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
    await db.benchmarks.create(body, {
      spreadsheetId: body.sheetId,
      sheetTab: body.sheetTab,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save benchmark:", error);
    return NextResponse.json({ error: "Failed to save benchmark" }, { status: 500 });
  }
}
