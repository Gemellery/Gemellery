import type { GemFormData, JewelryDesign, GenerateDesignResponse, RefineDesignResponse, UploadGemImageResponse } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Helper to get auth header
const getAuthHeader = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

// Generate new jewelry designs
export async function generateDesign(data: GemFormData): Promise<GenerateDesignResponse> {
    const response = await fetch(`${API_BASE}/api/jewelry-design/generate`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate design');
    }

    return response.json();
}

// Get design by ID
export async function getDesignById(id: number): Promise<JewelryDesign> {
    const response = await fetch(`${API_BASE}/api/jewelry-design/${id}`, {
        method: 'GET',
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch design');
    }

    const data = await response.json();
    return data.design;
}

// Get all user designs
export async function getUserDesigns(): Promise<JewelryDesign[]> {
    const response = await fetch(`${API_BASE}/api/jewelry-design/user-designs`, {
        method: 'GET',
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch designs');
    }

    const data = await response.json();
    return data.designs;
}

// Save/select a design image
export async function saveDesign(id: number, selectedImageUrl: string): Promise<JewelryDesign> {
    const response = await fetch(`${API_BASE}/api/jewelry-design/${id}/save`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ selectedImageUrl }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save design');
    }

    const data = await response.json();
    return data.design;
}

// Refine an existing design
export async function refineDesign(
    id: number,
    refinementPrompt: string,
    baseImageUrl: string,
    strength: number = 0.5
): Promise<RefineDesignResponse> {
    const response = await fetch(`${API_BASE}/api/jewelry-design/${id}/refine`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ refinementPrompt, baseImageUrl, strength }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to refine design');
    }

    return response.json();
}

// Upload gem image
export async function uploadGemImage(file: File): Promise<UploadGemImageResponse> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/api/jewelry-design/upload-gem-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
    }

    return response.json();
}

// Check AI status
export async function getAIStatus(): Promise<{ geminiConfigured: boolean; firebaseConfigured: boolean; aiAvailable: boolean }> {
    const response = await fetch(`${API_BASE}/api/jewelry-design/status`);

    if (!response.ok) {
        return { geminiConfigured: false, firebaseConfigured: false, aiAvailable: false };
    }

    return response.json();
}
