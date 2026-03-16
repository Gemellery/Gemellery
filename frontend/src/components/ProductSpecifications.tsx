import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchGemById } from '@/lib/gems/api'
import type { GemData } from '@/lib/gems/types'

const ProductSpecifications: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<GemData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGemData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await fetchGemById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch gem details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGemData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Detailed Specifications</h2>
        <div className="h-40 bg-gray-100 rounded-2xl w-full"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const rawOrigin = product.origin || ''
  const rawRegion = product.mining_region ? `(${product.mining_region})` : ''
  const originValue = `${rawOrigin} ${rawRegion}`.trim() || 'N/A'

  const specifications = [
    { label: 'GEMSTONE TYPE', value: product.gem_name },
    { label: 'CARAT WEIGHT', value: product.carat ? `${product.carat} Carats` : '' },
    { label: 'COLOR GRADE', value: product.color || 'N/A' },
    { label: 'CLARITY', value: product.clarity || 'N/A' },
    { label: 'CUT', value: product.cut || 'N/A' },
    { label: 'ORIGIN', value: originValue },
    { label: 'TREATMENTS', value: product.gem_type || 'N/A' }
  ]

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        Detailed Specifications
      </h2>

      {/* Specifications Grid */}
      <div className="border border-gray-100 rounded-2xl p-5 bg-white">
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {specifications
            .filter(spec => spec.value && spec.value !== 'N/A' && spec.value.trim() !== '')
            .map((spec, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-[10px] font-bold text-red-500 tracking-wider mb-1 uppercase">
                {spec.label}
              </p>
              <p className="text-[15px] font-medium text-gray-900">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductSpecifications