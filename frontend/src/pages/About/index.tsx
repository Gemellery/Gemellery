import { ArrowRight, Shield, Award, Sparkles, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import AdvancedFooter from '../../components/AdvancedFooter';

function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      <main className="flex-1 overflow-y-auto bg-[#faf9f7]">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: "url('/sample_gems/Image.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full">
                Est. Sri Lanka 2026
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Authenticity Mined.
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-teal-600 italic">
              Innovation Crafted.
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Bridging the gap between centuries of Sri Lankan gemstone expertise and modern technology. Empowering transparent, traceable, and secure gemstone trade for miners, sellers, and buyers globally.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-3 rounded-full transition-colors">
                Explore Marketplace
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-3 rounded-full border border-gray-300 transition-colors">
                Watch Our Story
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-[#faf9f7]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-5xl font-bold mb-2">100%</h3>
              <p className="text-gray-600 text-sm uppercase tracking-wide">Traceable Gems</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">500+</h3>
              <p className="text-gray-600 text-sm uppercase tracking-wide">Verified Artisans</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">35</h3>
              <p className="text-gray-600 text-sm uppercase tracking-wide">Countries Reached</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">NGJA</h3>
              <p className="text-gray-600 text-sm uppercase tracking-wide">Certified</p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="/sample_gems/handfulgems.jpg"
                  alt="Hands holding gemstones"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              
              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-teal-700" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Ethical Sourcing</h4>
                    <p className="text-sm text-gray-600">
                      Directly supporting transparent supply chains, ensuring responsible gem extraction.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-teal-700 font-semibold mb-4 uppercase tracking-wide">
                Our Mission
              </p>
              <h2 className="text-4xl font-bold mb-6">
                Restoring Trust to the Trade.
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                For centuries, the gemstone industry has been shrouded in mystery. Buyers couldn't trace their stones, and miners didn't receive fair value.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                GemeJewry exists to eliminate this opacity. We've built a digital ecosystem that connects certified Sri Lankan sellers directly with global buyers, ensuring every sapphire, ruby, and spinel comes with a digital passport of authenticity.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Shield className="text-teal-700 mb-4" size={32} />
                  <h4 className="font-bold mb-2">Verified Sellers</h4>
                  <p className="text-sm text-gray-600">
                    98% KYC and background checks for glass-level trust.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Award className="text-teal-700 mb-4" size={32} />
                  <h4 className="font-bold mb-2">Lab Certified</h4>
                  <p className="text-sm text-gray-600">
                    Every gem over $2K includes an independent lab certificate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Gemstone Journey */}
        <section className="py-20 px-4 bg-[#faf9f7]">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Gemstone Journey</h2>
            <p className="text-gray-600">
              From the depths of the earth to your bespoke collection.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1 border-l-2 border-gray-200 pl-8 pb-12">
                <h3 className="text-2xl font-bold mb-2">Ethical Mining</h3>
                <p className="text-gray-600">
                  Sustainably mined with family-run, boutique gem operations. Harvested from Sri Lanka's rich gem deposits.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1 border-l-2 border-gray-200 pl-8 pb-12">
                <h3 className="text-2xl font-bold mb-2">Verification & Grading</h3>
                <p className="text-gray-600">
                  Reviewed by the National Gem & Jewellery Authority and independent gemologists.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1 border-l-2 border-gray-200 pl-8 pb-12">
                <h3 className="text-2xl font-bold mb-2">AI-Assisted Design</h3>
                <p className="text-gray-600">
                  Our "Bespoke AI" engine generates custom jewelry designs tailored to your vision's unique dimensions.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="flex-1 border-l-2 border-gray-200 pl-8 pb-12">
                <h3 className="text-2xl font-bold mb-2">Secure Global Delivery</h3>
                <p className="text-gray-600">
                  Insured, tracked shipping to over 35 countries worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Studio Section */}
        <section className="py-20 px-4 bg-[#f8f0d9]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Crafted by Human Hands.
                <br />
                <span className="italic text-teal-700">Perfected by AI.</span>
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Don't just buy a gemstone. Create a legacy. Our proprietary AI design studio allows you to collaborate with your gems' craftsmen in GaleJs and Colombo to bring it to life, exactly as you wish (with realistic renderings).
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-teal-700 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Real-time 3D rendering</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-teal-700 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Chats AI with master jewelers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-teal-700 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Augmented gold & diamonds sourcing</span>
                </div>
              </div>

              <button className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-3 rounded-full inline-flex items-center gap-2 transition-colors">
                Try the Design Studio
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="relative">
              <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-4 bg-gray-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-8">
                  <img
                    src="/sample_gems/AIring.jpg"
                    alt="AI Ring Design"
                    className="w-full rounded-xl"
                  />
                  <div className="mt-4 bg-white rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Generating design...</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-teal-700 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-teal-700 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-teal-700 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="members" className="bg-[#FAF8F3] py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Meet the Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              {/* Member 1*/}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200">
                  <img
                    src="/team/team1.jpeg"
                    alt="Samitha Bandara"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2F3B2F]">
                  Samitha Bandara
                </h3>
                <p className="text-gray-600">Team Leader / Frontend Developer</p>
                <div className="w-12 h-[3px] bg-[#C9A66B] mt-3"></div>
              </div>

              {/* Member 2 */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200">
                  <img
                    src="/team/team2.jpg"
                    alt="Pasindu Jayasekara"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2F3B2F]">
                  Pasindu Jayasekara
                </h3>
                <p className="text-gray-600">Backend Developer</p>
                <div className="w-12 h-[3px] bg-[#C9A66B] mt-3"></div>
              </div>

              {/* Member 3 */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200">
                  <img
                    src="/team/team3.jpeg"
                    alt="Pamuditha Silva"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2F3B2F]">
                  Pamuditha Silva
                </h3>
                <p className="text-gray-600">Backend Developer</p>
                <div className="w-12 h-[3px] bg-[#C9A66B] mt-3"></div>
              </div>

              {/* Member 4 */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200">
                  <img
                    src="/team/team4.jpg"
                    alt="Navindu Basnayake"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2F3B2F]">
                  Navindu Basnayake
                </h3>
                <p className="text-gray-600">Frontend Developer</p>
                <div className="w-12 h-[3px] bg-[#C9A66B] mt-3"></div>
              </div>

              {/* Member 5 */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200">
                  <img
                    src="/team/team5.jpg"
                    alt="Akil Dikshan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2F3B2F]">
                  Akil Dikshan
                </h3>
                <p className="text-gray-600">Backend Developer</p>
                <div className="w-12 h-[3px] bg-[#C9A66B] mt-3"></div>
              </div>

              {/* Member 6 */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200">
                  <img
                    src="/team/team6.jpg"
                    alt="Trivon Fernando"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2F3B2F]">
                  Trivon Fernando
                </h3>
                <p className="text-gray-600">Frontend Developer</p>
                <div className="w-12 h-[3px] bg-[#C9A66B] mt-3"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center bg-[#faf9f7]">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-teal-700" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4">Ready to find your treasure?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of collectors and creators who trust GemeJewry for their most precious acquisitions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-3 rounded-full transition-colors">
                Browse Collection
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-3 rounded-full border border-gray-300 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <AdvancedFooter />
      </main>
    </div>
  );
}

export default About;
