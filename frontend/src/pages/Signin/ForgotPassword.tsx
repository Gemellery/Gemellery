import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, MoveLeft } from 'lucide-react';
import BasicFooter from '../../components/BasicFooter';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#1F7A73] focus:border-[#1F7A73]
                        focus:bg-white placeholder:text-gray-400 transition-all`;

    const labelClass = "block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5";

    return (
        <div className="min-h-screen bg-[#fcfbf8] flex flex-col">

            {/* === Top Navigation Bar === */}
            <nav className="w-full px-6 sm:px-12 md:px-48 py-4 flex justify-between items-center border-b border-gray-100 bg-white">
                <img src="/src/assets/logos/Elegance Jewelry.png" alt="Gemellery Logo" className="h-10 w-auto" />
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1F7A73]">
                    <LockKeyhole size={14} /> Secure
                </span>
            </nav>

            {/* === Page Body === */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">

                <h1 className="text-3xl sm:text-4xl font-bold text-center font-serif text-gray-900">
                    Reset Password
                </h1>
                <p className="text-sm text-center mt-3 text-gray-500 font-serif">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {/* === Form Card === */}
                <div className="w-full max-w-[420px] mt-8 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Forgot Password</h2>

                        <div className="mb-6">
                            <label className={labelClass}>Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                className={inputClass}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-[#1a6fc4] text-white py-2.5 rounded-lg font-semibold text-sm
                                       hover:bg-[#1560ac] active:bg-[#1050a0] transition-all duration-200 shadow-sm
                                       hover:shadow-md mb-4 disabled:opacity-60"
                        >
                            {loading ? "Sending link..." : "Send Reset Link"}
                        </button>

                        {message && (
                            <p className={`text-xs text-center mb-4 rounded-lg py-2 px-3 ${message.toLowerCase().includes("error")
                                    ? "text-red-500 bg-red-50"
                                    : "text-green-600 bg-green-50"
                                }`}>
                                {message}
                            </p>
                        )}

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => navigate("/signin")}
                                className="text-xs text-[#1a6fc4] hover:text-[#1a6fc4] hover:underline font-semibold transition-colors flex items-center gap-1.5"
                            >
                                <MoveLeft size={14} /> Back to Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <BasicFooter />
        </div>
    );
}

export default ForgotPassword;
