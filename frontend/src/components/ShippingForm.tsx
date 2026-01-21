import { useState } from "react";
import {
  Edit,
  CreditCard,
  ShieldCheck,
  Lock
} from "lucide-react";

function Checkout() {
  /* ---------------- Shipping Address ---------------- */
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  /* ---------------- Export Options ---------------- */
  const [exportOptions, setExportOptions] = useState({
    gia: false,
    luxuryBox: true,
  });

  /* ---------------- Payment ---------------- */
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-2xl font-serif font-semibold">
              Secure Checkout
            </h1>
            <p className="text-sm text-gray-500">
              Complete your purchase securely via our escrow service.
            </p>
          </div>

          {/* ---------------- Shipping Address ---------------- */}
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
              <input
                name="firstName"
                placeholder="First Name"
                className="input"
                onChange={handleShippingChange}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                className="input"
                onChange={handleShippingChange}
              />
            </div>

            <input
              name="street"
              placeholder="Apartment, suite, etc."
              className="input"
              onChange={handleShippingChange}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="city"
                placeholder="City"
                className="input"
                onChange={handleShippingChange}
              />
              <input
                name="postalCode"
                placeholder="Postal Code"
                className="input"
                onChange={handleShippingChange}
              />
            </div>

            <select
              name="country"
              className="input"
              onChange={handleShippingChange}
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Sri Lanka</option>
            </select>
          </section>

          {/* ---------------- Export & Authenticity ---------------- */}
          <section className="bg-[#fcfbf8] border rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Export & Authenticity
            </h3>

            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={exportOptions.gia}
                onChange={() =>
                  setExportOptions({ ...exportOptions, gia: !exportOptions.gia })
                }
              />
              <div className="text-sm">
                <p className="font-medium">Physical GIA Certificate</p>
                <p className="text-xs text-gray-500">
                  Receive original hardcopy certificate.
                </p>
              </div>
              <span className="ml-auto text-sm text-emerald-600">
                +$150.00
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={exportOptions.luxuryBox}
                onChange={() =>
                  setExportOptions({
                    ...exportOptions,
                    luxuryBox: !exportOptions.luxuryBox,
                  })
                }
              />
              <div className="text-sm">
                <p className="font-medium">Luxury Gift Packaging</p>
                <p className="text-xs text-gray-500">
                  Sealed authenticity box.
                </p>
              </div>
              <span className="ml-auto text-sm text-emerald-600">
                Free
              </span>
            </label>
          </section>

          {/* ---------------- Payment Method ---------------- */}
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

            <div className="flex items-start gap-2 bg-[#eaf3ef] p-3 rounded-lg text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Gemellery Escrow Protection ensures secure transactions.
            </div>
          </section>
        </div>

        {/* RIGHT SIDE (Order Summary Placeholder) */}
        <div className="hidden lg:block bg-[#f4efe6] rounded-xl p-6">
          <p className="text-sm font-semibold">Order Summary</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
