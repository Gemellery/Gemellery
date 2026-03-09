import { API_CONFIG } from '@/lib/api.config';
import type { CheckoutRequest, CheckoutResponse } from './types';

/**
 * Helper: Get auth headers
 */
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

/**
 * Checkout - Create an order from cart items
 */
export async function checkoutOrder(
  request: CheckoutRequest
): Promise<CheckoutResponse> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/checkout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to checkout (${response.status})`);
  }

  const data = await response.json();

  return {
    success: true,
    message: data.message || 'Order placed successfully',
    order_id: data.order_id,
    total_amount: data.total_amount,
  };
}
