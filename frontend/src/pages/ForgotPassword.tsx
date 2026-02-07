import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");

        const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        setMessage(data.message);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#fcfbf8] flex items-center justify-center">
            <div className="w-full max-w-md bg-[#f3eee5] p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Forgot Password
                </h2>

                <p className="text-sm text-center mb-6">
                    Enter your email and we’ll send you a reset link.
                </p>

                <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-4"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-teal-700 text-white py-3 rounded-md font-semibold hover:bg-teal-800"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>

                {message && (
                    <p className="text-sm text-center text-green-700 mt-4">
                        {message}
                    </p>
                )}

                <button
                    onClick={() => navigate("/signin")}
                    className="w-full mt-4 text-xs font-bold hover:underline"
                >
                    Back to Sign In
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
