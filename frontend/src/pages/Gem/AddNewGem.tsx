import BasicFooter from "../../components/BasicFooter";
import { useState, useEffect } from "react";
import { Edit, ShieldCheck, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "../../components/SellerSidebar";

function AddNewGem() {

    const [form, setForm] = useState({
        gem_name: "",
        gem_type: "",
        carat: "",
        cut: "",
        clarity: "",
        color: "",
        origin: "",
        mining_region: "",
        price: "",
        description: "",
        ngja_certificate_no: ""
    });

    const [enums, setEnums] = useState<any>({
        gem_type: [],
        cut: [],
        clarity: [],
        origin: [],
        mining_region: []
    });

    const [certificate, setCertificate] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    useEffect(() => {

        const loadEnums = async () => {

            try {

                const res = await fetch("http://localhost:5001/api/gems/enums");

                const data = await res.json();

                setEnums(data);

            } catch (err) {

                console.error("Failed loading enums", err);

            }

        };

        loadEnums();

    }, []);

    const handleChange = (e: any) => {

        setForm({ ...form, [e.target.name]: e.target.value });

    };

    const showError = (msg: string) => {

        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(null), 4000);

    };

    const handleSubmit = async () => {

        if (!token) return showError("Login required");

        const formData = new FormData();

        Object.entries(form).forEach(([k, v]) => {

            formData.append(k, v);

        });

        if (certificate) formData.append("certificate", certificate);

        images.forEach(img => formData.append("images", img));

        try {

            const res = await fetch("http://localhost:5001/api/gems", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (!res.ok) return showError(data.error || "Failed");

            setSuccessMessage("Gem listed successfully");

            setTimeout(() => navigate("/seller/dashboard"), 1500);

        } catch (err) {

            console.error(err);
            showError("Server error");

        }

    };

    return (
        <>
            <SellerSidebar
                sellerName={user.full_name || user.email}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 md:p-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                    <div className="lg:col-span-3 space-y-6">

                        <div>
                            <h1 className="text-3xl font-semibold mb-2">
                                List New Gemstone in Marketplace
                            </h1>
                            <p className="text-sm text-gray-500">
                                Complete this entire form to list your gemstone
                            </p>
                        </div>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-6">

                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                                        ✓
                                    </span>
                                    Gem Details
                                </h3>
                                <button className="text-xs text-gray-500 flex items-center gap-1">
                                    <Edit className="w-3 h-3" />Edit
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">

                                <input
                                    name="gem_name"
                                    value={form.gem_name}
                                    onChange={handleChange}
                                    placeholder="Gem Name"
                                    className="input"
                                />

                                <select name="gem_type" value={form.gem_type} onChange={handleChange} className="input">
                                    <option value="">Gem Type</option>
                                    {enums.gem_type.map((v: string) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>

                                <input
                                    name="carat"
                                    type="number"
                                    step="0.01"
                                    value={form.carat}
                                    onChange={handleChange}
                                    placeholder="Carat"
                                    className="input"
                                />

                                <select name="cut" value={form.cut} onChange={handleChange} className="input">
                                    <option value="">Cut</option>
                                    {enums.cut.map((v: string) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>

                                <select name="clarity" value={form.clarity} onChange={handleChange} className="input">
                                    <option value="">Clarity</option>
                                    {enums.clarity.map((v: string) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>

                                <input
                                    name="color"
                                    value={form.color}
                                    onChange={handleChange}
                                    placeholder="Color"
                                    className="input"
                                />

                                <select name="origin" value={form.origin} onChange={handleChange} className="input">
                                    <option value="">Origin</option>
                                    {enums.origin.map((v: string) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>

                                <select name="mining_region" value={form.mining_region} onChange={handleChange} className="input">
                                    <option value="">Mining Region</option>
                                    {enums.mining_region.map((v: string) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>

                            </div>

                            <input
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                type="number"
                                placeholder="Price"
                                className="input"
                            />

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Description"
                                className="input"
                            />

                        </section>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">

                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                NGJA Gem Report Details
                            </h3>

                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setCertificate(e.target.files?.[0] || null)}
                            />

                            <input
                                name="ngja_certificate_no"
                                value={form.ngja_certificate_no}
                                onChange={handleChange}
                                placeholder="NGJA Verification Number"
                                className="input"
                            />

                        </section>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">

                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold">Gem Images</h3>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Lock className="w-3 h-3" />Encrypted
                                </span>
                            </div>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setImages(Array.from(e.target.files || []))}
                            />

                        </section>

                        {errorMessage && (
                            <div className="text-red-600">{errorMessage}</div>
                        )}

                        {successMessage && (
                            <div className="text-green-600">{successMessage}</div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-full font-semibold bg-[#1F7A73] text-white"
                        >
                            {isSubmitting ? "Listing..." : "List Gem"}
                        </button>

                    </div>

                </div>

                <BasicFooter />

            </main>
        </>
    );
}

export default AddNewGem;