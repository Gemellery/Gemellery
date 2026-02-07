import React from 'react';
import { Download, Maximize2, Sparkles } from 'lucide-react';
import type { GeneratedImage } from '../../../lib/jewelry-designer/types';

interface DesignCardProps {
    image: GeneratedImage;
    index: number;
    onView: () => void;
    onSelect: () => void;
    onDownload: () => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({
    image,
    index,
    onView,
    onSelect,
    onDownload,
}) => {
    return (
        <div className="group relative rounded-2xl overflow-hidden border border-gray-800 bg-[#111827] transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-lg hover:shadow-[#D4AF37]/10">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={onView}>
                <img
                    src={image.url}
                    alt={`Design ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView();
                        }}
                        className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                        <Maximize2 className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Design number badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <span className="text-xs font-medium text-white">Design {index + 1}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3">
                <button
                    onClick={onSelect}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#0A1128] font-semibold hover:opacity-90 transition-opacity"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Select & Refine</span>
                </button>

                <button
                    onClick={onDownload}
                    className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                </button>
            </div>
        </div>
    );
};
