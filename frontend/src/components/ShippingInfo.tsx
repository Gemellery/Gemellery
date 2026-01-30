import React from 'react'
import { Truck, Shield, Clock } from 'lucide-react'

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
      icon: <Truck size={24} className="text-red-500 flex-shrink-0" />,
      title: 'Free insured global shipping',
      subtitle: 'via FedEx Priority'
    },
    {
      icon: <Shield size={24} className="text-red-500 flex-shrink-0" />,
      title: '30-Day Money Back Guarantee',
      subtitle: 'if not as described'
    },
    {
      icon: <Clock size={24} className="text-red-500 flex-shrink-0" />,
      title: 'Fast Delivery',
      subtitle: 'Usually arrives within 5-7 business days'
    }
  ]
}) => {
  return (
    <div className="bg-white p-8 rounded-lg space-y-6">
      {/* Shipping Benefits List */}
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-start gap-4">
          {/* Icon */}
          <div className="pt-1">
            {benefit.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {benefit.title}
              {benefit.subtitle && (
                <span className="text-red-500 ml-2">{benefit.subtitle}</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShippingInfo