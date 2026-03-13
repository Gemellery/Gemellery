import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";
import { faqData } from "./faqData";

function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  useEffect(() => {
    document.title = "FAQ | Gemellery";
    window.scrollTo(0, 0);
  }, []);

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
      <main className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-white">

        {/* Hero Section */}
        <section className="relative w-full py-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
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

        {/* Stats Banner */}
        <section className="w-full flex justify-center px-6 mb-10">
          <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: "20+", label: "FAQ Topics" },
              { number: "500+", label: "Verified Gems" },
              { number: "100+", label: "Trusted Sellers" },
              { number: "24/7", label: "Support" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-5 rounded-2xl bg-white/70 border border-[#D4AF37]/20 shadow-sm backdrop-blur"
              >
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F5D061]">
                  {stat.number}
                </span>
                <span className="text-xs text-gray-500 mt-1 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Search Bar */}
        <section className="w-full flex justify-center px-6 mb-10">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#D4AF37]/30 bg-white/80 backdrop-blur shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 text-base transition-all"
            />
          </div>
        </section>

        {/* Category Tabs */}
        <section className="w-full flex justify-center px-6 mb-10">
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl">
            {["All", ...faqData.map((c) => c.category)].map((cat) => {
              const catData = faqData.find((c) => c.category === cat);
              const count =
                cat === "All"
                  ? faqData.reduce((acc, c) => acc + c.items.length, 0)
                  : catData?.items.length ?? 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 flex items-center gap-2 ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#0A1128] border-[#D4AF37] shadow-md"
                      : "bg-white/60 text-gray-700 border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }`}
                >
                  {catData?.icon} {cat}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      activeCategory === cat
                        ? "bg-[#0A1128]/20 text-[#0A1128]"
                        : "bg-gray-100 text-gray-500"
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
            <div className="text-center py-20 text-gray-400 text-lg">
              😕 No results found for "
              <span className="text-[#D4AF37]">{searchQuery}</span>"
            </div>
          ) : (
            filteredData.map((category) => (
              <div key={category.category}>

                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {category.category}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/40 to-transparent ml-2" />
                </div>

                {/* Questions */}
                <div className="space-y-3">
                  {category.items.map((item, idx) => {
                    const key = `${category.category}-${idx}`;
                    const isOpen = openIndex === key;
                    return (
                      <div
                        key={key}
                        className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                          isOpen
                            ? "border-l-4 border-[#D4AF37] shadow-md bg-gradient-to-br from-amber-50/60 to-white"
                            : "border border-gray-100 bg-white/70 hover:border-[#D4AF37]/30 hover:shadow-sm"
                        }`}
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : key)}
                          className="w-full flex items-center justify-between px-6 py-5 text-left"
                        >
                          <span className="font-semibold text-gray-900 text-base pr-4">
                            {highlightText(item.question)}
                          </span>
                          <span
                            className={`text-[#D4AF37] text-xl font-bold transition-transform duration-300 flex-shrink-0 ${
                              isOpen ? "rotate-45" : ""
                            }`}
                          >
                            +
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-[#D4AF37]/10 pt-4">
                            {highlightText(item.answer)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ))
          )}
        </section>

        {/* CTA Section */}
        <section className="w-full flex justify-center px-6 pb-20">
          <div className="w-full max-w-3xl rounded-3xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#F5D061] p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-2xl font-bold text-[#0A1128] mb-2">
                Still have questions?
              </h3>
              <p className="text-[#0A1128]/70 text-sm">
                Can't find the answer you're looking for? Our team is happy to help.
              </p>
            </div>
            
              href="/contact"
              className="px-8 py-3 bg-[#0A1128] text-white font-semibold rounded-full hover:bg-[#0A1128]/80 transition-all duration-300 whitespace-nowrap shadow-md"
            >
              Contact Us
            </a>
          </div>
        </section>

      </main>
      <AdvancedFooter />
    </>
  );
}

export default FAQ;