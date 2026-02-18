"use client";

import { useState } from "react";
import MediaUploader from "@/components/MediaUploader";

export default function UploadTestPage() {
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const handleUploadComplete = (urls: string[]) => {
        console.log("Upload complete:", urls);
        setUploadedUrls(urls);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2 text-neutral-900 dark:text-neutral-100">
                    Media Upload Test
                </h1>
                <p className="text-center text-neutral-600 dark:text-neutral-400 mb-8">
                    Test uploading images, GIFs, and videos to Cloudflare R2
                </p>

                <MediaUploader onUploadComplete={handleUploadComplete} maxFiles={20} />

                {uploadedUrls.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                            Uploaded Files
                        </h2>
                        <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                            <ul className="space-y-2">
                                {uploadedUrls.map((url, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 text-green-500 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                        >
                                            {url}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
