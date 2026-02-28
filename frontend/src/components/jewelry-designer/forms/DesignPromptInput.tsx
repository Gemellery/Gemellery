import React, { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GemFormValues } from '../../../lib/jewelry-designer/validation';
import { PROMPT_EXAMPLES } from '../../../lib/jewelry-designer/constants';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface DesignPromptInputProps {
    register: UseFormRegister<GemFormValues>;
    errors: FieldErrors<GemFormValues>;
    value: string;
}

export const DesignPromptInput: React.FC<DesignPromptInputProps> = ({
    register,
    errors,
    value,
}) => {
    const [showTips, setShowTips] = useState(false);
    const characterCount = value?.length || 0;
    const maxChars = 1000;

    const tips = [
        'Mention specific styles (Art Deco, Vintage, Modern, Minimalist)',
        'Describe the setting type (Halo, Solitaire, Three-stone, Cluster)',
        'Include details about the band (Thin, Wide, Twisted, Split)',
        'Specify accent stones or decorations you want',
        'Reference specific jewelry types (Ring, Necklace, Earrings, Bracelet)',
    ];

    return (
        <div className="space-y-3" style={{ fontFamily: "'Market Sans', sans-serif" }}>
            <label className="block text-sm font-semibold text-gray-800">
                Describe your dream jewelry design <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <textarea
                    {...register('designPrompt')}
                    rows={6}
                    placeholder={`Examples:\n${PROMPT_EXAMPLES.map(e => `- ${e}`).join('\n')}`}
                    className={`
            w-full px-4 py-3 rounded-xl border resize-none
            bg-gray-50 text-gray-900 placeholder-gray-400
            ${errors.designPrompt
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                            : 'border-gray-300 hover:border-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
                        }
          `}
                    style={{ fontFamily: "'Market Sans', sans-serif" }}
                />

                {/* Character counter */}
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {characterCount}/{maxChars}
                </div>
            </div>

            {errors.designPrompt && (
                <p className="text-sm text-red-500">{errors.designPrompt.message}</p>
            )}

            {/* Design Tips Toggle */}
            <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="flex items-center text-sm text-[#B8860B] hover:text-[#D4AF37] font-semibold"
                style={{ fontFamily: "'Market Sans', sans-serif" }}
            >
                <Lightbulb className="w-4 h-4 mr-1" />
                Design Tips
                {showTips ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                )}
            </button>

            {/* Tips Panel */}
            {showTips && (
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <ul className="space-y-2">
                        {tips.map((tip, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                                <span className="text-[#D4AF37] mr-2">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
