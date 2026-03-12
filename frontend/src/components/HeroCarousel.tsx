import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const slides = [
    {
        video: "/videos/video_1.mp4",
        badge: "NGJA Certified Marketplace",
        titleLine1: "Discover Authentic",
        titleLine2: "Sri Lankan Gems",
        description:
            "Connect directly with verified sellers. Every gemstone backed by government certification and blockchain provenance.",
        primaryCta: { label: "Explore Marketplace", path: "/marketplace" },
        secondaryCta: { label: "Learn More", path: "/about" },
    },
    {
        video: "/videos/video_2.mp4",
        badge: "Powered by Gemini AI",
        titleLine1: "Design Bespoke",
        titleLine2: "Jewellery with AI",
        description:
            "Describe your vision, select your gem, and let our AI create stunning jewellery pieces unique to you — ready in seconds.",
        primaryCta: { label: "Try AI Designer", path: "/jewelry-designer" },
        secondaryCta: { label: "See How It Works", path: "/about" },
    },
];

const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.55, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [key, setKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
            setKey((k) => k + 1);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const slide = slides[current];

    const goTo = (i: number) => {
        setCurrent(i);
        setKey((k) => k + 1);
    };

    return (
        <div className="relative w-full overflow-hidden" style={{ height: "92vh" }}>
            {/* Videos */}
            {slides.map((s, i) => (
                <video
                    key={i}
                    src={s.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        i === current ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}

            {/* Gradient layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={key}
                    className="absolute inset-0 flex items-center"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">

                        {/* Badge */}
                        <motion.div
                            custom={0}
                            variants={contentVariants}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#C9A24D] animate-pulse" />
                            {slide.badge}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            custom={1}
                            variants={contentVariants}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] mb-5"
                        >
                            {slide.titleLine1}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#FFE066]">
                                {slide.titleLine2}
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            custom={2}
                            variants={contentVariants}
                            className="text-gray-200 text-lg md:text-xl mb-9 max-w-lg leading-relaxed"
                        >
                            {slide.description}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div custom={3} variants={contentVariants} className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate(slide.primaryCta.path)}
                                className="px-8 py-3.5 rounded-xl font-bold text-black text-base transition-all duration-300 hover:shadow-xl hover:shadow-[#C9A24D]/40 hover:-translate-y-0.5 active:scale-95"
                                style={{ background: "linear-gradient(135deg, #C9A24D 0%, #FFE066 100%)" }}
                            >
                                {slide.primaryCta.label}
                            </button>
                            <button
                                onClick={() => navigate(slide.secondaryCta.path)}
                                className="px-8 py-3.5 rounded-xl font-semibold text-white text-base border border-white/25 backdrop-blur-sm hover:bg-white/12 transition-all duration-300"
                            >
                                {slide.secondaryCta.label}
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Slide indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all duration-400 ${
                            i === current ? "w-10 bg-[#C9A24D]" : "w-5 bg-white/35 hover:bg-white/60"
                        }`}
                    />
                ))}
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-9 right-12 hidden md:flex flex-col items-center gap-2 opacity-60">
                <span className="text-white text-xs tracking-[0.18em] uppercase" style={{ writingMode: "vertical-rl" }}>
                    Scroll
                </span>
                <ChevronDown className="w-4 h-4 text-white animate-bounce" />
            </div>
        </div>
    );
}
