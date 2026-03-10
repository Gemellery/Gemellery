import React from 'react'

interface Specification {
  label: string
  value: string
}

interface ProductSpecificationsProps {
  title?: string
  specifications?: Specification[]
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  title = 'Detailed Specifications',
  specifications = [
    { label: 'GEMSTONE TYPE', value: 'Natural Blue Sapphire (Corundum)' },
    { label: 'CARAT WEIGHT', value: '3.52 Carats' },
    { label: 'COLOR GRADE', value: 'Vivid Royal Blue (GIA Top Grade)' },
    { label: 'CLARITY', value: 'VVS1 (Eye Clean)' },
    { label: 'ORIGIN', value: 'Ratnapura, Sri Lanka' },
    { label: 'TREATMENTS', value: 'None (Unheated)' }
  ]
}) => {
  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        {title}
      </h2>

      {/* Specifications Grid */}
      <div className="border border-gray-100 rounded-2xl p-5 bg-white">
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {specifications.map((spec, index) => (
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