// Types that match your real database columns

export interface GemFrompool {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  color: string;
  carat: number;
  origin: string;
  inStock: boolean;
  imageUrl: string | null;
}

export interface ReviewFrompool {
  id: number;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SellerFrompool {
  id: number;
  businessName: string;
  fullName: string;
  email: string;
  verificationStatus: string;
}

export interface SellerProfileResponse {
  seller: SellerFrompool;
  gems: GemFrompool[];
  reviews: ReviewFrompool[];
  averageRating: number;
  totalReviews: number;
}

// Old mock types kept so nothing else in the project breaks
export interface Gem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl?: string;
}

export interface Seller {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl?: string;
  location: string;
  memberSince: string;
  totalSales: number;
  responseRate: number;
  gems: Gem[];
  reviews: Review[];
}