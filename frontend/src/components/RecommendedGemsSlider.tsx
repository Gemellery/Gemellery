import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getGemImageUrl, fetchGems } from '@/lib/gems/api';
import type { GemListItem } from '@/lib/gems/types';
import { formatPrice } from '@/lib/gems/utils';
import GemCard from './GemCard';

const RecommendedGemsSlider = () => {
  const [recommendedGems, setRecommendedGems] = useState<GemListItem[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const loadGems = async () => {
      try {
        // Fetch 20 gems and pick randomly to simulate "randomly selected"
        const response = await fetchGems({ limit: 20 })
        if (response.success) {
          const shuffled = [...response.data].sort(() => 0.5 - Math.random());
          setRecommendedGems(shuffled.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to load recommended gems:', err)
      }
    }
    loadGems()
  }, [])

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

  if (recommendedGems.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles size={20} className="text-yellow-500" />
          You might also like
        </h2>
        
        {/* Nav arrows */}
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
        </div>
      </div>

      {/* Scroll Container with fade edges */}
      <div className="relative">
        {/* Left fade overlay */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#faf9f7] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Right fade overlay */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#faf9f7] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
        />

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recommendedGems.map((gem) => (
            <div
              key={gem.id}
              className="flex-shrink-0 w-[280px]"
            >
              <GemCard
                id={gem.id.toString()}
                name={gem.name}
                price={formatPrice(Number(gem.price))}
                weight={`${gem.weight || 0} ct`}
                cut={gem.cut || 'Mixed'}
                origin={gem.origin || 'Sri Lanka'}
                verified={gem.verified}
                image={gem.images?.[0] ? getGemImageUrl(gem.images[0]) : ''}
              />
            </div>
          ))}

          {/* View all card */}
          {recommendedGems.length > 0 && (
            <Link 
              to={`/marketplace`}
              className="flex-shrink-0 w-[140px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all duration-300 group min-h-[445px]">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-red-300 group-hover:bg-red-50 flex items-center justify-center shadow-xs transition-all duration-300">
                <ArrowRight size={16} className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
              <div className="text-center px-3">
                <p className="text-[12px] font-semibold text-gray-500 group-hover:text-[#CE0024] transition-colors duration-200">
                  View all gems
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">at marketplace</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default RecommendedGemsSlider;
