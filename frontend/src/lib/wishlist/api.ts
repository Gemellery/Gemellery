import { API_CONFIG } from "../api.config";
import type { WishlistItem } from "./types";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Get all wishlist items
export async function getWishlist(): Promise<WishlistItem[]> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/wishlist`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  const data = await response.json();
  return data.items || [];
}

// Add gem to wishlist
export async function addToWishlist(gemId: number): Promise<boolean> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/wishlist`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ gem_id: gemId }),
  });

  if (response.status === 409) {
    // Already wishlisted — not an error, just return true
    return true;
  }

  if (!response.ok) {
    throw new Error("Failed to add to wishlist");
  }

  return true;
}

// Remove gem from wishlist
export async function removeFromWishlist(gemId: number): Promise<boolean> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/wishlist/${gemId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to remove from wishlist");
  }

  return true;
}

// Check if a gem is in the wishlist
export async function checkWishlist(gemId: number): Promise<boolean> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/api/wishlist/check/${gemId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.isWishlisted;
}