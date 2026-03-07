import * as admin from "firebase-admin";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";



let firebaseInitialized = false;

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

export async function uploadGemImage(
    imageBuffer: Buffer,
    userId: number
): Promise<UploadedImage> {
    return uploadDesignImage(imageBuffer, {
        userId,
        folder: `gem-images/user-${userId}`,
    });
}

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

export async function downloadImageAsBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

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

export function isFirebaseConfigured(): boolean {
    return !!(
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY &&
        process.env.FIREBASE_STORAGE_BUCKET
    );
}

export function getPlaceholderImageUrl(text: string = "Design"): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A1128"/>
      <stop offset="100%" style="stop-color:#1a2a5e"/>
    </linearGradient>
    <linearGradient id="gem" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#F5D061"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <!-- Decorative ring shape -->
  <circle cx="512" cy="440" r="180" fill="none" stroke="url(#gem)" stroke-width="32" opacity="0.8"/>
  <circle cx="512" cy="440" r="120" fill="none" stroke="#D4AF37" stroke-width="12" opacity="0.4"/>
  <!-- Gem shape (diamond) -->
  <polygon points="512,300 580,420 512,500 444,420" fill="url(#gem)" opacity="0.9"/>
  <polygon points="512,300 580,420 512,380" fill="#F5D061" opacity="0.6"/>
  <!-- Text -->
  <text x="512" y="680" font-family="Georgia, serif" font-size="48" fill="#D4AF37" text-anchor="middle" opacity="0.9">${text}</text>
  <text x="512" y="730" font-family="Georgia, serif" font-size="28" fill="#9CA3AF" text-anchor="middle" opacity="0.7">AI Concept Design</text>
  <!-- Corner decorations -->
  <line x1="50" y1="50" x2="150" y2="50" stroke="#D4AF37" stroke-width="2" opacity="0.3"/>
  <line x1="50" y1="50" x2="50" y2="150" stroke="#D4AF37" stroke-width="2" opacity="0.3"/>
  <line x1="974" y1="50" x2="874" y2="50" stroke="#D4AF37" stroke-width="2" opacity="0.3"/>
  <line x1="974" y1="50" x2="974" y2="150" stroke="#D4AF37" stroke-width="2" opacity="0.3"/>
  <line x1="50" y1="974" x2="150" y2="974" stroke="#D4AF37" stroke-width="2" opacity="0.3"/>
  <line x1="50" y1="974" x2="50" y2="874" stroke="#D4AF37" stroke-width="2" opacity="0.3"/>
  <line x1="974" y1="974" x2="874" y2="974" stroke="#D4AF37" stroke-width="2" opacity="0.3"/>
  <line x1="974" y1="974" x2="974" y2="874" stroke="#D4AF37" stroke-width="2" opacity="0.3"/>
</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export function getPlaceholderThumbnailUrl(text: string = "Design"): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A1128"/>
      <stop offset="100%" style="stop-color:#1a2a5e"/>
    </linearGradient>
    <linearGradient id="gem" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#F5D061"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#bg)"/>
  <circle cx="150" cy="130" r="55" fill="none" stroke="url(#gem)" stroke-width="10" opacity="0.8"/>
  <polygon points="150,88 175,125 150,148 125,125" fill="url(#gem)" opacity="0.9"/>
  <text x="150" y="205" font-family="Georgia, serif" font-size="18" fill="#D4AF37" text-anchor="middle">${text}</text>
</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

