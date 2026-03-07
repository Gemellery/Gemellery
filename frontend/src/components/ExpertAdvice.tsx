import React from 'react'
import { Gem } from 'lucide-react'

const ExpertAdvice: React.FC = () => {
  return (
    <div className="bg-[#FFF8F0] rounded-2xl p-8 flex flex-col items-center text-center">
      {/* Icon */}
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-5">
        <Gem size={28} className="text-red-500" />
      </div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Need Expert Advice?
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Our gemologists are available for a video consultation to show you the stone in different lighting.
      </p>

      {/* CTA Button */}
      <button className="text-red-500 font-semibold text-sm hover:text-red-600 transition-colors duration-200 flex items-center gap-2">
        Schedule Video Call
        <span className="text-lg">→</span>
      </button>
    </div>
  )
}

export default ExpertAdvice
