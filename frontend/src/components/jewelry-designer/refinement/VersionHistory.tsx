import React from 'react';
import type { GeneratedImage, Refinement } from '../../../lib/jewelry-designer/types';
import { RotateCcw } from 'lucide-react';

interface Version {
    id: string;
    url: string;
    thumbnailUrl?: string;
    label: string;
    timestamp: string;
}

interface VersionHistoryProps {
    originalImages: GeneratedImage[];
    selectedOriginal: GeneratedImage;
    refinements: Refinement[];
    currentVersion: string;
    onSelectVersion: (versionId: string, imageUrl: string) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
    selectedOriginal,
    refinements,
    currentVersion,
    onSelectVersion,
}) => {
    // Build version list
    const versions: Version[] = [
        {
            id: selectedOriginal.id,
            url: selectedOriginal.url,
            thumbnailUrl: selectedOriginal.thumbnailUrl,
            label: 'Original',
            timestamp: selectedOriginal.generatedAt,
        },
        ...refinements.map((refinement, index) => ({
            id: refinement.id,
            url: refinement.imageUrl,
            thumbnailUrl: refinement.thumbnailUrl,
            label: `Refinement ${index + 1}`,
            timestamp: refinement.refinedAt,
        })),
    ];

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">
                    Version History
                </h3>
                <span className="text-xs text-gray-500">
                    {versions.length} version{versions.length > 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                {versions.map((version, index) => (
                    <button
                        key={version.id}
                        onClick={() => onSelectVersion(version.id, version.url)}
                        className={`
              flex-shrink-0 relative group rounded-lg overflow-hidden
              transition-all duration-200
              ${currentVersion === version.id
                                ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#0A1128]'
                                : 'hover:ring-2 hover:ring-gray-600'
                            }
            `}
                    >
                        <div className="w-20 h-20 overflow-hidden">
                            <img
                                src={version.thumbnailUrl || version.url}
                                alt={version.label}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Label */}
                        <div className={`
              absolute bottom-0 left-0 right-0 px-1 py-1 text-xs font-medium text-center
              ${currentVersion === version.id
                                ? 'bg-[#D4AF37] text-[#0A1128]'
                                : 'bg-black/70 text-white'
                            }
            `}>
                            {version.label}
                        </div>

                        {/* Revert indicator for non-current, non-last versions */}
                        {currentVersion !== version.id && index < versions.length - 1 && (
                            <div className="absolute top-1 right-1 p-1 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                <RotateCcw className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {refinements.length > 0 && (
                <p className="text-xs text-gray-500">
                    Click any version to view or revert to it
                </p>
            )}
        </div>
    );
};
