import React from "react";
import type { Review } from "../../types/seller.types";
import SellerStarRating from "./SellerStarRating";

interface SellerReviewCardProps { review: Review; }

const SellerReviewCard: React.FC<SellerReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-card px-5 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-accent/20 border border-border">
          {review.avatarUrl ? <img src={review.avatarUrl} alt={review.userName} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-foreground/60 text-sm font-bold">{review.userName.charAt(0).toUpperCase()}</div>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <p className="font-semibold text-foreground text-sm">{review.userName}</p>
            <time className="text-xs text-foreground/50">{formattedDate}</time>
          </div>
          <div className="mt-1"><SellerStarRating rating={review.rating} size="sm"/></div>
          <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerReviewCard;