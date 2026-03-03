/* === Cart Item === */
export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  gem_id: number;
  price: number;
  quantity: number;
  total_price: number;

  // Gem details (from JOIN in backend)
  gem_name: string;
  gem_type?: string;
  carat?: number;
  cut?: string;
  clarity?: string;
  color?: string;
  origin?: string;
  certification?: string;
  image_url?: string;
  seller_name?: string;
}

/* === Full cart === */
export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
}

/* === Add to cart request === */
export interface AddToCartRequest {
  gem_id: number;
  quantity?: number;
}

/* === Update Cart === */
export interface UpdateCartRequest {
  cart_item_id: number;
  quantity: number;
}