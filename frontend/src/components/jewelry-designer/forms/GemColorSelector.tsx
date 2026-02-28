import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_COLORS } from '../../../lib/jewelry-designer/constants';
import { ChevronDown } from 'lucide-react';

interface GemColorSelectorProps {
    register: UseFormRegister<GemFormValues>;
    errors: FieldErrors<GemFormValues>;
    value: string;
    onChange: (value: string) => void;
}

export const GemColorSelector: React.FC<GemColorSelectorProps> = ({
    register,
    errors,
    value,
    onChange,
}) => {
    // Get hex color for a selected value
    const getColorHex = (colorValue: string): string => {
        const color = GEM_COLORS.find(c => c.value === colorValue);
        return color?.hex || '#CCCCCC';
    };

    return (
        <div className="space-y-3" style={{ fontFamily: "'Market Sans', sans-serif" }}>
            <label className="block text-sm font-semibold text-gray-800">
                What color is your gem? <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                {/* Color swatch preview */}
                {value && (
                    <div
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{
                            background: getColorHex(value),
                            boxShadow: value === 'colorless' ? 'inset 0 0 0 1px #ccc' : 'none',
                        }}
                    />
                )}

                <select
                    {...register('gemColor')}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
            w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer
            bg-gray-50 text-gray-900 transition-all duration-200
            ${value ? 'pl-12' : 'pl-4'}
            ${errors.gemColor
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-gray-300 hover:border-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
                        }
          `}
                    style={{ fontFamily: "'Market Sans', sans-serif" }}
                >
                    <option value="" className="bg-white">Select color...</option>
                    {GEM_COLORS.map((color) => (
                        <option key={color.value} value={color.value} className="bg-white">
                            {color.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {errors.gemColor && (
                <p className="text-sm text-red-500">{errors.gemColor.message}</p>
            )}
        </div>
    );
};
