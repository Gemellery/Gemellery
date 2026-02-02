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
                                border: isSelected ? '1px solid #D4AF37' : '1px solid #2D2B3B',
                                background: isSelected ? 'rgba(212, 175, 55, 0.1)' : '#13111C', // Dark purple/black
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* SVG Icon */}
                            <div style={{ width: '32px', height: '32px', marginBottom: '8px', color: isSelected ? '#D4AF37' : '#9CA3AF' }}>
                                {getCutIcon(cut.value)}
                            </div>

                            <p style={{
                                fontSize: '11px',
                                fontWeight: 500,
                                color: isSelected ? 'white' : '#9CA3AF',
                                textAlign: 'center',
                                fontFamily: 'Inter, sans-serif',
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

// SVG icons matching mockup exactly - thin 1px strokes
function getCutIcon(cut: string) {
    const svgStyle = {
        width: '100%',
        height: '100%',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1', // Thin stroke
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    switch (cut) {
        case 'round-brilliant':
            // Round with 8 spokes
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <circle cx="16" cy="16" r="12" />
                    <circle cx="16" cy="16" r="6" />
                    {/* Spokes */}
                    <line x1="16" y1="4" x2="16" y2="10" />
                    <line x1="16" y1="22" x2="16" y2="28" />
                    <line x1="4" y1="16" x2="10" y2="16" />
                    <line x1="22" y1="16" x2="28" y2="16" />
                    <line x1="7.5" y1="7.5" x2="11.7" y2="11.7" />
                    <line x1="24.5" y1="7.5" x2="20.3" y2="11.7" />
                    <line x1="7.5" y1="24.5" x2="11.7" y2="20.3" />
                    <line x1="24.5" y1="24.5" x2="20.3" y2="20.3" />
                </svg>
            );
        case 'oval':
            // Concentric Ovals
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <ellipse cx="16" cy="16" rx="9" ry="12" />
                    <ellipse cx="16" cy="16" rx="5" ry="7" />
                </svg>
            );
        case 'cushion':
            // Concentric Rounded Squares (Fixed from teardrop)
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <rect x="5" y="5" width="22" height="22" rx="6" />
                    <rect x="10" y="10" width="12" height="12" rx="3" />
                </svg>
            );
        case 'pear':
            // Concentric Teardrops
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <path d="M16 4 C10 12, 8 20, 16 28 C24 20, 22 12, 16 4 Z" />
                    <path d="M16 9 C13 14, 12 18, 16 23 C20 18, 19 14, 16 9 Z" />
                </svg>
            );
        case 'emerald-cut':
            // Concentric Octagons
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <polygon points="8,4 24,4 28,8 28,24 24,28 8,28 4,24 4,8" />
                    <polygon points="11,8 21,8 24,11 24,21 21,24 11,24 8,21 8,11" />
                </svg>
            );
        case 'marquise':
            // Concentric Footballs
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <path d="M16 3 C8 10, 8 22, 16 29 C24 22, 24 10, 16 3 Z" />
                    <path d="M16 8 C12 12, 12 20, 16 24 C20 20, 20 12, 16 8 Z" />
                </svg>
            );
        case 'asscher':
            // Concentric clipped squares
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <polygon points="9,5 23,5 27,9 27,23 23,27 9,27 5,23 5,9" />
                    <rect x="10" y="10" width="12" height="12" />
                    <line x1="5" y1="9" x2="10" y2="10" />
                    <line x1="27" y1="9" x2="22" y2="10" />
                    <line x1="27" y1="23" x2="22" y2="22" />
                    <line x1="5" y1="23" x2="10" y2="22" />
                </svg>
            );
        case 'princess':
            // Square with diagonals/star pattern
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <rect x="5" y="5" width="22" height="22" />
                    <rect x="11" y="11" width="10" height="10" transform="rotate(45 16 16)" />
                </svg>
            );
        case 'radiant':
            // Octagon with grid lines
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <polygon points="8,4 24,4 28,8 28,24 24,28 8,28 4,24 4,8" />
                    <rect x="10" y="10" width="12" height="12" />
                    <line x1="16" y1="4" x2="16" y2="28" />
                    <line x1="4" y1="16" x2="28" y2="16" />
                </svg>
            );
        case 'heart':
            // Concentric Hearts
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <path d="M16 28 C16 28 3 20 3 11 C3 7 6 4 10 4 C13 4 15 6 16 8 C17 6 19 4 22 4 C26 4 29 7 29 11 C29 20 16 28 16 28 Z" />
                    <path d="M16 23 C16 23 7 17 7 11 C7 9 8 7 10 7 C12 7 14 9 14.5 10 L17.5 10 C18 9 20 7 22 7 C24 7 25 9 25 11 C25 17 16 23 16 23 Z" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 32 32" style={svgStyle}>
                    <circle cx="16" cy="16" r="12" />
                </svg>
            );
    }
}
