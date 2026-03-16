import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Store, ArrowRight } from 'lucide-react'
import type { GemFromDB } from '@/types/seller.types'
import GemCard from './GemCard'
import { formatPrice } from '@/lib/gems/utils'

interface SellerOtherListingsProps {
  sellerId?: string | number
  sellerName?: string
  sellerLocation?: string
  totalListings?: number
  listings?: GemFromDB[]
}

const SellerOtherListings: React.FC<SellerOtherListingsProps> = ({
  sellerId,
  sellerName = 'Seller',
  sellerLocation = 'Location',
  totalListings = 0,
  listings = []
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    setTimeout(checkScroll, 350)
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Seller Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CE0024] to-[#A8001D] flex items-center justify-center shadow-md flex-shrink-0">
            <Store size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              More from{' '}
              <span className="text-[#CE0024]">{sellerName}</span>
            </h2>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {sellerLocation} · {totalListings} gems listed
            </p>
          </div>
        </div>

        {/* Nav arrows + View All */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
          >
            <ChevronLeft size={15} className="text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
          >
            <ChevronRight size={15} className="text-gray-600" />
          </button>
          {listings.length > 0 && sellerId && (
            <Link
              to={`/seller/${sellerId}`}
              className="hidden sm:flex items-center gap-1.5 ml-1 text-[12px] font-semibold text-[#CE0024] hover:text-[#A8001D] transition-colors duration-200 group"
            >
              View all
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          )}
        </div>
      </div>

      {/* Scroll Container with fade edges */}
      <div className="relative">
        {/* Left fade overlay */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Right fade overlay */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
        />

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {listings.slice(0, 6).map((gem) => (
            <div
              key={gem.id}
              className="flex-shrink-0 w-[280px]"
            >
              <GemCard
                id={gem.id.toString()}
                name={gem.name}
                price={formatPrice(gem.price)}
                weight={`${gem.carat || 0} ct`}
                cut={gem.type || 'Mixed'}
                origin={gem.origin || 'Sri Lanka'}
                verified={false}
                image={gem.imageUrl || ''}
              />
            </div>
          ))}

          {/* View all card */}
          {listings.length > 0 && sellerId && (
            <Link 
              to={`/seller/${sellerId}`}
              className="flex-shrink-0 w-[140px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all duration-300 group min-h-[232px]">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-red-300 group-hover:bg-red-50 flex items-center justify-center shadow-xs transition-all duration-300">
                <ArrowRight size={16} className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
              <div className="text-center px-3">
                <p className="text-[12px] font-semibold text-gray-500 group-hover:text-[#CE0024] transition-colors duration-200">
                  View all {totalListings} gems
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">from this seller</p>
              </div>
            </Link>
          )}
          {listings.length === 0 && (
            <div className="w-full text-center py-10 text-gray-500 text-sm">
              No recent listings found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerOtherListings
