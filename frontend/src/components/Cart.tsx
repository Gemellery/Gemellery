// Cart.tsx
import { useState } from 'react';
import { Trash2, Plus, Minus, Lock, Sparkles, CheckCircle, Truck, Shield } from 'lucide-react';
import Navbar from './Navbar';
import AdvancedFooter from '../components/AdvancedFooter';
import { useCart } from '@/context/CartContext';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

const recommendedProducts: RecommendedProduct[] = [
  {
    id: '3',
    name: 'Colombian Emerald',
    price: 1200.00,
    image: '/sample_gems/emerald.png'
  },
  {
    id: '4',
    name: '0.5ct Diamond Solitaire',
    price: 3450.00,
    image: '/sample_gems/solitaire.jpg'
  },
  {
    id: '5',
    name: 'Burmese Ruby',
    price: 5100.00,
    image: '/sample_gems/ruby.png'
  }
];

function Cart() {
  const { items: cartItems, isLoading, error, removeFromCart, updateCartItem } = useCart();
  const [promoCode, setPromoCode] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0;
  const estimatedTax = 0.00;
  const total = subtotal + shipping + estimatedTax;

  // Handle quantity updates
  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingId(cartItemId);
    const success = await updateCartItem(cartItemId, newQuantity);
    setUpdatingId(null);
    
    if (!success) {
      console.error('Failed to update quantity');
    }
  };

  // Handle item removal
  const handleRemoveItem = async (cartItemId: number) => {
    const success = await removeFromCart(cartItemId);
    if (!success) {
      console.error('Failed to remove item');
    }
  };

  const handleApplyPromo = () => {
    console.log('Applying promo code:', promoCode);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
        <AdvancedFooter />
      </div>
    );
  }

  const isEmpty = cartItems.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      <main className="flex-1 overflow-y-auto bg-[#faf9f7]">
        {/* Breadcrumb */}
        <div className="px-4 py-4 text-sm text-gray-600 md:px-16">
          <a href="/" className="hover:text-red-700 transition-colors">Home</a>
          {' '}/{' '}
          <span>Your Cart</span>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Your Selection</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Review your high-value gemstone selections before securing your order. Each item
              is verified for authenticity.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {isEmpty ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
                <a href="/marketplace" className="text-red-700 font-semibold hover:underline">
                  Continue Shopping
                </a>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex flex-col gap-6 mb-12">
                  {cartItems.map(item => (
                    <div key={item.cart_item_id} className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm">
                      <div className="relative w-full md:w-36 h-64 md:h-36 flex-shrink-0">
                        <img 
                          src={item.image_url || '/sample_gems/default.jpg'} 
                          alt={item.gem_name}
                          className="w-full h-full object-cover rounded-lg bg-gradient-to-br from-gray-900 to-gray-700"
                        />
                        {item.certification && (
                          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[10px] font-semibold px-2.5 py-1 rounded border border-gray-200">
                            {item.certification.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold leading-snug pr-4">{item.gem_name}</h3>
                          <button 
                            onClick={() => handleRemoveItem(item.cart_item_id)}
                            className="text-gray-400 hover:text-red-700 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {item.seller_name && (
                          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                            <CheckCircle size={16} className="text-emerald-600" />
                            <span>Seller: {item.seller_name}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 my-3 text-sm text-gray-600">
                          {item.carat && <span>Weight: {item.carat} Carats</span>}
                          {item.cut && <span>• Cut: {item.cut}</span>}
                          {item.clarity && <span>• Clarity: {item.clarity}</span>}
                          {item.color && <span>• Color: {item.color}</span>}
                          {item.origin && <span>• Origin: {item.origin}</span>}
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                            <button 
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                              disabled={updatingId === item.cart_item_id}
                              className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} className="text-gray-600" />
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              readOnly 
                              className="w-12 text-center border-x border-gray-200 py-2 text-base"
                              min="1"
                            />
                            <button 
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                              disabled={updatingId === item.cart_item_id}
                              className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} className="text-gray-600" />
                            </button>
                          </div>

                          <div className="text-2xl font-semibold">
                            ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <section className="mt-12">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Sparkles size={20} className="text-yellow-500" />
                    You might also like
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedProducts.map(product => (
                      <div 
                        key={product.id} 
                        className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-52 object-cover bg-gradient-to-br from-gray-900 to-gray-700"
                        />
                        <h4 className="px-4 pt-4 text-base font-semibold">{product.name}</h4>
                        <p className="px-4 pb-4 font-semibold">
                          ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="bg-[#f5f3f0] p-8 rounded-xl h-fit sticky top-8">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

            <div className="flex justify-between mb-4 text-[15px]">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                  ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-600 -mt-1">USD</div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isEmpty}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

        {/* Footer */}
        <AdvancedFooter />
      </main>
    </div>
  );
}

export default Cart;
