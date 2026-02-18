import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminTokenEdge } from "@/lib/authEdge";

// Constants for security
const sessionCookieName = "admin_session";
const PROTECTED_ADMIN_PATHS = ["/admin", "/api/admin"];
const PROTECTED_BENCHMARK_METHODS = ["POST", "PUT", "DELETE"];

const isLoginRoute = (pathname: string) =>
  pathname === "/admin/login" || pathname === "/api/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Check if the path is an admin-protected route
  const isAdminPath = PROTECTED_ADMIN_PATHS.some(path => pathname.startsWith(path));

  // 2. Check if it's a mutation on benchmarks
  const isBenchmarkMutation = pathname.startsWith("/api/benchmarks") &&
    PROTECTED_BENCHMARK_METHODS.includes(method);

  // If either is true, we need to verify the token
  if ((isAdminPath || isBenchmarkMutation) && !isLoginRoute(pathname)) {
    const token = request.cookies.get(sessionCookieName)?.value;
    const secret = process.env.ADMIN_JWT_SECRET;
    const url = request.nextUrl.clone();

    // Redirect to login or return 401
    if (!token || !secret) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    const valid = await verifyAdminTokenEdge(token, secret);
    if (!valid) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/benchmarks/:path*"],
};

