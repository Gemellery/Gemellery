import React, { useState, useEffect } from 'react'
import { ShoppingCart, Calendar, Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { addToWishlist, removeFromWishlist, checkWishlist } from '@/lib/wishlist/api'

interface ProductActionsProps {
  gemId?: number
  onBookViewing?: () => void
  quantity?: number
  showQuantitySelector?: boolean
  vendorEmail?: string
}

const ProductActions: React.FC<ProductActionsProps> = ({
  gemId,
  onBookViewing,
  quantity: initialQuantity = 1,
  vendorEmail
}) => {
  const [quantity] = useState(initialQuantity)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Add to Cart')
  const { addToCart } = useCart()

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
      const success = await addToCart(gemId, quantity)
      if (success) {
        setButtonText('Added')
      } else {
        setButtonText('Failed to Add')
      }
      
      setTimeout(() => {
        setButtonText('Add to Cart')
      }, 2000)
    } catch (error) {
      console.error(error)
      // We still don't show the alert as per user request to avoid "popups"
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBookViewing = async () => {
    setIsBooking(true)
    try {
      // Use the vendor's email if available, otherwise fallback to support
      const supportEmail = vendorEmail || 'support@gemellery.com'
      
      // Prefill event details
      const title = encodeURIComponent(`Gem Viewing Appointment - Gem ID: ${gemId || 'Unknown'}`)
      const details = encodeURIComponent(`I would like to schedule a viewing for this gem.`)
      
      // Construct Google Calendar event link (action=TEMPLATE creates a new event)
      // The 'add' parameter adds the support email to the guest list so they get notified
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&add=${supportEmail}`
      
      // Open in a new tab
      window.open(url, '_blank', 'noopener,noreferrer')

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
        <span className="text-[15px]">{isAddingToCart ? 'Adding to Cart...' : buttonText}</span>
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