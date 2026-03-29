import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, User, MessageSquare, Loader2, CheckCircle } from "lucide-react";

interface NewsLetterFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

function NewsLetter() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    const [formData, setFormData] = useState<NewsLetterFormData>({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    inquiryType: "General Inquiry",
                    message: formData.message,
                    subscribe: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setFormData({ firstName: "", lastName: "", email: "", message: "" });
                // Reset success state after 5 seconds
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setError(data.error || "Failed to send message. Please try again.");
            }
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            ref={ref}
            className="w-full py-16 md:py-20 px-4 sm:px-6"
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
                        className="p-6 sm:p-8 md:p-10 flex flex-col gap-4 bg-white/4 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/8"
                    >
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#C9A24D]/30 bg-[#C9A24D]/10 text-[#C9A24D] w-fit">
                            Get in Touch
                        </span>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                            Stay Connected with{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#FFE066]">
                                Gemellery
                            </span>
                        </h2>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Have a question or want to learn more? Send us a message and our team will get back to you within 24 hours.
                        </p>

                        {submitted ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center gap-3 py-8"
                            >
                                <CheckCircle className="w-12 h-12 text-[#1F7A73]" />
                                <p className="text-white font-semibold text-lg">Message Sent!</p>
                                <p className="text-gray-400 text-sm text-center">
                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
                                {/* Name Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="First Name"
                                            required
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white/6 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F7A73]/50 transition"
                                        />
                                    </div>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Last Name"
                                            required
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white/6 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F7A73]/50 transition"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email address"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/6 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F7A73]/50 transition"
                                    />
                                </div>

                                {/* Message */}
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Your message..."
                                        required
                                        rows={3}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/6 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F7A73]/50 transition resize-none"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-400 text-xs">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 rounded-xl font-bold text-black text-sm transition-all hover:shadow-lg hover:shadow-[#C9A24D]/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    style={{ background: "linear-gradient(135deg, #C9A24D 0%, #FFE066 100%)" }}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Let's Connect"
                                    )}
                                </button>
                                <p className="text-xs text-gray-600 text-center">
                                    We respect your privacy. Your information is secure with us.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default NewsLetter;
