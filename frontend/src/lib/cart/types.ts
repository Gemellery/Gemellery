/* === Cart Item === */
export interface CartItem {
  cart_item_id: number;
  gem_id: number;
  gem_name: string;
  price: number;
  quantity: number;
  total_price: number;
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