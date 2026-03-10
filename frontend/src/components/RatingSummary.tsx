import React from 'react'
import { Star } from 'lucide-react'

interface RatingBreakdown {
  stars: number
  count: number
}

interface RatingSummaryProps {
  averageRating?: number
  totalRatings?: number
  breakdown?: RatingBreakdown[]
}

const RatingSummary: React.FC<RatingSummaryProps> = ({
  averageRating = 5.0,
  totalRatings = 14,
  breakdown = [
    { stars: 5, count: 14 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ]
}) => {
  const maxCount = Math.max(...breakdown.map(b => b.count), 1)

  const renderStars = (count: number, size: number = 14, filled: boolean = true) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={size}
          className={
            filled && i <= Math.floor(count)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-300 fill-gray-300'
          }
        />
      )
    }
    return stars
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-start gap-6">
        {/* Left: Overall Rating */}
        <div className="flex flex-col items-center flex-shrink-0 pr-5 border-r border-gray-100">
          <div className="flex items-baseline gap-0.5 mb-1">
            <span className="text-4xl font-bold text-gray-900 leading-none">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-lg text-gray-400 font-medium">/5</span>
          </div>
          <div className="flex items-center gap-0.5 mb-1.5">
            {renderStars(averageRating, 16)}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {totalRatings} Rating{totalRatings !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Right: Breakdown Bars */}
        <div className="flex-1 space-y-1.5 pt-0.5">
          {breakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              {/* Mini stars */}
              <div className="flex items-center gap-[1px] flex-shrink-0 w-[78px]">
                {renderStars(item.stars, 11)}
              </div>

              {/* Progress bar */}
              <div className="flex-1 h-[8px] bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: item.count > 0 ? `${Math.max((item.count / maxCount) * 100, 8)}%` : '0%'
                  }}
                />
              </div>

              {/* Count */}
              <span className="text-xs text-gray-500 font-medium w-5 text-right tabular-nums flex-shrink-0">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RatingSummary
