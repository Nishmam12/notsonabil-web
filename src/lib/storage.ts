import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    throw new Error("Missing R2 configuration in environment variables");
}

// Cloudflare R2 endpoint
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

export const s3Client = new S3Client({
    region: "auto", // R2 uses 'auto' as the region
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

export interface PresignedUrlOptions {
    key: string;
    contentType: string;
    expiresIn?: number; // seconds, default 3600 (1 hour)
}

export async function generatePresignedUploadUrl({
    key,
    contentType,
    expiresIn = 3600,
}: PresignedUrlOptions): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        ContentType: contentType,
        ACL: "public-read", // Allow public access to uploaded files
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
}

export function getPublicUrl(key: string): string {
    // This assumes you have a public domain configured for your R2 bucket
    // If not, you'll need to use a custom domain or R2 public URL
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (!publicUrl) {
        throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL not configured");
    }
    return `${publicUrl}/${key}`;
}
