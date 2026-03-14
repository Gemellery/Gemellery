import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Diamond, Scale, Dot } from 'lucide-react'
import type { GemData } from '@/lib/gems/types'

const lkrFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 0,
});

const ProductInfo: React.FC<{ product: GemData }> = ({ product }) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-[31px] md:text-[35px] font-bold text-gray-900 leading-[1.15] tracking-[-0.01em]">
        {product.gem_name}
      </h1>

      {/* Price Section */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="text-[28px] text-gray-900 tracking-tight">
          {lkrFormatter.format(product.price)}
        </span>
      </div>

      {/* Seller Section */}
      <div className="flex items-center justify-between bg-[#f8f7f5] rounded-xl px-4 py-3 border border-gray-100/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {(product.business_name || product.seller_name || 'S').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-gray-900 text-sm">
                {product.business_name || product.seller_name || 'Verified Seller'}
              </h3>
              {product.seller_verified && (
                <CheckCircle size={13} className="text-emerald-500" />
              )}
            </div>
            <p className="flex items-center text-[11px] text-gray-500 whitespace-nowrap">
              {product.seller_regional_branch || product.mining_region || product.origin}
              <Dot size={13} className="text-gray-500 mx-0.5" />
              Member since {product.seller_joined_date ? new Date(product.seller_joined_date).getFullYear() : (product.created_at ? new Date(product.created_at).getFullYear() : new Date().getFullYear())}
            </p>
          </div>
        </div>
        <Link 
          to={`/seller/${product.seller_id}`}
          className="text-[11px] font-semibold text-gray-700 hover:text-gray-900 px-3.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-all duration-200 whitespace-nowrap flex-shrink-0"
        >
          View Profile
        </Link>
      </div>

      {/* Shape & Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#f8f7f5] rounded-xl px-4 py-3 border border-gray-100/60">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Shape
          </p>
          <div className="flex items-center gap-1.5">
            <Diamond size={14} className="text-gray-500" />
            <p className="text-[15px] font-semibold text-gray-900">{product.cut || 'Standard'}</p>
          </div>
        </div>
        <div className="bg-[#f8f7f5] rounded-xl px-4 py-3 border border-gray-100/60">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Weight            
          </p>
          <div className="flex items-center gap-1.5">
            <Scale size={14} className="text-gray-500" />
            <p className="text-[15px] font-semibold text-gray-900">{product.carat || 'Natural'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo