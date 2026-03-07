// Form data structure for gem input
export interface GemFormData {
    gemType: string;
    gemTypeOther?: string;
    gemCut: string;
    gemSizeMode: 'simple' | 'advanced';
    gemSizeSimple?: string;
    gemSizeLengthMm?: number;
    gemSizeWidthMm?: number;
    gemSizeHeightMm?: number;
    gemSizeCarat?: number;
    gemColor: string;
    gemTransparency: string;
    gemImageUrl?: string;
    designPrompt: string;
    materials: {
        metals: string[];
        finish?: string;
    };
    numImages: number;
}

// Generated image from AI
export interface GeneratedImage {
    id: string;
    url: string;
    thumbnailUrl?: string;
    generatedAt: string;
    label?: string; // e.g. "Original 1", "Refinement 2"
}

// Design refinement data
export interface Refinement {
    id: string;
    prompt: string;
    baseImageId?: string;  // ID of the original GeneratedImage
    baseImageUrl: string;
    imageUrl: string;
    thumbnailUrl?: string;
    strength: number;
    refinedAt: string;
}

// Complete jewelry design from API
export interface JewelryDesign {
    id: number;
    userId: number;
    gemType: string;
    gemCut: string;
    gemSizeMode: 'simple' | 'advanced';
    gemSizeSimple?: string;
    gemSizeLengthMm?: number;
    gemSizeWidthMm?: number;
    gemSizeHeightMm?: number;
    gemSizeCarat?: number;
    gemColor: string;
    gemTransparency: string;
    gemImageUrl?: string;
    designPrompt: string;
    materials: {
        metals: string[];
        finish?: string;
    };
    generatedImages: GeneratedImage[];
    selectedImageUrl?: string;
    refinements?: Refinement[];
    createdAt: string;
    updatedAt: string;
}

// API response types
export interface GenerateDesignResponse {
    message: string;
    design: JewelryDesign;
    aiUsed: boolean;
}

export interface RefineDesignResponse {
    message: string;
    refinement: Refinement;
    design: JewelryDesign;
    aiUsed: boolean;
}

export interface UploadGemImageResponse {
    message: string;
    imageUrl: string;
    thumbnailUrl: string;
    imageId: string;
}
