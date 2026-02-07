import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { GeneratedImage } from '../../../lib/jewelry-designer/types';

interface ImageLightboxProps {
    images: GeneratedImage[];
    currentIndex: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onDownload: (image: GeneratedImage) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
    images,
    currentIndex,
    onClose,
    onPrevious,
    onNext,
    onDownload,
}) => {
    const currentImage = images[currentIndex];

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') onPrevious();
        if (e.key === 'ArrowRight') onNext();
    }, [onClose, onPrevious, onNext]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                aria-label="Close lightbox"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous button */}
            {images.length > 1 && (
                <button
                    onClick={onPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
                <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                </button>
            )}

            {/* Image */}
            <div className="max-w-4xl max-h-[80vh] mx-auto px-16">
                <img
                    src={currentImage.url}
                    alt={`Design ${currentIndex + 1}`}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-white/80 text-sm">
                            Design {currentIndex + 1} of {images.length}
                        </span>
                    </div>
                    <button
                        onClick={() => onDownload(currentImage)}
                        className="flex items-center space-x-2 bg-[#D4AF37] text-[#0A1128] px-4 py-2 rounded-lg hover:bg-[#c4a030] transition-colors font-medium"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            </div>

            {/* Navigation dots */}
            {images.length > 1 && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                const diff = index - currentIndex;
                                if (diff > 0) {
                                    for (let i = 0; i < diff; i++) onNext();
                                } else if (diff < 0) {
                                    for (let i = 0; i < Math.abs(diff); i++) onPrevious();
                                }
                            }}
                            className={`rounded-full transition-all ${index === currentIndex
                                    ? 'bg-[#D4AF37] w-8 h-2'
                                    : 'bg-white/50 hover:bg-white/75 w-2 h-2'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
