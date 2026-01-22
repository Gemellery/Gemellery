import React from 'react'

interface ProductAIDesignStudioProps {
  onTryAIDesign?: () => void;
}

const ProductAIDesignStudio: React.FC<ProductAIDesignStudioProps> = ({ onTryAIDesign }) => {
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12 flex items-center justify-between gap-8"
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 400%22%3E%3Cdefs%3E%3C/defs%3E%3C/svg%3E')",
        backgroundPosition: "right center",
        backgroundSize: "40%",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Background image element (ring) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-l from-white to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        {/* Header label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-red-500 font-semibold text-sm tracking-widest">✨ AI DESIGN STUDIO</span>
        </div>

        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          Visualize this gem in a bespoke ring instantly.
        </h2>

        {/* CTA Button */}
        <button
          onClick={onTryAIDesign}
          className="inline-block px-8 py-3 bg-white text-slate-900 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Try AI Design
        </button>
      </div>
    </div>
  )
}

export default ProductAIDesignStudio
