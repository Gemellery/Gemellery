import React, { useState } from 'react'
import { ShoppingCart, Calendar, Heart } from 'lucide-react'

interface ProductActionsProps {
  onAddToCart?: (quantity: number) => void
  onBookViewing?: () => void
  onFavorite?: (isFavorited: boolean) => void
  quantity?: number
  showQuantitySelector?: boolean
}

const ProductActions: React.FC<ProductActionsProps> = ({
  onAddToCart,
  onBookViewing,
  onFavorite,
}) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      if (onAddToCart) {
        await onAddToCart(1)
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBookViewing = async () => {
    setIsBooking(true)
    try {
      if (onBookViewing) {
        await onBookViewing()
      }
    } finally {
      setIsBooking(false)
    }
  }

  const handleFavorite = () => {
    const newFavoritedState = !isFavorited
    setIsFavorited(newFavoritedState)
    if (onFavorite) {
      onFavorite(newFavoritedState)
    }
  }

  return (
    <div className="space-y-3 mt-6">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <ShoppingCart size={20} />
        {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
      </button>

      {/* Book Viewing + Wishlist Row */}
      <div className="flex gap-3">
        <button
          onClick={handleBookViewing}
          disabled={isBooking}
          className="flex-1 border-2 border-red-400 hover:border-red-500 disabled:border-red-300 text-red-500 hover:text-red-600 disabled:text-red-300 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
        >
          <Calendar size={18} />
          {isBooking ? 'Booking...' : 'Book Viewing'}
        </button>

        {/* Wishlist Button */}
        <button
          onClick={handleFavorite}
          className={`w-14 h-14 flex items-center justify-center border-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
            isFavorited
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={22}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>
      </div>
    </div>
  )
}

export default ProductActions