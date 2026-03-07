import React from 'react'

interface Review {
  initials: string
  name: string
  rating: number
  date: string
  text: string
}

interface ReviewsRatingsProps {
  reviews?: Review[]
}

const ReviewsRatings: React.FC<ReviewsRatingsProps> = ({
  reviews = [
    {
      initials: 'JD',
      name: 'James D.',
      rating: 5,
      date: '2 weeks ago',
      text: 'The color on this sapphire is even more stunning in person. Gemellery\'s certification process gave me the peace of mind to make such a large purchase online. The packaging was exquisite.'
    },
    {
      initials: 'SL',
      name: 'Sarah L.',
      rating: 5,
      date: '1 month ago',
      text: 'Beautiful stone. Shipping was a bit slower than expected due to customs, but the support team kept me updated throughout.'
    }
  ]
}) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews & Ratings
        </h2>
        <button className="text-red-500 font-semibold text-sm hover:text-red-600 transition-colors duration-200">
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-gray-600">{review.initials}</span>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>

            {/* Review Text */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsRatings
