import React, { useState } from 'react';
import type { GeneratedImage, Refinement } from '../../../lib/jewelry-designer/types';
import { DesignCard } from './DesignCard';
import { ImageLightbox } from './ImageLightbox';

interface DesignGalleryProps {
    images: GeneratedImage[];
    refinements?: Refinement[];
    onSelectDesign: (image: GeneratedImage) => void;
}

export const DesignGallery: React.FC<DesignGalleryProps> = ({
    images,
    refinements = [],
    onSelectDesign,
}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImages, setLightboxImages] = useState<GeneratedImage[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // When clicking a card, build the per-card image list:
    // [the original] + [all refinements whose baseImageId OR baseImageUrl matches this original]
    const openLightbox = (cardIndex: number) => {
        const original = images[cardIndex];

        // Match via ID (fast, reliable) or URL equality as fallback (for old records)
        const myRefinements = refinements
            .filter((r) =>
                (r.baseImageId && r.baseImageId === original.id) ||
                (!r.baseImageId && r.baseImageUrl === original.url)
            )
            .map((r, j) => ({
                id: r.id,
                url: r.imageUrl,
                thumbnailUrl: r.thumbnailUrl || r.imageUrl,
                generatedAt: r.refinedAt,
                label: `Refinement ${j + 1}`,
            }));

        setLightboxImages([
            { ...original, label: `Original ${cardIndex + 1}` },
            ...myRefinements,
        ]);
        setCurrentImageIndex(0);
        setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);

    const goToPrevious = () =>
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : lightboxImages.length - 1
        );

    const goToNext = () =>
        setCurrentImageIndex((prev) =>
            prev < lightboxImages.length - 1 ? prev + 1 : 0
        );

    const downloadImage = (image: GeneratedImage) => {
        const link = document.createElement('a');
        link.download = `jewelry-design-${image.id}.png`;

        if (image.url.startsWith('data:')) {
            link.href = image.url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            fetch(image.url)
                .then((r) => r.blob())
                .then((blob) => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    link.href = blobUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch(() => alert('Failed to download image.'));
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => {
                    // Count refinements for this specific image (ID-based, URL fallback)
                    const myRefinementCount = refinements.filter(
                        (r) =>
                            (r.baseImageId && r.baseImageId === image.id) ||
                            (!r.baseImageId && r.baseImageUrl === image.url)
                    ).length;

                    return (
                        <DesignCard
                            key={image.id}
                            image={image}
                            index={index}
                            refinementCount={myRefinementCount}
                            onView={() => openLightbox(index)}
                            onSelect={() => onSelectDesign(image)}
                            onDownload={() => downloadImage(image)}
                        />
                    );
                })}
            </div>

            {lightboxOpen && lightboxImages.length > 0 && (
                <ImageLightbox
                    images={lightboxImages}
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
