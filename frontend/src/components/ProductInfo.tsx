import React from 'react'
import { CheckCircle, Diamond,Microscope } from 'lucide-react'

interface ProductInfoProps {
  badge?: string
  rating?: number
  reviewCount?: number
  title?: string
  sku?: string
  currentPrice?: number
  originalPrice?: number
  discount?: number
  seller?: {
    name: string
    verified?: boolean
    location?: string
    memberSince?: number
  }
  shape?: string
  dimensions?: string
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  title = '3.5 Carat Vivid Royal Blue Sapphire',
  currentPrice = 12500,
  originalPrice = 14200,
  discount = 12,
  seller = {
    name: 'GemLanka Exports',
    verified: true,
    location: 'Ratnapura, Sri Lanka',
    memberSince: 2018
  },
  shape = 'Cushion',
  dimensions = '8.2 x 7.8 mm'
}) => {
  const discountPercentage = discount || Math.round(((originalPrice - currentPrice) / originalPrice) * 100)

  return (
    <div className="space-y-7">
      {/* Title */}
      <h1 className="text-[26px] md:text-[30px] font-bold text-gray-900 leading-[1.15] tracking-[-0.01em]">
        {title}
      </h1>

      {/* Price Section */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="text-[28px] font-bold text-gray-900 tracking-tight">
          ${currentPrice.toLocaleString()}.00
        </span>
        <span className="text-base text-gray-400 line-through">
          ${originalPrice.toLocaleString()}.00
        </span>
        <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
          -{discountPercentage}%
        </span>
      </div>

      {/* Seller Section */}
      <div className="flex items-center justify-between bg-[#f8f7f5] rounded-xl px-4 py-3 border border-gray-100/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {seller.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-gray-900 text-sm">{seller.name}</h3>
              {seller.verified && (
                <CheckCircle size={13} className="text-emerald-500" />
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              {seller.location} • Member since {seller.memberSince}
            </p>
          </div>
        </div>
        <button className="text-[11px] font-semibold text-gray-700 hover:text-gray-900 px-3.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-all duration-200 whitespace-nowrap flex-shrink-0">
          View Profile
        </button>
      </div>

      {/* Shape & Dimensions */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#f8f7f5] rounded-xl px-4 py-3 border border-gray-100/60">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Shape
          </p>
          <div className="flex items-center gap-1.5">
            <Diamond size={14} className="text-gray-500" />
            <p className="text-[15px] font-semibold text-gray-900">{shape}</p>
          </div>
        </div>
        <div className="bg-[#f8f7f5] rounded-xl px-4 py-3 border border-gray-100/60">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Treatment            
          </p>
          <div className="flex items-center gap-1.5">
            <Microscope size={14} className="text-gray-500" />
            <p className="text-[15px] font-semibold text-gray-900">{dimensions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo