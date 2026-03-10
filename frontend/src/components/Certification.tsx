import React from 'react'
import { CheckCircle, FileText, Award } from 'lucide-react'

interface CertificationItem {
  icon: React.ReactNode
  title: string
  subtitle: string
  verified?: boolean
}

interface CertificationProps {
  certifications?: CertificationItem[]
}

const Certification: React.FC<CertificationProps> = ({
  certifications = [
    {
      icon: <FileText size={16} className="text-gray-600" />,
      title: 'GIA Report',
      subtitle: 'Included',
      verified: true
    }
  ]
}) => {
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default Certification
