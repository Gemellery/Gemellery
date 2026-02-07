import React, { useState } from 'react';
import { Wand2, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface RefinementPromptProps {
    onRefine: (prompt: string, strength: number) => void;
    isRefining: boolean;
}

const SUGGESTIONS = [
    'Make the band thicker',
    'Add small diamonds on the sides',
    'Change to rose gold',
    'Make the setting lower profile',
    'Add vintage filigree details',
    'Make more minimalist',
    'Increase the size of center stone',
    'Add engraving pattern on band',
];

export const RefinementPrompt: React.FC<RefinementPromptProps> = ({
    onRefine,
    isRefining,
}) => {
    const [prompt, setPrompt] = useState('');
    const [strength, setStrength] = useState(0.5);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSubmit = () => {
        if (prompt.trim() && prompt.trim().length >= 10) {
            onRefine(prompt.trim(), strength);
            setPrompt('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const strengthLabel = strength === 0.3 ? 'Subtle' : strength === 0.5 ? 'Moderate' : 'Major';

    return (
        <div className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                    How would you like to modify this design?
                </label>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe the changes you'd like to make..."
                    rows={3}
                    maxLength={300}
                    disabled={isRefining}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#1a1f35] text-white
            focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-30
            resize-none disabled:bg-gray-800 disabled:cursor-not-allowed placeholder-gray-500"
                />

                <div className="flex justify-between items-center text-xs">
                    <button
                        type="button"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="flex items-center text-[#D4AF37] hover:text-[#c4a030] font-medium"
                    >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Common modifications
                        {showSuggestions ? (
                            <ChevronUp className="w-3 h-3 ml-1" />
                        ) : (
                            <ChevronDown className="w-3 h-3 ml-1" />
                        )}
                    </button>
                    <span className="text-gray-500">
                        {prompt.length} / 300
                    </span>
                </div>
            </div>

            {/* Suggestions */}
            {showSuggestions && (
                <div className="grid grid-cols-2 gap-2">
                    {SUGGESTIONS.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => setPrompt(suggestion)}
                            disabled={isRefining}
                            className="text-left px-3 py-2 text-sm bg-[#1a1f35] rounded-lg border border-gray-700
                hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Refinement Strength */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-white">
                        Refinement Strength
                    </label>
                    <span className="text-sm font-medium text-[#D4AF37]">
                        {strengthLabel}
                    </span>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setStrength(0.3)}
                        disabled={isRefining}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${strength === 0.3
                                ? 'bg-[#D4AF37] text-[#0A1128]'
                                : 'bg-[#1a1f35] text-gray-400 border border-gray-700 hover:border-gray-600'
                            }`}
                    >
                        Subtle
                    </button>
                    <button
                        onClick={() => setStrength(0.5)}
                        disabled={isRefining}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${strength === 0.5
                                ? 'bg-[#D4AF37] text-[#0A1128]'
                                : 'bg-[#1a1f35] text-gray-400 border border-gray-700 hover:border-gray-600'
                            }`}
                    >
                        Moderate
                    </button>
                    <button
                        onClick={() => setStrength(0.7)}
                        disabled={isRefining}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${strength === 0.7
                                ? 'bg-[#D4AF37] text-[#0A1128]'
                                : 'bg-[#1a1f35] text-gray-400 border border-gray-700 hover:border-gray-600'
                            }`}
                    >
                        Major
                    </button>
                </div>

                <p className="text-xs text-gray-500">
                    Subtle changes maintain most of the original design. Major changes create more dramatic variations.
                </p>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={isRefining || prompt.trim().length < 10}
                className="w-full py-4 rounded-xl font-semibold transition-all duration-300
          bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#0A1128]
          hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center space-x-2"
            >
                {isRefining ? (
                    <>
                        <div className="w-5 h-5 border-2 border-[#0A1128] border-t-transparent rounded-full animate-spin" />
                        <span>Refining Design...</span>
                    </>
                ) : (
                    <>
                        <Wand2 className="w-5 h-5" />
                        <span>Refine Design</span>
                    </>
                )}
            </button>

            {prompt.trim().length > 0 && prompt.trim().length < 10 && (
                <p className="text-xs text-amber-500 text-center">
                    Please enter at least 10 characters to describe the refinement
                </p>
            )}
        </div>
    );
};
