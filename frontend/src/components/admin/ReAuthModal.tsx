import { useState } from "react";
import axios from "axios";

interface Props {
    onSuccess: () => void;
    onClose: () => void;
}

function ReAuthModal({ onSuccess, onClose }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setError("");

        if (!email.trim() || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "http://localhost:5001/api/super-admin/re-authenticate",
                { password },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            onSuccess();

        } catch (err: any) {
            setError(
                err.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-80 shadow-lg">
                <h2 className="font-semibold mb-4">
                    Confirm Super Admin Credentials
                </h2>

                <input
                    type="email"
                    placeholder="Super Admin Email"
                    className="border w-full p-2 mb-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border w-full p-2 mb-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 text-gray-600"
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="bg-black text-white px-4 py-1 rounded disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReAuthModal;