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