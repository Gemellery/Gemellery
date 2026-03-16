import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Gem, Image, Wand2, Sparkles, ArrowRight } from "lucide-react";

const steps = [
    { icon: Gem, text: "Choose gem type, cut & size" },
    { icon: Image, text: "Upload a reference image (optional)" },
    { icon: Wand2, text: "AI generates your unique design" },
    { icon: Sparkles, text: "Refine with natural language prompts" },
];

export default function AIDesignerPromo() {
    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <div
            ref={ref}
            className="w-full py-24 px-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #070f1c 0%, #0d1829 60%, #091524 100%)" }}
        >
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                    backgroundSize: "64px 64px",
                }}
            />
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-[#8B5CF6]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#C9A24D]/6 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.45 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A24D]/30 bg-[#C9A24D]/10 text-[#C9A24D] text-sm font-semibold mb-6"
                        >
                            <Sparkles className="w-4 h-4" />
                            Powered by Gemini AI
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5"
                        >
                            Design Your Dream{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#FFE066]">
                                Jewellery
                            </span>{" "}
                            with AI
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gray-400 text-lg leading-relaxed mb-8"
                        >
                            Describe your ideal piece, pick your gem, and our AI creates
                            stunning bespoke jewellery designs — unique to you, generated in seconds.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.28 }}
                            className="flex flex-col gap-3 mb-10"
                        >
                            {steps.map(({ icon: Icon, text }, i) => (
                                <div key={text} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#1F7A73]/20 border border-[#1F7A73]/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-[#1F7A73]" />
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <span className="text-[#C9A24D]/60 font-bold text-xs">{i + 1}.</span>
                                        {text}
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 16 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.36 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/jewelry-designer")}
                            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-black text-base transition-all hover:shadow-2xl hover:shadow-[#C9A24D]/25"
                            style={{ background: "linear-gradient(135deg, #C9A24D 0%, #FFE066 100%)" }}
                        >
                            <Wand2 className="w-5 h-5" />
                            Try AI Designer Free
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Right: single jewellery image */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="relative flex items-center justify-center pt-8 lg:pt-0"
                    >
                        {/* Glow behind image */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#C9A24D]/15 to-[#1F7A73]/10 blur-2xl top-0 bottom-0" />

                        <div className="relative w-full max-w-[420px]">
                            {/* Image Frame with Button Inside */}
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl w-full bg-[#0a1628]">
                                <img
                                    src="/gems/jewellery_promo.png"
                                    alt="AI Generated Jewellery Design"
                                    className="w-full object-cover"
                                    style={{ aspectRatio: "4 / 5" }}
                                />
                                {/* Bottom overlay with text and button */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050d1a] via-[#050d1a]/80 to-transparent pt-16">
                                    <p className="text-white text-base font-semibold">Sapphire Diamond Halo Ring</p>
                                    <p className="text-gray-300 text-xs mt-1 mb-5">Generated by Gemellery AI</p>
                                    
                                    {/* Mock button (not clickable) */}
                                    <div
                                        className="w-full py-3.5 rounded-xl text-center text-black font-bold text-sm"
                                        style={{ background: "linear-gradient(135deg,#C9A24D,#FFE066)" }}
                                    >
                                        Select &amp; Refine Design
                                    </div>
                                </div>
                                {/* Corner badge */}
                                <div className="absolute top-4 right-4 bg-[#1F7A73] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    AI Generated
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
