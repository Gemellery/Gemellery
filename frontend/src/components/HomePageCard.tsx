import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Fingerprint, LockKeyhole, Sparkles } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        accentColor: "#1F7A73",
        from: "#0d2e2b",
        to: "#0a2422",
        tag: "Government Backed",
        title: "NGJA Verified",
        description:
            "Every gemstone is officially inspected and certified by the National Gem & Jewellery Authority of Sri Lanka before it reaches you.",
        highlight: "100% certified",
    },
    {
        icon: Fingerprint,
        accentColor: "#C9A24D",
        from: "#2a1f08",
        to: "#1e1505",
        tag: "Tamper-Proof",
        title: "Blockchain Passport",
        description:
            "Each gem receives a permanent on-chain identity recording its full provenance, ownership history, and certification. Impossible to forge.",
        highlight: "Immutable record",
    },
    {
        icon: LockKeyhole,
        accentColor: "#3B82F6",
        from: "#0c1e38",
        to: "#091630",
        tag: "Buyer Protected",
        title: "Secure Escrow",
        description:
            "Payment is safely held in escrow until you physically receive and verify the jewel. Complete confidence on every purchase.",
        highlight: "Zero risk buying",
    },
    {
        icon: Sparkles,
        accentColor: "#8B5CF6",
        from: "#1a0f2e",
        to: "#120a24",
        tag: "AI Powered",
        title: "AI Design Studio",
        description:
            "Design bespoke jewellery with our Gemini AI studio. Describe your vision, refine with prompts, and see it come to life instantly.",
        highlight: "Create anything",
    },
];

export default function HomePageCard() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <div ref={ref} className="w-full py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4 }}
                    className="text-center text-xs uppercase tracking-widest text-[#1F7A73] font-bold mb-2"
                >
                    Why Gemellery?
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 18 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.07 }}
                    className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-3"
                >
                    The Gold Standard of Trust
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.45, delay: 0.14 }}
                    className="text-center text-gray-500 max-w-2xl mx-auto mb-14 text-base"
                >
                    Sri Lanka's most trusted gemstone platform — built on certification,
                    blockchain, and AI from the ground up.
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map(({ icon: Icon, accentColor, from, to, tag, title, description, highlight }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 32 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                            whileHover={{ y: -6, transition: { duration: 0.22 } }}
                            className="group relative rounded-2xl p-7 overflow-hidden cursor-default flex flex-col"
                            style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
                        >
                            {/* Subtle border */}
                            <div
                                className="absolute inset-0 rounded-2xl pointer-events-none"
                                style={{ boxShadow: `inset 0 0 0 1px ${accentColor}25` }}
                            />

                            {/* Glow on hover */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{ boxShadow: `0 0 40px ${accentColor}20` }}
                            />

                            {/* Top glow circle */}
                            <div
                                className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-30"
                                style={{ background: accentColor }}
                            />

                            {/* Tag */}
                            <span
                                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-5 w-fit"
                                style={{ background: `${accentColor}22`, color: accentColor }}
                            >
                                {tag}
                            </span>

                            {/* Icon */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
                            >
                                <Icon className="w-6 h-6" style={{ color: accentColor }} />
                            </div>

                            <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed flex-1">{description}</p>

                            {/* Bottom highlight */}
                            <div className="mt-5 pt-4 border-t flex items-center gap-1.5" style={{ borderColor: `${accentColor}20` }}>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                                <span className="text-xs font-semibold" style={{ color: accentColor }}>{highlight}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
