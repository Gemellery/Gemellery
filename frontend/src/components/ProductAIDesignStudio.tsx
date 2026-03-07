import React from 'react'

interface ProductAIDesignStudioProps {
  onTryAIDesign?: () => void;
}

const ProductAIDesignStudio: React.FC<ProductAIDesignStudioProps> = ({ onTryAIDesign }) => {
  return (
    <div 
      className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 md:p-8 flex items-center justify-between gap-6"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80')",
        backgroundPosition: "right center",
        backgroundSize: "45%",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay"
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 from-40% to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        {/* Label */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-400 font-semibold text-xs tracking-widest">✨ AI DESIGN STUDIO</span>
        </div>

        {/* Heading */}
        <h3 className="text-2xl md:text-2xl font-bold text-white mb-4 leading-tight">
          Visualize this gem in a<br />bespoke ring instantly.
        </h3>

        {/* CTA */}
        <button
          onClick={onTryAIDesign}
          className="inline-block px-6 py-2.5 bg-white text-slate-900 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Try AI Design
        </button>
      </div>
    </div>
  )
}

export default ProductAIDesignStudio
