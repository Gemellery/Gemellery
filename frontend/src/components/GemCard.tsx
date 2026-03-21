import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShieldCheck, Sparkles, Scale, Gem, Globe } from 'lucide-react'
import { useCart } from '@/context/CartContext';
import * as wishlistApi from '@/lib/wishlist/api';

interface GemCardProps {
  id?: string
  name: string
  price: string
  weight: string
  cut: string
  origin: string
  verified: boolean | number | string
  image: string
}

const GemCard: React.FC<GemCardProps> = ({ id, name, price, weight, cut, origin, verified, image }) => {
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
      className="w-full max-w-[320px] bg-white rounded-[20px] pb-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative bg-[#FDF8EE] h-64 shrink-0 flex items-center justify-center overflow-hidden group">
        <img 
          src={image || `https://placehold.co/400x300/FDF8EE/b45309?text=${encodeURIComponent(name)}`} 
          alt={name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/FDF8EE/b45309?text=${encodeURIComponent(name)}`
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform mix-blend-multiply"
        />
        
        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-[18px] h-[18px] text-[#2E8B57]" />
            <span className="text-[13px] font-bold text-gray-800 tracking-tight">Verified</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-sm hover:scale-110 transition-transform group/wishlist disabled:opacity-50"
        >
          <Heart 
            className={`w-[18px] h-[18px] transition-colors ${
              isWishlisted 
                ? 'text-[#CE0024] fill-[#CE0024]' 
                : 'text-gray-400 group-hover/wishlist:text-[#CE0024]'
            }`} 
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white px-5 pt-4 pb-1 flex flex-col grow">
        {/* Title and Price */}
        <div className="flex flex-col items-start mb-4 gap-1">
          <h2 className="text-[17px] font-black tracking-tight text-[#111111] line-clamp-1">{name}</h2>
          <span className="text-[19px] font-black tracking-tight text-[#CE0024] whitespace-nowrap">{price}</span>
        </div>

        {/* Details Row (Pill style) */}
        <div className="flex items-center gap-1.5 mb-5 w-full">
          <div className="flex flex-1 items-center justify-center gap-1 bg-[#F4F6F8] px-2 py-1.5 rounded-full min-w-0">
            <Scale className="w-3.5 h-3.5 text-[#5A6A85] shrink-0" />
            <span className="text-[12px] font-semibold text-[#5A6A85] tracking-tight truncate">{weight}</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-1 bg-[#F4F6F8] px-2 py-1.5 rounded-full min-w-0">
            <Gem className="w-3.5 h-3.5 text-[#5A6A85] shrink-0" />
            <span className="text-[12px] font-semibold text-[#5A6A85] tracking-tight truncate">{cut}</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-1 bg-[#F4F6F8] px-2 py-1.5 rounded-full min-w-0">
            <Globe className="w-3.5 h-3.5 text-[#5A6A85] shrink-0" />
            <span className="text-[12px] font-semibold text-[#5A6A85] tracking-tight truncate">{origin}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex gap-2.5 mt-auto">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-[#CE0024] hover:bg-[#A8001D] text-white font-bold tracking-wide py-3 px-4 rounded-[12px] transition-colors text-[15px]"
          >
            {buttonText}
          </button>
          <button 
            title="Design jewelry with this gem"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/jewelry-designer', {
                state: { prefilledGem: { id, name, price, weight, cut, origin, image } }
              })
            }}
            className="bg-[#F4F6F8] hover:bg-[#E5E9ED] rounded-[12px] p-3 transition-colors shrink-0 flex items-center justify-center group/designer"
          >
            <Sparkles className="w-5 h-5 text-[#5A6A85] group-hover/designer:text-[#D4AF37]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GemCard