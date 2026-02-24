import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";
import SellerStarRating from "../../components/seller/SellerStarRating";
import { fetchSellerProfile } from "../../services/sellerService";
import type { SellerProfileResponse } from "../../types/seller.types";

type ActiveTab = "gems" | "reviews";

const PLACEHOLDER_BANNER =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80";
const PLACEHOLDER_AVATAR = "https://i.pravatar.cc/300?img=47";
const PLACEHOLDER_IMAGE = "/sample_gems/handfulgems.jpg";

const SellerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<ActiveTab>("gems");
  const [profileData, setProfileData] = useState<SellerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSellerProfile(id);
        setProfileData(data);
      } catch (err) {
        console.error("Failed to load seller profile:", err);
        setError("Failed to load seller profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (profileData?.reviews) {
      profileData.reviews.forEach((r) => {
        dist[r.rating] = (dist[r.rating] || 0) + 1;
      });
    }
    return dist;
  }, [profileData?.reviews]);

  const tabs: { id: ActiveTab; label: string; count: number }[] = [
    { id: "gems", label: "Gems for Sale", count: profileData?.gems.length || 0 },
    { id: "reviews", label: "Reviews", count: profileData?.totalReviews || 0 },
  ];

  // Show spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground/60 text-sm">Loading seller profile...</p>
          </div>
        </main>
        <AdvancedFooter />
      </div>
    );
  }

  // Show error if API call failed
  if (error || !profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">Seller Not Found</h2>
            <p className="text-foreground/60 text-sm max-w-md">
              {error || "This seller profile could not be loaded."}
            </p>
          </div>
        </main>
        <AdvancedFooter />
      </div>
    );
  }

  const { seller, gems, reviews, averageRating, totalReviews } = profileData;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

          {/* SELLER HEADER */}
          <div className="w-full rounded-[var(--radius-2xl)] overflow-hidden border border-border bg-card shadow-sm">
            <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden">
              <img src={PLACEHOLDER_BANNER} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>

            <div className="px-5 sm:px-8 pb-6 -mt-14 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-card overflow-hidden shadow-md bg-accent/20">
                    <img src={PLACEHOLDER_AVATAR} alt={seller.fullName} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      {/* From seller table */}
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-[Playfair_Display]">
                        {seller.businessName}
                      </h1>
                      {/* From user table */}
                      <p className="text-sm text-foreground/50 mt-0.5">Managed by {seller.fullName}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <SellerStarRating rating={averageRating} size="sm" showValue />
                        <span className="text-sm text-foreground/60">
                          ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                        </span>
                        {seller.verificationStatus === "approved" && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            ✓ Verified Seller
                          </span>
                        )}
                        {seller.verificationStatus === "pending" && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                            ⏳ Pending Verification
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="payment-btn active self-start sm:self-auto mt-1 sm:mt-0 text-sm px-5 py-2 rounded-[var(--radius-lg)] font-medium whitespace-nowrap">
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Total Gems", value: gems.length.toString() },
                  { label: "Total Reviews", value: totalReviews.toString() },
                  { label: "Average Rating", value: averageRating > 0 ? `${averageRating} / 5` : "No ratings yet" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-background rounded-[var(--radius-lg)] px-4 py-3 border border-border">
                    <p className="text-xs text-foreground/50 uppercase tracking-wide font-medium">{label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TABS */}
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
                <span className={`text-xs px-1.5 py-0.5 rounded-[var(--radius-sm)] ${
                  activeTab === tab.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-border text-foreground/50"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* GEMS TAB */}
          {activeTab === "gems" && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-[Playfair_Display]">
                  Available Gems
                </h2>
                <p className="text-sm text-foreground/50">
                  {gems.filter((g) => g.inStock).length} in stock
                </p>
              </div>

              {gems.length === 0 ? (
                <div className="text-center py-16 text-foreground/50">
                  <p className="text-lg">No gems listed yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {gems.map((gem) => (
                    <div key={gem.id} className="group flex flex-col rounded-[var(--radius-lg)] overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 max-w-[260px] w-full mx-auto">
                      <div className="relative overflow-hidden bg-background" style={{ height: "180px" }}>
                        <img
                          src={gem.imageUrl ? `http://localhost:5001${gem.imageUrl}` : PLACEHOLDER_IMAGE}
                          alt={gem.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                        />
                        {!gem.inStock && (
                          <div className="absolute top-2 left-2">
                            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] bg-foreground/80 text-background">
                              Sold Out
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-[var(--radius-sm)] bg-card/90 border border-border text-foreground/80 backdrop-blur-sm">
                            {gem.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 p-3 gap-1.5">
                        <h3 className="font-semibold text-foreground text-sm leading-snug font-[Playfair_Display] line-clamp-1">
                          {gem.name}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          {gem.carat && <span className="text-xs text-foreground/50">{gem.carat}ct</span>}
                          {gem.color && <span className="text-xs text-foreground/50">{gem.color}</span>}
                          {gem.origin && <span className="text-xs text-foreground/50">{gem.origin}</span>}
                        </div>
                        <p className="text-xs text-foreground/65 leading-relaxed line-clamp-2 flex-1">
                          {gem.description}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-base font-bold text-foreground tabular-nums">
                            ${Number(gem.price).toLocaleString()}
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
                  ))}
                </div>
              )}
            </section>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5 font-[Playfair_Display]">
                Customer Reviews
              </h2>

              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-5 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-center">
                  <div className="flex flex-col items-center text-center flex-shrink-0">
                    <span className="text-5xl font-bold text-foreground font-[Playfair_Display]">
                      {averageRating > 0 ? averageRating : "—"}
                    </span>
                    <div className="mt-2">
                      <SellerStarRating rating={averageRating} size="md" />
                    </div>
                    <p className="text-sm text-foreground/50 mt-1">
                      {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star] || 0;
                      const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-foreground/60 w-3 text-right flex-shrink-0">{star}</span>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-foreground/50 w-8 tabular-nums">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-16 text-foreground/50">
                  <p className="text-lg">No reviews yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-[var(--radius-xl)] border border-border bg-card px-5 py-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 border border-border flex items-center justify-center text-foreground/60 text-sm font-bold">
                          {review.buyerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <p className="font-semibold text-foreground text-sm">{review.buyerName}</p>
                            <time className="text-xs text-foreground/50">
                              {new Date(review.date).toLocaleDateString("en-GB", {
                                day: "numeric", month: "long", year: "numeric",
                              })}
                            </time>
                          </div>
                          <div className="mt-1">
                            <SellerStarRating rating={review.rating} size="sm" />
                          </div>
                          <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      </main>

      <AdvancedFooter />
    </div>
  );
};

export default SellerProfile;