import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Lock, Truck, Shield, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getGemImageUrl } from '@/lib/gems/api';
import { formatPrice } from '@/lib/gems/utils';
import Navbar from './Navbar';
import AdvancedFooter from '../components/AdvancedFooter';
import RecommendedGemsSlider from './RecommendedGemsSlider';


function Cart() {
  const navigate = useNavigate();
  const {
    items,
    totalAmount,
    itemCount,
    isLoading,
    error,
    removeFromCart,
  } = useCart();

  const [promoCode, setPromoCode] = useState<string>('');
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Calculate totals
  const subtotal = Number(totalAmount) || 0;
  const shipping = 0;
  const estimatedTax = 0.00;
  const total = subtotal + shipping + estimatedTax;

  // Remove item handler
  const handleRemoveItem = async (cartItemId: number) => {
    setRemovingId(cartItemId);
    await removeFromCart(cartItemId);
    setRemovingId(null);
  };

  const handleApplyPromo = () => {
    console.log('Applying promo code:', promoCode);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // ============================================
  // Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-[#faf9f7]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-700 mx-auto mb-3" />
            <p className="text-gray-500">Loading your cart...</p>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // Empty Cart State
  // ============================================
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-[#faf9f7]">
          {/* Breadcrumb */}
          <div className="px-4 py-4 text-sm text-gray-600 md:px-16">
            <a href="/" className="hover:text-red-700 transition-colors">Home</a>
            {' '}/{' '}
            <span>Your Cart</span>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-16 md:px-16">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-4xl font-semibold mb-2">Your Selection</h1>
              <p className="text-gray-500 mb-8">Your cart is empty. Discover beautiful gems in our marketplace.</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="bg-red-700 hover:bg-red-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
              >
                Browse Gems
              </button>
            </div>

            {/* Recommendations Slider */}
            <RecommendedGemsSlider />
          </div>

        </main>
        <AdvancedFooter />
      </div>
    );
  }

  // ============================================
  // Cart With Items
  // ============================================
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      <main className="flex-1 bg-[#faf9f7]">
        {/* Breadcrumb */}
        <div className="px-4 py-4 text-sm text-gray-600 md:px-16">
          <a href="/" className="hover:text-red-700 transition-colors">Home</a>
          {' '}/{' '}
          <span>Your Cart</span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 md:px-16 mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Your Selection</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Review your high-value gemstone selections before securing your order. Each item
              is verified for authenticity.
            </p>

            {/* Cart Items */}
            <div className="flex flex-col gap-6 mb-12">
              {items.map(item => (
                <div key={item.cart_item_id} className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm">
                  <div className="relative w-full md:w-36 h-64 md:h-36 flex-shrink-0">
                    <img 
                      src={item.image 
                        ? getGemImageUrl(item.image)
                        : `https://placehold.co/400x300/fff8e1/b45309?text=${encodeURIComponent(item.gem_name)}`
                      } 
                      alt={item.gem_name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fff8e1/b45309?text=${encodeURIComponent(item.gem_name)}`
                      }}
                      className="w-full h-full object-cover rounded-lg bg-gradient-to-br from-gray-900 to-gray-700"
                    />
                    {item.certification && (
                      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[10px] font-semibold px-2.5 py-1 rounded border border-gray-200">
                        CERTIFIED
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold leading-snug pr-4">{item.gem_name}</h3>
                      <button 
                        onClick={() => handleRemoveItem(item.cart_item_id)}
                        disabled={removingId === item.cart_item_id}
                        className="text-gray-400 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        {removingId === item.cart_item_id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>

                    {item.seller_name && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <Shield size={16} className="text-emerald-600" />
                        <span>Seller: {item.seller_name}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5 my-3 text-sm text-gray-600">
                      {item.carat && <span>Weight: {item.carat} Carats</span>}
                      {item.cut && <span>• Cut: {item.cut}</span>}
                      {item.clarity && <span>• Clarity: {item.clarity}</span>}
                      {item.origin && <span>• Origin: {item.origin}</span>}
                      {item.color && <span>• Color: {item.color}</span>}
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </div>

                      <div className="text-2xl font-semibold">
                        {formatPrice(item.total_price || item.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations Slider */}
            <RecommendedGemsSlider />
          </div>

          {/* Order Summary Sidebar */}
          <aside className="bg-[#f5f3f0] p-8 rounded-xl h-fit sticky top-8">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

            <div className="flex justify-between mb-4 text-[15px]">
              <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between mb-4 text-[15px]">
              <span className="flex items-center gap-2">
                <Truck size={16} className="text-gray-600" />
                Shipping
              </span>
              <span className="text-emerald-600 font-semibold">Free (Insured)</span>
            </div>

            <div className="flex justify-between mb-4 text-[15px]">
              <span>Estimated Tax</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-4 mt-4 border-t-2 border-gray-300 font-semibold mb-6">
              <span>Total</span>
              <div className="text-right">
                <div className="text-3xl">
                  {formatPrice(total)}
                </div>
                <div className="text-xs text-gray-600 -mt-1">LKR</div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
            >
              <Lock size={16} />
              Secure Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
              <Shield size={16} className="text-emerald-600" />
              <span>Guaranteed authenticity & secure payment</span>
            </div>

            <div className="flex gap-3 justify-center mb-6">
              <img src="/sample_gems/Visa.jpg" alt="Visa" className="h-6" />
              <img src="/sample_gems/mastercard.jpg" alt="Mastercard" className="h-6" />
              <img src="/sample_gems/amex.jpg" alt="Amex" className="h-6" />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-300">
              <label className="block mb-3 font-medium text-[15px]">Have a promo code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-md transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="text-center mt-6 text-sm text-gray-600">
              Need help? <a href="/contact" className="text-red-700 font-semibold hover:underline">Contact Concierge</a>
            </div>
          </aside>
        </div>
      </main>
      {/* Footer */}
      <AdvancedFooter />
    </div>
  );
}

export default Cart;
