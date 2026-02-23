import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const PROTECTED_ADMIN_PATHS = ["/admin", "/api/admin"];
const ADMIN_EMAIL = "notsonabil@gmail.com";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = PROTECTED_ADMIN_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return await updateSession(request);
  }

  if (isAdminPath) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    const normalizedUserEmail = user.email?.toLowerCase().trim();
    const normalizedAdminEmail = ADMIN_EMAIL.toLowerCase().trim();

    console.log(`[Middleware] Authenticated user: ${normalizedUserEmail}`);

    if (normalizedUserEmail !== normalizedAdminEmail) {
      console.warn(`[Middleware] Access Denied: Email mismatch. Expected ${normalizedAdminEmail}, got ${normalizedUserEmail}`);
      return new NextResponse("Access Denied", { status: 403 });
    }

    // Role check
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("email", normalizedUserEmail)
      .single();

    const role = userData?.role;
    console.log(`[Middleware] Fetched role for ${normalizedUserEmail}: ${role}`);

    if (userError || role !== "SUPER_ADMIN") {
      console.warn(`[Middleware] Access Denied: Role mismatch or error. Role: ${role}, Error: ${userError?.message}`);
      return new NextResponse("Access Denied", { status: 403 });
    }

    return response;
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
