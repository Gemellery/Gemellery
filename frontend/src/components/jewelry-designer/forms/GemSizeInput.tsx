import React, { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_SIZES } from '../../../lib/jewelry-designer/constants';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GemSizeInputProps {
    register: UseFormRegister<GemFormValues>;
    errors: FieldErrors<GemFormValues>;
    sizeMode: 'simple' | 'advanced';
    selectedSize: string;
    onSizeModeChange: (mode: 'simple' | 'advanced') => void;
    onSizeChange: (size: string) => void;
}

export const GemSizeInput: React.FC<GemSizeInputProps> = ({
    register,
    errors,
    sizeMode,
    selectedSize,
    onSizeModeChange,
    onSizeChange,
}) => {
    const [showAdvanced, setShowAdvanced] = useState(sizeMode === 'advanced');

    const toggleAdvanced = () => {
        const newMode = showAdvanced ? 'simple' : 'advanced';
        setShowAdvanced(!showAdvanced);
        onSizeModeChange(newMode);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-white">
                What size is your gem? <span className="text-red-500">*</span>
            </label>

            {/* Simple Mode - Radio buttons */}
            {!showAdvanced && (
                <div className="space-y-2">
                    {GEM_SIZES.map((size) => (
                        <label
                            key={size.value}
                            className={`
                flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedSize === size.value
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                    : 'border-gray-700 bg-[#1a1f35] hover:border-gray-600'
                                }
              `}
                        >
                            <input
                                type="radio"
                                {...register('gemSizeSimple')}
                                value={size.value}
                                checked={selectedSize === size.value}
                                onChange={() => onSizeChange(size.value)}
                                className="mt-1 w-4 h-4 text-[#D4AF37] bg-[#1a1f35] border-gray-600 focus:ring-[#D4AF37] focus:ring-offset-0"
                            />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{size.label}</p>
                                <p className="text-xs text-gray-500">{size.description}</p>
                            </div>
                        </label>
                    ))}

                    {errors.gemSizeSimple && (
                        <p className="text-sm text-red-500">{errors.gemSizeSimple.message}</p>
                    )}
                </div>
            )}

            {/* Advanced Mode - Dimension inputs */}
            {showAdvanced && (
                <div className="space-y-4 p-4 rounded-xl border-2 border-gray-700 bg-[#1a1f35]">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Length (mm)</label>
                            <input
                                type="number"
                                step="0.1"
                                {...register('gemSizeLengthMm', { valueAsNumber: true })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#0d1121] text-white
                  focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                placeholder="0.0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Width (mm)</label>
                            <input
                                type="number"
                                step="0.1"
                                {...register('gemSizeWidthMm', { valueAsNumber: true })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#0d1121] text-white
                  focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                placeholder="0.0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Height (mm)</label>
                            <input
                                type="number"
                                step="0.1"
                                {...register('gemSizeHeightMm', { valueAsNumber: true })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#0d1121] text-white
                  focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                placeholder="0.0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Carat Weight (optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('gemSizeCarat', { valueAsNumber: true })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#0d1121] text-white
                focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                            placeholder="0.00"
                        />
                    </div>

                    {errors.gemSizeLengthMm && (
                        <p className="text-sm text-red-500">{errors.gemSizeLengthMm.message}</p>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                type="button"
                onClick={toggleAdvanced}
                className="flex items-center text-sm text-[#D4AF37] hover:text-[#e5c349] font-medium"
            >
                {showAdvanced ? (
                    <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Use simple size selection
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        I know exact dimensions
                    </>
                )}
            </button>
        </div>
    );
};
