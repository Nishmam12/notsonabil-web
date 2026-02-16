import { NextResponse } from "next/server";
import type { BenchmarkDataset } from "@/types/benchmark";
import { deleteBenchmark, updateBenchmark } from "@/lib/googleSheets";
import { verifyAdminToken, sessionCookieName } from "@/lib/auth";

const getTokenFromRequest = (request: Request) => {
  const cookies = request.headers.get("cookie") ?? "";
  return cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${sessionCookieName}=`))
    ?.split("=")[1];
};

export async function PUT(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as BenchmarkDataset & {
    sheetId?: string;
    sheetTab?: string;
  };
  if (!body?.id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await updateBenchmark(body, {
      spreadsheetId: body.sheetId,
      sheetTab: body.sheetTab,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update benchmark" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const sheetId = url.searchParams.get("sheetId") ?? undefined;
    const sheetTab = url.searchParams.get("sheetTab") ?? undefined;
    await deleteBenchmark(context.params.id, {
      spreadsheetId: sheetId,
      sheetTab,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete benchmark" }, { status: 500 });
  }
}
