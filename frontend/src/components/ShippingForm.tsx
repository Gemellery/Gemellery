import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  ShieldCheck,
  CreditCard,
  Lock,
  MessageCircle,
  Loader,
  AlertCircle,
  Trash2
} from "lucide-react";
import Navbar from "./Navbar";
import AdvancedFooter from "./AdvancedFooter";
import * as shippingAPI from "@/lib/shipping/api.ts";
import * as orderAPI from "@/lib/order/api.ts";
import type { ShippingAddress } from "@/lib/shipping/types.ts";
import { useCart } from "@/context/CartContext";


function Checkout() {
  /* ---------------- Cart Items ---------------- */
  const { items: cartItems, totalAmount, isLoading: isCartLoading } = useCart();

  /* ---------------- Shipping ---------------- */
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  /* ---------------- Shipping Address Management ---------------- */
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null);

  /* ---------------- Checkout State ---------------- */
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  /* ---------------- Export Options ---------------- */
  const [gia, setGia] = useState(false);
  const [luxuryBox, setLuxuryBox] = useState(true);

  /* ---------------- Payment ---------------- */
  const [paymentMethod, setPaymentMethod] = useState("card");

  /* ---------------- Pricing (Dynamic from Cart) ---------------- */
  const SUBTOTAL = totalAmount || 0;
  const EXPORT_FEE = gia ? 150 : 0;
  const TAX = 0;
  const TOTAL = SUBTOTAL + EXPORT_FEE + TAX;

  // Load existing shipping addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    setAddressError(null);
    try {
      const data = await shippingAPI.getShippingAddresses();
      setAddresses(data);

      // Select the default address if available
      const defaultAddress = data.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.address_id);
        populateFormFromAddress(defaultAddress);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to load shipping addresses";
      setAddressError(error);
      console.error("Error loading addresses:", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const populateFormFromAddress = (address: ShippingAddress) => {
    setShipping({
      firstName: address.first_name,
      lastName: address.last_name,
      street: address.street,
      city: address.city,
      postalCode: address.postal_code,
      country: address.country,
    });
  };

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (address: ShippingAddress) => {
    setSelectedAddressId(address.address_id);
    populateFormFromAddress(address);
    setShowAddressForm(false);
  };

  const handleCheckout = async () => {
    // Validate that cart is not empty
    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty. Please add items before checkout.");
      return;
    }

    // Validate that a shipping address is selected
    if (!selectedAddressId) {
      setCheckoutError("Please select or add a shipping address before checkout.");
      return;
    }

    // Validate payment method
    if (!paymentMethod) {
      setCheckoutError("Please select a payment method.");
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await orderAPI.checkoutOrder({
        payment_method: paymentMethod,
        shipping_address_id: selectedAddressId,
      });

      // Success! Redirect to order confirmation or history page
      if (response.order_id) {
        navigate(`/order-history`);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to complete checkout";
      setCheckoutError(error);
      console.error("Checkout error:", err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    setAddressError(null);
    setAddressSuccess(null);

    // Validate all fields
    if (!shipping.firstName || !shipping.lastName || !shipping.street || !shipping.city || !shipping.postalCode || !shipping.country) {
      setAddressError("All address fields are required");
      setIsSavingAddress(false);
      return;
    }

    try {
      const newAddressId = await shippingAPI.createShippingAddress({
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        street: shipping.street,
        city: shipping.city,
        postal_code: shipping.postalCode,
        country: shipping.country,
        is_default: addresses.length === 0, // Set as default if it's the first address
      });

      setAddressSuccess("Shipping address saved successfully!");
      setSelectedAddressId(newAddressId);
      
      // Reload addresses to reflect changes
      await loadAddresses();
      setShowAddressForm(false);

      // Clear success message after 3 seconds
      setTimeout(() => setAddressSuccess(null), 3000);
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to save shipping address";
      setAddressError(error);
      console.error("Error saving address:", err);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (e: React.MouseEvent, addressId: number) => {
    e.stopPropagation(); // Prevent triggering handleSelectAddress
    
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setIsDeletingId(addressId);
    setAddressError(null);
    setAddressSuccess(null);

    try {
      await shippingAPI.deleteShippingAddress(addressId);
      setAddressSuccess("Address deleted successfully!");
      
      // If the deleted address was selected, clear selection
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }

      // Reload addresses to reflect changes
      await loadAddresses();

      // Clear success message after 3 seconds
      setTimeout(() => setAddressSuccess(null), 3000);
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to delete shipping address";
      setAddressError(error);
      console.error("Error deleting address:", err);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    
    <div className="min-h-screen bg-[#fcfbf8] p-6">
      {/* NavBar */}
      <Navbar />
      <main className="flex-1 overflow-auto py-6">  
      
      
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT SIDE ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-3xl font-semibold mb-2">
                Secure Checkout
              </h1>
              <p className="text-sm text-gray-500">
                Complete your purchase securely via our escrow service.
              </p>
            </div>

            {/* -------- Shipping Address -------- */}
            <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                    ✓
                  </span>
                  Shipping Address
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700"
                >
                  <Edit className="w-3 h-3" /> {showAddressForm ? "Cancel" : "Edit"}
                </button>
              </div>

              {/* Error Message */}
              {addressError && (
                <div className="flex gap-2 bg-red-50 p-3 rounded-lg text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{addressError}</p>
                </div>
              )}

              {/* Success Message */}
              {addressSuccess && (
                <div className="flex gap-2 bg-green-50 p-3 rounded-lg text-xs text-green-600">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{addressSuccess}</p>
                </div>
              )}

              {/* Loading State */}
              {isLoadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="ml-2 text-sm text-gray-500">Loading addresses...</span>
                </div>
              ) : (
                <>
                  {/* Saved Addresses List */}
                  {addresses.length > 0 && !showAddressForm && (
                    <div className="space-y-3 mb-6">
                      <p className="text-xs font-medium text-gray-500">SAVED ADDRESSES</p>
                      {addresses.map((address) => (
                        <div
                          key={address.address_id}
                          onClick={() => handleSelectAddress(address)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedAddressId === address.address_id
                              ? "border-emerald-600 bg-emerald-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === address.address_id}
                              onChange={() => handleSelectAddress(address)}
                              className="mt-1"
                            />
                            <div className="text-sm flex-1">
                              <p className="font-medium">
                                {address.first_name} {address.last_name}
                              </p>
                              <p className="text-gray-600">{address.street}</p>
                              <p className="text-gray-600">
                                {address.city}, {address.postal_code}
                              </p>
                              <p className="text-gray-600">{address.country}</p>
                              {address.is_default && (
                                <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAddress(e, address.address_id)}
                              disabled={isDeletingId === address.address_id}
                              className="text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                              title="Delete address"
                            >
                              {isDeletingId === address.address_id ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(true)}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-emerald-600 hover:text-emerald-600 transition"
                      >
                        + Add New Address
                      </button>
                    </div>
                  )}

                  {/* Address Form */}
                  {showAddressForm && (
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          name="firstName"
                          placeholder="First Name"
                          className="input"
                          value={shipping.firstName}
                          onChange={handleShippingChange}
                          required
                        />
                        <input
                          name="lastName"
                          placeholder="Last Name"
                          className="input"
                          value={shipping.lastName}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>

                      <input
                        name="street"
                        placeholder="Street Address"
                        className="input"
                        value={shipping.street}
                        onChange={handleShippingChange}
                        required
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          name="city"
                          placeholder="City"
                          className="input"
                          value={shipping.city}
                          onChange={handleShippingChange}
                          required
                        />
                        <input
                          name="postalCode"
                          placeholder="Postal Code"
                          className="input"
                          value={shipping.postalCode}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>

                      <select
                        name="country"
                        className="input"
                        value={shipping.country}
                        onChange={handleShippingChange}
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={isSavingAddress}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
                        >
                          {isSavingAddress && <Loader className="w-4 h-4 animate-spin" />}
                          {isSavingAddress ? "Saving..." : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* No addresses and not showing form */}
                  {addresses.length === 0 && !showAddressForm && (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm mb-4">No saved addresses yet</p>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* -------- Export & Authenticity -------- */}
            <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Export & Authenticity
              </h3>

              <label className="flex gap-3 p-3 border rounded-lg cursor-pointer">
                <input type="checkbox" checked={gia} onChange={() => setGia(!gia)} />
                <div className="text-sm">
                  <p className="font-medium">Physical GIA Certificate</p>
                  <p className="text-xs text-gray-500">
                    Original hardcopy certificate.
                  </p>
                </div>
                <span className="ml-auto text-sm text-emerald-600">+$150.00</span>
              </label>

              <label className="flex gap-3 p-3 border rounded-lg cursor-pointer">
                <input type="checkbox" checked={luxuryBox} onChange={() => setLuxuryBox(!luxuryBox)} />
                <div className="text-sm">
                  <p className="font-medium">Luxury Gift Packaging</p>
                  <p className="text-xs text-gray-500">
                    Sealed authenticity box.
                  </p>
                </div>
                <span className="ml-auto text-sm text-emerald-600">Free</span>
              </label>
            </section>

            {/* -------- Payment Method -------- */}
            <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Payment Method</h3>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Lock className="w-3 h-3" /> Encrypted
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`payment-btn ${paymentMethod === "card" && "active"}`}
                >
                  <CreditCard className="w-4 h-4" /> Credit Card
                </button>
                <button className="payment-btn">Wire Transfer</button>
                <button className="payment-btn">Crypto</button>
              </div>

              {paymentMethod === "card" && (
                <div className="bg-[#f4efe6] p-4 rounded-lg space-y-3">
                  <input placeholder="Card Number" className="input" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM / YY" className="input" />
                    <input placeholder="CVC" className="input" />
                  </div>
                  <input placeholder="Name on card" className="input" />
                </div>
              )}

              <div className="flex gap-2 bg-[#eaf3ef] p-3 rounded-lg text-xs text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Gemellery Escrow Protection ensures secure transactions.
              </div>
            </section>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="space-y-4">

            {/* Order Summary */}
            <div className="bg-[#f4efe6] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold">Order Summary</h3>

              {/* Loading State */}
              {isCartLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="ml-2 text-sm text-gray-500">Loading cart...</span>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <p>No items in cart</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.cart_item_id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg border bg-white flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl"></span>
                        </div>
                        <div className="text-sm flex-1">
                          <p className="font-medium">{item.gem_name}</p>
                          <p className="text-xs text-gray-500">
                            {item.carat && `${item.carat}ct`}
                            {item.cut && `, ${item.cut}`}
                            {item.color && `, ${item.color}`}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          )}
                          <p className="text-emerald-600 font-semibold mt-1">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr /></>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${SUBTOTAL.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Insured Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Export Documentation</span>
                  <span>${EXPORT_FEE.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Sales Tax (Est.)</span>
                  <span>$0.00</span>
                </div>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total Due</span>
                <span>${TOTAL.toLocaleString()}</span>
              </div>

              {/* Checkout Error Message */}
              {checkoutError && (
                <div className="flex gap-2 bg-red-50 p-3 rounded-lg text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{checkoutError}</p>
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut || !selectedAddressId || cartItems.length === 0 || isCartLoading}
                className="w-full bg-[#a33a42] hover:bg-[#8f3238] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ${TOTAL.toLocaleString()}</>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 flex justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                SSL Encrypted Payment
              </p>
            </div>

            {/* Help Card */}
            <div className="bg-white border rounded-xl p-4 flex gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <div className="text-xs">
                <p className="font-medium">Need Help?</p>
                <p className="text-gray-500">Chat with a Gemologist</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}  
      <AdvancedFooter />
    </div>
  );
}

export default Checkout;
