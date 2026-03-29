import Slider from "react-slick";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ChevronLeft, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchGems, getGemImageUrl } from "@/lib/gems/api";
import { formatPrice } from "@/lib/gems/utils";
import type { GemListItem } from "@/lib/gems/types";

function PrevArrow({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-5 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#C9A24D] hover:text-white hover:border-[#C9A24D] transition-all duration-300 text-gray-600"
        >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
    );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-5 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#C9A24D] hover:text-white hover:border-[#C9A24D] transition-all duration-300 text-gray-600"
        >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
    );
}

function getFirstImageUrl(gem: GemListItem): string {
    const raw = gem.images;
    if (!raw) return "/sample_gems/placeholder.jpg";

    if (typeof raw === "string") {
        return raw.trim() ? getGemImageUrl(raw) : "/sample_gems/placeholder.jpg";
    }

    if (raw.length === 0) return "/sample_gems/placeholder.jpg";
    const first = raw.find(
        (img) => img !== null && img !== undefined && img !== "" && img !== "null"
    );
    if (!first) return "/sample_gems/placeholder.jpg";
    return getGemImageUrl(first);
}

export default function PopularGemsCarousel() {
    const navigate = useNavigate();
    const sliderRef = useRef<Slider>(null);
    const [gems, setGems] = useState<GemListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGems = async () => {
            try {
                const response = await fetchGems({ page: 1, limit: 8 });
                setGems(response.data);
            } catch (err) {
                console.error("Failed to load popular gems:", err);
            } finally {
                setLoading(false);
            }
        };
        loadGems();
    }, []);

    const settings = {
        dots: true,
        infinite: gems.length > 4,
        speed: 600,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        pauseOnHover: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 900, settings: { slidesToShow: 2 } },
            { breakpoint: 580, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="w-full py-16 md:py-24 px-4 sm:px-6 bg-[#f7f8fa]">
            <div className="max-w-7xl mx-auto">
                <p className="text-center text-xs uppercase tracking-widest text-[#C9A24D] font-bold mb-2">
                    Collection
                </p>
                <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                    Popular Gemstones
                </h2>
                <p className="text-center text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-10 md:mb-14 px-2">
                    NGJA-certified gems sourced directly from Sri Lanka's finest mining regions —
                    each verified on the blockchain.
                </p>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-[#C9A24D] animate-spin mb-3" />
                        <p className="text-gray-400 text-sm">Loading gems...</p>
                    </div>
                ) : gems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <p className="text-gray-500 text-sm">No gems available at the moment.</p>
                    </div>
                ) : (
                    <div className="relative px-6">
                        <Slider ref={sliderRef} {...settings}>
                            {gems.map((gem) => (
                                <div key={gem.id} className="px-3">
                                    <motion.div
                                        whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                        className="bg-white rounded-2xl overflow-hidden cursor-pointer group relative"
                                        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                                        onClick={() => navigate(`/product-detail/${gem.id}`)}
                                    >
                                        {/* Hover shadow */}
                                        <div
                                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                                            style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}
                                        />

                                        {/* Image container */}
                                        <div className="relative w-full overflow-hidden" style={{ height: "270px" }}>
                                            <img
                                                src={getFirstImageUrl(gem)}
                                                alt={gem.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/sample_gems/placeholder.jpg";
                                                }}
                                            />

                                            {/* NGJA badge */}
                                            {gem.certification && gem.certification !== "-" && (
                                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-[#1F7A73]/15">
                                                    <ShieldCheck className="w-3 h-3 text-[#1F7A73]" />
                                                    <span className="text-[10px] font-bold text-[#1F7A73] uppercase tracking-wide">NGJA</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                                                    {gem.origin || "Sri Lanka"}
                                                </span>
                                                {gem.type && (
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C9A24D]/8 text-[#C9A24D] border border-[#C9A24D]/15">
                                                        {gem.type}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-[15px] line-clamp-1 mb-3">
                                                {gem.name}
                                            </h3>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <span className="text-base font-extrabold text-[#C9A24D]">
                                                    {formatPrice(gem.price)}
                                                </span>
                                                <span className="text-[11px] font-semibold text-[#1F7A73] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    View
                                                    <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}

                <div className="text-center mt-12">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/marketplace")}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A24D]/20"
                        style={{
                            background: "linear-gradient(135deg, #C9A24D 0%, #FFE066 100%)",
                            color: "#0A1128",
                        }}
                    >
                        Browse All Gems
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
