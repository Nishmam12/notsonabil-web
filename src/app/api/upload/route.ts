import { NextRequest, NextResponse } from "next/server";
import { generatePresignedUploadUrl, getPublicUrl } from "@/lib/storage";

const ALLOWED_TYPES = {
    // Images
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    // Videos
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fileName, fileType, fileSize } = body;

        // Validate file type
        if (!fileType || !(fileType in ALLOWED_TYPES)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: images (jpg, png, gif, webp) and videos (mp4, webm, mov)" },
                { status: 400 }
            );
        }

        // Validate file size
        if (!fileSize || fileSize > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            );
        }

        // Generate unique file name with timestamp
        const extension = ALLOWED_TYPES[fileType as keyof typeof ALLOWED_TYPES];
        const timestamp = Date.now();
        const sanitizedFileName = fileName
            .replace(/[^a-zA-Z0-9.-]/g, "_")
            .substring(0, 100);
        const key = `uploads/${timestamp}-${sanitizedFileName}`;

        // Generate presigned URL
        const uploadUrl = await generatePresignedUploadUrl({
            key,
            contentType: fileType,
            expiresIn: 3600, // 1 hour
        });

        const publicUrl = getPublicUrl(key);

        return NextResponse.json({
            uploadUrl,
            publicUrl,
            key,
        });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return NextResponse.json(
            { error: "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}
