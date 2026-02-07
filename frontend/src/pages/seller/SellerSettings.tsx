import { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from "../../components/BasicFooter";
import { Edit, Save, Menu } from "lucide-react";

interface SellerProfile {
    full_name: string;
    mobile: string;
    email: string;
    role: string;
    joined_date: string;
    country_name: string;

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
        joined_date: "",
        country_name: "",
        business_name: "",
        business_reg_no: "",
        ngja_registration_no: "",
        seller_license_url: "",
        address: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Load seller profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/seller/profile`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to load profile");

                const data: SellerProfile = await res.json();
                setForm(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile();
    }, []);

    // Handle input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Save changes
    const handleSave = async () => {
        try {
            await fetch(`${API_URL}/api/seller/profile`, {
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
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* LEFT SIDEBAR */}
            <SellerSidebar
                sellerName={user.full_name || user.email}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 md:p-8">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-200"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <h1 className="text-2xl font-semibold">Seller Settings</h1>
                </div>

                {/* CONTENT */}
                <div className="max-w-4xl space-y-6">
                    {/* Personal Information */}
                    <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4 relative">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-sm">Personal Information</h2>

                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
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

                        <Label text="Full Name" />
                        <Input
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />

                        <Label text="Mobile Number" />
                        <Input
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />

                        <Label text="Address" />
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            rows={3}
                            className="input"
                        />

                        <Label text="Joined Date" />
                        <Input
                            value={
                                form.joined_date
                                    ? new Date(form.joined_date).toLocaleDateString()
                                    : ""
                            }
                            disabled
                        />

                        <Label text="Country" />
                        <Input value={form.country_name} disabled />
                    </section>

                    {/* Account Details */}
                    <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                        <h2 className="font-bold text-sm">Account Details</h2>

                        <Label text="Email" />
                        <Input value={form.email} disabled />

                        <Label text="Account Type" />
                        <Input value={form.role} disabled />
                    </section>

                    {/* Business Verification */}
                    <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                        <h2 className="font-bold text-sm">Business Verification</h2>

                        <Label text="Business Name" />
                        <Input value={form.business_name} disabled />

                        <Label text="Business Registration No" />
                        <Input value={form.business_reg_no} disabled />

                        <Label text="NGJA Registration No" />
                        <Input value={form.ngja_registration_no} disabled />

                        <Label text="NGJA Seller License" />
                        <a
                            href={`${API_URL}${form.seller_license_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-600 underline"
                        >
                            View Seller License
                        </a>
                    </section>

                    <p className="text-xs text-gray-500">
                        Business and verification details cannot be edited.
                    </p>
                </div>

                <Footer />
            </main>
        </div>
    );
}

export default SellerSettings;

/* ---------- Helpers ---------- */

const Label = ({ text }: { text: string }) => (
    <p className="text-sm font-semibold text-gray-800">{text}</p>
);

const Input = (props: any) => (
    <input
        {...props}
        className={`input ${props.disabled ? "bg-gray-100" : ""}`}
    />
);
