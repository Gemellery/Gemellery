import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_TYPES } from '../../../lib/jewelry-designer/constants';
import { ChevronDown } from 'lucide-react';

interface GemTypeSelectorProps {
    register: UseFormRegister<GemFormValues>;
    errors: FieldErrors<GemFormValues>;
    value: string;
    onChange: (value: string) => void;
}

export const GemTypeSelector: React.FC<GemTypeSelectorProps> = ({
    register,
    errors,
    value,
    onChange,
}) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-white">
                What type of gem do you have? <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <select
                    {...register('gemType')}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
            w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer
            bg-[#1a1f35] text-white transition-all duration-200
            ${errors.gemType
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-700 hover:border-gray-600 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-30'
                        }
          `}
                >
                    <option value="" className="bg-[#1a1f35]">Select gem type...</option>
                    {GEM_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#1a1f35]">
                            {type}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <p className="text-xs text-gray-500">
                Select the primary gemstone for your design
            </p>

            {errors.gemType && (
                <p className="text-sm text-red-500">{errors.gemType.message}</p>
            )}

            {value === 'Other' && (
                <div className="mt-3">
                    <input
                        {...register('gemTypeOther')}
                        type="text"
                        placeholder="Enter gem type..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#1a1f35] text-white
              focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-30
              placeholder-gray-500"
                    />
                    {errors.gemTypeOther && (
                        <p className="text-sm text-red-500 mt-1">{errors.gemTypeOther.message}</p>
                    )}
                </div>
            )}
        </div>
    );
};
