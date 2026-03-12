import Slider from "react-slick";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const gems = [
    {
        name: "Pigeon Blood Ruby",
        origin: "Ratnapura, Sri Lanka",
        priceFrom: "$800",
        image: "/gems/ruby.png",
        type: "Ruby",
    },
    {
        name: "Royal Blue Sapphire",
        origin: "Elahera, Sri Lanka",
        priceFrom: "$1,200",
        image: "/gems/sapphire.png",
        type: "Sapphire",
    },
    {
        name: "Colombian Emerald",
        origin: "Pelmadulla, Sri Lanka",
        priceFrom: "$950",
        image: "/gems/emerald.png",
        type: "Emerald",
    },
    {
        name: "Padparadscha Sapphire",
        origin: "Okkampitiya, Sri Lanka",
        priceFrom: "$2,500",
        image: "/gems/padparadscha.png",
        type: "Padparadscha",
    },
    {
        name: "Alexandrite",
        origin: "Ratnapura, Sri Lanka",
        priceFrom: "$3,000",
        image: "/gems/alexandrite.png",
        type: "Alexandrite",
    },
    {
        name: "Chrysoberyl Cat's Eye",
        origin: "Avissawella, Sri Lanka",
        priceFrom: "$650",
        image: "/gems/catseye.png",
        type: "Cat's Eye",
    },
];

function PrevArrow({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-[#1F7A73] hover:text-white hover:border-[#1F7A73] transition-all duration-200"
        >
            <ChevronLeft className="w-5 h-5" />
        </button>
    );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-[#1F7A73] hover:text-white hover:border-[#1F7A73] transition-all duration-200"
        >
            <ChevronRight className="w-5 h-5" />
        </button>
    );
}

export default function PopularGemsCarousel() {
    const navigate = useNavigate();
    const sliderRef = useRef<Slider>(null);

    const settings = {
        dots: true,
        infinite: true,
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
        <div className="w-full py-24 px-6 bg-[#f7f8fa]">
            <div className="max-w-7xl mx-auto">
                <p className="text-center text-xs uppercase tracking-widest text-[#C9A24D] font-bold mb-2">
                    Collection
                </p>
                <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                    Popular Gemstones
                </h2>
                <p className="text-center text-gray-500 text-base max-w-xl mx-auto mb-14">
                    NGJA-certified gems sourced directly from Sri Lanka's finest mining regions —
                    each verified on the blockchain.
                </p>

                <div className="relative px-6">
                    <Slider ref={sliderRef} {...settings}>
                        {gems.map((gem) => (
                            <div key={gem.name} className="px-3">
                                <motion.div
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.22 }}
                                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer group"
                                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                                    onClick={() => navigate(`/marketplace?type=${gem.type.toLowerCase()}`)}
                                >
                                    {/* Image container */}
                                    <div className="relative w-full bg-white flex items-center justify-center" style={{ height: "220px" }}>
                                        <img
                                            src={gem.image}
                                            alt={gem.name}
                                            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* NGJA badge */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow border border-[#1F7A73]/20">
                                            <ShieldCheck className="w-3 h-3 text-[#1F7A73]" />
                                            <span className="text-[10px] font-bold text-[#1F7A73] uppercase tracking-wide">NGJA</span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 border-t border-gray-50">
                                        <p className="text-xs text-gray-400 mb-1">{gem.origin}</p>
                                        <h3 className="font-bold text-gray-900 text-sm mb-2">{gem.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Starting from</span>
                                            <span className="text-sm font-bold text-[#1F7A73]">{gem.priceFrom}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </Slider>
                </div>

                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate("/marketplace")}
                        className="px-8 py-3 rounded-full border-2 border-[#1F7A73] text-[#1F7A73] font-semibold hover:bg-[#1F7A73] hover:text-white transition-all duration-300 text-sm"
                    >
                        Browse All Gems
                    </button>
                </div>
            </div>
        </div>
    );
}
