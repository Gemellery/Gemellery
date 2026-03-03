import { API_CONFIG } from '@/lib/api.config';
import type { CartItem, CartResponse, AddToCartRequest } from '@/lib/cart/types';

// ==========================
// Helper: Get auth headers
// ==========================
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Not authenticated. Please log in.');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// =======================
//Fetch the user's cart
// =======================
export async function getCart(): Promise<CartResponse> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch cart (${response.status})`);
  }

  const data = await response.json();

  return {
    items: data.items || [],
    totalAmount: data.totalAmount || 0,
  };
}

// ===================
// Add a gem to cart
// ===================
export async function addToCart(
  gemId: number,
  quantity: number = 1
): Promise<CartItem> {
  const body: AddToCartRequest = {
    gem_id: gemId,
    quantity,
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}/api/cart`, { 
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Handle specific error cases
    if (response.status === 401) {
      throw new Error('Please log in to add items to cart.');
    }
    if (response.status === 403) {
      throw new Error('Only buyers can add items to cart.');
    }
    if (response.status === 409) {
      throw new Error('This gem is already in your cart.');
    }

    throw new Error(errorData.message || `Failed to add to cart (${response.status})`);
  }

  const data = await response.json();
  return data;
}

// ==========================
// Remove an item from cart
// ==========================
export async function removeFromCart(cartItemId: number): Promise<void> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/api/cart/${cartItemId}`,  // ← CHANGED
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to remove item (${response.status})`);
  }
}

// ================
// Clear cart
// ================
export async function clearCart(): Promise<void> {
  const cart = await getCart();

  // Remove each item
  await Promise.all(
    cart.items.map((item) => removeFromCart(item.cart_item_id))
  );
}