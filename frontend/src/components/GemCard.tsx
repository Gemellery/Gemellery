import React from 'react'
import { Heart, Shield, Sparkles } from 'lucide-react'
import { MdOutlineScale } from "react-icons/md";
import { FaRegGem } from "react-icons/fa";
import { IoMdGlobe } from "react-icons/io";
import { GrCertificate } from "react-icons/gr";

const GemCard = () => {
  const gem = {
    name: "Royal Blue Sapphire",
    price: "$4,250",
    weight: "2.05 ct",
    cut: "Cushion",
    origin: "Ceylon (Sri Lanka)",
    certification: "GRS Certified",
    verified: true,
    image: "https://via.placeholder.com/400x300?text=Blue+Sapphire"
  }

  return (
    <div className="max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Image Container */}
      <div className="relative bg-amber-100 h-80 flex items-center justify-center">
        <img 
          src={gem.image} 
          alt={gem.name}
          className="w-full h-full object-cover"
        />
        
        {/* Verified Badge */}
        <div className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-gray-800">Verified</span>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition">
          <Heart className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-gray-50 p-6">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{gem.name}</h2>
          <span className="text-3xl font-bold text-red-600">{gem.price}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xl"><MdOutlineScale /></span>
            <span className="font-medium">{gem.weight}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl"><FaRegGem /></span>
            <span className="font-medium">{gem.cut}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl"><IoMdGlobe /></span>
            <span className="font-medium">{gem.origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl"><GrCertificate /></span>
            <span className="font-medium">{gem.certification}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex gap-3">
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition">
            Add to Cart
          </button>
          <button className="bg-white border border-gray-300 rounded-full p-3 hover:bg-gray-100 transition">
            <Sparkles className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GemCard