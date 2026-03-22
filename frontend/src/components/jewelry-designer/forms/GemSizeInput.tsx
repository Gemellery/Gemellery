import React, { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_SIZES } from '../../../lib/jewelry-designer/constants';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        <div className="space-y-3" style={{ fontFamily: "'Market Sans', sans-serif" }}>
            <Label className="block text-sm font-semibold text-gray-800">
                What size is your gem? <span className="text-red-500">*</span>
            </Label>

            {/* Simple Mode - Radio buttons */}
            {!showAdvanced && (
                <div className="space-y-2">
                    <RadioGroup value={selectedSize} onValueChange={onSizeChange} className="grid grid-cols-1 gap-3">
                        {GEM_SIZES.map((size) => (
                            <Label
                                key={size.value}
                                className={`
                                    flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50/50
                                    ${selectedSize === size.value
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm shadow-[#D4AF37]/10'
                                        : 'border-gray-100 bg-white/50 backdrop-blur-sm hover:border-gray-200'
                                    }
                                `}
                            >
                                <RadioGroupItem value={size.value} className="mt-0.5 text-[#D4AF37] border-gray-300 focus-visible:ring-[#D4AF37]" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 leading-none mb-1.5">{size.label}</p>
                                    <p className="text-xs text-gray-500 leading-tight font-normal">{size.description}</p>
                                </div>
                            </Label>
                        ))}
                    </RadioGroup>

                    {/* Hidden input to ensure react-hook-form grabs the value and triggers validation if unmodified */}
                    <input type="hidden" {...register('gemSizeSimple')} value={selectedSize} />

                    {errors.gemSizeSimple && (
                        <p className="text-sm text-red-500">{errors.gemSizeSimple.message}</p>
                    )}
                </div>
            )}

            {/* Advanced Mode - Dimension inputs */}
            {showAdvanced && (
                <div className="space-y-4 p-5 rounded-xl border-2 border-gray-100 bg-white/40 backdrop-blur-md shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <Label className="block text-xs text-gray-500 mb-2">Length (mm)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register('gemSizeLengthMm', { valueAsNumber: true })}
                                className="bg-white/80 focus-visible:ring-[#D4AF37]/50 focus-visible:border-[#D4AF37] py-5"
                                placeholder="0.0"
                            />
                        </div>
                        <div>
                            <Label className="block text-xs text-gray-500 mb-2">Width (mm)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register('gemSizeWidthMm', { valueAsNumber: true })}
                                className="bg-white/80 focus-visible:ring-[#D4AF37]/50 focus-visible:border-[#D4AF37] py-5"
                                placeholder="0.0"
                            />
                        </div>
                        <div>
                            <Label className="block text-xs text-gray-500 mb-2">Height (mm)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register('gemSizeHeightMm', { valueAsNumber: true })}
                                className="bg-white/80 focus-visible:ring-[#D4AF37]/50 focus-visible:border-[#D4AF37] py-5"
                                placeholder="0.0"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Label className="block text-xs text-gray-500 mb-2">Carat Weight (optional)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            {...register('gemSizeCarat', { valueAsNumber: true })}
                            className="bg-white/80 focus-visible:ring-[#D4AF37]/50 focus-visible:border-[#D4AF37] py-5"
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
                className="flex items-center text-sm text-[#B8860B] hover:text-[#D4AF37] font-semibold"
                style={{ fontFamily: "'Market Sans', sans-serif" }}
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
