import React, { useState } from 'react';
import { METAL_TYPES, METAL_FINISHES } from '../../../lib/jewelry-designer/constants';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

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
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleMetal = (metalValue: string) => {
        if (selectedMetals.includes(metalValue)) {
            onMetalsChange(selectedMetals.filter(m => m !== metalValue));
        } else {
            onMetalsChange([...selectedMetals, metalValue]);
        }
    };

    return (
        <div className="space-y-3">
            {/* Collapsible Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-700 bg-[#1a1f35] hover:border-gray-600 transition-all"
            >
                <div className="flex items-center">
                    <span className="text-sm font-medium text-white">Metal & Materials</span>
                    <span className="ml-2 text-xs text-gray-500">(optional)</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1f35] space-y-4">
                    {/* Metal Types */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-3">
                            Select metal type(s)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {METAL_TYPES.map((metal) => (
                                <button
                                    key={metal.value}
                                    type="button"
                                    onClick={() => toggleMetal(metal.value)}
                                    className={`
                    flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-sm
                    ${selectedMetals.includes(metal.value)
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                                            : 'border-gray-700 bg-[#0d1121] text-gray-400 hover:border-gray-600'
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
                        <label className="block text-sm font-medium text-white mb-3">
                            Finish (optional)
                        </label>
                        <div className="flex gap-2">
                            {METAL_FINISHES.map((finish) => (
                                <button
                                    key={finish.value}
                                    type="button"
                                    onClick={() => onFinishChange(finish.value)}
                                    className={`
                    flex-1 px-3 py-2 rounded-lg border transition-all text-sm text-center
                    ${selectedFinish === finish.value
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                                            : 'border-gray-700 bg-[#0d1121] text-gray-400 hover:border-gray-600'
                                        }
                  `}
                                >
                                    {finish.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Display selected metals summary when collapsed */}
            {!isExpanded && selectedMetals.length > 0 && (
                <p className="text-xs text-gray-500 px-1">
                    Selected: {selectedMetals.map(m => METAL_TYPES.find(t => t.value === m)?.label).join(', ')}
                </p>
            )}
        </div>
    );
};
