import crypto from "crypto";

const base64UrlEncode = (input: string) =>
  Buffer.from(input).toString("base64url");

const base64UrlDecode = (input: string) =>
  Buffer.from(input, "base64url").toString("utf-8");

const getSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not set");
  }
  return secret;
};

export type AdminSessionPayload = {
  role: "admin";
  email: string;
  exp: number;
};

export const signAdminToken = (payload: AdminSessionPayload) => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyAdminToken = (token: string) => {
  const [encodedHeader, encodedPayload, signature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return payload;
};

export const validateAdminCredentials = (email: string, password: string) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return false;
  }
  return email === adminEmail && password === adminPassword;
};

export const createAdminSession = (email: string) => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  return signAdminToken({ role: "admin", email, exp });
};

export const sessionCookieName = "admin_session";
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
