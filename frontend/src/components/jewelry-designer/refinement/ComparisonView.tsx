import React, { useState, useRef } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface ComparisonViewProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
    beforeImage,
    afterImage,
    beforeLabel = 'Before',
    afterLabel = 'After',
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const updateSliderPosition = (clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        updateSliderPosition(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        updateSliderPosition(e.touches[0].clientX);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">
                    Before & After Comparison
                </h3>
                <button
                    onClick={() => setSliderPosition(50)}
                    className="text-xs text-[#D4AF37] hover:text-[#c4a030] font-medium flex items-center"
                >
                    <ArrowLeftRight className="w-3 h-3 mr-1" />
                    Reset
                </button>
            </div>

            <div
                ref={containerRef}
                className="relative aspect-square rounded-xl overflow-hidden cursor-ew-resize select-none"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
            >
                {/* After Image (full) */}
                <img
                    src={afterImage}
                    alt={afterLabel}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                />

                {/* Before Image (clipped) */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                >
                    <img
                        src={beforeImage}
                        alt={beforeLabel}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ width: `${(100 / sliderPosition) * 100}%` }}
                        draggable={false}
                    />
                </div>

                {/* Slider Line */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    {/* Handle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
                        <ArrowLeftRight className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                    {beforeLabel}
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                    {afterLabel}
                </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
                Drag the slider to compare before and after
            </p>
        </div>
    );
};
