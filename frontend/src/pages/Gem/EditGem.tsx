import BasicFooter from "../../components/BasicFooter";
import { useEffect, useState } from "react";
import { Edit, ShieldCheck, Lock, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SellerSidebar from "../../components/SellerSidebar";

interface ExistingImage {
    image_id: number;
    image_url: string;
}

function EditGem() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

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

    const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    // Fetch existing gem data
    useEffect(() => {
        const fetchGem = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/gems/seller/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch gem");

                const data = await res.json();
                setForm({
                    gem_name: data.gem_name || "",
                    gem_type: data.gem_type || "",
                    carat: data.carat?.toString() || "",
                    cut: data.cut || "",
                    clarity: data.clarity || "",
                    color: data.color || "",
                    origin: data.origin || "",
                    price: data.price?.toString() || "",
                    description: data.description || "",
                    ngja_certificate_no: data.ngja_certificate_no || "",
                });
                setExistingImages(data.images || []);
            } catch (err) {
                console.error(err);
                setErrorMessage("Failed to load gem details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchGem();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 4000);
    };

    const handleRemoveExistingImage = (imageId: number) => {
        setDeletedImageIds((prev) => [...prev, imageId]);
        setExistingImages((prev) => prev.filter((img) => img.image_id !== imageId));
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);

        if (isSubmitting) return;

        if (!form.gem_name.trim()) return showError("Gem Name is required.");
        if (!form.price.trim()) return showError("Price is required.");

        if (!token) return showError("You must be logged in.");

        setIsSubmitting(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (deletedImageIds.length > 0) {
            formData.append("deleted_image_ids", JSON.stringify(deletedImageIds));
        }

        newImages.forEach((img) => formData.append("images", img));

        try {
            const response = await fetch(`http://localhost:5001/api/gems/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            let result;
            try {
                result = await response.json();
            } catch {
                setIsSubmitting(false);
                return showError("Update failed. Please try again.");
            }

            if (!response.ok) {
                setIsSubmitting(false);
                return showError(result.error || "Failed to update gem.");
            }

            setSuccessMessage("Gem updated successfully! Redirecting...");
            setTimeout(() => navigate("/seller/listings"), 1500);
        } catch (err) {
            console.error(err);
            showError("Server error. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden">
                <SellerSidebar
                    sellerName={user.full_name || user.email}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 md:p-8 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#1F7A73] border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 text-sm">Loading gem details...</p>
                    </div>
                </main>
            </div>
        );
    }

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
                                Edit Gemstone Details
                            </h1>
                            <p className="text-sm text-gray-500">
                                Update your gemstone listing information
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

                            <input
                                name="ngja_certificate_no"
                                value={form.ngja_certificate_no}
                                disabled
                                className="input font-bold bg-gray-100 cursor-not-allowed"
                                placeholder="NGJA Verification Number"
                            />
                            <p className="text-xs text-gray-400">Certificate number cannot be changed after listing.</p>
                        </section>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold">Gem Images</h3>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Lock className="w-3 h-3" /> Encrypted
                                </span>
                            </div>

                            {/* Existing images */}
                            {existingImages.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Current Images</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {existingImages.map((img) => (
                                            <div key={img.image_id} className="relative group">
                                                <img
                                                    src={`http://localhost:5001/uploads/gem_images/${img.image_url}`}
                                                    alt="Gem"
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder-gem.png";
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(img.image_id)}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New images */}
                            {newImages.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">New Images to Upload</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {newImages.map((file, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="New"
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveNewImage(idx)}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                    setNewImages((prev) => [...prev, ...Array.from(e.target.files || [])])
                                }
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

                        <div className="flex gap-4 pt-10">
                            <button
                                type="button"
                                onClick={() => navigate("/seller/listings")}
                                className="px-8 py-3 rounded-full font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
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
                                {isSubmitting ? "Updating..." : "Update Gem"}
                            </button>
                        </div>
                    </div>

                    <aside className="space-y-6 mt-21.5">
                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Editing Tips</h2>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                <li>Keep gem details accurate and up to date</li>
                                <li>High-quality images attract more buyers</li>
                                <li>Price changes take effect immediately</li>
                                <li>Certificate number cannot be modified</li>
                            </ul>
                        </section>
                    </aside>
                </div>
                <BasicFooter />
            </main>
        </>
    );
}

export default EditGem;
