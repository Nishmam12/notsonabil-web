import { verifyAdminToken, sessionCookieName } from "@/lib/auth";

export const getSessionTokenFromRequest = (request: Request) => {
  const cookies = request.headers.get("cookie") ?? "";
  const token = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${sessionCookieName}=`))
    ?.split("=")[1];
  return token ?? "";
};

export const requireAdmin = (request: Request) => {
  const token = getSessionTokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return false;
  }
  return true;
};

