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
  quantity: initialQuantity = 1,
  showQuantitySelector = true
}) => {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      if (onAddToCart) {
        await onAddToCart(quantity)
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
    <div className="bg-white p-8 rounded-lg space-y-4">
      {/* Quantity Selector */}
      {showQuantitySelector && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-semibold text-gray-700">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center border-l border-r border-gray-300 py-2 focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
              min="1"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-600 text-white font-semibold py-4 px-6 rounded-full flex items-center justify-center gap-3 transition-colors duration-200"
      >
        <ShoppingCart size={20} />
        {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
      </button>

      {/* Book Viewing and Wishlist Row */}
      <div className="flex gap-4">
        {/* Book Viewing Button */}
        <button
          onClick={handleBookViewing}
          disabled={isBooking}
          className="flex-1 border-2 border-red-400 hover:border-red-500 disabled:border-red-300 text-red-500 hover:text-red-600 disabled:text-red-300 font-semibold py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <Calendar size={20} />
          {isBooking ? 'Booking...' : 'Book Viewing'}
        </button>

        {/* Wishlist/Favorite Button */}
        <button
          onClick={handleFavorite}
          className="w-14 h-14 flex items-center justify-center border border-gray-300 hover:border-gray-400 rounded-full transition-colors duration-200 flex-shrink-0"
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={24}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>
    </div>
  )
}

export default ProductActions