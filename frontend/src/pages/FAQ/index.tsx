import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";

function FAQ() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-white">

        {/* Hero Section */}
        <section className="relative w-full py-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-block mb-4 px-5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#B8962E] text-sm font-semibold tracking-widest uppercase">
            Help Center
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Frequently Asked <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F5D061]">
              Questions
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Everything you need to know about Gemellery — gemstones, orders, sellers, and more.
          </p>
        </section>

      </main>
      <AdvancedFooter />
    </>
  );
}

export default FAQ;