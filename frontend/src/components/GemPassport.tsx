import React from 'react'
import { Shield, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import type { GemData } from '@/lib/gems/types'

const GemPassport: React.FC<GemData> = (data) => {
  return (
    <div className="bg-[#f8f7f5] border border-gray-100/80 rounded-2xl overflow-hidden">
      {/* Main Card */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          {/* Left Section */}
          <div className="flex-1 min-w-0">
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
                <p className="text-[13px] font-semibold text-gray-800 truncate" title={data.tx_hash || 'Not Minted'}>
                  {data.tx_hash || 'Not Minted'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
                  Status
                </p>
                <p className="text-[13px] font-semibold text-gray-800 capitalize">
                  {data.blockchain_status === 'none' || data.blockchain_status === 'failed' 
                    ? 'Not Processed' 
                    : data.blockchain_status}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex-shrink-0 ml-4">
            <div className="bg-white rounded-xl p-3 w-24 h-24 flex items-center justify-center border border-gray-200/60 shadow-sm">
              {data.tx_hash ? (
                <QRCodeCanvas 
                  value={`https://sepolia.etherscan.io/tx/${data.tx_hash}`} 
                  size={76} 
                  fgColor="#111827" // very dark gray (gray-900) for high contrast
                />
              ) : (
                <QrCode size={40} className="text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>      
    </div>
  )
}

export default GemPassport