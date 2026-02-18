"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface UploadedFile {
    file: File;
    preview: string;
    progress: number;
    url?: string;
    error?: string;
}

interface MediaUploaderProps {
    onUploadComplete?: (urls: string[]) => void;
    maxFiles?: number;
}

export default function MediaUploader({
    onUploadComplete,
    maxFiles = 10,
}: MediaUploaderProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
    };

    const handleFiles = (newFiles: File[]) => {
        // Check file limit
        if (files.length + newFiles.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed`);
            return;
        }

        const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
        }));

        setFiles((prev) => [...prev, ...uploadedFiles]);

        // Start uploading each file
        uploadedFiles.forEach((uploadedFile, index) => {
            uploadFile(uploadedFile, files.length + index);
        });
    };

    const uploadFile = async (uploadedFile: UploadedFile, index: number) => {
        try {
            // Step 1: Get presigned URL from API
            const response = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: uploadedFile.file.name,
                    fileType: uploadedFile.file.type,
                    fileSize: uploadedFile.file.size,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to get upload URL");
            }

            const { uploadUrl, publicUrl } = await response.json();

            // Step 2: Upload file to R2 using presigned URL
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    updateFileProgress(index, percentComplete);
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status === 200) {
                    updateFileUrl(index, publicUrl);
                } else {
                    updateFileError(index, "Upload failed");
                }
            });

            xhr.addEventListener("error", () => {
                updateFileError(index, "Upload failed");
            });

            xhr.open("PUT", uploadUrl);
            xhr.setRequestHeader("Content-Type", uploadedFile.file.type);
            xhr.send(uploadedFile.file);
        } catch (error) {
            console.error("Upload error:", error);
            updateFileError(
                index,
                error instanceof Error ? error.message : "Upload failed"
            );
        }
    };

    const updateFileProgress = (index: number, progress: number) => {
        setFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, progress } : f))
        );
    };

    const updateFileUrl = (index: number, url: string) => {
        setFiles((prev) => {
            const updated = prev.map((f, i) =>
                i === index ? { ...f, url, progress: 100 } : f
            );

            // Check if all uploads are complete
            const allComplete = updated.every((f) => f.url || f.error);
            if (allComplete && onUploadComplete) {
                const urls = updated.filter((f) => f.url).map((f) => f.url!);
                onUploadComplete(urls);
            }

            return updated;
        });
    };

    const updateFileError = (index: number, error: string) => {
        setFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, error } : f))
        );
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
                    }
        `}
            >
                <div className="flex flex-col items-center gap-2">
                    <svg
                        className="w-12 h-12 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                        Drop files here or click to browse
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Images (JPG, PNG, GIF, WebP) and Videos (MP4, WebM, MOV) up to 50MB
                    </p>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInput}
                className="hidden"
            />

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="relative rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-900"
                        >
                            {/* Preview */}
                            <div className="aspect-square bg-neutral-100 dark:bg-neutral-800">
                                {file.file.type.startsWith("image/") ? (
                                    <img
                                        src={file.preview}
                                        alt={file.file.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={file.preview}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Progress Bar */}
                            {file.progress < 100 && !file.error && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-700">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${file.progress}%` }}
                                    />
                                </div>
                            )}

                            {/* Success Indicator */}
                            {file.url && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}

                            {/* Error Indicator */}
                            {file.error && (
                                <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center p-2">
                                    <p className="text-white text-xs text-center">{file.error}</p>
                                </div>
                            )}

                            {/* Remove Button */}
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* File Name */}
                            <div className="p-2 bg-white dark:bg-neutral-900">
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                    {file.file.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
