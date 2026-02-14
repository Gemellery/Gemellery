import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Shield, Sparkles } from 'lucide-react'
import { MdOutlineScale } from "react-icons/md";
import { FaRegGem } from "react-icons/fa";
import { IoMdGlobe } from "react-icons/io";
import { GrCertificate } from "react-icons/gr";

interface GemCardProps {
  id?: string
  name: string
  price: string
  weight: string
  cut: string
  origin: string
  certification: string
  verified: boolean
  image: string
}

const GemCard: React.FC<GemCardProps> = ({ id, name, price, weight, cut, origin, certification, verified, image }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    if (id) {
      navigate(`/product-detail/${id}`)
    }
  }
  return (
    <div 
      onClick={handleCardClick}
      className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 h-56 sm:h-64 md:h-72 flex-shrink-0 flex items-center justify-center overflow-hidden group">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Verified Badge */}
        {verified && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1.5 shadow-md hover:shadow-lg transition backdrop-blur-sm">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Verified</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 rounded-full p-2 sm:p-2.5 shadow-md hover:shadow-lg hover:bg-red-50 transition backdrop-blur-sm group/wishlist">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover/wishlist:text-red-600 transition" />
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white p-4 sm:p-5 flex flex-col flex-grow">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">{name}</h2>
          <span className="text-xl sm:text-2xl font-bold text-red-600 whitespace-nowrap">{price}</span>
        </div>

        {/* Details Grid - More Responsive */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5 flex-grow">
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <span className="text-base sm:text-lg flex-shrink-0"><MdOutlineScale /></span>
            <span className="text-xs sm:text-sm font-medium truncate">{weight}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <span className="text-base sm:text-lg flex-shrink-0"><FaRegGem /></span>
            <span className="text-xs sm:text-sm font-medium truncate">{cut}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <span className="text-base sm:text-lg flex-shrink-0"><IoMdGlobe /></span>
            <span className="text-xs sm:text-sm font-medium truncate">{origin}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <span className="text-base sm:text-lg flex-shrink-0"><GrCertificate /></span>
            <span className="text-xs sm:text-sm font-medium truncate">{certification}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex gap-2 mt-auto">
          <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base shadow-sm hover:shadow-md">
            Add to Cart
          </button>
          <button className="bg-gray-100 hover:bg-gradient-to-br hover:from-amber-100 hover:to-amber-200 border border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3 transition-all duration-300 flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GemCard