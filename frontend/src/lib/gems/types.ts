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
  certificateUrl: string;
  images: string[];
  seller_id: number;
  seller_name: string;
  verificationStatus: string;
  verified: number;
  status: string;
  createdAt: string;
}

// GemDetail — single gem from the detail endpoint
export interface GemDetail {
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
  certificateUrl: string;
  images: string[];
  seller_id: number;
  seller_name: string;
  verificationStatus: string;
  verified: number;
  status: string;
  createdAt: string;
}

// Pagination metadata
export interface GemPagination {
  page: number;
  limit: number;
  total: number;
}

// API response wrappers
export interface GemListResponse {
  success: boolean;
  data: GemListItem[];
  pagination: GemPagination;
}

export interface GemDetailResponse {
  success: boolean;
  data: GemDetail;
}

// Query parameters for GET /api/gems
export interface GemFilters {
  page?: number;
  limit?: number;
  search?: string;
  gemType?: string;
  priceMin?: number;
  priceMax?: number;
  caratMin?: number;
  caratMax?: number;
  color?: string;
  cut?: string;
  clarity?: string;
  origin?: string;
}
