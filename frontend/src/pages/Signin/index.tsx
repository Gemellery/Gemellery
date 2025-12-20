import { LockKeyhole } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function SignIn() {
  const [role, setRole] = useState("buyer");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [full_name, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();



  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/");

  };

  const handleRegister = async () => {
    setError("");

    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        role,
        full_name,
        mobile,
        country_id: 1, // temp value
        address_id: 1
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed");
      return;
    }

    alert("Registration successful. Please sign in.");
    setMode("signin"); // switch back to sign in form

    console.log({
      email,
      password,
      role,
      full_name,
      mobile,
    });

  };



  return (
    <>
      <div className="min-h-screen">
        <nav className="w-full px-48 py-4 flex justify-between items-center border-b">
          <div>
            <img src="src\assets\logos\Elegance Jewelry.png" alt="Gemellery Logo" width={"25%"} />
          </div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1F7A73]"><LockKeyhole size={16} />Secure</h3>
        </nav>
        <div className='flex-col px-10 flex justify-center items-center '>
          <h1 className="text-4xl font-bold text-center mt-10 font-serif">
            Welcome to GEMELLERY
          </h1>
          <h5 className='text-md text-center mt-4 font-serif'>
            The exclusive marketplace for verified sapphires & rubies.<br />
            Select your role to begin your secure transaction.
          </h5>

          <div className="w-full max-w-lg mt-8 rounded-xl overflow-hidden shadow-sm border mb-8">
            <div className="p-6 space-y-5 bg-[#F3EEE5]">

              {mode === "signin" ? (
                /* ================= SIGN IN FORM ================= */
                <>
                  {/* Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      ACCOUNT TYPE
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />

                    <div className="flex justify-between mt-2">
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-xs font-bold text-black hover:underline"
                      >
                        Don’t have an account? Register here
                      </button>

                      <button className="text-xs text-teal-700 hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type='button' onClick={handleLogin} className="w-full bg-teal-700 text-white py-3 rounded-md font-semibold hover:bg-teal-800 transition">
                    Sign In →
                  </button>
                  {error && (
                    <p className="text-red-600 text-sm text-center mt-2">
                      {error}
                    </p>
                  )}

                </>
              ) : (
                /* ================= SIGN UP FORM ================= */
                <>
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={full_name}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm"
                    />

                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm"
                    />

                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm"
                    />

                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Contact No
                    </label>
                    <input
                      type="text"
                      placeholder="+1234567890"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm"
                    />

                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Sri Lanka"
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main St, City, Country"
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {/* Submit */}
                  <button type='button' onClick={handleRegister} className="w-full bg-teal-700 text-white py-3 rounded-md font-semibold hover:bg-teal-800 transition">
                    Create Account →
                  </button>
                  {error && (
                    <p className="text-red-600 text-sm text-center mt-2">
                      {error}
                    </p>
                  )}


                  {/* Back to Sign In */}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="w-full text-xs font-bold text-black hover:underline text-center"
                  >
                    Already have an account? Sign in
                  </button>
                </>
              )}

            </div>

            <div className="border-t p-4 text-center text-xs text-gray-600 bg-white">
              Learn how we verify sellers
            </div>
          </div>



        </div>
      </div>
    </>
  )
}

export default SignIn
