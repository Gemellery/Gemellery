import type { SellerProfileResponse } from "../types/seller.types";

const API_BASE_URL = "http://localhost:5001/api";

export const fetchSellerProfile = async (
  sellerId: string
): Promise<SellerProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/seller/${sellerId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch the seller: ${response.statusText}`);
  }

  const data: SellerProfileResponse = await response.json();
  return data;
};

export const submitSellerReview = async (
  sellerId: string,
  rating: number,
  comment: string
): Promise<{ id: number | string; buyerName: string; rating: number; comment: string; date: string }> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/seller/${sellerId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ rating, comment }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Failed to submit review: ${response.statusText}`);
  }

  const data = await response.json();
  return data.review;
};