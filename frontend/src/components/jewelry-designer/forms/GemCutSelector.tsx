import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}>
                What is the shape/cut of your gem? <span style={{ color: '#EF4444' }}>*</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {GEM_CUTS.map((cut) => {
                    const isSelected = value === cut.value;
                    return (
                        <button
                            key={cut.value}
                            type="button"
                            onClick={() => onChange(cut.value)}
                            style={{
                                padding: '16px 8px',
                                borderRadius: '12px',
                                border: isSelected ? '2px solid #D4AF37' : '1px solid #374151',
                                background: isSelected ? 'rgba(212, 175, 55, 0.1)' : '#1a1f35',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {/* SVG Icon */}
                            <div style={{ width: '32px', height: '32px', marginBottom: '8px' }}>
                                {getCutIcon(cut.value, isSelected)}
                            </div>

                            <p style={{
                                fontSize: '11px',
                                fontWeight: 500,
                                color: isSelected ? 'white' : '#9CA3AF',
                                textAlign: 'center',
                            }}>
                                {cut.label}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Hidden input for form registration */}
            <input type="hidden" {...register('gemCut')} value={value} />

            <p style={{ fontSize: '12px', color: '#6B7280' }}>
                Click on a shape that matches your gemstone
            </p>

            {errors.gemCut && (
                <p style={{ fontSize: '13px', color: '#EF4444' }}>{errors.gemCut.message}</p>
            )}
        </div>
    );
};

// SVG icons matching mockup exactly - thin strokes
function getCutIcon(cut: string, isSelected: boolean) {
    const color = isSelected ? '#D4AF37' : '#9CA3AF';

    const svgStyle = {
        width: '100%',
        height: '100%',
    };

    switch (cut) {
        case 'round-brilliant':
            // Circle with cross pattern inside
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="1.5" />
                    <circle cx="16" cy="16" r="6" stroke={color} strokeWidth="1" />
                    <line x1="16" y1="4" x2="16" y2="10" stroke={color} strokeWidth="1" />
                    <line x1="16" y1="22" x2="16" y2="28" stroke={color} strokeWidth="1" />
                    <line x1="4" y1="16" x2="10" y2="16" stroke={color} strokeWidth="1" />
                    <line x1="22" y1="16" x2="28" y2="16" stroke={color} strokeWidth="1" />
                    <line x1="7" y1="7" x2="11" y2="11" stroke={color} strokeWidth="1" />
                    <line x1="21" y1="7" x2="25" y2="11" stroke={color} strokeWidth="1" />
                    <line x1="7" y1="25" x2="11" y2="21" stroke={color} strokeWidth="1" />
                    <line x1="21" y1="25" x2="25" y2="21" stroke={color} strokeWidth="1" />
                </svg>
            );
        case 'oval':
            // Vertical oval with inner oval
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <ellipse cx="16" cy="16" rx="9" ry="12" stroke={color} strokeWidth="1.5" />
                    <ellipse cx="16" cy="16" rx="5" ry="7" stroke={color} strokeWidth="1" />
                </svg>
            );
        case 'cushion':
            // Rounded square with drop inside
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <rect x="5" y="5" width="22" height="22" rx="6" stroke={color} strokeWidth="1.5" />
                    {/* Teardrop/water drop in center */}
                    <path d="M16 10 C14 14, 12 18, 16 22 C20 18, 18 14, 16 10" stroke={color} strokeWidth="1" fill="none" />
                </svg>
            );
        case 'pear':
            // Teardrop shape
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <path d="M16 4 C10 12, 8 20, 16 28 C24 20, 22 12, 16 4" stroke={color} strokeWidth="1.5" />
                    <path d="M16 9 C13 14, 12 18, 16 23 C20 18, 19 14, 16 9" stroke={color} strokeWidth="1" />
                </svg>
            );
        case 'emerald-cut':
            // Octagon with clipped corners
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <polygon points="8,4 24,4 28,8 28,24 24,28 8,28 4,24 4,8" stroke={color} strokeWidth="1.5" />
                    <polygon points="11,8 21,8 24,11 24,21 21,24 11,24 8,21 8,11" stroke={color} strokeWidth="1" />
                </svg>
            );
        case 'marquise':
            // Pointed vertical oval (football shape)
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <path d="M16 3 C8 10, 8 22, 16 29 C24 22, 24 10, 16 3" stroke={color} strokeWidth="1.5" />
                    <path d="M16 8 C12 12, 12 20, 16 24 C20 20, 20 12, 16 8" stroke={color} strokeWidth="1" />
                </svg>
            );
        case 'asscher':
            // Square with chamfered corners and inner square
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <polygon points="10,4 22,4 28,10 28,22 22,28 10,28 4,22 4,10" stroke={color} strokeWidth="1.5" />
                    <rect x="10" y="10" width="12" height="12" stroke={color} strokeWidth="1" />
                </svg>
            );
        case 'princess':
            // Square with X pattern
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <rect x="5" y="5" width="22" height="22" stroke={color} strokeWidth="1.5" />
                    <line x1="5" y1="5" x2="27" y2="27" stroke={color} strokeWidth="1" />
                    <line x1="27" y1="5" x2="5" y2="27" stroke={color} strokeWidth="1" />
                    <rect x="11" y="11" width="10" height="10" stroke={color} strokeWidth="1" />
                </svg>
            );
        case 'radiant':
            // Octagon with inner square
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <polygon points="8,4 24,4 28,8 28,24 24,28 8,28 4,24 4,8" stroke={color} strokeWidth="1.5" />
                    <rect x="10" y="10" width="12" height="12" stroke={color} strokeWidth="1" />
                    <line x1="4" y1="8" x2="10" y2="10" stroke={color} strokeWidth="0.75" />
                    <line x1="28" y1="8" x2="22" y2="10" stroke={color} strokeWidth="0.75" />
                    <line x1="4" y1="24" x2="10" y2="22" stroke={color} strokeWidth="0.75" />
                    <line x1="28" y1="24" x2="22" y2="22" stroke={color} strokeWidth="0.75" />
                </svg>
            );
        case 'heart':
            // Heart shape
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <path
                        d="M16 28 L5 17 C2 13, 3 8, 8 7 C11 6, 14 8, 16 12 C18 8, 21 6, 24 7 C29 8, 30 13, 27 17 Z"
                        stroke={color}
                        strokeWidth="1.5"
                    />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 32 32" fill="none" style={svgStyle}>
                    <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="1.5" />
                </svg>
            );
    }
}
