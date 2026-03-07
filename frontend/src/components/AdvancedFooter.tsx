import logo from '../assets/logos/Elegance Jewelry.png';
import { Instagram, Linkedin, X, Facebook } from 'lucide-react';

function AdvancedFooter() {
    return (
        <>
            <footer className="w-full bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-xl border-t border-white/30 shadow-2xl flex flex-col items-center justify-center">
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 px-6 py-10">
                    <div className="flex flex-col space-y-4 items-start">
                        <img
                            src={logo}
                            alt="Gemellery Logo"
                            className="h-20 w-auto object-contain"
                        />
                        <p className="text-gray-800 leading-relaxed text-xs font-medium">
                            <i>Authentic Sri Lankan gemstones,<br /> delivered
                                with transparency<br /> and care to the world.</i>
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Features</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/marketplace" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    Marketplace
                                </a>
                            </li>

                            <li>
                                <a href="/ai-studio" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    AI Design Studio
                                </a>
                            </li>

                            <li>
                                <a href="/about" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    About Us
                                </a>
                            </li>

                            <li>
                                <a href="/blog" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/faq" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    FAQ
                                </a>
                            </li>

                            <li>
                                <a href="/privacy-policy" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    Privacy Policy
                                </a>
                            </li>

                            <li>
                                <a href="/terms-and-conditions" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    Terms of Service
                                </a>
                            </li>

                            <li>
                                <a href="/help" className="text-gray-700 hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">
                                    Need Help ?
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Follow Us</h3>
                        <ul className="flex items-center space-x-4 text-sm text-gray-700">
                            <li>
                                <a href="https://www.instagram.com/gemellery.lk?igsh=MmJrY2gzdW5nMzR3" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors duration-300">
                                    <Instagram />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/gemellery/" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors duration-300">
                                    <Linkedin />
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com/Gemellery_lk" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors duration-300">
                                    <X />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/profile.php?id=61585844218473" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors duration-300">
                                    <Facebook />
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>

                <div className="w-full bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur py-4 flex items-center justify-center border-t border-white/10">
                    <p className="text-[#D8D4DC] text-center text-xs tracking-wide font-medium">
                        Copyright © 2025 Gemellery - All Rights Reserved.
                    </p>
                </div>

            </footer>
        </>
    )
}

export default AdvancedFooter;
