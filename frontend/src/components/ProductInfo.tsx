import React from 'react'
import {CheckCircle, MapPin } from 'lucide-react'

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
  sku = 'SKU-2024-001',
  currentPrice = 12500,
  originalPrice = 14200,
  discount = 12,
  seller = {
    name: 'GemLanka Exports',
    verified: true,
    location: 'Anuradhapura, Sri Lanka',
    memberSince: 2018
  },
  shape = 'Cushion',
  dimensions = '8.2 x 7.8 mm'
}) => {
  const discountPercentage = discount || Math.round(((originalPrice - currentPrice) / originalPrice) * 100)



  return (
    <div className="bg-white p-8 rounded-lg">
      {/* Badge */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-red-500 tracking-wider">
          {badge}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-gray-900">★ {rating}</span>
          <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
        {title}
      </h1>

      {/* SKU */}
      <p className="text-sm text-gray-500 mb-6">{sku}</p>

      {/* Price Section */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-bold text-gray-900">
            ${currentPrice.toLocaleString()}
          </span>
          <span className="text-lg text-gray-400 line-through">
            ${originalPrice.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
            -{discountPercentage}%
          </span>
        </div>
      </div>

      {/* Seller Section */}
      <div className="border-t border-b border-gray-200 py-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* Seller Avatar */}
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {seller.name.charAt(0)}
              </span>
            </div>

            {/* Seller Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{seller.name}</h3>
                {seller.verified && (
                  <CheckCircle size={16} className="text-blue-500 fill-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <MapPin size={14} />
                <span>{seller.location}</span>
              </div>
              <p className="text-xs text-gray-500">
                Member since {seller.memberSince}
              </p>
            </div>
          </div>

          {/* View Profile Button */}
          <button className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 rounded border border-gray-300 hover:border-gray-400 transition-colors duration-200 whitespace-nowrap flex-shrink-0">
            View Profile
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Shape
          </p>
          <p className="text-lg font-semibold text-gray-900">{shape}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Dimensions
          </p>
          <p className="text-lg font-semibold text-gray-900">{dimensions}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo