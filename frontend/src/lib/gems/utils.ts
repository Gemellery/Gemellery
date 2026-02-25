// ============================================================
// Gem Utilities — data transformation for display
// ============================================================

import { getGemImageUrl } from '@/lib/gems/api';
import type { GemListItem } from '@/lib/gems/types';

// ──────────────────────────────────────────────
// parsePrice
// ──────────────────────────────────────────────
export function parsePrice(price: string | undefined | null): number {
  if (!price) return 0;
  const parsed = parseFloat(price);
  return isNaN(parsed) ? 0 : parsed;
}

// ──────────────────────────────────────────────
// formatPrice
// ──────────────────────────────────────────────
export function formatPrice(
  price: string | undefined | null,
  currency: string = 'USD'
): string {
  const numericPrice = parsePrice(price);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

// ──────────────────────────────────────────────
// formatWeight
// ──────────────────────────────────────────────
export function formatWeight(weight: string | undefined | null): string {
  if (!weight) return '0.00 ct';
  const parsed = parseFloat(weight);
  if (isNaN(parsed)) return '0.00 ct';
  return `${parsed.toFixed(2)} ct`;
}

// ──────────────────────────────────────────────
// formatDate
// ──────────────────────────────────────────────
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown date';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// ──────────────────────────────────────────────
// isVerified
// ──────────────────────────────────────────────
export function isVerified(verificationStatus: string | undefined | null): boolean {
  return verificationStatus === 'approved';
}

// ──────────────────────────────────────────────
// isCertified / getCertificationLabel
// ──────────────────────────────────────────────
export function isCertified(certification: string | undefined | null): boolean {
  if (!certification) return false;
  const trimmed = certification.trim();
  return trimmed !== '' && trimmed !== '-';
}

export function getCertificationLabel(certification: string | undefined | null): string {
  return isCertified(certification) ? 'Certified' : 'Not Certified';
}

// ──────────────────────────────────────────────
// Image helpers
// ──────────────────────────────────────────────
const PLACEHOLDER_IMAGE = '/sample_gems/placeholder.jpg';

export function getFirstImage(images: string[] | undefined | null): string {
  if (!images || images.length === 0) {
    return PLACEHOLDER_IMAGE;
  }

  const firstValidImage = images.find(
    (img) => img !== null && img !== undefined && img !== ''
  );

  if (!firstValidImage) {
    return PLACEHOLDER_IMAGE;
  }

  return getGemImageUrl(firstValidImage);
}

export function getAllImages(images: string[] | undefined | null): string[] {
  if (!images || images.length === 0) {
    return [PLACEHOLDER_IMAGE];
  }

  const validImages = images
    .filter((img) => img !== null && img !== undefined && img !== '')
    .map((img) => getGemImageUrl(img));

  return validImages.length > 0 ? validImages : [PLACEHOLDER_IMAGE];
}

// ──────────────────────────────────────────────
// Display-ready gem type
// ──────────────────────────────────────────────
export interface GemCardDisplay {
  id: number;
  name: string;
  type: string;
  formattedPrice: string;
  numericPrice: number;
  formattedWeight: string;
  cut: string;
  clarity: string;
  color: string;
  origin: string;
  description: string;
  imageUrl: string;
  allImageUrls: string[];
  sellerName: string;
  isVerified: boolean;
  isCertified: boolean;
  certificationLabel: string;
  status: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// transformGemForCard
// ──────────────────────────────────────────────
export function transformGemForCard(gem: GemListItem): GemCardDisplay {
  return {
    id: gem.id,
    name: gem.name,
    type: gem.type,
    formattedPrice: formatPrice(gem.price),
    numericPrice: parsePrice(gem.price),
    formattedWeight: formatWeight(gem.weight),
    cut: gem.cut,
    clarity: gem.clarity,
    color: gem.color,
    origin: gem.origin,
    description: gem.description,
    imageUrl: getFirstImage(gem.images),
    allImageUrls: getAllImages(gem.images),
    sellerName: gem.seller_name,
    isVerified: isVerified(gem.verificationStatus),
    isCertified: isCertified(gem.certification),
    certificationLabel: getCertificationLabel(gem.certification),
    status: gem.status,
    createdAt: formatDate(gem.createdAt),
  };
}