import type { BenchmarkDataset } from "@/types/benchmark";

// Validation error type
export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

// Valid categories and tiers
const VALID_CATEGORIES = ["mouse", "keyboard", "monitor", "audio", "controller"];
const VALID_TIERS = ["S", "A", "B", "C", ""];

// Validate benchmark data
export function validateBenchmark(data: Partial<BenchmarkDataset>): ValidationResult {
    const errors: ValidationError[] = [];

    // Required fields
    if (!data.id?.trim()) {
        errors.push({ field: "id", message: "Product ID is required" });
    }

    if (!data.name?.trim()) {
        errors.push({ field: "name", message: "Product name is required" });
    } else if (data.name.trim().length < 3) {
        errors.push({ field: "name", message: "Product name must be at least 3 characters" });
    }

    if (!data.category?.trim()) {
        errors.push({ field: "category", message: "Category is required" });
    } else if (!VALID_CATEGORIES.includes(data.category.toLowerCase())) {
        errors.push({
            field: "category",
            message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
        });
    }

    if (!data.brand?.trim()) {
        errors.push({ field: "brand", message: "Brand is required" });
    }

    // Numeric validations
    if (typeof data.latency === "number") {
        if (data.latency < 0) {
            errors.push({ field: "latency", message: "Latency must be >= 0" });
        }
    } else if (data.latency !== undefined) {
        errors.push({ field: "latency", message: "Latency must be a number" });
    }

    if (typeof data.accuracy === "number") {
        if (data.accuracy < 0 || data.accuracy > 100) {
            errors.push({ field: "accuracy", message: "Accuracy must be between 0-100" });
        }
    } else if (data.accuracy !== undefined) {
        errors.push({ field: "accuracy", message: "Accuracy must be a number" });
    }

    if (typeof data.pollingRate === "number") {
        if (data.pollingRate < 0) {
            errors.push({ field: "pollingRate", message: "Polling rate must be >= 0" });
        }
    } else if (data.pollingRate !== undefined) {
        errors.push({ field: "pollingRate", message: "Polling rate must be a number" });
    }

    if (typeof data.labScore === "number") {
        if (data.labScore < 0) {
            errors.push({ field: "labScore", message: "Lab score must be >= 0" });
        }
    } else if (data.labScore !== undefined) {
        errors.push({ field: "labScore", message: "Lab score must be a number" });
    }

    // Tier validation
    if (data.tier && !VALID_TIERS.includes(data.tier)) {
        errors.push({
            field: "tier",
            message: `Tier must be one of: ${VALID_TIERS.filter((t) => t).join(", ")} or empty`,
        });
    }

    // URL validation (simple check)
    if (data.image && data.image.trim()) {
        try {
            new URL(data.image);
        } catch {
            errors.push({ field: "image", message: "Image must be a valid URL" });
        }
    }

    // Date validation
    if (data.testDate && data.testDate.trim()) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.testDate)) {
            errors.push({ field: "testDate", message: "Test date must be in YYYY-MM-DD format" });
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// Validate file upload
export interface FileValidationOptions {
    maxSizeBytes?: number;
    allowedTypes?: string[];
}

export function validateFile(
    file: { size: number; type: string },
    options: FileValidationOptions = {}
): ValidationResult {
    const errors: ValidationError[] = [];
    const maxSize = options.maxSizeBytes ?? 50 * 1024 * 1024; // 50MB default
    const allowedTypes = options.allowedTypes ?? [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
    ];

    if (file.size > maxSize) {
        errors.push({
            field: "file",
            message: `File size must be less than ${maxSize / 1024 / 1024}MB`,
        });
    }

    if (!allowedTypes.includes(file.type)) {
        errors.push({
            field: "file",
            message: `File type must be one of: ${allowedTypes.join(", ")}`,
        });
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// Validate admin credentials
export function validateCredentials(email: string, password: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (!email || !email.trim()) {
        errors.push({ field: "email", message: "Email is required" });
    } else if (!email.includes("@")) {
        errors.push({ field: "email", message: "Invalid email format" });
    }

    if (!password || password.length < 4) {
        errors.push({ field: "password", message: "Password must be at least 4 characters" });
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
