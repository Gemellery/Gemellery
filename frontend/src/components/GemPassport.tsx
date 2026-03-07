import React, { useState } from 'react'
import { Shield, QrCode, ChevronDown, ChevronUp } from 'lucide-react'

interface CertificateData {
  tokenId: string
  provenance: string
  treatment?: string
  origin?: string
  certificationBody?: string
  certificationDate?: string
  gemType?: string
}

interface GemPassportProps {
  data?: CertificateData
  onViewDetails?: () => void
}

const GemPassport: React.FC<GemPassportProps> = ({
  data = {
    tokenId: '#LK-88392-GEM',
    provenance: 'Verified Source',
    treatment: 'None (Unheated)',
    origin: 'Ratnapura, Sri Lanka',
    certificationBody: 'Gemological Institute',
    certificationDate: '2024-01-15',
    gemType: 'Natural Blue Sapphire'
  },
  
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Main Card */}
      <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-start justify-between mb-6">
          {/* Left Section */}
          <div className="flex-1">
            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              <Shield size={24} className="text-teal-600" />
              <h3 className="text-xl font-bold text-gray-900">Gem Passport</h3>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-gray-600 mb-6">
              Immutable Digital Certificate
            </p>

            {/* Certificate Details */}
            <div className="space-y-4">
              {/* Token ID */}
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                  Token ID
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {data.tokenId}
                </p>
              </div>

              {/* Provenance */}
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                  Provenance
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {data.provenance}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex-shrink-0 ml-6">
            <div className="bg-gray-200 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
              <QrCode size={64} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={toggleExpand}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors duration-200 mt-6 pt-6 border-t border-gray-200"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={18} />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown size={18} />
              View Full Certificate
            </>
          )}
        </button>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-8 bg-gray-50 space-y-6">
          {/* Treatment Details */}
          {data.treatment && (
            <div className="border-b border-gray-200 pb-6">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Treatment Information
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                    Treatment
                  </p>
                  <p className="text-sm text-gray-900">{data.treatment}</p>
                </div>
              </div>
            </div>
          )}

          {/* Origin & Verification */}
          {(data.origin || data.certificationBody) && (
            <div className="border-b border-gray-200 pb-6">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Origin & Verification
              </h4>
              <div className="grid grid-cols-2 gap-6">
                {data.origin && (
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                      Origin
                    </p>
                    <p className="text-sm text-gray-900">{data.origin}</p>
                  </div>
                )}
                {data.certificationBody && (
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                      Certification Body
                    </p>
                    <p className="text-sm text-gray-900">{data.certificationBody}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(data.gemType || data.certificationDate) && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Certificate Details
              </h4>
              <div className="grid grid-cols-2 gap-6">
                {data.gemType && (
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                      Gem Type
                    </p>
                    <p className="text-sm text-gray-900">{data.gemType}</p>
                  </div>
                )}
                {data.certificationDate && (
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                      Certification Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(data.certificationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification Badge */}
          <div className="bg-white rounded-lg p-4 flex items-start gap-3 border border-green-200">
            <div className="text-green-600 pt-1">
              <Shield size={20} className="fill-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                Verified Certificate
              </p>
              <p className="text-xs text-gray-600 mt-1">
                This gemstone has been verified and certified as authentic. The blockchain-verified certificate ensures complete transparency and immutability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GemPassport