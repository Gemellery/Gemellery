import React from 'react'

interface ProductAIDesignStudioProps {
  onTryAIDesign?: () => void;
}

const ProductAIDesignStudio: React.FC<ProductAIDesignStudioProps> = ({ onTryAIDesign }) => {
  return (
    <div 
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 min-h-[150px]"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80')",
        backgroundPosition: "right center",
        backgroundSize: "55%",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay"
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 from-50% to-gray-950/20 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 px-6 py-5">
        {/* Header label */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-red-400 font-semibold text-[10px] tracking-[0.15em] uppercase">✨ AI DESIGN STUDIO</span>
        </div>

        {/* Main heading */}
        <h2 className="text-xl font-bold text-white mb-3 leading-snug max-w-[320px]">
          Visualize this gem in a bespoke ring instantly.
        </h2>

        {/* CTA Button */}
        <button
          onClick={onTryAIDesign}
          className="inline-flex items-center px-5 py-2 bg-white text-gray-900 font-semibold text-[13px] rounded-full hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Try AI Design
        </button>
      </div>
    </div>
  )
}

export default ProductAIDesignStudio
