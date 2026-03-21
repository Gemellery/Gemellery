export interface ShippingAddress {
  address_id: number;
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateShippingAddressRequest {
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface UpdateShippingAddressRequest {
  first_name?: string;
  last_name?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
}

export interface ShippingAddressResponse {
  success: boolean;
  message: string;
  addresses?: ShippingAddress[];
  address_id?: number;
}
