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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: "'Market Sans', sans-serif" }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
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
                                border: isSelected ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid #E5E7EB',
                                background: isSelected ? 'rgba(212, 175, 55, 0.08)' : '#F9FAFB',
                                color: isSelected ? '#B8860B' : '#9CA3AF',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: isSelected ? '0 4px 6px -1px rgba(212, 175, 55, 0.1)' : 'none',
                            }}
                        >
                            {/* SVG Icon */}
                            <div style={{ width: '48px', height: '48px', marginBottom: '8px', color: isSelected ? '#B8860B' : '#9CA3AF' }}>
                                {getCutIcon(cut.value)}
                            </div>

                            <p style={{
                                fontSize: '11px',
                                fontWeight: 500,
                                color: isSelected ? '#B8860B' : '#6B7280',
                                textAlign: 'center',
                                fontFamily: "'Market Sans', sans-serif",
                            }}>
                                {cut.label}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Hidden input for form registration */}
            <input type="hidden" {...register('gemCut')} value={value} />

            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                Click on a shape that matches your gemstone
            </p>

            {errors.gemCut && (
                <p style={{ fontSize: '13px', color: '#EF4444' }}>{errors.gemCut.message}</p>
            )}
        </div>
    );
};

function getCutIcon(cut: string) {
    const iconMap: Record<string, React.ReactNode> = {
        'round-brilliant': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Outer circle */}
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Table facet (center) */}
                <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Star facets */}
                <line x1="24" y1="4" x2="24" y2="16" stroke="currentColor" strokeWidth="1" />
                <line x1="24" y1="32" x2="24" y2="44" stroke="currentColor" strokeWidth="1" />
                <line x1="4" y1="24" x2="16" y2="24" stroke="currentColor" strokeWidth="1" />
                <line x1="32" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1" />
                {/* Diagonal facets */}
                <line x1="9" y1="9" x2="18" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="39" y1="9" x2="30" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="9" y1="39" x2="18" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="39" y1="39" x2="30" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
            </svg>
        ),
        'oval': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Outer oval */}
                <ellipse cx="24" cy="24" rx="14" ry="19" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Inner table */}
                <ellipse cx="24" cy="24" rx="7" ry="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Vertical facets */}
                <line x1="24" y1="5" x2="24" y2="14" stroke="currentColor" strokeWidth="0.8" />
                <line x1="24" y1="34" x2="24" y2="43" stroke="currentColor" strokeWidth="0.8" />
                {/* Side facets */}
                <line x1="10" y1="24" x2="17" y2="24" stroke="currentColor" strokeWidth="0.8" />
                <line x1="31" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="0.8" />
            </svg>
        ),
        'cushion': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Outer rounded square */}
                <rect x="6" y="6" width="36" height="36" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Inner table */}
                <rect x="14" y="14" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Corner facets */}
                <line x1="6" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="14" y1="6" x2="14" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="34" y1="6" x2="34" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="34" y1="14" x2="42" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="6" y1="34" x2="14" y2="34" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="14" y1="34" x2="14" y2="42" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="34" y1="34" x2="34" y2="42" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
                <line x1="34" y1="34" x2="42" y2="34" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
            </svg>
        ),
        'pear': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Pear outline */}
                <path d="M24 4 C14 14 10 26 14 34 C18 42 30 42 34 34 C38 26 34 14 24 4 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Inner facet */}
                <path d="M24 12 C19 18 17 26 19 31 C21 35 27 35 29 31 C31 26 29 18 24 12 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Center line */}
                <line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" strokeWidth="0.8" />
            </svg>
        ),
        'emerald-cut': ( // Mapped from 'emerald' in snippet
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Octagonal outline */}
                <polygon points="12,6 36,6 44,14 44,34 36,42 12,42 4,34 4,14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Inner octagon */}
                <polygon points="16,12 32,12 38,18 38,30 32,36 16,36 10,30 10,18" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Step cut lines */}
                <line x1="4" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="0.8" />
                <line x1="44" y1="14" x2="38" y2="18" stroke="currentColor" strokeWidth="0.8" />
                <line x1="4" y1="34" x2="10" y2="30" stroke="currentColor" strokeWidth="0.8" />
                <line x1="44" y1="34" x2="38" y2="30" stroke="currentColor" strokeWidth="0.8" />
            </svg>
        ),
        'marquise': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Pointed oval */}
                <path d="M24 4 C14 12 10 20 10 24 C10 28 14 36 24 44 C34 36 38 28 38 24 C38 20 34 12 24 4 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Inner facet */}
                <path d="M24 12 C19 17 16 22 16 24 C16 26 19 31 24 36 C29 31 32 26 32 24 C32 22 29 17 24 12 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Center line */}
                <line x1="24" y1="4" x2="24" y2="44" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </svg>
        ),
        'asscher': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Outer square */}
                <rect x="6" y="6" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Inner square */}
                <rect x="14" y="14" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Corner step cuts */}
                <line x1="6" y1="6" x2="14" y2="14" stroke="currentColor" strokeWidth="1" />
                <line x1="42" y1="6" x2="34" y2="14" stroke="currentColor" strokeWidth="1" />
                <line x1="6" y1="42" x2="14" y2="34" stroke="currentColor" strokeWidth="1" />
                <line x1="42" y1="42" x2="34" y2="34" stroke="currentColor" strokeWidth="1" />
                {/* Mid step lines */}
                <rect x="10" y="10" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
            </svg>
        ),
        'princess': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Outer square */}
                <rect x="6" y="6" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Diagonal cross - signature of princess cut */}
                <line x1="6" y1="6" x2="42" y2="42" stroke="currentColor" strokeWidth="1" />
                <line x1="42" y1="6" x2="6" y2="42" stroke="currentColor" strokeWidth="1" />
                {/* Inner diamond */}
                <polygon points="24,10 38,24 24,38 10,24" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </svg>
        ),
        'radiant': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Octagonal outline */}
                <polygon points="12,6 36,6 44,14 44,34 36,42 12,42 4,34 4,14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Radiant inner pattern */}
                <rect x="16" y="16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {/* Radiant facet lines */}
                <line x1="12" y1="6" x2="16" y2="16" stroke="currentColor" strokeWidth="0.8" />
                <line x1="36" y1="6" x2="32" y2="16" stroke="currentColor" strokeWidth="0.8" />
                <line x1="12" y1="42" x2="16" y2="32" stroke="currentColor" strokeWidth="0.8" />
                <line x1="36" y1="42" x2="32" y2="32" stroke="currentColor" strokeWidth="0.8" />
                <line x1="4" y1="14" x2="16" y2="16" stroke="currentColor" strokeWidth="0.8" />
                <line x1="44" y1="14" x2="32" y2="16" stroke="currentColor" strokeWidth="0.8" />
                <line x1="4" y1="34" x2="16" y2="32" stroke="currentColor" strokeWidth="0.8" />
                <line x1="44" y1="34" x2="32" y2="32" stroke="currentColor" strokeWidth="0.8" />
            </svg>
        ),
        'heart': (
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
                {/* Heart outline */}
                <path d="M24 44 C8 30 4 20 10 12 C14 8 20 8 24 14 C28 8 34 8 38 12 C44 20 40 30 24 44 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Inner facets */}
                <path d="M24 36 C14 28 12 22 15 17 C17 14 20 14 24 18 C28 14 31 14 33 17 C36 22 34 28 24 36 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Center cleft */}
                <line x1="24" y1="14" x2="24" y2="22" stroke="currentColor" strokeWidth="0.8" />
            </svg>
        ),
    };

    return iconMap[cut] || (
        <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
            <polygon points="24,4 44,40 4,40" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}
