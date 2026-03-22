import { useEffect, useState } from "react";
import BuyerSidebar from "../../components/BuyerSidebar";
import Footer from "../../components/BasicFooter";
import { Edit, Save, Menu } from "lucide-react";

const Label = ({ text }: { text: string }) => (
    <p className="text-sm font-semibold text-gray-800">{text}</p>
);

const Input = (props: any) => (
    <input
        {...props}
        className={`input ${props.disabled ? "bg-gray-100" : ""}`}
    />
);


interface BuyerProfile {
    full_name: string;
    mobile: string;
    email: string;
    role: string;
    joined_date: string;
    country_name: string;
    address: string;
}

function BuyerSettings() {
    const [form, setForm] = useState<BuyerProfile>({
        full_name: "",
        mobile: "",
        email: "",
        role: "",
        joined_date: "",
        country_name: "",
        address: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    // Load buyer profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/buyer/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to load profile");

                const data: BuyerProfile = await res.json();
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
            const res = await fetch(`${API_URL}/api/buyer/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    full_name: form.full_name,
                    mobile: form.mobile,
                    address: form.address,
                }),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const updatedRes = await fetch(`${API_URL}/api/buyer/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedData = await updatedRes.json();
            setForm(updatedData);

            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...storedUser,
                    full_name: updatedData.full_name,
                })
            );

            setIsEditing(false);

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="flex h-screen overflow-hidden">
            {/* LEFT SIDEBAR */}
            <BuyerSidebar
                buyerName={user.full_name || user.email}
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

                    <h1 className="text-2xl font-semibold">Buyer Settings</h1>
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
                </div>

                <Footer />
            </main>
        </div>
    );
}

export default BuyerSettings;
