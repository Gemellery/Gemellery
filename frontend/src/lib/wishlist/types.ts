export interface WishlistItem {
  wishlist_id: number;
  gem_id: number;
  added_date: string;
  gem_name: string;
  gem_type?: string;
  price: number;
  carat?: number;
  color?: string;
  cut?: string;
  clarity?: string;
  origin?: string;
  verification_status?: string;
  image_url?: string;
}