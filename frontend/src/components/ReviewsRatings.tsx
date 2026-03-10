import React from 'react'
import { Star } from 'lucide-react'

interface Review {
  initials: string
  name: string
  rating: number
  date: string
  text: string
}

interface ReviewsRatingsProps {
  reviews?: Review[]
  onWriteReview?: () => void
}

const ReviewsRatings: React.FC<ReviewsRatingsProps> = ({
  reviews = [
    {
      initials: 'JD',
      name: 'James D.',
      rating: 5,
      date: '2 weeks ago',
      text: 'The color of this sapphire is even more stunning in person. Gemellery\'s certification process gave me the peace of mind to make such a large purchase online. The packaging was exquisite.'
    },
    {
      initials: 'SL',
      name: 'Sarah L.',
      rating: 4.5,
      date: '1 month ago',
      text: 'Beautiful stone. Shipping was a bit slower than expected due to customs, but the support team kept me updated throughout.'
    }
  ],
  onWriteReview
}) => {
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
        <h2 className="text-xl font-bold text-gray-900">Reviews & Ratings</h2>
        <button
          onClick={onWriteReview}
          className="text-red-500 hover:text-red-600 font-semibold text-[13px] transition-colors duration-200"
        >
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-gray-500">{review.initials}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[13px] font-semibold text-gray-900">{review.name}</h4>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">{review.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {review.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsRatings
