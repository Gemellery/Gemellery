import React, { useState } from 'react'
import { Star } from 'lucide-react'

interface Review {
  id: number | string
  buyerName: string
  rating: number
  date: string
  comment: string
}

interface ReviewsRatingsProps {
  reviews?: Review[]
}

const ReviewsRatings: React.FC<ReviewsRatingsProps> = ({
  reviews: initialReviews = [],
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  // Keep local list in sync when parent refreshes props
  React.useEffect(() => {
    setReviews(initialReviews)
  }, [initialReviews])

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={11}
          className={i <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
        />
      )
    }
    return stars
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Seller Reviews &amp; Ratings</h2>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-500">No reviews yet for this seller.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    {review.buyerName ? review.buyerName.charAt(0) : '?'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-[13px] font-semibold text-gray-900">{review.buyerName}</h4>
                    <span className="text-[11px] text-gray-400 flex-shrink-0">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default ReviewsRatings
