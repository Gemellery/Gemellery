import { API_CONFIG } from '@/lib/api.config';
import type {
  ShippingAddress,
  CreateShippingAddressRequest,
  UpdateShippingAddressRequest,
  ShippingAddressResponse
} from '@/lib/shipping/types';


// Helper: Get auth headers

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


// Fetch all shipping addresses

export async function getShippingAddresses(): Promise<ShippingAddress[]> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/shipping`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch shipping addresses (${response.status})`);
  }

  const data: ShippingAddressResponse = await response.json();

  return data.addresses || [];
}


// Create a new shipping address

export async function createShippingAddress(
  address: CreateShippingAddressRequest
): Promise<number> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/shipping`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create shipping address (${response.status})`);
  }

  const data: ShippingAddressResponse = await response.json();

  return data.address_id || 0;
}


// Update a shipping address

export async function updateShippingAddress(
  addressId: number,
  updates: UpdateShippingAddressRequest
): Promise<void> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/shipping/${addressId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update shipping address (${response.status})`);
  }
}


// Delete a shipping address

export async function deleteShippingAddress(addressId: number): Promise<void> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/shipping/${addressId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete shipping address (${response.status})`);
  }
}


// Set a shipping address as default

export async function setDefaultAddress(addressId: number): Promise<void> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/shipping/${addressId}/set-default`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to set default address (${response.status})`);
  }
}
