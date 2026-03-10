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
    provenance: 'Verified Source'
  },
}) => {
  return (
    <div className="bg-[#f8f7f5] border border-gray-100/80 rounded-2xl overflow-hidden">
      {/* Main Card */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          {/* Left Section */}
          <div className="flex-1">
            {/* Title Row */}
            <div className="flex items-center gap-2 mb-0.5">
              <Shield size={16} className="text-teal-600" />
              <h3 className="text-sm font-bold text-gray-900">Gem Passport</h3>
            </div>
            <p className="text-[11px] text-gray-400 mb-3 ml-6">
              Immutable Digital Certificate
            </p>

            {/* Certificate Details */}
            <div className="space-y-2.5 ml-6">
              <div>
                <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
                  Token ID
                </p>
                <p className="text-[13px] font-semibold text-gray-800">
                  {data.tokenId}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
                  Provenance
                </p>
                <p className="text-[13px] font-semibold text-gray-800">
                  {data.provenance}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex-shrink-0 ml-4">
            <div className="bg-white rounded-xl p-2.5 w-14 h-14 flex items-center justify-center border border-gray-200/60 shadow-sm">
              <QrCode size={34} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>      
    </div>
  )
}

export default GemPassport