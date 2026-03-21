import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/Elegance Jewelry.png";
import { Construction } from "lucide-react";

function MaintenancePage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200 px-6">

            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src={logo}
                        alt="Gemellery"
                        className="h-14 object-contain"
                    />
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <Construction size={32} className="text-yellow-600" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-3">
                    Platform Under Maintenance
                </h1>

                {/* Message */}
                <p className="text-gray-600 text-sm leading-relaxed">
                    Our platform is currently undergoing scheduled maintenance to improve
                    performance and reliability.
                </p>

                <p className="text-gray-500 text-sm mt-2">
                    Please check back again shortly.
                </p>

                {/* Admin Login */}
                <button
                    onClick={() => navigate("/signin")}
                    className="mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
                >
                    Admin Login
                </button>

                {/* Footer */}
                <div className="mt-6 text-xs text-gray-400">
                    © {new Date().getFullYear()} Gemellery
                </div>

            </div>

        </div>
    );
}

export default MaintenancePage;