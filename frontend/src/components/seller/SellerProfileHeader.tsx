import React from "react";
import type { Seller } from "../../types/seller.types";
import SellerStarRating from "./SellerStarRating";

interface SellerProfileHeaderProps { seller: Seller; averageRating: number; totalReviews: number; }

const SellerProfileHeader: React.FC<SellerProfileHeaderProps> = ({ seller, averageRating, totalReviews }) => {
  const memberYear = new Date(seller.memberSince).getFullYear();
  return (
    <div className="w-full rounded-[var(--radius-2xl)] overflow-hidden border border-border bg-card shadow-sm">
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden">
        {seller.bannerUrl ? <img src={seller.bannerUrl} alt="Seller banner" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/30"/>}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent"/>
      </div>
      <div className="px-5 sm:px-8 pb-6 -mt-14 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-card overflow-hidden shadow-md">
              <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full object-cover"/>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-[Playfair_Display]">{seller.name}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <SellerStarRating rating={averageRating} size="sm" showValue/>
                  <span className="text-sm text-foreground/60">({totalReviews} review{totalReviews !== 1 ? "s" : ""})</span>
                </div>
              </div>
              <button className="payment-btn active self-start sm:self-auto mt-1 sm:mt-0 text-sm px-5 py-2 rounded-[var(--radius-lg)] font-medium whitespace-nowrap">Contact Seller</button>
            </div>
            <p className="mt-3 text-sm sm:text-base text-foreground/75 leading-relaxed max-w-2xl">{seller.description}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ label: "Location", value: seller.location }, { label: "Member Since", value: memberYear.toString() }, { label: "Total Sales", value: seller.totalSales.toString() }, { label: "Response Rate", value: `${seller.responseRate}%` }].map(({ label, value }) => (
            <div key={label} className="bg-background rounded-[var(--radius-lg)] px-4 py-3 border border-border">
              <p className="text-xs text-foreground/50 uppercase tracking-wide font-medium">{label}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfileHeader;