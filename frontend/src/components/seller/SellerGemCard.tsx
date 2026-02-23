import React, { useState } from "react";
import type { Gem } from "../../types/seller.types";

interface SellerGemCardProps {
  gem: Gem;
}

const SellerGemCard: React.FC<SellerGemCardProps> = ({ gem }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col rounded-[var(--radius-lg)] overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 max-w-[260px] w-full mx-auto">
      {/* Image */}
      <div className="relative overflow-hidden bg-background" style={{ height: "179px" }}>
        {!imgError ? (
          <img
            src={gem.imageUrl}
            alt={gem.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent/10">
            <svg
              className="w-10 h-10 text-foreground/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 23 23"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Sold Out badge */}
        {!gem.inStock && (
          <div className="absolute top-2 left-2">
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] bg-foreground/80 text-background">
              Sold Out
            </span>
          </div>
        )}

        {/* Category chip */}
        <div className="absolute top-2 right-2">
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-[var(--radius-sm)] bg-card/90 border border-border text-foreground/80 backdrop-blur-sm">
            {gem.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <h3 className="font-semibold text-foreground text-sm leading-snug font-[Playfair_Display] line-clamp-1">
          {gem.name}
        </h3>
        <p className="text-xs text-foreground/65 leading-relaxed line-clamp-2 flex-1">
          {gem.description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-base font-bold text-foreground tabular-nums">
            ${gem.price.toLocaleString()}
          </span>
          <button
            disabled={!gem.inStock}
            className={`text-xs font-semibold px-3 py-1 rounded-[var(--radius-md)] transition-opacity duration-150 ${
              gem.inStock
                ? "payment-btn active cursor-pointer"
                : "bg-border text-foreground/40 cursor-not-allowed"
            }`}
          >
            {gem.inStock ? "View Gem" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerGemCard;