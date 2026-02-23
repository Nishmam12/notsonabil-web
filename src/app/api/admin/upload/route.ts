import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { generatePresignedUploadUrl, getPublicUrl } from "@/lib/storage";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File missing" }, { status: 400 });
    }

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
    logger.error("Admin upload error", error);
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}
