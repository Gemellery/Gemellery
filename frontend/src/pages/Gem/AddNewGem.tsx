import Navbar from '../../components/Navbar';
import AdvancedFooter from '../../components/AdvancedFooter';
import { useState } from "react";
import {
    Edit,
    ShieldCheck,
    Lock,
} from "lucide-react";

function AddNewGem() {

    return (
        <>
            <Navbar />
            <main className="flex-1 overflow-auto py-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-semibold mb-2">
                                List New Gemstone in Marketplace
                            </h1>
                            <p className="text-sm text-gray-500">
                                Complete this entire form for list your new Gemstone
                            </p>
                        </div>

                        {/* -------- Shipping Address -------- */}
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
                                <input name="GemName" placeholder="Gem Name (Ex:- Blue Sapphire)" className="input" />
                                <input name="GemType" placeholder="Gem Type (Ex:- Heated or Unheated)" className="input" />
                                <input name="Carrots" placeholder="Gem Weight" className="input" />
                                <input name="Cut" placeholder="Gem Cut" className="input" />
                                <input name="GemClarity" placeholder="Gem Clarity" className="input" />
                                <input name="GemOrigin" placeholder="Gem Origin" className="input" />
                                <input name="GemColor" placeholder="Gem Color" className="input" />
                                <select name="country" className="input">
                                    <option>Select Status</option>
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                    <option>Sri Lanka</option>
                                </select>
                            </div>

                            <input name="price" placeholder="Enter your expecting price" className="input" />
                            <textarea
                                name="GemDescription"
                                placeholder="Enter brief description about your gem (Maximum 250 characters)"
                                className="input"
                                rows={6}
                            />
                        </section>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                NGJA Gem Report Details
                            </h3>

                            <label className="flex gap-3 p-3 border rounded-lg cursor-pointer items-start">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.png"
                                />

                                <div className="text-sm">
                                    <p className="font-medium">NGJA Gem Verification Certificate</p>
                                    <p className="text-xs text-gray-500">
                                        Upload the original softcopy of NGJA Gem certificate.
                                    </p>
                                </div>

                                <span className="ml-auto text-sm text-emerald-600">
                                    Upload
                                </span>
                            </label>

                            <input name="GemLicenseNumber" placeholder="Enter exact same NGJA Verification number for your gem" className="input font-bold placeholder-red-300" />
                        </section>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold">Gem Images</h3>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Lock className="w-3 h-3" /> Encrypted
                                </span>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Upload Gemstone Images
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="block w-full text-sm text-gray-600
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-emerald-50 file:text-emerald-700
                 hover:file:bg-emerald-100"
                                />
                                <p className="text-xs text-gray-500">
                                    You can upload multiple images (JPG, PNG). Max size 5MB each.
                                </p>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-6 mt-21.5">
                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Gemstone History</h2>
                            <p className="text-sm text-gray-600">
                                From ancient civilizations to modern jewelry, gemstones have always been
                                treasured as symbols of power, spirituality, and eternal beauty. Kings and
                                queens adorned themselves with rare stones to signify wealth and divine
                                favor.
                            </p>
                        </section>
                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Symbolism & Meaning</h2>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                <li><span className="font-medium">Sapphire:</span> Wisdom and royalty</li>
                                <li><span className="font-medium">Ruby:</span> Passion and courage</li>
                                <li><span className="font-medium">Emerald:</span> Growth and harmony</li>
                                <li><span className="font-medium">Diamond:</span> Strength and eternity</li>
                            </ul>
                        </section>

                        <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Care & Maintenance</h2>
                            <p className="text-sm text-gray-600">
                                Store gemstones separately to avoid scratches, clean them with mild soap
                                and water, and keep them away from harsh chemicals. Proper care preserves
                                brilliance for generations.
                            </p>
                        </section>
                    </aside>

                </div>
            </main >

            <AdvancedFooter />
        </>
    )
}

export default AddNewGem
