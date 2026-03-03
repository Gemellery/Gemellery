import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Shield, Sparkles } from 'lucide-react'
import { MdOutlineScale } from "react-icons/md";
import { FaRegGem } from "react-icons/fa";
import { IoMdGlobe } from "react-icons/io";
import { GrCertificate } from "react-icons/gr";
import { useCart } from '@/context/CartContext';
import * as wishlistApi from '@/lib/wishlist/api';

interface GemCardProps {
  id?: string
  name: string
  price: string
  weight: string
  cut: string
  origin: string
  certification: string
  verified: boolean | number | string
  image: string
}

const GemCard: React.FC<GemCardProps> = ({ id, name, price, weight, cut, origin, certification, verified, image }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [buttonText, setButtonText] = useState('Add to Cart')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Normalize verified to a real boolean
  const isVerified = 
    verified === true || 
    verified === 1 || 
    verified === '1' || 
    verified === 'true' || 
    verified === 'approved' 

  // Check if this gem is already wishlisted on mount
  useEffect(() => {
    const checkIfWishlisted = async () => {
      if (!id) return;
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // Only check for logged-in buyers
      if (!token || !user) return;
      try {
        const role = JSON.parse(user).role?.toLowerCase();
        if (role !== 'buyer') return;
      } catch { return; }

      try {
        const result = await wishlistApi.checkWishlist(Number(id));
        setIsWishlisted(result);
      } catch {
        // Silently fail — user might not be logged in
      }
    };
    checkIfWishlisted();
  }, [id]);

  const handleCardClick = () => {
    if (id) {
      navigate(`/product-detail/${id}`)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!id) return

    const success = await addToCart(Number(id))

    if (success) {
      setButtonText('Added')
    } else {
      setButtonText('Failed to Add')
    }

    setTimeout(() => {
      setButtonText('Add to Cart')
    }, 2000)
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation()  // Prevent card click navigation
    if (!id || wishlistLoading) return

    // Check if user is logged in as buyer
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      navigate('/signin');
      return;
    }

    try {
      const role = JSON.parse(user).role?.toLowerCase();
      if (role !== 'buyer') {
        alert('Only buyers can add items to wishlist');
        return;
      }
    } catch {
      navigate('/signin');
      return;
    }

    setWishlistLoading(true)

    try {
      if (isWishlisted) {
        await wishlistApi.removeFromWishlist(Number(id))
        setIsWishlisted(false)
      } else {
        await wishlistApi.addToWishlist(Number(id))
        setIsWishlisted(true)
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

  return (
    <div 
      onClick={handleCardClick}
      className="w-full max-w-xs bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative bg-linear-to-br from-amber-50 to-amber-100 h-56 sm:h-64 md:h-72 shrink-0 flex items-center justify-center overflow-hidden group">
        <img 
          src={image || `https://placehold.co/400x300/fff8e1/b45309?text=${encodeURIComponent(name)}`} 
          alt={name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fff8e1/b45309?text=${encodeURIComponent(name)}`
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1.5 shadow-md hover:shadow-lg transition backdrop-blur-sm">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Verified</span>
          </div>
        )}

        {/* Wishlist Button — NOW FUNCTIONAL */}
        <button 
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 rounded-full p-2 sm:p-2.5 shadow-md hover:shadow-lg hover:bg-red-50 transition backdrop-blur-sm group/wishlist disabled:opacity-50"
        >
          <Heart 
            className={`w-5 h-5 sm:w-6 sm:h-6 transition ${
              isWishlisted 
                ? 'text-red-600 fill-red-600' 
                : 'text-gray-400 group-hover/wishlist:text-red-600'
            }`} 
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white p-4 sm:p-5 flex flex-col grow">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">{name}</h2>
          <span className="text-xl sm:text-2xl font-bold text-red-600 whitespace-nowrap">{price}</span>
        </div>

        {/* Details Grid*/}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5 grow">
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <span className="text-base sm:text-lg shrink-0"><MdOutlineScale /></span>
            <span className="text-xs sm:text-sm font-medium truncate">{weight}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <span className="text-base sm:text-lg shrink-0"><FaRegGem /></span>
            <span className="text-xs sm:text-sm font-medium truncate">{cut}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <span className="text-base sm:text-lg shrink-0"><IoMdGlobe /></span>
            <span className="text-xs sm:text-sm font-medium truncate">{origin}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <span className="text-base sm:text-lg shrink-0"><GrCertificate /></span>
            <span className="text-xs sm:text-sm font-medium truncate">{certification}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex gap-2 mt-auto">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base shadow-sm hover:shadow-md"
          >
            {buttonText}
          </button>
          <button className="bg-gray-100 hover:bg-linear-to-br hover:from-amber-100 hover:to-amber-200 border border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3 transition-all duration-300 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GemCard