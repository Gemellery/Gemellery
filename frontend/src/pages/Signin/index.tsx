import { LockKeyhole } from 'lucide-react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasicFooter from '../../components/BasicFooter';

function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [full_name, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const [countries, setCountries] = useState<any[]>([]);
  const [countryId, setCountryId] = useState("");
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState<"buyer" | "seller">("buyer");
  const [businessName, setBusinessName] = useState("");
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [ngjaRegNo, setNgjaRegNo] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/countries");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries");
      }
    };

    loadCountries();
  }, []);

  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    const role = data.user.role?.toLowerCase();

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (role === "seller") {
      navigate("/seller/dashboard", { replace: true });
    } else if (role === "buyer") {
      navigate("/", { replace: true });
    } else {
      console.log("Unexpected role:", role);
    }

  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", userType);
    formData.append("full_name", full_name);
    formData.append("mobile", mobile);
    formData.append("country_id", countryId);
    formData.append("address", address);

    if (userType === "seller") {
      formData.append("business_name", businessName);
      formData.append("business_reg_no", businessRegNo);
      formData.append("ngja_registration_no", ngjaRegNo);
      if (licenseFile) {
        formData.append("seller_license", licenseFile);
      }
    }

    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      return;
    }
    setSuccess("Registration successful! You can now sign in.");
    setTimeout(() => {
      setMode("signin");
      setSuccess("")
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-[#fcfbf8] relative pb-24">
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

          <div className="w-full max-w-lg mt-8 rounded-xl overflow-hidden shadow-sm mb-8">
            <div className="p-6 space-y-5 bg-[#f3eee5]">

              {mode === "signin" ? (
                <>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-black mb-1">
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
                    <label className="block text-xs font-semibold text-black mb-1">
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

                      <button type='button' onClick={() => navigate("/forgot-password")} className="text-xs text-teal-700 hover:underline">
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

                  {/* Account Type */}
                  <div>
                    <h1 className='text-2xl font-bold text-center mb-8'>Register New Account</h1>
                    <label className="block text-xs font-bold text-black mb-1">
                      <u>Are you going to create a Buying or Selling account?</u>
                    </label>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value as "buyer" | "seller")}
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm"
                    >
                      <option value="buyer">Buying Account</option>
                      <option value="seller">Selling Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-black mb-1">
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
                    <label className="block text-xs font-semibold text-black mb-1">
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
                    <label className="block text-xs font-semibold text-black mb-1">
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

                  {/* Contact No */}
                  <div>
                    <label className="block text-xs font-semibold text-black mb-1">
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

                  {/* Country*/}
                  <div>
                    <label className="block text-xs font-semibold text-black mb-1">
                      Country
                    </label>
                    <select
                      value={countryId}
                      onChange={(e) => setCountryId(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600">
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option
                          key={country.country_id}
                          value={country.country_id}>
                          {country.country_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <label className="block text-xs font-semibold text-black mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main St, City, Country"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />

                  {userType === "seller" && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-black mb-1">
                          BUSINESS NAME
                        </label>
                        <input
                          type="text"
                          placeholder="ABC Jewelers Pvt Ltd"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-black mb-1">
                          BUSINESS REGISTRATION NO
                        </label>
                        <input
                          type="text"
                          placeholder="BRN123456"
                          value={businessRegNo}
                          onChange={(e) => setBusinessRegNo(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-black mb-1">
                          NGJA REGISTRATION NO
                        </label>
                        <input
                          type="text"
                          placeholder="NGJA123456"
                          value={ngjaRegNo}
                          onChange={(e) => setNgjaRegNo(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-black mb-1">
                          NGJA CERTIFICATE (PDF / Image)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                          className="w-full text-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* Submit */}
                  <button type='button' onClick={handleRegister} className="w-full bg-teal-700 text-white py-3 rounded-md font-semibold hover:bg-teal-800 transition">
                    Create Account →
                  </button>
                  {success && (
                    <p className="text-green-600 text-sm text-center mt-2">
                      {success}
                    </p>
                  )}

                  {error && (
                    <p className="text-red-600 text-sm text-center mt-2">
                      {error}
                    </p>
                  )}

                  {/* Back to Sign In */}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="w-full text-xs font-bold text-black hover:underline text-center">
                    Already have an account? Sign in
                  </button>
                </>
              )}
            </div>

            <div className="p-4 text-center text-xs text-gray-600 bg-[#fcfbf8]">
              Learn how we verify sellers
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <BasicFooter />
        </div>
      </div >
    </>
  )
}

export default SignIn
