import { NextResponse } from "next/server";
import { verifyAdminToken, sessionCookieName } from "@/lib/auth";
import { generatePresignedUploadUrl, getPublicUrl } from "@/lib/storage";

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

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File missing" }, { status: 400 });
    }

    // Reuse the same logic as /api/upload but specialized for admin usage if needed
    // For now, let's establish a clean pattern using the s3 lib
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `admin/${timestamp}-${sanitizedName}`;

    // Get signed URL for direct upload
    const uploadUrl = await generatePresignedUploadUrl({
      key,
      contentType: file.type,
    });

    const publicUrl = getPublicUrl(key);

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key
    });
  } catch (error) {
    console.error("Admin upload error:", error);
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}
