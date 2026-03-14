import React, { useState, useEffect } from "react";
import { Search, ArrowUp, Gem } from "lucide-react";
import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";
import { faqData } from "./faqData";

function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    document.title = "FAQ | Gemellery";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const filteredData = faqData
    .filter((cat) => activeCategory === "All" || cat.category === activeCategory)
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          searchQuery === "" ||
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const highlightText = (text: string): React.ReactNode => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-[#D4AF37]/30 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-14 flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gradient-to-b from-amber-50/50 to-white">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#D4AF37]/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/5">
              <Gem className="w-3 h-3 text-[#B8962E]" />
              <span className="text-xs font-semibold text-[#B8962E] tracking-widest uppercase">
                Help Center
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 leading-tight">
              Frequently Asked
            </h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F5D061]">
              Questions
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
              Everything you need to know about Gemellery — gemstones, orders, sellers, and more.
            </p>

            {/* Search Bar inside Hero */}
            <div className="relative w-full max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Search your question..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory("All");
                }}
                className="w-full pl-12 pr-10 py-4 rounded-xl border border-[#D4AF37]/25 bg-white shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg font-bold leading-none"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="w-full flex justify-center px-6 py-8 border-b border-gray-100">
          <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "20+", label: "FAQ Topics" },
              { number: "500+", label: "Verified Gems" },
              { number: "100+", label: "Trusted Sellers" },
              { number: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center ${
                  i !== 3 ? "md:border-r border-gray-100" : ""
                }`}
              >
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F5D061]">
                  {stat.number}
                </span>
                <span className="text-xs text-gray-400 mt-1 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Category Tabs */}
        <section className="w-full flex justify-center px-6 pt-8 pb-6">
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
            {["All", ...faqData.map((c) => c.category)].map((cat) => {
              const catData = faqData.find((c) => c.category === cat);
              const count =
                cat === "All"
                  ? faqData.reduce((acc, c) => acc + c.items.length, 0)
                  : catData?.items.length ?? 0;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center gap-2 ${
                    activeCategory === cat
                      ? "bg-[#0A1128] text-[#D4AF37] border-[#0A1128] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  {catData && (
                    <catData.icon
                      className={`w-3.5 h-3.5 ${
                        activeCategory === cat ? "text-[#D4AF37]" : "text-gray-400"
                      }`}
                    />
                  )}
                  {cat}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                      activeCategory === cat
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="w-full max-w-3xl mx-auto px-6 pb-16 space-y-10">
          {filteredData.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-base mb-1">
                No results found for{" "}
                <span className="text-[#D4AF37] font-semibold">{searchQuery}</span>
              </p>
              <p className="text-gray-400 text-sm mb-5">Try different keywords</p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredData.map((category, catIdx) => (
              <div key={category.category}>

                {/* Category Header */}
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#0A1128] flex items-center justify-center flex-shrink-0">
                      <category.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      {category.category}
                    </h2>
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {category.items.length} questions
                    </span>
                </div>

                {/* Questions */}
                <div className="space-y-2">
                  {category.items.map((item, idx) => {
                    const key = `${category.category}-${idx}`;
                    const isOpen = openIndex === key;
                    return (
                      <div
                        key={key}
                        className={`rounded-xl transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? "border-l-[3px] border-l-[#D4AF37] border-t border-t-gray-100 border-r border-r-gray-100 border-b border-b-gray-100 bg-[#D4AF37]/[0.03]"
                            : "border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                  }`}
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                        >
                          <span
                            className={`text-sm font-medium pr-2 leading-relaxed ${
                              isOpen ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {highlightText(item.question)}
                          </span>
                          <span
                            className={`text-[#D4AF37] text-lg font-bold transition-transform duration-200 flex-shrink-0 ${
                              isOpen ? "rotate-45" : ""
                            }`}
                          >
                            +
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-3">
                            {highlightText(item.answer)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Divider between categories */}
                {catIdx < filteredData.length - 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <div className="h-px w-12 bg-gray-100" />
                    <Gem className="w-3 h-3 text-[#D4AF37]" />
                    <div className="h-px w-12 bg-gray-100" />
                  </div>
                )}

              </div>
            ))
          )}
        </section>

        {/* CTA Section */}
        <section className="w-full flex justify-center px-6 pb-20">
          <div className="w-full max-w-3xl rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#F5D061] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-[#0A1128] mb-1">
                Still have questions?
              </h3>
              <p className="text-[#0A1128]/60 text-sm">
                Our support team is ready to help you anytime.
              </p>
            </div>
            <a
              href="/contact"
              className="px-7 py-3 bg-[#0A1128] text-white text-sm font-semibold rounded-xl hover:bg-[#0A1128]/85 transition-all duration-200 whitespace-nowrap"
            >
              Contact Us
            </a>
          </div>
        </section>

      </main>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-xl bg-[#0A1128] text-[#D4AF37] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      <AdvancedFooter />
    </>
  );
}

export default FAQ;