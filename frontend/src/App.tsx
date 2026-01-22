import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import SignIn from './pages/Signin'
import Home from './pages/Home'
import SignUp from './pages/Signup'
import SellerDashboard from './pages/Dashboards/seller.dashboard'
import BuyerDashboardLayout from './pages/Dashboards/buyer.dashboard'
import Marketplace from './pages/Marketplace'
import ShippingForm from './components/ShippingForm'
import ProductSpecifications from './components/ProductSpecifications'
import Cart from './components/Cart'
import About from './pages/About'
import Contact from './components/ContactFormPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboardLayout />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/shipping-form" element={<ShippingForm />} />
          <Route path="/product-gallery" element={<ProductSpecifications />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          
          <Route path="/contact" element={<Contact />} />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
