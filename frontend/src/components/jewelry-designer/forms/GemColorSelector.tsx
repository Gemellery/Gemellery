import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_COLORS } from '../../../lib/jewelry-designer/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    return (
        <div className="space-y-3" style={{ fontFamily: "'Market Sans', sans-serif" }}>
            <label className="block text-sm font-semibold text-gray-800">
                What color is your gem? <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className={`w-full py-6 px-4 bg-white/50 backdrop-blur-sm border-gray-200 text-base focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all
                        ${errors.gemColor ? 'border-red-400 focus:ring-red-200' : 'hover:border-gray-300'}
                    `} style={{ fontFamily: "'Market Sans', sans-serif" }}>
                        <SelectValue placeholder="Select color..." />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="bg-white/95 backdrop-blur-xl border-gray-100 shadow-xl rounded-xl">
                        {GEM_COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value} className="py-3 px-4 focus:bg-gray-50 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-4 h-4 rounded-full border border-gray-200"
                                        style={{ background: color.hex, boxShadow: color.value === 'colorless' ? 'inset 0 0 0 1px #ccc' : 'none' }}
                                    />
                                    {color.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Hidden hook form registration constraint */}
            <input type="hidden" {...register('gemColor')} value={value} />

            {errors.gemColor && (
                <p className="text-sm text-red-500">{errors.gemColor.message}</p>
            )}
        </div>
    );
};
