export interface CheckoutRequest {
  payment_method: string;
  shipping_address_id: number;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  order_id?: number;
  total_amount?: number;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  gem_id: number;
  price: number;
  quantity: number;
  created_at?: string;
}

export interface Order {
  order_id: number;
  buyer_id: number;
  total_amount: number;
  payment_method: string;
  shipping_address_id: number;
  status: string;
  created_at: string;
  updated_at?: string;
}
