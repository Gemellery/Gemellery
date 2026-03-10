import Navbar from '@/components/Navbar'
import AdvancedFooter from '@/components/AdvancedFooter'
import ProductGallery from '../../components/ProductGallery'
import ProductInfo from '../../components/ProductInfo'
import ProductActions from '../../components/ProductActions'
import ProductSpecifications from '../../components/ProductSpecifications'
import ShippingInfo from '../../components/ShippingInfo'
import GemPassport from '../../components/GemPassport'
import ProductAIDesignStudio from '../../components/ProductAIDesignStudio'
import ReviewsRatings from '../../components/ReviewsRatings'
import Certification from '../../components/Certification'
import RatingSummary from '../../components/RatingSummary'
import SellerOtherListings from '../../components/SellerOtherListings'
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
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-16 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Gallery + AI Studio */}
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

            {/* AI Design Studio */}
            <ProductAIDesignStudio onTryAIDesign={handleTryAIDesign} />
          </div>

          {/* Info, Actions, Shipping, Gem Passport */}
          <div className="space-y-8 lg:pl-4">
            {/* Product Info */}
            <ProductInfo
              badge="NATURAL UNHEATED"
              rating={4.9}
              reviewCount={12}
              title="3.5 Carat Vivid Royal Blue Sapphire"
              sku="SKU-2024-001"
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

            {/* Gem Passport */}
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

            {/* Product Actions */}
            <ProductActions
              onAddToCart={handleAddToCart}
              onBookViewing={handleBookViewing}
              onFavorite={handleFavorite}
              showQuantitySelector={false}
            />

            {/* Shipping Info */}
            <ShippingInfo />

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-12"></div>

        {/* ===== Details + Certification ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12">
          {/* Specifications */}
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
          </div>

          {/* Certification */}
          <div className="lg:col-span-2 space-y-8">
            <Certification />
          </div>
        </div>

        {/* ===== Seller Other Listings (full-width horizontal scroll) ===== */}
        <div className="mb-12">
          <div className="border-t border-gray-100 mb-10" />
          <SellerOtherListings
            sellerName="GemLanka Exports"
            sellerLocation="Ratnapura, Sri Lanka"
            totalListings={48}
          />
        </div>

        {/* ===== Reviews + Rating Summary ===== */}
        <div className="border-t border-gray-100 mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <ReviewsRatings />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <RatingSummary />
          </div>
        </div>
      </div>

      <AdvancedFooter />
    </div>
  )
}

export default ProductDetail
