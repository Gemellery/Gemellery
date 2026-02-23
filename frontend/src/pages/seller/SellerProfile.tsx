import React, { useMemo, useState } from "react";
import { mockSeller } from "../../data/mockSeller";
import SellerProfileHeader from "../../components/seller/SellerProfileHeader";
import SellerGemCard from "../../components/seller/SellerGemCard";
import SellerReviewCard from "../../components/seller/SellerReviewCard";
import SellerStarRating from "../../components/seller/SellerStarRating";
import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";

type ActiveTab = "gems" | "reviews";

const SellerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("gems");
  const seller = mockSeller;

  const averageRating = useMemo(() => {
    if (seller.reviews.length === 0) return 0;
    const total = seller.reviews.reduce((sum, r) => sum + r.rating, 0);
    return parseFloat((total / seller.reviews.length).toFixed(1));
  }, [seller.reviews]);

  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    seller.reviews.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });
    return dist;
  }, [seller.reviews]);

  const tabs: { id: ActiveTab; label: string; count: number }[] = [
    { id: "gems", label: "Gems for Sale", count: seller.gems.length },
    { id: "reviews", label: "Reviews", count: seller.reviews.length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

          {/* Seller Header */}
          <SellerProfileHeader
            seller={seller}
            averageRating={averageRating}
            totalReviews={seller.reviews.length}
          />

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-card border border-border rounded-[var(--radius-lg)] w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-150 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-background"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-[var(--radius-sm)] ${
                    activeTab === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-border text-foreground/50"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Gems Tab */}
          {activeTab === "gems" && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-[Playfair_Display]">
                  Available Gems
                </h2>
                <p className="text-sm text-foreground/50">
                  {seller.gems.filter((g) => g.inStock).length} in stock
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {seller.gems.map((gem) => (
                  <SellerGemCard key={gem.id} gem={gem} />
                ))}
              </div>
            </section>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5 font-[Playfair_Display]">
                Customer Reviews
              </h2>

              {/* Rating Summary */}
              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-5 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-center">

                  {/* Big number */}
                  <div className="flex flex-col items-center text-center flex-shrink-0">
                    <span className="text-5xl font-bold text-foreground font-[Playfair_Display]">
                      {averageRating}
                    </span>
                    <div className="mt-2">
                      <SellerStarRating rating={averageRating} size="md" />
                    </div>
                    <p className="text-sm text-foreground/50 mt-1">
                      {seller.reviews.length} reviews
                    </p>
                  </div>

                  {/* Distribution bars */}
                  <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star] || 0;
                      const pct =
                        seller.reviews.length > 0
                          ? Math.round((count / seller.reviews.length) * 100)
                          : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-foreground/60 w-3 text-right flex-shrink-0">
                            {star}
                          </span>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-foreground/50 w-8 tabular-nums">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                {seller.reviews.map((review) => (
                  <SellerReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Footer */}
      <AdvancedFooter />

    </div>
  );
};

export default SellerProfile;