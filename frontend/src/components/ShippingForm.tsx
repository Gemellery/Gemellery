import { useState } from "react";
import {
  Edit,
  ShieldCheck,
  CreditCard,
  Lock,
  MessageCircle
} from "lucide-react";

function Checkout() {
  /* ---------------- Shipping ---------------- */
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  /* ---------------- Export Options ---------------- */
  const [gia, setGia] = useState(false);
  const [luxuryBox, setLuxuryBox] = useState(true);

  /* ---------------- Payment ---------------- */
  const [paymentMethod, setPaymentMethod] = useState("card");

  /* ---------------- Pricing ---------------- */
  const SUBTOTAL = 12450;
  const EXPORT_FEE = gia ? 150 : 0;
  const TAX = 0;
  const TOTAL = SUBTOTAL + EXPORT_FEE + TAX;

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT SIDE ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-serif font-semibold">
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
              <button className="text-xs text-gray-500 flex items-center gap-1">
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input name="firstName" placeholder="First Name" className="input" onChange={handleShippingChange} />
              <input name="lastName" placeholder="Last Name" className="input" onChange={handleShippingChange} />
            </div>

            <input name="street" placeholder="Apartment, suite, etc." className="input" onChange={handleShippingChange} />

            <div className="grid md:grid-cols-2 gap-4">
              <input name="city" placeholder="City" className="input" onChange={handleShippingChange} />
              <input name="postalCode" placeholder="Postal Code" className="input" onChange={handleShippingChange} />
            </div>

            <select name="country" className="input" onChange={handleShippingChange}>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Sri Lanka</option>
            </select>
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

            <div className="flex gap-3">
              <img src="/sample_gems/gem 3.2ct Royal Blue Ceylon Sapphire.png" className="w-16 h-16 rounded-lg border" />
              <div className="text-sm">
                <p className="font-medium">3.2ct Royal Blue Ceylon Sapphire</p>
                <p className="text-xs text-gray-500">Cushion Cut, Unheated</p>
                <p className="text-emerald-600 font-semibold mt-1">
                  ${SUBTOTAL.toLocaleString()}
                </p>
              </div>
            </div>

            <hr />

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

            <button className="w-full bg-[#a33a42] hover:bg-[#8f3238] text-white py-3 rounded-full text-sm font-medium">
              Pay ${TOTAL.toLocaleString()}
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
    </div>
  );
}

export default Checkout;
