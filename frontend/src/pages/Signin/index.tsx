import { LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasicFooter from '../../components/BasicFooter';
import { useGoogleLogin } from "@react-oauth/google";

function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [full_name, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const [countryId, setCountryId] = useState("");
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState<"buyer" | "seller">("buyer");
  const [businessName, setBusinessName] = useState("");
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [ngjaRegNo, setNgjaRegNo] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const handleAuthSuccess = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    
    const role = user.role?.toLowerCase();
    const validRoles = ["buyer", "seller", "admin", "super_admin"];
    
    if (validRoles.includes(role)) {
      navigate("/", { replace: true });
    } else {
      setError("Invalid user role");
    }
  };

  // Fetch countries for registration
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/countries");
        const data = await res.json();
        setCountries(data);
      } catch {
        console.error("Failed to load countries");
      }
    };
    loadCountries();
  }, []);

  // Standard email/password login
  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.message); return; }
    handleAuthSuccess(data.token, data.user);
  };

  /**
   * Google OAuth success callback: fetches profile and authenticates with backend.
   */
  const handleGoogleSuccess = async (tokenResponse: any) => {
    setGoogleLoading(true);
    setError("");

    try {
      // Fetch the user's Google profile using the access token
      const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await profileRes.json();

      // Send profile info to our backend to create/find the user
      const res = await fetch("http://localhost:5001/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: tokenResponse.access_token, profile }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      handleAuthSuccess(data.token, data.user);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setError("Google sign-in was cancelled or failed.");
      setGoogleLoading(false);
    },
    onNonOAuthError: () => {
      setGoogleLoading(false);
    },
  });

  // Handles user registration with multipart/form-data support
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // Using FormData because sellers may upload a file (NGJA certificate)
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", userType);
    formData.append("full_name", full_name);
    formData.append("mobile", mobile);
    formData.append("country_id", countryId);
    formData.append("address", address);

    // Seller-only fields
    if (userType === "seller") {
      formData.append("business_name", businessName);
      formData.append("business_reg_no", businessRegNo);
      formData.append("ngja_registration_no", ngjaRegNo);
      if (licenseFile) formData.append("seller_license", licenseFile);
    }

    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) { setError(data.message); return; }

    setSuccess("Registration successful! You can now sign in.");
    setTimeout(() => { setMode("signin"); setSuccess(""); }, 2000);
  };

  // Shared input class — keeps all inputs consistent
  const inputClass = `w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#1a6fc4] focus:border-[#1a6fc4]
                      focus:bg-white placeholder:text-gray-400 transition-all`;

  // Shared label class
  const labelClass = "block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-[#fcfbf8] flex flex-col">

      {/* === Top Navigation Bar === */}
      <nav className="w-full px-6 sm:px-12 md:px-48 py-4 flex justify-between items-center border-b border-gray-100 bg-white">
        <img src="src\assets\logos\Elegance Jewelry.png" alt="Gemellery Logo" className="h-10 w-auto" />
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1F7A73]">
          <LockKeyhole size={14} /> Secure
        </span>
      </nav>

      {/* === Page Body === */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">

        {/* === Page Headings === */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center font-serif text-gray-900">
          Welcome to GEMELLERY
        </h1>
        <p className="text-sm text-center mt-3 text-gray-500 font-serif">
          The exclusive marketplace for verified sapphires &amp; rubies.<br />
          Select your role to begin your secure transaction.
        </p>

        {/* === Form Card === */}
        <div className="w-full max-w-[420px] mt-8 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">

          {mode === "signin" ? (
            /* === SIGN IN FORM === */
            <div className="p-8">

              {/* Form heading */}
              <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">Login</h1>

              {/* === Email Field === */}
              <div className="mb-4">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Email or phone number"
                  className={inputClass}
                />
              </div>

              {/* === Password Field with Eye Toggle === */}
              <div className="mb-4">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Enter password"
                    className={`${inputClass} pr-11`}
                  />
                  {/* Eye icon toggles between showing and hiding the password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* === Remember Me + Forgot Password === */}
              <div className="flex items-center justify-between mb-6">
                {/* Custom toggle switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`relative inline-flex w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none
                      ${rememberMe ? "bg-[#1a6fc4]" : "bg-gray-300"}`}
                  >
                    {/* The sliding white circle */}
                    <span
                      className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5
                        ${rememberMe ? "translate-x-5.5" : "translate-x-0.5"}`}
                    />
                  </button>
                  <span className="text-xs text-gray-600">Remember me</span>
                </label>

                {/* Forgot password link */}
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-[#1a6fc4] hover:text-[#1a6fc4] hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* === Sign In Button === */}
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-[#1a6fc4] text-white py-2.5 rounded-lg font-semibold text-sm
                           hover:bg-[#1560ac] active:bg-[#1050a0] transition-all duration-200 shadow-sm
                           hover:shadow-md mb-4"
              >
                Sign in
              </button>

              {/* === Error Message === */}
              {error && (
                <p className="text-red-500 text-xs text-center mb-4 bg-red-50 rounded-lg py-2 px-3">
                  {error}
                </p>
              )}

              {/* === Divider === */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 whitespace-nowrap">or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={() => { setGoogleLoading(true); triggerGoogleLogin(); }}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg
                           bg-gray-900 text-white text-sm font-medium
                           hover:bg-gray-800 active:bg-black transition-all duration-200
                           shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* Official Google "G" SVG logo */}
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                <span>{googleLoading ? "Connecting..." : "Or sign in with Google"}</span>
              </button>

              {/* === Sign Up Link === */}
              <p className="text-center text-xs text-gray-500 mt-6">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[#1a6fc4] hover:text-blue-800 font-semibold hover:underline transition-colors"
                >
                  Sign up now
                </button>
              </p>
            </div>

          ) : (
            /* ═══════════════ SIGN UP FORM ═══════════════ */
            <div className="p-8">

              <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
                Create Account
              </h2>

              {/* === Account Type === */}
              <div className="mb-4">
                <label className={labelClass}>Account Type</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as "buyer" | "seller")}
                  className={inputClass}
                >
                  <option value="buyer">Buying Account</option>
                  <option value="seller">Selling Account</option>
                </select>
              </div>

              {/* === Full Name === */}
              <div className="mb-4">
                <label className={labelClass}>Full Name</label>
                <input type="text" placeholder="John Doe" value={full_name}
                  onChange={(e) => setFullName(e.target.value)} className={inputClass} />
              </div>

              {/* === Email === */}
              <div className="mb-4">
                <label className={labelClass}>Email Address</label>
                <input type="email" placeholder="name@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>

              {/* === Password === */}
              <div className="mb-4">
                <label className={labelClass}>Password</label>
                <input type="password" placeholder="Create a strong password" value={password}
                  onChange={(e) => setPassword(e.target.value)} className={inputClass} />
              </div>

              {/* === Contact === */}
              <div className="mb-4">
                <label className={labelClass}>Contact No</label>
                <input type="text" placeholder="+1234567890" value={mobile}
                  onChange={(e) => setMobile(e.target.value)} className={inputClass} />
              </div>

              {/* === Country === */}
              <div className="mb-4">
                <label className={labelClass}>Country</label>
                <select value={countryId} onChange={(e) => setCountryId(e.target.value)} className={inputClass}>
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.country_id} value={c.country_id}>{c.country_name}</option>
                  ))}
                </select>
              </div>

              {/* === Address === */}
              <div className="mb-4">
                <label className={labelClass}>Address</label>
                <input type="text" placeholder="123 Main St, City, Country" value={address}
                  onChange={(e) => setAddress(e.target.value)} className={inputClass} />
              </div>

              {/* === Seller-Only Fields === */}
              {/* Conditionally rendered — only shown when "Selling Account" is selected */}
              {userType === "seller" && (
                <div className="mt-2 mb-4 p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Seller Information
                  </p>

                  <div>
                    <label className={labelClass}>Business Name</label>
                    <input type="text" placeholder="ABC Jewelers Pvt Ltd" value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Business Reg No / NIC</label>
                    <input type="text" placeholder="BRN123456" value={businessRegNo}
                      onChange={(e) => setBusinessRegNo(e.target.value)} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>NGJA Registration No</label>
                    <input type="text" placeholder="NGJA123456" value={ngjaRegNo}
                      onChange={(e) => setNgjaRegNo(e.target.value)} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>NGJA Certificate (PDF / Image)</label>
                    <input type="file" accept=".pdf,image/*"
                      onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3
                                 file:rounded-lg file:border-0 file:text-xs file:font-medium
                                 file:bg-[#1a6fc4] file:text-white hover:file:bg-teal-700 cursor-pointer" />
                  </div>
                </div>
              )}

              {/* === Create Account Button === */}
              <button
                type="button"
                onClick={handleRegister}
                className="w-full bg-[#1a6fc4] text-white py-2.5 rounded-lg font-semibold text-sm
                           hover:bg-[#1560ac] transition-all duration-200 shadow-sm hover:shadow-md mt-2"
              >
                Create Account →
              </button>

              {/* === Feedback Messages === */}
              {success && (
                <p className="text-green-600 text-xs text-center mt-4 bg-green-50 rounded-lg py-2 px-3">
                  {success}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-xs text-center mt-4 bg-red-50 rounded-lg py-2 px-3">
                  {error}
                </p>
              )}

              {/* === Back to Sign In === */}
              <p className="text-center text-xs text-gray-500 mt-6">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-[#1a6fc4] hover:text-blue-800 font-semibold hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <BasicFooter />
    </div>
  );
}

export default SignIn;
