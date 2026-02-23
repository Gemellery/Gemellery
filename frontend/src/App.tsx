import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import SignIn from "./pages/Signin";
import Home from "./pages/Home";
import SellerDashboard from "./pages/Dashboards/seller.dashboard";
import BuyerDashboardLayout from "./pages/Dashboards/buyer.dashboard";
import Marketplace from "./pages/Marketplace";
import ShippingForm from "./components/ShippingForm";
import ProductDetail from "./pages/ProductDetail";
import ProductSpecifications from "./components/ProductSpecifications";
import Cart from "./components/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddNewGem from "./pages/Gem/AddNewGem";
import JewelryDesigner from "./pages/JewelryDesigner/Designer";
import JewelryResults from "./pages/JewelryDesigner/Results";
import JewelryRefine from "./pages/JewelryDesigner/Refine";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerAllListings from "./pages/seller/SellerAllListings";
import AdminDashboardLayout from "./pages/Dashboards/admin.dashboard";
import ManageAdmins from "./pages/Admin/ManageAdmins";

import ProtectedRoute from "./components/ProtectedRoute";
import VerifySellers from "./pages/Admin/VerifySellers";
import VerifyGems from "./pages/Admin/VerifyGems";
import ManageUsers from "./pages/Admin/AdminUserManagement";
import SellerReviews from "./pages/Admin/SellerReviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/admin/manage-admins" element={<ManageAdmins />} /> */}

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/shipping-form" element={<ShippingForm />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/product-gallery" element={<ProductSpecifications />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/jewelry-designer" element={<JewelryDesigner />} />
        <Route path="/jewelry_designer" element={<JewelryDesigner />} />
        <Route path="/jewelry-designer/results" element={<JewelryResults />} />
        <Route path="/jewelry-designer/refine/:id" element={<JewelryRefine />} />

        {/* ================= SELLER PROTECTED ROUTES ================= */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-new-gem"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <AddNewGem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/listings"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerAllListings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/SellerSettings"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerSettings />
            </ProtectedRoute>
          }
        />

        {/* ================= BUYER PROTECTED ROUTES ================= */}
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerDashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN PROTECTED ROUTES ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verify-sellers"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <VerifySellers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-gems"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <VerifyGems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/review-moderation"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <SellerReviews />
            </ProtectedRoute>
          }
        />

        {/* Super Admin Only Route (future use) */}
        <Route
          path="/admin/manage-admins"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <ManageAdmins />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
