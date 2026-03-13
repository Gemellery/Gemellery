import React, { useState } from 'react'
import { FileText, X } from 'lucide-react'
import { API_CONFIG } from '@/lib/api.config'

interface CertificationItem {
  icon: React.ReactNode
  title: string
  subtitle: string
  verified?: boolean
  certificateUrl?: string | null
}

interface CertificationProps {
  certifications?: CertificationItem[]
}

const Certification: React.FC<CertificationProps> = ({
  certifications = []
}) => {
  const [selectedCert, setSelectedCert] = useState<string | null>(null)

  if (!certifications || certifications.length === 0) return null

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-5">Certification</h3>

      <div className="space-y-2.5">
        {certifications.map((cert, index) => (
          <div key={index} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
            {/* Icon */}
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              {cert.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900">{cert.title}</p>
              <p className="text-[11px] text-gray-400">{cert.subtitle}</p>
            </div>      

            {/* Action */}
            {cert.certificateUrl && (
              <button 
                onClick={() => setSelectedCert(cert.certificateUrl!)}
                className="text-[12px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                View Certificate
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" />
                Certificate Viewer
              </h3>
              <button 
                onClick={() => setSelectedCert(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-auto flex justify-center items-center bg-gray-50/50 min-h-[60vh] relative">
              {selectedCert.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={selectedCert.startsWith('http') ? selectedCert : `${API_CONFIG.BASE_URL}/uploads/gem_certificates/${selectedCert}`} 
                  className="w-full h-[70vh] rounded-xl shadow-sm border border-gray-200 bg-white" 
                  title="Certificate PDF" 
                />
              ) : (
                <img 
                  src={selectedCert.startsWith('http') ? selectedCert : `${API_CONFIG.BASE_URL}/uploads/gem_certificates/${selectedCert}`} 
                  alt="Gemstone Certificate" 
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-sm border border-gray-200 bg-white" 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Certification
