import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Fingerprint, Link2, BadgeCheck, ArrowRight } from "lucide-react";

const steps = [
    {
        icon: ShieldCheck,
        color: "#1F7A73",
        label: "NGJA Certified",
        desc: "Gem physically inspected & certified by government authority",
    },
    {
        icon: Fingerprint,
        color: "#C9A24D",
        label: "Passport Created",
        desc: "A unique blockchain identity minted for the gemstone",
    },
    {
        icon: Link2,
        color: "#3B82F6",
        label: "Provenance Recorded",
        desc: "Full origin, ownership history and certification immutably stored",
    },
    {
        icon: BadgeCheck,
        color: "#8B5CF6",
        label: "Buyer Verified",
        desc: "You receive and can verify the complete gem record instantly",
    },
];

const benefits = [
    "Tamper-proof ownership records",
    "Full origin & provenance trail",
    "Resale value proof built-in",
    "Instant verification anywhere",
];

export default function BlockchainSection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div
            ref={ref}
            style={{ background: "linear-gradient(135deg, #050d1a 0%, #0a1628 60%, #071220 100%)" }}
            className="w-full py-24 px-6 relative overflow-hidden"
        >
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "48px 48px",
                }}
            />
            {/* Glow orbs */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#1F7A73]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#C9A24D]/6 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left: Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F7A73]/40 bg-[#1F7A73]/10 text-[#1F7A73] text-sm font-semibold mb-6"
                        >
                            <Link2 className="w-4 h-4" />
                            Blockchain Technology
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5"
                        >
                            Your Gem's Entire Story.{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#FFE066]">
                                On-Chain.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gray-400 text-lg leading-relaxed mb-8"
                        >
                            Every gemstone on Gemellery receives a permanent, tamper-proof digital
                            passport on the blockchain — recording its origin, certification, and
                            every ownership transfer. Buy with full confidence. Sell with proven provenance.
                        </motion.p>

                        {/* Benefits */}
                        <motion.ul
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="space-y-3 mb-10"
                        >
                            {benefits.map((b) => (
                                <li key={b} className="flex items-center gap-3 text-gray-300 text-sm">
                                    <span className="w-5 h-5 rounded-full bg-[#1F7A73]/20 border border-[#1F7A73]/40 flex items-center justify-center flex-shrink-0">
                                        <BadgeCheck className="w-3 h-3 text-[#1F7A73]" />
                                    </span>
                                    {b}
                                </li>
                            ))}
                        </motion.ul>

                        <motion.button
                            initial={{ opacity: 0, y: 16 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.location.href = "/marketplace"}
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border border-[#1F7A73]/50 bg-[#1F7A73]/15 hover:bg-[#1F7A73]/25 transition-all duration-300"
                        >
                            View Blockchain Passports
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Right: Step flow visual */}
                    <div className="flex flex-col gap-4">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.label}
                                initial={{ opacity: 0, x: 40 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                                className="flex items-start gap-4 relative"
                            >
                                {/* Connector line */}
                                {i < steps.length - 1 && (
                                    <div
                                        className="absolute left-5 top-10 w-px h-full opacity-20"
                                        style={{ background: step.color }}
                                    />
                                )}

                                {/* Step number + icon */}
                                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: `${step.color}22`, border: `1px solid ${step.color}44` }}
                                    >
                                        <step.icon className="w-5 h-5" style={{ color: step.color }} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div
                                    className="flex-1 rounded-xl p-4 border"
                                    style={{
                                        background: `${step.color}08`,
                                        borderColor: `${step.color}22`,
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                            style={{ background: `${step.color}20`, color: step.color }}
                                        >
                                            Step {i + 1}
                                        </span>
                                        <span className="text-white font-semibold text-sm">{step.label}</span>
                                    </div>
                                    <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
