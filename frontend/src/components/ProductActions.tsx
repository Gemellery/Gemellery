import React, { useState, useEffect } from 'react'
import { ShoppingCart, Calendar, Heart } from 'lucide-react'
import { addToCart } from '@/lib/cart/api'
import { addToWishlist, removeFromWishlist, checkWishlist } from '@/lib/wishlist/api'

interface ProductActionsProps {
  gemId?: number
  onBookViewing?: () => void
  quantity?: number
  showQuantitySelector?: boolean
}

const ProductActions: React.FC<ProductActionsProps> = ({
  gemId,
  onBookViewing,
  quantity: initialQuantity = 1
}) => {
  const [quantity] = useState(initialQuantity)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  // Check initial wishlist status
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (gemId) {
        try {
          const status = await checkWishlist(gemId)
          setIsFavorited(status)
        } catch (error) {
          console.error("Failed to check wishlist status", error)
        }
      }
    }
    fetchWishlistStatus()
  }, [gemId])

  const handleAddToCart = async () => {
    if (!gemId) return
    setIsAddingToCart(true)
    try {
      await addToCart(gemId, quantity)
      alert("Item added to cart successfully!")
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : "Failed to add to cart")
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

  const handleFavorite = async () => {
    if (!gemId || isWishlistLoading) return
    setIsWishlistLoading(true)
    try {
      if (isFavorited) {
        await removeFromWishlist(gemId)
        setIsFavorited(false)
      } else {
        await addToWishlist(gemId)
        setIsFavorited(true)
      }
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : "Failed to update wishlist")
    } finally {
      setIsWishlistLoading(false)
    }
  }

  return (
    <div className="space-y-2.5">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart || !gemId}
        className="w-full bg-[#1a3a2a] hover:bg-[#142e22] disabled:bg-[#1a3a2a]/70 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99]"
      >
        <ShoppingCart size={17} />
        <span className="text-[15px]">{isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}</span>
      </button>

      {/* Book Viewing and Wishlist Row */}
      <div className="flex gap-2.5">
        <button
          onClick={handleBookViewing}
          disabled={isBooking}
          className="flex-1 border-2 border-red-400/80 hover:border-red-500 hover:bg-red-50/50 disabled:border-red-200 text-red-500 hover:text-red-600 disabled:text-red-300 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99]"
        >
          <Calendar size={16} />
          <span className="text-[14px]">{isBooking ? 'Booking...' : 'Book Viewing'}</span>
        </button>

        <button
          onClick={handleFavorite}
          disabled={isWishlistLoading || !gemId}
          className={`w-[52px] h-[52px] flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0 active:scale-90 disabled:opacity-50 ${
            isFavorited 
              ? 'bg-red-50 border-2 border-red-400' 
              : 'border-2 border-gray-200 hover:border-red-300 hover:bg-red-50/30'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={20}
            className={`transition-all duration-200 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          />
        </button>
      </div>
    </div>
  )
}

export default ProductActions