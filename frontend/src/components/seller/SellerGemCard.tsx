import React, { useState } from "react";
import type { Gem } from "../../types/seller.types";

interface SellerGemCardProps { gem: Gem; }

const SellerGemCard: React.FC<SellerGemCardProps> = ({ gem }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="group flex flex-col rounded-[var(--radius-xl)] overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative overflow-hidden aspect-square bg-background">
        {!imgError ? (
          <img src={gem.imageUrl} alt={gem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgError(true)}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent/10">
            <svg className="w-12 h-12 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        )}
        {!gem.inStock && <div className="absolute top-2 left-2"><span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] bg-foreground/80 text-background">Sold Out</span></div>}
        <div className="absolute top-2 right-2"><span className="inline-block text-xs font-medium px-2 py-0.5 rounded-[var(--radius-sm)] bg-card/90 border border-border text-foreground/80 backdrop-blur-sm">{gem.category}</span></div>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-foreground text-base leading-snug font-[Playfair_Display] line-clamp-1">{gem.name}</h3>
        <p className="text-sm text-foreground/65 leading-relaxed line-clamp-2 flex-1">{gem.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-foreground tabular-nums">${gem.price.toLocaleString()}</span>
          <button disabled={!gem.inStock} className={`text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-lg)] transition-opacity duration-150 ${gem.inStock ? "payment-btn active cursor-pointer" : "bg-border text-foreground/40 cursor-not-allowed"}`}>
            {gem.inStock ? "View Gem" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerGemCard;