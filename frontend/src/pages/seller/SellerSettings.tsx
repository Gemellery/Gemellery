import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";
import { useEffect, useState } from "react";
import { Edit, Save } from "lucide-react";

interface SellerProfile {
    full_name: string;
    mobile: string;
    email: string;
    role: string;
    joined_date: string
    country_name: string

    business_name: string;
    business_reg_no: string;
    ngja_registration_no: string;
    seller_license_url: string;

    address: string;
}

function SellerSettings() {
    const [form, setForm] = useState<SellerProfile>({
        full_name: "",
        mobile: "",
        email: "",
        role: "",
        business_name: "",
        business_reg_no: "",
        ngja_registration_no: "",
        seller_license_url: "",
        address: "",
        joined_date: "",
        country_name: "",

    });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // LOAD PROFILE
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5001/api/seller/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error("Failed to load profile");

                const data: SellerProfile = await res.json();
                setForm(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    // HANDLE CHANGE
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // SAVE
    const handleSave = async () => {
        try {
            await fetch("http://localhost:5001/api/seller/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    full_name: form.full_name,
                    mobile: form.mobile,
                    address: form.address,
                }),
            });

            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Seller Settings</h1>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 text-sm text-gray-600"
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 text-sm text-emerald-600 font-semibold"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                    )}
                </div>

                <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                    <h2 className="font-bold text-m text-black">
                        Personal Information
                    </h2>

                    <h2 className="font-semibold text-sm text-gray-800">
                        Full Name
                    </h2>
                    <input
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Full Name"
                        className="input"
                    />
                    <h2 className="font-semibold text-sm text-gray-800">
                        Mobile Number
                    </h2>
                    <input
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Mobile Number"
                        className="input"
                    />
                    <h2 className="font-semibold text-sm text-gray-800">
                        Address
                    </h2>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Address"
                        className="input"
                    />
                    <h2 className="font-semibold text-sm text-gray-800">
                        Joined Date
                    </h2>
                    <input
                        value={new Date(form.joined_date).toLocaleDateString()}
                        disabled
                        className="input bg-gray-100"
                        placeholder="Joined Date"
                    />
                    <h2 className="font-semibold text-sm text-gray-800">
                        Country
                    </h2>
                    <input
                        value={form.country_name}
                        disabled
                        className="input bg-gray-100"
                        placeholder="Country"
                    />
                </section>

                <section className="bg-[#fcfbf8] border rounded-xl p-6 mt-6 space-y-4">
                    <h2 className="font-semibold text-sm text-gray-700">
                        Account Details
                    </h2>

                    <h2 className="font-semibold text-sm text-gray-800">
                        Email
                    </h2>
                    <input
                        value={form.email}
                        disabled
                        className="input bg-gray-100"
                        placeholder="Email"
                    />

                    <h2 className="font-semibold text-sm text-gray-800">
                        Account Type
                    </h2>
                    <input
                        value={form.role}
                        disabled
                        className="input bg-gray-100"
                        placeholder="Role"
                    />
                </section>

                <section className="bg-[#fcfbf8] border rounded-xl p-6 mt-6 space-y-4">
                    <h2 className="font-semibold text-sm text-gray-700">
                        Business Verification
                    </h2>

                    <h2 className="font-semibold text-sm text-gray-800">
                        Business Name
                    </h2>
                    <input
                        value={form.business_name}
                        disabled
                        className="input bg-gray-100"
                        placeholder="Business Name"
                    />

                    <h2 className="font-semibold text-sm text-gray-800">
                        Business Registration Number
                    </h2>
                    <input
                        value={form.business_reg_no}
                        disabled
                        className="input bg-gray-100"
                        placeholder="Business Registration No"
                    />

                    <h2 className="font-semibold text-sm text-gray-800">
                        NGJA Registration Number
                    </h2>
                    <input
                        value={form.ngja_registration_no}
                        disabled
                        className="input bg-gray-100"
                        placeholder="NGJA Registration No"
                    />

                    <h2 className="font-semibold text-sm text-gray-800">
                        NGJA Gem Selling License
                    </h2>
                    <a
                        href={`${API_URL}${form.seller_license_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 underline"
                    >
                        View Seller License
                    </a>
                </section>

                <p className="text-xs text-gray-500 mt-6">
                    Business and verification details cannot be edited.
                </p>
            </main>

            <AdvancedFooter />
        </>
    );
}

export default SellerSettings;
