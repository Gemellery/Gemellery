import Navbar from '@/components/Navbar'
import AdvancedFooter from '@/components/AdvancedFooter'
import ProductGallery from '../../components/ProductGallery'
import ProductInfo from '../../components/ProductInfo'
import ProductActions from '../../components/ProductActions'
import ProductSpecifications from '../../components/ProductSpecifications'
import ShippingInfo from '../../components/ShippingInfo'
import GemPassport from '../../components/GemPassport'
import ProductAIDesignStudio from '../../components/ProductAIDesignStudio'
import ExpertAdvice from '../../components/ExpertAdvice'
import Certification from '../../components/Certification'
import ReviewsRatings from '../../components/ReviewsRatings'
import { ChevronRight } from 'lucide-react'

const ProductDetail = () => {

  const handleAddToCart = (quantity: number) => {
    console.log(`Added ${quantity} items to cart`)
  }

  const handleBookViewing = () => {
    console.log('Book viewing request submitted')
  }

  const handleFavorite = (isFavorited: boolean) => {
    console.log(`Product ${isFavorited ? 'added to' : 'removed from'} favorites`)
  }

  const handleTryAIDesign = () => {
    console.log('Opening AI Design Studio')
  }

  return (

    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pb-16 pt-4 flex-1">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-700 transition-colors">Home</a>
          <ChevronRight size={14} />
          <a href="/marketplace" className="hover:text-gray-700 transition-colors">Gemstones</a>
          <ChevronRight size={14} />
          <a href="/marketplace" className="hover:text-gray-700 transition-colors">Sapphires</a>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">3.5ct Royal Blue Sapphire</span>
        </nav>

        {/* ============================================= */}
        {/* Top Section: Gallery (left) + Info (right)    */}
        {/* ============================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

          {/* LEFT COLUMN — Gallery + AI Studio */}
          <div className="space-y-6">
            <ProductGallery
              images={[
                "../public/sample_gems/alexandrite_18.jpg",
                '../public/sample_gems/aquamarine_8.jpg',
                '../public/sample_gems/solitaire.jpg',
                '../public/sample_gems/sapphire blue_6.jpg',
              ]}
              productName="3.5 Carat Vivid Royal Blue Sapphire"
            />

            {/* AI Design Studio — below gallery */}
            <ProductAIDesignStudio onTryAIDesign={handleTryAIDesign} />
          </div>

          {/* RIGHT COLUMN — Info, Actions, Shipping, GemPassport */}
          <div>
            <ProductInfo
              badge="NATURAL UNHEATED"
              rating={4.9}
              reviewCount={12}
              title="3.5 Carat Vivid Royal Blue Sapphire"
              currentPrice={12500}
              originalPrice={14200}
              discount={12}
              seller={{
                name: 'GemLanka Exports',
                verified: true,
                location: 'Ratnapura, Sri Lanka',
                memberSince: 2018
              }}
              shape="Cushion"
              dimensions="8.2 x 7.8 mm"
            />

            <ProductActions
              onAddToCart={handleAddToCart}
              onBookViewing={handleBookViewing}
              onFavorite={handleFavorite}
              showQuantitySelector={false}
            />

            <ShippingInfo />

            <GemPassport
              data={{
                tokenId: '#LK-88392-GEM',
                provenance: 'Verified Source',
                treatment: 'None (Unheated)',
                origin: 'Ratnapura, Sri Lanka',
                certificationBody: 'Gemological Institute',
                certificationDate: '2024-01-15',
                gemType: 'Natural Blue Sapphire'
              }}
            />
          </div>
        </div>

        {/* ============================================= */}
        {/* Bottom Section: Specs + Reviews / Expert + Cert */}
        {/* ============================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT — Specifications + Reviews (wider) */}
          <div className="lg:col-span-3 space-y-12">
            <ProductSpecifications
              title="Detailed Specifications"
              specifications={[
                { label: 'GEMSTONE TYPE', value: 'Natural Blue Sapphire (Corundum)' },
                { label: 'CARAT WEIGHT', value: '3.52 Carats' },
                { label: 'COLOR GRADE', value: 'Vivid Royal Blue (GIA Top Grade)' },
                { label: 'CLARITY', value: 'VVS1 (Eye Clean)' },
                { label: 'ORIGIN', value: 'Ratnapura, Sri Lanka 🇱🇰' },
                { label: 'TREATMENTS', value: 'None (Unheated)' }
              ]}
            />

            <ReviewsRatings />
          </div>

          {/* RIGHT — Expert Advice + Certification */}
          <div className="lg:col-span-2 space-y-6">
            <ExpertAdvice />
            <Certification />
          </div>
        </div>
      </div>

      {/* Footer */}
      <AdvancedFooter />
    </div>
  )
}

export default ProductDetail
