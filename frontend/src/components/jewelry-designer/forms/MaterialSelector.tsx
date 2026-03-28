import React from 'react';
import { METAL_TYPES, METAL_FINISHES } from '../../../lib/jewelry-designer/constants';
import { Check } from 'lucide-react';

interface MaterialSelectorProps {
    selectedMetals: string[];
    selectedFinish?: string;
    onMetalsChange: (metals: string[]) => void;
    onFinishChange: (finish: string) => void;
}

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
    selectedMetals,
    selectedFinish,
    onMetalsChange,
    onFinishChange,
}) => {
    const toggleMetal = (metalValue: string) => {
        if (selectedMetals.includes(metalValue)) {
            onMetalsChange(selectedMetals.filter(m => m !== metalValue));
        } else {
            onMetalsChange([...selectedMetals, metalValue]);
        }
    };

    return (
        <div className="space-y-4" style={{ fontFamily: "'Market Sans', sans-serif" }}>
            <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-semibold text-gray-800">
                    Metal & Materials <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                </h3>
            </div>

            <div className="p-5 rounded-xl border border-gray-100 bg-white/40 backdrop-blur-md space-y-6 shadow-inner">
                {/* Metal Types */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Select metal type(s)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {METAL_TYPES.map((metal) => (
                            <button
                                key={metal.value}
                                type="button"
                                onClick={() => toggleMetal(metal.value)}
                                className={`
                                    flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-sm
                                    ${selectedMetals.includes(metal.value)
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-gray-900 shadow-sm shadow-[#D4AF37]/10'
                                        : 'border-gray-200 bg-white/60 text-gray-500 hover:border-gray-300 hover:bg-white'
                                    }
                                `}
                            >
                                <span>{metal.label}</span>
                                {selectedMetals.includes(metal.value) && (
                                    <Check className="w-4 h-4 text-[#D4AF37]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Metal Finish */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Finish
                    </label>
                    <div className="flex gap-2">
                        {METAL_FINISHES.map((finish) => (
                            <button
                                key={finish.value}
                                type="button"
                                onClick={() => onFinishChange(finish.value)}
                                className={`
                                    flex-1 px-3 py-3 rounded-lg border transition-all text-sm text-center
                                    ${selectedFinish === finish.value
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-gray-900 shadow-sm shadow-[#D4AF37]/10'
                                        : 'border-gray-200 bg-white/60 text-gray-500 hover:border-gray-300 hover:bg-white'
                                    }
                                `}
                            >
                                {finish.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
