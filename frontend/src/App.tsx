import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import SignIn from './pages/Signin'
import Home from './pages/Home'
// import SignUp from './pages/Signup'
import SellerDashboard from './pages/Dashboards/seller.dashboard'
import BuyerDashboardLayout from './pages/Dashboards/buyer.dashboard'
import Marketplace from './pages/Marketplace'
import ShippingForm from './components/ShippingForm'
import ProductDetail from './pages/ProductDetail'
import ProductSpecifications from './components/ProductSpecifications'
import Cart from './components/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddNewGem from "./pages/Gem/AddNewGem";
import JewelryDesigner from "./pages/JewelryDesigner/Designer";
import JewelryResults from "./pages/JewelryDesigner/Results";
import JewelryRefine from "./pages/JewelryDesigner/Refine";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerAllListings from "./pages/seller/SellerAllListings";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboardLayout />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/shipping-form" element={<ShippingForm />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/product-gallery" element={<ProductSpecifications />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/add-new-gem" element={<AddNewGem />} />
          <Route path="/seller/listings" element={<SellerAllListings />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* AI Jewelry Designer */}
          <Route path="/jewelry-designer" element={<JewelryDesigner />} />
          <Route path="/jewelry_designer" element={<JewelryDesigner />} />
          <Route path="/jewelry-designer/results" element={<JewelryResults />} />
          <Route path="/jewelry-designer/refine/:id" element={<JewelryRefine />} />
          <Route path="/seller/SellerSettings" element={<SellerSettings />} />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App

