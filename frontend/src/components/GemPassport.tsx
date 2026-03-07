import React from 'react'
import { Shield, QrCode } from 'lucide-react'

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
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        {/* Left Section */}
        <div className="flex-1">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">Gem Passport</h3>
          </div>

          {/* Subtitle */}
          <p className="text-xs text-gray-500 mb-5 ml-7">
            Immutable Digital Certificate
          </p>

          {/* Details */}
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Token ID
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {data.tokenId}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Provenance
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {data.provenance}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex-shrink-0 ml-4">
          <div className="bg-gray-100 rounded-xl p-3 w-16 h-16 flex items-center justify-center">
            <QrCode size={40} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GemPassport