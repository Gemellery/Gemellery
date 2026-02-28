import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { getDesignById, refineDesign } from '../../lib/jewelry-designer/api';
import type { JewelryDesign, GeneratedImage } from '../../lib/jewelry-designer/types';
import { RefinementPrompt } from '../../components/jewelry-designer/refinement/RefinementPrompt';
import { VersionHistory } from '../../components/jewelry-designer/refinement/VersionHistory';
import { ComparisonView } from '../../components/jewelry-designer/refinement/ComparisonView';

const JewelryRefine: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [design, setDesign] = useState<JewelryDesign | null>(
        location.state?.design || null
    );
    const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
        location.state?.selectedImage || null
    );
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [baseImageUrl, setBaseImageUrl] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [previousImageUrl, setPreviousImageUrl] = useState('');
    const [refinedDesign, setRefinedDesign] = useState<JewelryDesign | null>(null);

    // Fetch design if not in state
    useEffect(() => {
        if (!design && id) {
            setLoading(true);
            getDesignById(parseInt(id))
                .then((data) => {
                    setDesign(data);
                    // Set selected image to the saved one or first generated
                    const selected = data.generatedImages.find(
                        (img) => img.url === data.selectedImageUrl
                    ) || data.generatedImages[0];
                    setSelectedImage(selected);
                    setCurrentImageUrl(selected.url);
                    setBaseImageUrl(selected.url);
                })
                .catch((err) => {
                    console.error('Failed to load design:', err);
                    setError('Failed to load design');
                    setTimeout(() => navigate('/jewelry-designer'), 2000);
                })
                .finally(() => setLoading(false));
        } else if (design && selectedImage) {
            setCurrentImageUrl(selectedImage.url);
            setBaseImageUrl(selectedImage.url);
        }
    }, [design, id, navigate, selectedImage]);

    const handleRefine = async (prompt: string, strength: number) => {
        if (!design || !id) return;

        setIsRefining(true);
        setError('');
        setSuccess('');

        try {
            // Store current image as previous for comparison
            setPreviousImageUrl(currentImageUrl);

            const result = await refineDesign(
                parseInt(id),
                prompt,
                baseImageUrl,
                strength,
                selectedImage?.id // pass original image ID for gallery matching
            );

            // Update design + show refined image
            setDesign(result.design);
            setCurrentImageUrl(result.refinement.imageUrl);
            // Do NOT update baseImageUrl — keep it pointing to original for consistent gallery matching
            setRefinedDesign(result.design);
            setSuccess('Design refined successfully! Click "Save & View in Gallery" to see it.');
            setShowComparison(true);

        } catch (err: unknown) {
            console.error('Refinement error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to refine design';
            setError(errorMessage);
        } finally {
            setIsRefining(false);
        }
    };

    const handleSelectVersion = (_versionId: string, imageUrl: string) => {
        setCurrentImageUrl(imageUrl);
        setBaseImageUrl(imageUrl);
        setShowComparison(false);
    };

    const downloadImage = (url: string, filename?: string) => {
        try {
            const link = document.createElement('a');
            link.download = filename || `jewelry-design-${Date.now()}.png`;

            if (url.startsWith('data:')) {
                // data URI — link directly
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Regular URL — fetch as blob
                fetch(url)
                    .then(r => r.blob())
                    .then(blob => {
                        const blobUrl = window.URL.createObjectURL(blob);
                        link.href = blobUrl;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);
                    });
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8', fontFamily: "'Market Sans', sans-serif" }}>
                <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                    <span>Loading design...</span>
                </div>
            </div>
        );
    }

    if (!design || !selectedImage) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}>
                <div className="flex items-center space-x-3 text-red-500">
                    <AlertCircle className="w-6 h-6" />
                    <span>Design not found</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: '#FAFAF8', fontFamily: "'Market Sans', sans-serif" }}>
            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/jewelry-designer/results"
                        state={{ design }}
                        className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Results
                    </Link>

                    <h1 className="text-3xl mb-2 text-gray-900" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}>
                        Refine Your Design
                    </h1>
                    <p className="text-gray-500">
                        Make adjustments to perfect your jewelry design
                    </p>
                </div>

                {/* Success / Save Panel — shown after a refinement completes */}
                {success && refinedDesign && (
                    <div className="mb-6 p-5 rounded-xl bg-green-50 border border-green-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                <p className="text-green-800 text-sm">{success}</p>
                            </div>
                            <button
                                onClick={() => {
                                    try {
                                        sessionStorage.setItem(
                                            'lastJewelryDesign',
                                            JSON.stringify(refinedDesign)
                                        );
                                    } catch { /* quota */ }
                                    navigate('/jewelry-designer/results', {
                                        state: { design: refinedDesign },
                                    });
                                }}
                                className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#0A1128] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save &amp; View in Gallery</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Design Display (2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Design */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Current Version
                                </h2>
                                <button
                                    onClick={() => downloadImage(currentImageUrl)}
                                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                            </div>

                            <div className="rounded-xl overflow-hidden">
                                <img
                                    src={currentImageUrl}
                                    alt="Current design"
                                    className="w-full aspect-square object-cover"
                                />
                            </div>
                        </div>

                        {/* Version History */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <VersionHistory
                                originalImages={design.generatedImages}
                                selectedOriginal={selectedImage}
                                refinements={design.refinements || []}
                                currentVersion={
                                    design.refinements?.find((r) => r.imageUrl === currentImageUrl)?.id ||
                                    selectedImage.id
                                }
                                onSelectVersion={handleSelectVersion}
                            />
                        </div>

                        {/* Comparison View */}
                        {showComparison && previousImageUrl && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <ComparisonView
                                    beforeImage={previousImageUrl}
                                    afterImage={currentImageUrl}
                                    beforeLabel="Previous"
                                    afterLabel="Refined"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: Refinement Controls (1 column) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8 space-y-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Refine Design
                            </h2>

                            <RefinementPrompt
                                onRefine={handleRefine}
                                isRefining={isRefining}
                            />

                            {/* Design Info */}
                            <div className="pt-6 border-t border-gray-200 space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Design Details
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="p-2 rounded bg-gray-50">
                                        <span className="text-gray-400 block text-xs">Gem</span>
                                        <span className="text-gray-900">{design.gemType} - {design.gemCut}</span>
                                    </div>
                                    <div className="p-2 rounded bg-gray-50">
                                        <span className="text-gray-400 block text-xs">Color</span>
                                        <span className="text-gray-900">{design.gemColor}</span>
                                    </div>
                                    <div className="col-span-2 p-2 rounded bg-gray-50">
                                        <span className="text-gray-400 block text-xs">Refinements</span>
                                        <span className="text-[#B8860B] font-medium">
                                            {design.refinements?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Original Prompt */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                    Original Prompt
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {design.designPrompt}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JewelryRefine;
