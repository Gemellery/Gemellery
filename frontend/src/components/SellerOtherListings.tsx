import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Store, Shield, Star, ArrowRight } from 'lucide-react'

interface SellerListing {
  id: string
  name: string
  price: string
  priceValue: number
  image: string
  carat: string
  shape: string
  origin: string
  rating: number
  reviews: number
  verified: boolean
  badge?: string
}

interface SellerOtherListingsProps {
  sellerName?: string
  sellerLocation?: string
  totalListings?: number
  listings?: SellerListing[]
}

const SellerOtherListings: React.FC<SellerOtherListingsProps> = ({
  sellerName = 'GemLanka Exports',
  sellerLocation = 'Ratnapura, Sri Lanka',
  totalListings = 48,
  listings = [
    {
      id: '1',
      name: 'Ceylon Pink Sapphire',
      price: '$4,200',
      priceValue: 4200,
      image: '../public/sample_gems/sapphire blue_6.jpg',
      carat: '2.1 ct',
      shape: 'Oval',
      origin: 'Sri Lanka',
      rating: 4.8,
      reviews: 7,
      verified: true,
      badge: 'UNHEATED',
    },
    {
      id: '2',
      name: 'Natural Alexandrite',
      price: '$8,900',
      priceValue: 8900,
      image: '../public/sample_gems/alexandrite_18.jpg',
      carat: '1.8 ct',
      shape: 'Cushion',
      origin: 'Sri Lanka',
      rating: 5.0,
      reviews: 3,
      verified: true,
      badge: 'RARE',
    },
    {
      id: '3',
      name: 'Aquamarine Crystal',
      price: '$2,750',
      priceValue: 2750,
      image: '../public/sample_gems/aquamarine_8.jpg',
      carat: '4.5 ct',
      shape: 'Emerald',
      origin: 'Sri Lanka',
      rating: 4.6,
      reviews: 11,
      verified: true,
    },
    {
      id: '4',
      name: 'Blue Sapphire Solitaire',
      price: '$6,100',
      priceValue: 6100,
      image: '../public/sample_gems/solitaire.jpg',
      carat: '2.9 ct',
      shape: 'Round',
      origin: 'Sri Lanka',
      rating: 4.9,
      reviews: 5,
      verified: true,
      badge: 'GIA CERT',
    },
    {
      id: '5',
      name: 'Vivid Orange Sapphire',
      price: '$3,400',
      priceValue: 3400,
      image: '../public/sample_gems/sapphire blue_6.jpg',
      carat: '1.5 ct',
      shape: 'Pear',
      origin: 'Sri Lanka',
      rating: 4.7,
      reviews: 9,
      verified: false,
    },
    {
      id: '6',
      name: 'Star Ruby Cabochon',
      price: '$5,500',
      priceValue: 5500,
      image: '../public/sample_gems/alexandrite_18.jpg',
      carat: '3.2 ct',
      shape: 'Cabochon',
      origin: 'Sri Lanka',
      rating: 4.9,
      reviews: 6,
      verified: true,
      badge: 'NATURAL',
    },
  ],
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={9}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
      />
    ))
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Seller Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md shadow-red-100 flex-shrink-0">
            <Store size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              More from{' '}
              <span className="text-red-600">{sellerName}</span>
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
          <a
            href="#"
            className="hidden sm:flex items-center gap-1.5 ml-1 text-[12px] font-semibold text-red-500 hover:text-red-700 transition-colors duration-200 group"
          >
            View all
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
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
          className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {listings.map((gem) => (
            <div
              key={gem.id}
              className="flex-shrink-0 w-[210px] bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-transparent group"
            >
              {/* Image */}
              <div className="relative h-[150px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={gem.image}
                  alt={gem.name}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = `https://placehold.co/210x150/fff8e1/b45309?text=${encodeURIComponent(gem.name)}`
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                {gem.badge && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-white/95 backdrop-blur-sm text-[9px] font-bold text-red-600 tracking-wider px-2 py-1 rounded-full shadow-sm">
                      {gem.badge}
                    </span>
                  </div>
                )}

                {/* Verified shield */}
                {gem.verified && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <Shield size={11} className="text-white" />
                  </div>
                )}

                {/* Price tag - appears on hover */}
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <span className="text-[13px] font-bold text-red-600">{gem.price}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3">
                <h3 className="text-[13px] font-semibold text-gray-900 leading-snug mb-2 line-clamp-1 group-hover:text-red-600 transition-colors duration-200">
                  {gem.name}
                </h3>

                {/* Specs row */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[11px] bg-gray-50 text-gray-500 font-medium px-2 py-0.5 rounded-md">
                    {gem.carat}
                  </span>
                  <span className="text-[11px] bg-gray-50 text-gray-500 font-medium px-2 py-0.5 rounded-md">
                    {gem.shape}
                  </span>
                  <span className="text-[11px] bg-gray-50 text-gray-500 font-medium px-2 py-0.5 rounded-md truncate">
                    {gem.origin}
                  </span>
                </div>

                {/* Rating + Price row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">{renderStars(gem.rating)}</div>
                    <span className="text-[10px] text-gray-400 font-medium">({gem.reviews})</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-800">{gem.price}</span>
                </div>
              </div>

              {/* Bottom accent bar on hover */}
              <div className="h-0.5 bg-gradient-to-r from-red-400 via-red-600 to-red-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}

          {/* View all card */}
          <div className="flex-shrink-0 w-[140px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all duration-300 group min-h-[232px]">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-red-300 group-hover:bg-red-50 flex items-center justify-center shadow-xs transition-all duration-300">
              <ArrowRight size={16} className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
            <div className="text-center px-3">
              <p className="text-[12px] font-semibold text-gray-500 group-hover:text-red-600 transition-colors duration-200">
                View all {totalListings} gems
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">from this seller</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerOtherListings
