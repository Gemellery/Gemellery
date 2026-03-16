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
  business_name?: string;
  seller_verification_status?: string;
  seller_verified?: boolean | number;
  seller_joined_date?: string;
  seller_regional_branch?: string;
  verificationStatus: string;
  verified: boolean | number;
  status: string;
  createdAt: string;
  txHash?: string;
  blockchainStatus?: string;
  tokenId?: string | number | null;
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
  priceRanges?: string;
  caratMin?: number;
  caratMax?: number;
  color?: string;
  cut?: string;
  clarity?: string;
  origin?: string;
  miningRegion?: string;
  isCertified?: string;
  specialColors?: string;
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

// ──────────────────────────────────────────────
// GemData — detailed gem info from GET /api/gems/:id
// ──────────────────────────────────────────────
export interface GemData {
    gem_id: number;
    gem_name: string;
    gem_type: string;
    price: number;
    carat: number;
    cut: string;
    clarity: string;
    color: string;
    origin: string;
    mining_region: string;
    description: string;
    ngja_certificate_no: string;
    ngja_certificate_url: string;
    token_id: number | null;
    tx_hash: string | null;
    blockchain_status: string;
    minted_at: string | null;
    verification_status: string;
    verified: number;
    status: string;
    created_at: string;
    seller_name: string;
    business_name?: string;
    seller_verification_status?: string;
    seller_verified?: boolean | number;
    seller_joined_date?: string;
    seller_regional_branch?: string;
    seller_id: number;
    images: string[];
}

export interface GemResponse {
    success: boolean;   
    data: GemData;
}
