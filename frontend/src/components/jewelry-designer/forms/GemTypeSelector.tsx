import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_TYPES } from '../../../lib/jewelry-designer/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

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
        <div className="space-y-3" style={{ fontFamily: "'Market Sans', sans-serif" }}>
            <label className="block text-sm font-semibold text-gray-800">
                What type of gem do you have? <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className={`w-full py-6 px-4 bg-gray-50/50 backdrop-blur-sm border-gray-200 text-base focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all
                        ${errors.gemType ? 'border-red-400 focus:ring-red-200' : 'hover:border-gray-300'}
                    `} style={{ fontFamily: "'Market Sans', sans-serif" }}>
                        <SelectValue placeholder="Select gem type..." />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="bg-white/90 backdrop-blur-xl border-gray-100 shadow-xl rounded-xl">
                        {GEM_TYPES.map((type) => (
                            <SelectItem key={type} value={type} className="py-3 px-4 focus:bg-gray-50 cursor-pointer">
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <p className="text-xs text-gray-400">
                Select the primary gemstone for your design
            </p>

            {errors.gemType && (
                <p className="text-sm text-red-500">{errors.gemType.message}</p>
            )}

            {value === 'Other' && (
                <div className="mt-3">
                    <Input
                        {...register('gemTypeOther')}
                        placeholder="Enter gem type..."
                        className="w-full py-6 px-4 bg-gray-50/50 backdrop-blur-sm border-gray-200 focus-visible:ring-2 focus-visible:ring-[#D4AF37]/20 focus-visible:border-[#D4AF37] transition-all text-base placeholder:text-gray-400"
                        style={{ fontFamily: "'Market Sans', sans-serif" }}
                    />
                    {errors.gemTypeOther && (
                        <p className="text-sm text-red-500 mt-1">{errors.gemTypeOther.message}</p>
                    )}
                </div>
            )}
        </div>
    );
};
