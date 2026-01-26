import { Mail } from "lucide-react";

function NewsLetter() {
    return (
        <div className="w-full py-20 px-6 md:px-12 bg-[#faf7ef]">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white rounded-2xl shadow-lg border border-[#f5e2aa] overflow-hidden">

                    <div className="w-full h-full">
                        <img
                            src="/sample_gems/newsletter_gem.jpg"
                            alt="Gemellery Newsletter"
                            className="w-full h-full object-cover transition duration-700 ease-in-out hover:scale-105 hover:brightness-110 hover:saturate-150"
                        />
                    </div>

                    <div className="p-8 md:p-12 flex flex-col gap-5">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Stay Connected with Gemellery
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                            Subscribe to receive exclusive gemstone collections, AI jewellery
                            design updates, verified seller highlights, and platform announcements.
                        </p>

                        <form className="flex flex-col gap-4 mt-2">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F7A73]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-[#1F7A73] text-white py-3 rounded-xl font-semibold hover:bg-[#16635d] transition"
                            >
                                Subscribe Now
                            </button>

                            <p className="text-xs text-gray-400">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default NewsLetter;
