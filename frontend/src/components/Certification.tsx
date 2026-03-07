import React from 'react'
import { CheckCircle, Info } from 'lucide-react'

interface CertificationItem {
  label: string
  status: string
  type: 'included' | 'on-request'
}

interface CertificationProps {
  items?: CertificationItem[]
}

const Certification: React.FC<CertificationProps> = ({
  items = [
    { label: 'GIA Report', status: 'Included', type: 'included' },
    { label: 'Third-party Appraisal', status: 'On Request', type: 'on-request' }
  ]
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Certification
      </h3>

      {/* Certification Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.type === 'included' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                {item.type === 'included' ? (
                  <span className="text-base font-bold text-gray-700">GIA</span>
                ) : (
                  <CheckCircle size={18} className="text-blue-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.status}</p>
              </div>
            </div>

            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
              item.type === 'included' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {item.type === 'included' ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <Info size={16} className="text-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Certification
