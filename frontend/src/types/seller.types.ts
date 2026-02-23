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