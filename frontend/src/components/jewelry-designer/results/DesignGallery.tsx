import React, { useState } from 'react';
import type { GeneratedImage } from '../../../lib/jewelry-designer/types';
import { DesignCard } from './DesignCard';
import { ImageLightbox } from './ImageLightbox';

interface DesignGalleryProps {
    images: GeneratedImage[];
    onSelectDesign: (image: GeneratedImage) => void;
}

export const DesignGallery: React.FC<DesignGalleryProps> = ({
    images,
    onSelectDesign,
}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const goToPrevious = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : images.length - 1
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            prev < images.length - 1 ? prev + 1 : 0
        );
    };

    const downloadImage = async (image: GeneratedImage) => {
        try {
            const response = await fetch(image.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `jewelry-design-${image.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image. Please try again.');
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                    <DesignCard
                        key={image.id}
                        image={image}
                        index={index}
                        onView={() => openLightbox(index)}
                        onSelect={() => onSelectDesign(image)}
                        onDownload={() => downloadImage(image)}
                    />
                ))}
            </div>

            {lightboxOpen && (
                <ImageLightbox
                    images={images}
                    currentIndex={currentImageIndex}
                    onClose={closeLightbox}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                    onDownload={downloadImage}
                />
            )}
        </>
    );
};
