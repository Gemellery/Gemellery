import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
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
import { FileText } from 'lucide-react'
import { fetchGemById } from '@/lib/gems/api'
import type { GemData } from '@/lib/gems/types'
import { fetchSellerProfile } from '@/services/sellerService'
import type { SellerProfileResponse } from '@/types/seller.types'

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<GemData | null>(null)
  const [sellerProfile, setSellerProfile] = useState<SellerProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGemData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchGemById(id);
        setProduct(data);
        
        if (data.seller_id) {
          try {
            const profile = await fetchSellerProfile(data.seller_id.toString());
            setSellerProfile(profile);
          } catch (profileErr) {
            console.error('Failed to fetch seller profile:', profileErr);
          }
        }
      } catch (err) {
        console.error('Failed to fetch gem details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadGemData();
  }, [id]);

  const ratingBreakdown = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    if (sellerProfile?.reviews) {
      sellerProfile.reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) {
          dist[r.rating as keyof typeof dist] = (dist[r.rating as keyof typeof dist] || 0) + 1
        }
      })
    }
    return [5, 4, 3, 2, 1].map(stars => ({ stars, count: dist[stars as keyof typeof dist] }))
  }, [sellerProfile?.reviews]);

  const handleBookViewing = () => {
    console.log('Book viewing request submitted')
  }

  const handleTryAIDesign = () => {
    console.log('Opening AI Design Studio')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-serif text-slate-800 mb-4">Product Not Found</h2>
          <p className="text-slate-600 mb-8">{error || "The gemstone you're looking for doesn't exist or is currently unavailable."}</p>
          <a href="/marketplace" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-700 hover:bg-emerald-800 transition-colors">
            Return to Marketplace
          </a>
        </div>
        <AdvancedFooter />
      </div>
    );
  }

  // Format images array ensuring proper URL paths
  const displayImages = product.images?.length > 0 
    ? product.images.map((img: string) => img.startsWith('/') ? img : `/uploads/${img}`)
    : ['/placeholder-gem.jpg'];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-16 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Gallery + AI Studio */}
          <div className="space-y-6">
            <ProductGallery
              images={displayImages}
              productName={product.gem_name}
            />

            {/* AI Design Studio */}
            <ProductAIDesignStudio onTryAIDesign={handleTryAIDesign} />
          </div>

          {/* Info, Actions, Shipping, Gem Passport */}
          <div className="space-y-8 lg:pl-4">
            {/* Product Info */}
            <ProductInfo product={product} />

            {/* Gem Passport */}
            <div className="mt-15">
              <GemPassport {...product} />
            </div>

            {/* Product Actions */}
            <ProductActions
              gemId={product.gem_id}
              onBookViewing={handleBookViewing}
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
            <ProductSpecifications/>
          </div>

          {/* Certification */}
          <div className="lg:col-span-2 space-y-8">
            <Certification 
              certifications={product.ngja_certificate_no ? [
                {
                  icon: <FileText size={16} className="text-gray-600" />,
                  title: `NGJA Report: ${product.ngja_certificate_no}`,
                  subtitle: product.ngja_certificate_url ? 'Digital Copy Available' : 'Physical Copy Included',
                  verified: true,
                  certificateUrl: product.ngja_certificate_url
                }
              ] : []} 
            />
          </div>
        </div>

        <div className="border-t border-gray-100 mb-10" />

        {/* ===== Reviews + Rating Summary ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-3 space-y-8">
            <ReviewsRatings
              reviews={sellerProfile?.reviews || []}
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <RatingSummary 
              averageRating={sellerProfile?.averageRating || 0}
              totalRatings={sellerProfile?.totalReviews || 0}
              breakdown={ratingBreakdown}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 mb-12"></div>


        {/* ===== Seller Other Listings (full-width horizontal scroll) ===== */}
        <div className="mb-12">
          <SellerOtherListings
            sellerName={product.seller_name || 'Seller'}
            sellerLocation={product.mining_region || product.origin || 'Sri Lanka'}
            totalListings={sellerProfile?.gems?.length || 0}
          />
        </div>

      </div>

      <AdvancedFooter />
    </div>
  )
}

export default ProductDetail
