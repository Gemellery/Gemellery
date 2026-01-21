import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import SignIn from './pages/Signin'
import Home from './pages/Home'
import SignUp from './pages/Signup'
import SellerDashboard from './pages/Dashboards/seller.dashboard'
import BuyerDashboardLayout from './pages/Dashboards/buyer.dashboard'
import FilterSection from './components/FilterSection'

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
          <Route path="/gem" element={<FilterSection />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
