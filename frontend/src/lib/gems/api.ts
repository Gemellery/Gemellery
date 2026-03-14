import { API_CONFIG } from '@/lib/api.config';
import type { GemListItem, GemFilters, GemApiResponse, GemData, GemResponse } from '@/lib/gems/types';

/* === Image URL builder === */
export function getGemImageUrl(path: string): string {
  if (!path) return "/sample_gems/placeholder.jpg";

  // If already full URL (S3)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // fallback for local uploads (if ever used)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${API_BASE}/uploads/${path}`;
}

/* === Parse image === */
function parseImages(images: any): string[] {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images.filter(
      (img: any) => img !== null && img !== undefined && img !== '' && img !== 'null'
    );
  }

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (img: any) => img !== null && img !== undefined && img !== '' && img !== 'null'
        );
      }
    } catch {
      return images.trim() !== '' ? [images] : [];
    }
  }

  return [];
}

/* === GemListItem === */
function normalizeGem(raw: any): GemListItem {
  return {
    id: raw.id,
    name: raw.name || '',
    type: raw.type || '',
    price: raw.price?.toString() || '0',
    weight: raw.weight?.toString() || '0',
    cut: raw.cut || '',
    clarity: raw.clarity || '',
    color: raw.color || '',
    origin: raw.origin || '',
    description: raw.description || '',
    certification: raw.certification || '',
    certificateUrl: raw.certificateUrl || null,
    images: parseImages(raw.images),
    seller_id: raw.seller_id || 0,
    seller_name: raw.seller_name || 'Unknown Seller',
    business_name: raw.business_name,
    seller_verification_status: raw.seller_verification_status || 'pending',
    seller_verified: raw.seller_verified === 1 || raw.seller_verified === true,
    seller_joined_date: raw.seller_joined_date || '',
    txHash: raw.txHash || '',
    blockchainStatus: raw.blockchainStatus || '',
    tokenId: raw.tokenId || '',
    seller_regional_branch: raw.seller_regional_branch || '',
    verificationStatus: raw.verificationStatus || 'pending',
    verified: raw.verified === 1 || raw.verified === true,
    status: raw.status || 'Available',
    createdAt: raw.createdAt || '',
  };
}

/* === fetchGems === */
export async function fetchGems(
  filters: GemFilters = {}
): Promise<GemApiResponse> {
  const params = new URLSearchParams();

  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.gemType) params.append('gemType', filters.gemType);
  if (filters.gemName) params.append('gemName', filters.gemName);
  if (filters.priceMin !== undefined) params.append('priceMin', filters.priceMin.toString());
  if (filters.priceMax !== undefined) params.append('priceMax', filters.priceMax.toString());
  if (filters.priceRanges) params.append('priceRanges', filters.priceRanges);
  if (filters.caratMin !== undefined) params.append('caratMin', filters.caratMin.toString());
  if (filters.caratMax !== undefined) params.append('caratMax', filters.caratMax.toString());
  if (filters.color) params.append('color', filters.color);
  if (filters.specialColors) params.append('specialColors', filters.specialColors);
  if (filters.cut) params.append('cut', filters.cut);
  if (filters.clarity) params.append('clarity', filters.clarity);
  if (filters.origin) params.append('origin', filters.origin);
  if (filters.miningRegion) params.append('miningRegion', filters.miningRegion);
  if (filters.isCertified) params.append('isCertified', filters.isCertified);

  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.GEMS_ENDPOINT}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'API returned unsuccessful response');
  }

  const normalizedData: GemListItem[] = (json.data || []).map(normalizeGem);

  return {
    success: true,
    data: normalizedData,
    pagination: {
      page: json.pagination?.page || 1,
      limit: json.pagination?.limit || 12,
      total: json.pagination?.total || 0,
    },
  };
}

/* === fetchGemById === */
export async function fetchGemById(id: string): Promise<GemData> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.GEMS_ENDPOINT}/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Gem not found");
    }
    throw new Error(`Failed to fetch gem details: ${response.statusText}`);
  }

  const result: GemResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error("Failed to fetch gem details: Invalid API response");
  }

  return result.data;
}