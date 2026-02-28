import Navbar from '@/components/Navbar'
import ProductGallery from '../../components/ProductGallery'
import ProductInfo from '../../components/ProductInfo'
import ProductActions from '../../components/ProductActions'
import ProductSpecifications from '../../components/ProductSpecifications'
import ShippingInfo from '../../components/ShippingInfo'
import GemPassport from '../../components/GemPassport'
import ProductAIDesignStudio from '../../components/ProductAIDesignStudio'

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

    <div className="min-h-screen bg-gray-100">
        <Navbar />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16 pt-8">
        {/* Product Gallery and Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Gallery */}
          <div>
            <ProductGallery
              images={[
                "../public/sample_gems/alexandrite_18.jpg",
                '../public/sample_gems/aquamarine_8.jpg',
                '../public/sample_gems/solitaire.jpg',
                '../public/sample_gems/sapphire blue_6.jpg',
              ]}
              productName="3.5 Carat Vivid Royal Blue Sapphire"
            />
          </div>

          {/* Right Column - Info and Actions */}
          <div className="space-y-6">
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
                location: 'Anuradhapura, Sri Lanka',
                memberSince: 2018
              }}
              shape="Cushion"
              dimensions="8.2 x 7.8 mm"
            />

            {/* Product Actions */}
            <ProductActions
              onAddToCart={handleAddToCart}
              onBookViewing={handleBookViewing}
              onFavorite={handleFavorite}
              showQuantitySelector={true}
            />

            {/* Shipping Info */}
            <ShippingInfo />
          </div>
        </div>

        {/* AI Design Studio Section */}
        <div className="mb-12">
          <ProductAIDesignStudio onTryAIDesign={handleTryAIDesign} />
        </div>

        {/* Product Specifications */}
        <div className="mb-12">
          <ProductSpecifications
            title="Detailed Specifications"
            specifications={[
              {
                label: 'GEMSTONE TYPE',
                value: 'Natural Blue Sapphire (Corundum)'
              },
              {
                label: 'CARAT WEIGHT',
                value: '3.52 Carats'
              },
              {
                label: 'COLOR GRADE',
                value: 'Vivid Royal Blue (GIA Top Grade)'
              },
              {
                label: 'CLARITY',
                value: 'VVS1 (Eye Clean)'
              },
              {
                label: 'ORIGIN',
                value: 'Ratnapura, Sri Lanka'
              },
              {
                label: 'TREATMENTS',
                value: 'None (Unheated)'
              }
            ]}
          />
        </div>

        {/* Gem Passport */}
        <div className="mb-12">
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
    </div>
  )
}

export default ProductDetail
