import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminTokenEdge } from "@/lib/authEdge";

const sessionCookieName = "admin_session";

const isAdminPath = (pathname: string) => pathname.startsWith("/admin");
const isAdminApiPath = (pathname: string) => pathname.startsWith("/api/admin");

const isLoginPath = (pathname: string) => pathname === "/admin/login";
const isLoginApi = (pathname: string) => pathname === "/api/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname) || isAdminApiPath(pathname)) {
    if (isLoginPath(pathname) || isLoginApi(pathname)) {
      return NextResponse.next();
    }
    const token = request.cookies.get(sessionCookieName)?.value;
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!token || !secret) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    const valid = await verifyAdminTokenEdge(token, secret);
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
