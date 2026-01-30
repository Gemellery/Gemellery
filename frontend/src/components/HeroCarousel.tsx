import { useEffect, useState } from "react";

const slides = [
    {
        video: "/videos/video_1.mp4",
        title: "Discover Authentic Sri Lankan Gems",
        description:
            "Connect directly with verified sellers and explore NGJA-certified gemstones.",
    },
    {
        video: "/videos/video_2.mp4",
        title: "Design Your Jewellery with AI",
        description:
            "Create bespoke jewellery using our AI-powered design studio.",
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[85vh] overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Video */}
                    <video
                        src={slide.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 flex items-center">
                        <div className="max-w-6xl px-10 text-white">
                            <h1 className="text-5xl font-bold mb-4">
                                {slide.title}
                            </h1>
                            <p className="text-lg mb-6 max-w-xl">
                                {slide.description}
                            </p>

                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition">
                                    Explore Gems
                                </button>
                                <button className="px-6 py-3 border border-white font-semibold rounded-md hover:bg-white hover:text-black transition">
                                    AI Design Studio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
