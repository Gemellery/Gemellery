import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import SignIn from './pages/Signin';
import Home from './pages/Home';
import SellerDashboard from './pages/Dashboards/seller.dashboard';
import BuyerDashboardLayout from './pages/Dashboards/buyer.dashboard';
import Marketplace from './pages/Marketplace';
import ShippingForm from './components/ShippingForm';
import ProductDetail from './pages/ProductDetail';
import ProductSpecifications from './components/ProductSpecifications';
import Cart from './components/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddNewGem from "./pages/Gem/AddNewGem";
import JewelryDesigner from "./pages/JewelryDesigner/Designer";
import JewelryResults from "./pages/JewelryDesigner/Results";
import JewelryRefine from "./pages/JewelryDesigner/Refine";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerAllListings from "./pages/seller/SellerAllListings";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardLayout from './pages/Dashboards/admin.dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
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

        {/* Seller Protected Routes */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-new-gem"
          element={
            <ProtectedRoute allowedRole="seller">
              <AddNewGem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/listings"
          element={
            <ProtectedRoute allowedRole="seller">
              <SellerAllListings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/SellerSettings"
          element={
            <ProtectedRoute allowedRole="seller">
              <SellerSettings />
            </ProtectedRoute>
          }
        />

        {/* Buyer Protected Routes */}
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute allowedRole="buyer">
              <BuyerDashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        {/* <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <BuyerDashboardLayout />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/admin/dashboard" element={<AdminDashboardLayout />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
