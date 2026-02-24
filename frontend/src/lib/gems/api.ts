import API_CONFIG from '@/lib/api.config';
import type { GemFilters, GemListResponse, GemDetailResponse } from '@/lib/gems/types';

// ──────────────────────────────────────────────
// Helper: Convert a GemFilters object into a URL query string
// ──────────────────────────────────────────────
function buildQueryString(filters: GemFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// ──────────────────────────────────────────────
// fetchGems — Get a paginated, filtered list of gems
// ──────────────────────────────────────────────
export async function fetchGems(filters: GemFilters = {}): Promise<GemListResponse> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.GEMS_ENDPOINT}${buildQueryString(filters)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch gems: ${response.status} ${response.statusText}`);
  }

  const data: GemListResponse = await response.json();

  if (!data.success) {
    throw new Error('API returned success: false');
  }

  return data;
}

// ──────────────────────────────────────────────
// fetchGemById — Get details for a single gem
// ──────────────────────────────────────────────
export async function fetchGemById(id: string): Promise<GemDetailResponse> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.GEMS_ENDPOINT}/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Gem with ID ${id} not found`);
    }
    throw new Error(`Failed to fetch gem: ${response.status} ${response.statusText}`);
  }

  const data: GemDetailResponse = await response.json();

  if (!data.success) {
    throw new Error('API returned success: false');
  }

  return data;
}

// ──────────────────────────────────────────────
// URL builders — turn filenames into full URLs
// ──────────────────────────────────────────────
export function getGemImageUrl(filename: string): string {
  return `${API_CONFIG.BASE_URL}/uploads/gem_images/${filename}`;
}

export function getCertificateUrl(filename: string): string {
  return `${API_CONFIG.BASE_URL}/uploads/gem_certificates/${filename}`;
}