import logo from '../assets/logos/Elegance Jewelry.png';
import { Instagram, Linkedin, X, Facebook } from 'lucide-react';

function AdvancedFooter() {
    return (
        <>
            <footer className="w-full bg-[#FAF8F3] flex flex-col items-center justify-center">
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 px-6 py-10">
                    <div className="flex flex-col space-y-4 items-start">
                        <img
                            src={logo}
                            alt="Gemellery Logo"
                            className="h-20 w-auto object-contain"
                        />
                        <p className="text-gray-700 leading-relaxed text-xs">
                            <i>Authentic Sri Lankan gemstones,<br /> delivered
                                with transparency<br /> and care to the world.</i>
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-950">Features</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/marketplace" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    Marketplace
                                </a>
                            </li>

                            <li>
                                <a href="/ai-studio" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    AI Design Studio
                                </a>
                            </li>

                            <li>
                                <a href="/about" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    About Us
                                </a>
                            </li>

                            <li>
                                <a href="/blog" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/faq" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    FAQ
                                </a>
                            </li>

                            <li>
                                <a href="/privacy-policy" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    Privacy Policy
                                </a>
                            </li>

                            <li>
                                <a href="/terms-and-conditions" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    Terms of Service
                                </a>
                            </li>

                            <li>
                                <a href="/help" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                    Need Help ?
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Follow Us</h3>
                        <ul className="flex items-center space-x-4 text-sm text-gray-700">
                            <li>
                                <a href="https://www.instagram.com/gemellery.lk?igsh=MmJrY2gzdW5nMzR3" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                                    <Instagram />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/gemellery/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                                    <Linkedin />
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com/Gemellery_lk" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                                    <X />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/profile.php?id=61585844218473" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                                    <Facebook />
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>

                <div className="w-full bg-black py-4 flex items-center justify-center">
                    <p className="text-[#D8D4DC] text-center text-xs tracking-wide">
                        Copyright © 2025 Gemellery - All Rights Reserved.
                    </p>
                </div>

            </footer>
        </>
    )
}

export default AdvancedFooter;
