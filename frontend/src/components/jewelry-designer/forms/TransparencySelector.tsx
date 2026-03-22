import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { GEM_TRANSPARENCY } from '../../../lib/jewelry-designer/constants';
import { Eye, EyeOff, Circle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
    const getIcon = (transparencyValue: string, isSelected: boolean) => {
        const iconStyle = {
            width: '24px',
            height: '24px',
            color: isSelected ? '#B8860B' : '#9CA3AF',
        };

        switch (transparencyValue) {
            case 'transparent':
                return <Eye style={iconStyle} />;
            case 'semi-transparent':
                return <Circle style={iconStyle} />;
            case 'opaque':
                return <EyeOff style={iconStyle} />;
            default:
                return <Circle style={iconStyle} />;
        }
    };

    return (
        <div className="flex flex-col gap-3" style={{ fontFamily: "'Market Sans', sans-serif" }}>
            <Label className="text-sm font-semibold text-gray-800">
                How see-through is your gem? <span className="text-red-500">*</span>
            </Label>

            <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {GEM_TRANSPARENCY.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <Label
                            key={option.value}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center group
                                ${isSelected 
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm shadow-[#D4AF37]/10' 
                                    : 'border-gray-100 bg-white/50 backdrop-blur-sm hover:border-gray-200 hover:bg-white/80'
                                }
                            `}
                        >
                            <RadioGroupItem value={option.value} className="sr-only" />
                            {/* Icon */}
                            <div className="flex justify-center mb-2 transition-transform group-hover:scale-105">
                                {getIcon(option.value, isSelected)}
                            </div>

                            <p className={`text-[13px] font-semibold mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                {option.label}
                            </p>
                            <p className="text-[11px] text-gray-500 font-normal leading-tight">
                                {option.description}
                            </p>
                        </Label>
                    );
                })}
            </RadioGroup>

            {/* Hidden input for form registration */}
            <input type="hidden" {...register('gemTransparency')} value={value} />

            <p className="text-[12px] text-gray-400 mt-1">
                This helps us render light and reflections accurately
            </p>

            {errors.gemTransparency && (
                <p className="text-[13px] text-red-500 mt-1">{errors.gemTransparency.message}</p>
            )}
        </div>
    );
};
