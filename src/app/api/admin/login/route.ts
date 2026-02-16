import { NextResponse } from "next/server";
import {
  createAdminSession,
  sessionCookieName,
  sessionCookieOptions,
  validateAdminCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const isValid = validateAdminCredentials(body.email, body.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createAdminSession(body.email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, token, sessionCookieOptions);
  return response;
}
