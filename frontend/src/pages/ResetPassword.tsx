import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        setLoading(true);
        setMessage("");

        const res = await fetch("http://localhost:5001/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password })
        });

        const data = await res.json();

        if (!res.ok) {
            setMessage(data.message);
        } else {
            setMessage("Password reset successful. Redirecting...");
            setTimeout(() => navigate("/signin"), 2000);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#fcfbf8] flex items-center justify-center">
            <div className="w-full max-w-md bg-[#f3eee5] p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Reset Password
                </h2>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-4"
                />

                <button
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full bg-teal-700 text-white py-3 rounded-md font-semibold hover:bg-teal-800"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

                {message && (
                    <p className="text-sm text-center mt-4">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
