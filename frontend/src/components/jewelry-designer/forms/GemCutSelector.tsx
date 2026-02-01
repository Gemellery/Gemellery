import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_CUTS } from '../../../lib/jewelry-designer/constants';

interface GemCutSelectorProps {
    register: UseFormRegister<GemFormValues>;
    errors: FieldErrors<GemFormValues>;
    value: string;
    onChange: (value: string) => void;
}

export const GemCutSelector: React.FC<GemCutSelectorProps> = ({
    register,
    errors,
    value,
    onChange,
}) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-white">
                What is the shape/cut of your gem? <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-5 gap-3">
                {GEM_CUTS.map((cut) => (
                    <button
                        key={cut.value}
                        type="button"
                        onClick={() => onChange(cut.value)}
                        className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 group
              ${value === cut.value
                                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                : 'border-gray-700 bg-[#1a1f35]'
                            }
            `}
                    >
                        {/* SVG Icon */}
                        <div className={`
              w-10 h-10 mx-auto mb-2
              ${value === cut.value ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-[#D4AF37]'}
            `}>
                            {getCutIcon(cut.value)}
                        </div>

                        <p className={`
              text-xs font-medium text-center
              ${value === cut.value ? 'text-white' : 'text-gray-400'}
            `}>
                            {cut.label}
                        </p>
                    </button>
                ))}
            </div>

            {/* Hidden input for form registration */}
            <input type="hidden" {...register('gemCut')} value={value} />

            <p className="text-xs text-gray-500">
                Click on a shape that matches your gemstone
            </p>

            {errors.gemCut && (
                <p className="text-sm text-red-500">{errors.gemCut.message}</p>
            )}
        </div>
    );
};

// SVG icons for each cut style
function getCutIcon(cut: string) {
    const iconProps = {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        className: 'w-full h-full',
    };

    switch (cut) {
        case 'round-brilliant':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <circle cx="24" cy="24" r="18" />
                    <circle cx="24" cy="24" r="10" />
                    <line x1="24" y1="6" x2="24" y2="14" />
                    <line x1="24" y1="34" x2="24" y2="42" />
                    <line x1="6" y1="24" x2="14" y2="24" />
                    <line x1="34" y1="24" x2="42" y2="24" />
                </svg>
            );
        case 'oval':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <ellipse cx="24" cy="24" rx="12" ry="18" />
                    <ellipse cx="24" cy="24" rx="6" ry="10" />
                </svg>
            );
        case 'cushion':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <rect x="8" y="8" width="32" height="32" rx="8" ry="8" />
                    <rect x="14" y="14" width="20" height="20" rx="4" ry="4" />
                </svg>
            );
        case 'pear':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <path d="M24 6 C12 18, 10 30, 24 42 C38 30, 36 18, 24 6" />
                    <path d="M24 14 C18 22, 17 28, 24 36 C31 28, 30 22, 24 14" />
                </svg>
            );
        case 'emerald-cut':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <polygon points="12,6 36,6 42,12 42,36 36,42 12,42 6,36 6,12" />
                    <polygon points="16,12 32,12 36,16 36,32 32,36 16,36 12,32 12,16" />
                </svg>
            );
        case 'marquise':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <ellipse cx="24" cy="24" rx="8" ry="20" />
                    <ellipse cx="24" cy="24" rx="4" ry="12" />
                </svg>
            );
        case 'asscher':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <polygon points="14,6 34,6 42,14 42,34 34,42 14,42 6,34 6,14" />
                    <polygon points="18,12 30,12 36,18 36,30 30,36 18,36 12,30 12,18" />
                </svg>
            );
        case 'princess':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <rect x="8" y="8" width="32" height="32" />
                    <rect x="14" y="14" width="20" height="20" />
                    <line x1="8" y1="8" x2="14" y2="14" />
                    <line x1="40" y1="8" x2="34" y2="14" />
                    <line x1="8" y1="40" x2="14" y2="34" />
                    <line x1="40" y1="40" x2="34" y2="34" />
                </svg>
            );
        case 'radiant':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <polygon points="12,6 36,6 42,12 42,36 36,42 12,42 6,36 6,12" />
                    <rect x="14" y="14" width="20" height="20" />
                </svg>
            );
        case 'heart':
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <path d="M24 42 L8 26 C4 20, 6 12, 14 10 C18 9, 22 11, 24 16 C26 11, 30 9, 34 10 C42 12, 44 20, 40 26 Z" />
                    <path d="M24 34 L14 24 C12 21, 13 17, 17 16 C19 15.5, 21 16.5, 24 20 C27 16.5, 29 15.5, 31 16 C35 17, 36 21, 34 24 Z" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 48 48" {...iconProps}>
                    <circle cx="24" cy="24" r="16" />
                </svg>
            );
    }
}
