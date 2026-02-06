import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";
import { useState } from "react";
import { Edit, ShieldCheck, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddNewGem() {
    const [form, setForm] = useState({
        gem_name: "",
        gem_type: "",
        carat: "",
        cut: "",
        clarity: "",
        color: "",
        origin: "",
        price: "",
        description: "",
        ngja_certificate_no: "",
    });

    const [certificate, setCertificate] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 4000);
    };

    const handleSubmit = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);

        if (isSubmitting) return;

        // validation
        if (!form.gem_name.trim()) return showError("Gem Name is required.");
        if (!form.price.trim()) return showError("Price is required.");
        if (!form.ngja_certificate_no.trim())
            return showError("NGJA Certificate Number is required.");
        if (!certificate)
            return showError("NGJA Certificate file is required.");

        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user?.token)
            return showError("You must be logged in to list a gem.");

        setIsSubmitting(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });

        formData.append("certificate", certificate);
        images.forEach((img) => formData.append("images", img));

        try {
            const response = await fetch("http://localhost:5001/api/gems", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            });

            let result;
            try {
                result = await response.json();
            } catch {
                setIsSubmitting(false);
                return showError("Upload failed. File may be too large.");
            }

            if (!response.ok) {
                setIsSubmitting(false);
                return showError(result.error || "Failed to list gem.");
            }

            setSuccessMessage("Gem listed successfully! Redirecting...");

            // Reset form
            setForm({
                gem_name: "",
                gem_type: "",
                carat: "",
                cut: "",
                clarity: "",
                color: "",
                origin: "",
                price: "",
                description: "",
                ngja_certificate_no: "",
            });
            setCertificate(null);
            setImages([]);

            setTimeout(() => {
                navigate("/seller/dashboard");
            }, 1500);


        } catch (err) {
            console.error(err);
            showError("Server error. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="flex-1 overflow-auto py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-semibold mb-2">
                                List New Gemstone in Marketplace
                            </h1>
                            <p className="text-sm text-gray-500">
                                Complete this entire form for list your new Gemstone
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
                                    <Edit className="w-3 h-3" /> Edit
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="gem_name" value={form.gem_name} onChange={handleChange} maxLength={45} placeholder="Gem Name" className="input" />
                                <input name="gem_type" value={form.gem_type} onChange={handleChange} maxLength={50} placeholder="Gem Type" className="input" />
                                <input name="carat" value={form.carat} onChange={handleChange} type="number" step="0.01" min="0" placeholder="Carat" className="input" />
                                <input name="cut" value={form.cut} onChange={handleChange} maxLength={50} placeholder="Cut" className="input" />
                                <input name="clarity" value={form.clarity} onChange={handleChange} maxLength={50} placeholder="Clarity" className="input" />
                                <input name="origin" value={form.origin} onChange={handleChange} maxLength={50} placeholder="Origin" className="input" />
                                <input name="color" value={form.color} onChange={handleChange} maxLength={50} placeholder="Color" className="input" />
                            </div>

                            <input name="price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" placeholder="Price" className="input" />

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={255}
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

                            <label className="flex gap-3 p-3 border rounded-lg cursor-pointer items-start">
                                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                                    onChange={(e) => setCertificate(e.target.files?.[0] || null)} />
                                <div className="text-sm">
                                    <p className="font-medium">NGJA Gem Verification Certificate</p>
                                    <p className="text-xs text-gray-500">Upload original certificate</p>
                                </div>
                                <span className="ml-auto text-sm text-emerald-600">Upload</span>
                            </label>

                            <input
                                name="ngja_certificate_no"
                                value={form.ngja_certificate_no}
                                onChange={handleChange}
                                maxLength={25}
                                placeholder="NGJA Verification Number"
                                className="input font-bold"
                            />
                        </section>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold">Gem Images</h3>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Lock className="w-3 h-3" /> Encrypted
                                </span>
                            </div>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setImages(Array.from(e.target.files || []))}
                                className="block w-full text-sm text-gray-600"
                            />
                        </section>

                        {errorMessage && (
                            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700">
                                {successMessage}
                            </div>
                        )}

                        <div className="flex justify-end pt-6">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-all
                  ${isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#1F7A73] text-white hover:scale-105"
                                    }`}
                            >
                                {isSubmitting ? "Listing..." : "List Gem"}
                            </button>
                        </div>
                    </div>

                    <aside className="space-y-6 mt-21.5">
                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Gemstone History</h2>
                            <p className="text-sm text-gray-600">
                                From ancient civilizations to modern jewelry, gemstones have
                                always been treasured as symbols of power, spirituality, and
                                eternal beauty.
                            </p>
                        </section>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Symbolism & Meaning</h2>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                <li><span className="font-medium">Sapphire:</span> Wisdom</li>
                                <li><span className="font-medium">Ruby:</span> Passion</li>
                                <li><span className="font-medium">Emerald:</span> Growth</li>
                                <li><span className="font-medium">Diamond:</span> Eternity</li>
                            </ul>
                        </section>
                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Care & Maintenance</h2>
                            <p className="text-sm text-gray-600">
                                Store gemstones separately, clean with mild soap, and avoid
                                harsh chemicals.
                            </p>
                        </section>
                    </aside>
                </div>
            </main>
            <AdvancedFooter />
        </>
    );
}

export default AddNewGem;
