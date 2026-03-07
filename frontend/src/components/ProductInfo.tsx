import React from 'react'
import { CheckCircle, MapPin, Diamond, Ruler } from 'lucide-react'

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
  badge = 'NATURAL UNHEATED',
  rating = 4.9,
  reviewCount = 12,
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
    <div>
      {/* Badge + Rating Row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-red-500 tracking-widest uppercase">
          {badge}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-sm font-semibold text-gray-900">{rating}</span>
          <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
        {title}
      </h1>

      {/* Price Section */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-bold text-gray-900">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-base text-gray-400 line-through">
          ${originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">
          -{discountPercentage}%
        </span>
      </div>

      {/* Seller Section */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base">
              {seller.name.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-semibold text-gray-900 text-sm">{seller.name}</span>
              {seller.verified && (
                <CheckCircle size={14} className="text-blue-500 fill-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} />
              <span>{seller.location}</span>
              <span className="mx-1">•</span>
              <span>Member since {seller.memberSince}</span>
            </div>
          </div>
        </div>

        {/* View Profile */}
        <button className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 whitespace-nowrap flex-shrink-0">
          View Profile
        </button>
      </div>

      {/* Shape & Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
          <Diamond size={18} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">
              Shape
            </p>
            <p className="text-sm font-semibold text-gray-900">{shape}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
          <Ruler size={18} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">
              Dimensions
            </p>
            <p className="text-sm font-semibold text-gray-900">{dimensions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo