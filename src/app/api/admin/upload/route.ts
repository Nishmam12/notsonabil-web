import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { verifyAdminToken, sessionCookieName } from "@/lib/auth";

const sanitizeFilename = (name: string) =>
  name.replace(/[^a-zA-Z0-9.\-_]/g, "_").toLowerCase();

const getTokenFromRequest = (request: Request) => {
  const cookies = request.headers.get("cookie") ?? "";
  return cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${sessionCookieName}=`))
    ?.split("=")[1];
};

export async function POST(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File missing" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${fileName}` });
}
