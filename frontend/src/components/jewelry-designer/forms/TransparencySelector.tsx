import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_TRANSPARENCY } from '../../../lib/jewelry-designer/constants';
import { Eye, EyeOff, Circle } from 'lucide-react';

interface TransparencySelectorProps {
    register: UseFormRegister<GemFormValues>;
    errors: FieldErrors<GemFormValues>;
    value: string;
    onChange: (value: string) => void;
}

export const TransparencySelector: React.FC<TransparencySelectorProps> = ({
    register,
    errors,
    value,
    onChange,
}) => {
    // Get icon for each transparency level
    const getIcon = (transparencyValue: string) => {
        switch (transparencyValue) {
            case 'transparent':
                return <Eye className="w-6 h-6" />;
            case 'semi-transparent':
                return <Circle className="w-6 h-6" />;
            case 'opaque':
                return <EyeOff className="w-6 h-6" />;
            default:
                return <Circle className="w-6 h-6" />;
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-white">
                How see-through is your gem? <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
                {GEM_TRANSPARENCY.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`
              p-4 rounded-xl border-2 transition-all duration-200 text-center
              hover:border-[#D4AF37] hover:bg-[#D4AF37]/5
              ${value === option.value
                                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                : 'border-gray-700 bg-[#1a1f35]'
                            }
            `}
                    >
                        {/* Icon */}
                        <div className={`
              mx-auto mb-2
              ${value === option.value ? 'text-[#D4AF37]' : 'text-gray-400'}
            `}>
                            {getIcon(option.value)}
                        </div>

                        <p className={`
              text-sm font-medium
              ${value === option.value ? 'text-white' : 'text-gray-400'}
            `}>
                            {option.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {option.description}
                        </p>
                    </button>
                ))}
            </div>

            {/* Hidden input for form registration */}
            <input type="hidden" {...register('gemTransparency')} value={value} />

            <p className="text-xs text-gray-500">
                This helps us render light and reflections accurately
            </p>

            {errors.gemTransparency && (
                <p className="text-sm text-red-500">{errors.gemTransparency.message}</p>
            )}
        </div>
    );
};
