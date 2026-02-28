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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: "'Market Sans', sans-serif" }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
                How see-through is your gem? <span style={{ color: '#EF4444' }}>*</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {GEM_TRANSPARENCY.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            style={{
                                padding: '16px',
                                borderRadius: '12px',
                                border: isSelected ? '2px solid #D4AF37' : '2px solid #E5E7EB',
                                background: isSelected ? 'rgba(212, 175, 55, 0.08)' : '#F9FAFB',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontFamily: "'Market Sans', sans-serif",
                            }}
                        >
                            {/* Icon */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                                {getIcon(option.value, isSelected)}
                            </div>

                            <p style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: isSelected ? '#1F2937' : '#6B7280',
                                marginBottom: '4px',
                            }}>
                                {option.label}
                            </p>
                            <p style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                {option.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Hidden input for form registration */}
            <input type="hidden" {...register('gemTransparency')} value={value} />

            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                This helps us render light and reflections accurately
            </p>

            {errors.gemTransparency && (
                <p style={{ fontSize: '13px', color: '#EF4444' }}>{errors.gemTransparency.message}</p>
            )}
        </div>
    );
};
