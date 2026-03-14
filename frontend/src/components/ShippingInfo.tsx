import React from 'react'
import { Truck, Shield } from 'lucide-react'

interface ShippingBenefit {
  icon: React.ReactNode
  title: string
  subtitle?: string
}

interface ShippingInfoProps {
  benefits?: ShippingBenefit[]
}

const ShippingInfo: React.FC<ShippingInfoProps> = ({
  benefits = [
    {
      icon: <Truck size={16} className="text-red-500 flex-shrink-0" />,
      title: 'Free insured global shipping',
      subtitle: 'via FedEx Priority'
    },
    {
      icon: <Shield size={16} className="text-red-500 flex-shrink-0" />,
      title: '30-Day Money Back Guarantee',
      subtitle: 'if not as described'
    }
  ]
}) => {
  return (
    <div className="space-y-2">
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-center gap-2.5">
          {benefit.icon}
          <p className="text-[13px] text-gray-600">
            <span className="font-semibold text-gray-800">{benefit.title}</span>
            {benefit.subtitle && (
              <span className="text-red-500 ml-1">{benefit.subtitle}</span>
            )}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ShippingInfo