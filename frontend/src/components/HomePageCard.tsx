import { ShieldCheck, Link, LockKeyhole } from "lucide-react";

function HomePageCard() {
    return (
        <div className="bg-gradient-to-b from-[#F5F7FA] to-[#E5E7EB] py-20">
            <main className="max-w-7xl mx-auto px-6 md:px-10">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                        The Gold Standard of Trust
                    </h1>
                    <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                        Every gemstone is backed by government certification and immutable
                        blockchain records.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-8
                          shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="w-20 h-20 flex items-center justify-center rounded-xl
                            bg-[#1F7A73]/10 mb-6">
                            <ShieldCheck className="w-10 h-10 text-[#1F7A73]" /> 
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            NGJA Verified
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Officially certified by the National Gem & Jewellery Authority of
                            Sri Lanka.
                        </p>
                    </div>

                    <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-8
                          shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="w-20 h-20 flex items-center justify-center rounded-xl
                            bg-[#1F7A73]/10 mb-6">
                            <Link className="w-10 h-10 text-[#3B82F6]" />  
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Blockchain Passport
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            A secure digital twin that records provenance and ownership
                            history with full transparency.
                        </p>
                    </div>

                    <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-8
                          shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="w-20 h-20 flex items-center justify-center rounded-xl
                            bg-[#1F7A73]/10 mb-6">
                            <LockKeyhole className="w-10 h-10 text-[#C9A24D]" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Secure Escrow
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Payments are safely held until you physically verify the gemstone’s
                            authenticity.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default HomePageCard;
