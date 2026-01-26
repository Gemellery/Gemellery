import React from 'react'

interface ProductAIDesignStudioProps {
  onTryAIDesign?: () => void;
}

const ProductAIDesignStudio: React.FC<ProductAIDesignStudioProps> = ({ onTryAIDesign }) => {
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 md:p-12 flex items-center justify-between gap-8"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80')",
        backgroundPosition: "right center",
        backgroundSize: "50%",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay"
      }}
    >
      {/* Background overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 from-40% to-transparent pointer-events-none"></div>

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
