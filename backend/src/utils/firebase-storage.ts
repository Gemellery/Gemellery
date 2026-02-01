import * as admin from "firebase-admin";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Firebase Admin Configuration
// ============================================

let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase(): void {
    if (firebaseInitialized) return;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !privateKey || !storageBucket) {
        console.warn("[Firebase] Missing configuration. Storage will not work.");
        return;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
            storageBucket,
        });

        firebaseInitialized = true;
        console.log("[Firebase] Initialized successfully");
    } catch (error: any) {
        if (error.code === "app/duplicate-app") {
            firebaseInitialized = true;
        } else {
            console.error("[Firebase] Initialization error:", error.message);
        }
    }
}

// ============================================
// Types
// ============================================

export interface UploadedImage {
    id: string;
    url: string;
    thumbnailUrl: string;
    uploadedAt: string;
}

export interface UploadOptions {
    userId: number;
    designId?: number;
    folder?: string;
}

// ============================================
// Image Upload Functions
// ============================================

/**
 * Upload an image to Firebase Storage
 * Automatically creates a thumbnail
 */
export async function uploadDesignImage(
    imageBuffer: Buffer,
    options: UploadOptions,
    mimeType: string = "image/png"
): Promise<UploadedImage> {
    initializeFirebase();

    const bucket = admin.storage().bucket();
    const imageId = uuidv4();
    const timestamp = Date.now();

    // Define file paths
    const folder = options.folder || `jewelry-designs/user-${options.userId}`;
    const imagePath = `${folder}/${imageId}-${timestamp}.png`;
    const thumbnailPath = `${folder}/${imageId}-${timestamp}-thumb.png`;

    console.log(`[Firebase] Uploading image: ${imagePath}`);

    try {
        // Process and optimize main image (max 1024x1024)
        const optimizedImage = await sharp(imageBuffer)
            .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
            .png({ quality: 90 })
            .toBuffer();

        // Create thumbnail (300x300)
        const thumbnail = await sharp(imageBuffer)
            .resize(300, 300, { fit: "cover" })
            .png({ quality: 80 })
            .toBuffer();

        // Upload main image
        const imageFile = bucket.file(imagePath);
        await imageFile.save(optimizedImage, {
            metadata: {
                contentType: "image/png",
                metadata: {
                    userId: options.userId.toString(),
                    designId: options.designId?.toString() || "",
                    uploadedAt: new Date().toISOString(),
                },
            },
        });

        // Make image publicly accessible
        await imageFile.makePublic();

        // Upload thumbnail
        const thumbFile = bucket.file(thumbnailPath);
        await thumbFile.save(thumbnail, {
            metadata: {
                contentType: "image/png",
            },
        });
        await thumbFile.makePublic();

        // Get public URLs
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imagePath}`;
        const thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${thumbnailPath}`;

        console.log(`[Firebase] Upload complete: ${imageUrl}`);

        return {
            id: imageId,
            url: imageUrl,
            thumbnailUrl: thumbnailUrl,
            uploadedAt: new Date().toISOString(),
        };
    } catch (error: any) {
        console.error("[Firebase] Upload error:", error.message);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
}

/**
 * Upload a gem image (user's photo of their gemstone)
 */
export async function uploadGemImage(
    imageBuffer: Buffer,
    userId: number
): Promise<UploadedImage> {
    return uploadDesignImage(imageBuffer, {
        userId,
        folder: `gem-images/user-${userId}`,
    });
}

/**
 * Delete an image and its thumbnail from Firebase Storage
 */
export async function deleteDesignImage(imageUrl: string): Promise<boolean> {
    initializeFirebase();

    const bucket = admin.storage().bucket();

    try {
        // Extract file path from URL
        const urlParts = imageUrl.split(`${bucket.name}/`);
        if (urlParts.length < 2) {
            console.warn("[Firebase] Invalid image URL format");
            return false;
        }

        const filePath = urlParts[1];
        const thumbPath = filePath.replace(".png", "-thumb.png");

        // Delete main image
        await bucket.file(filePath).delete().catch(() => { });

        // Delete thumbnail
        await bucket.file(thumbPath).delete().catch(() => { });

        console.log(`[Firebase] Deleted: ${filePath}`);
        return true;
    } catch (error: any) {
        console.error("[Firebase] Delete error:", error.message);
        return false;
    }
}

/**
 * Download an image from a URL and return as Buffer
 */
export async function downloadImageAsBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

/**
 * Process an uploaded file buffer (validate and optimize)
 */
export async function processUploadedImage(
    buffer: Buffer,
    maxSize: number = 1024
): Promise<Buffer> {
    try {
        const processed = await sharp(buffer)
            .resize(maxSize, maxSize, { fit: "inside", withoutEnlargement: true })
            .png({ quality: 90 })
            .toBuffer();

        return processed;
    } catch (error: any) {
        throw new Error(`Invalid image format: ${error.message}`);
    }
}

/**
 * Check if Firebase is properly configured
 */
export function isFirebaseConfigured(): boolean {
    return !!(
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY &&
        process.env.FIREBASE_STORAGE_BUCKET
    );
}

/**
 * Get a placeholder image URL (for when Firebase is not available or image generation fails)
 */
export function getPlaceholderImageUrl(text: string = "Design"): string {
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/1024x1024/D4AF37/0A1128?text=${encodedText}`;
}

/**
 * Get a placeholder thumbnail URL
 */
export function getPlaceholderThumbnailUrl(text: string = "Design"): string {
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/300x300/D4AF37/0A1128?text=${encodedText}`;
}
