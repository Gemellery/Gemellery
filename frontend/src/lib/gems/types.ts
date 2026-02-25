// GemListItem — one gem in the marketplace list
export interface GemListItem {
  id: number;
  name: string;
  type: string;
  price: string;
  weight: string;
  cut: string;
  clarity: string;
  color: string;
  origin: string;
  description: string;
  certification: string;
  certificateUrl: string | null;
  images: string[] | string | null;
  seller_id: number;
  seller_name: string;
  verificationStatus: string;
  verified: boolean | number;
  status: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// GemFilters — query params sent to GET /api/gems
// ──────────────────────────────────────────────
export interface GemFilters {
  page?: number;
  limit?: number;
  search?: string;
  gemType?: string;
  gemName?: string;
  priceMin?: number;
  priceMax?: number;
  caratMin?: number;
  caratMax?: number;
  color?: string;
  cut?: string;
  clarity?: string;
  origin?: string;
  isCertified?: string;
}

// ──────────────────────────────────────────────
// GemApiResponse — shape of the GET /api/gems response
// ──────────────────────────────────────────────

export interface GemApiResponse {
  success: boolean;
  data: GemListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
