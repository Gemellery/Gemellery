import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail } from "lucide-react";

function NewsLetter() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <div
            ref={ref}
            className="w-full py-20 px-6"
            style={{ background: "linear-gradient(135deg, #071018 0%, #0d1a28 100%)" }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-white/8 shadow-2xl">

                    {/* Image */}
                    <div className="w-full min-h-64 md:min-h-0 overflow-hidden relative">
                        <img
                            src="/sample_gems/newsletter_gem.jpg"
                            alt="Gemellery Newsletter"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#071018]/60" />
                    </div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.15 }}
                        className="p-8 md:p-12 flex flex-col gap-5 bg-white/4 backdrop-blur-md border-l border-white/8"
                    >
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#C9A24D]/30 bg-[#C9A24D]/10 text-[#C9A24D] w-fit">
                            Newsletter
                        </span>

                        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                            Stay Connected with{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#FFE066]">
                                Gemellery
                            </span>
                        </h2>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Exclusive gemstone collections, AI design updates, verified seller
                            highlights, and platform announcements — delivered to your inbox.
                        </p>

                        <form className="flex flex-col gap-3 mt-1">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/6 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F7A73]/50 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl font-bold text-black text-sm transition-all hover:shadow-lg hover:shadow-[#C9A24D]/20 hover:-translate-y-0.5"
                                style={{ background: "linear-gradient(135deg, #C9A24D 0%, #FFE066 100%)" }}
                            >
                                Subscribe Now
                            </button>
                            <p className="text-xs text-gray-600 text-center">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default NewsLetter;
