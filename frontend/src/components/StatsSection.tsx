import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
    { value: 500, suffix: "+", label: "Verified Gems" },
    { value: 80, suffix: "+", label: "Trusted Sellers" },
    { value: 1200, suffix: "+", label: "Happy Buyers" },
    { value: 100, suffix: "%", label: "NGJA Certified" },
];

function useCountUp(target: number, duration: number, active: boolean) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [active, target, duration]);
    return count;
}

function StatCard({ value, suffix, label, delay, inView }: { value: number; suffix: string; label: string; delay: number; inView: boolean }) {
    const count = useCountUp(value, 1600, inView);
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay }}
            className="text-center py-10 px-6"
        >
            <div className="text-4xl md:text-5xl font-extrabold text-[#1F7A73] mb-2">
                {count}{suffix}
            </div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
        </motion.div>
    );
}

export default function StatsSection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className="w-full py-20 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    className="text-center text-xs uppercase tracking-widest text-[#C9A24D] font-bold mb-2"
                >
                    Trusted by thousands
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.08 }}
                    className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-12"
                >
                    The Numbers Speak for Themselves
                </motion.h2>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {stats.map((s, i) => (
                        <StatCard key={s.label} {...s} delay={0.1 + i * 0.1} inView={inView} />
                    ))}
                </div>
            </div>
        </div>
    );
}
