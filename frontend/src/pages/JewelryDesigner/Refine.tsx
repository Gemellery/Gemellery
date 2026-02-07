import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, AlertCircle } from 'lucide-react';
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
                strength
            );

            // Update design with new refinement
            setDesign(result.design);
            setCurrentImageUrl(result.refinement.imageUrl);
            setBaseImageUrl(result.refinement.imageUrl);
            setSuccess('Design refined successfully!');
            setShowComparison(true);

            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
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

    const downloadImage = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `refined-design-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
                <div className="flex items-center space-x-3 text-white">
                    <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                    <span>Loading design...</span>
                </div>
            </div>
        );
    }

    if (!design || !selectedImage) {
        return (
            <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
                <div className="flex items-center space-x-3 text-red-400">
                    <AlertCircle className="w-6 h-6" />
                    <span>Design not found</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A1128]">
            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/jewelry-designer/results"
                        state={{ design }}
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Results
                    </Link>

                    <h1 className="text-3xl font-serif text-[#D4AF37] mb-2">
                        Refine Your Design
                    </h1>
                    <p className="text-gray-400">
                        Make adjustments to perfect your jewelry design
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 rounded-xl bg-green-900/30 border border-green-700/50">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <p className="text-green-200">{success}</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                            <p className="text-red-200">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Design Display (2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Design */}
                        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-white">
                                    Current Version
                                </h2>
                                <button
                                    onClick={() => downloadImage(currentImageUrl)}
                                    className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
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
                        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6">
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
                            <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6">
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
                        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 sticky top-8 space-y-6">
                            <h2 className="text-lg font-medium text-white">
                                Refine Design
                            </h2>

                            <RefinementPrompt
                                onRefine={handleRefine}
                                isRefining={isRefining}
                            />

                            {/* Design Info */}
                            <div className="pt-6 border-t border-gray-700 space-y-4">
                                <h3 className="text-sm font-medium text-white">
                                    Design Details
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="p-2 rounded bg-[#1a1f35]">
                                        <span className="text-gray-500 block text-xs">Gem</span>
                                        <span className="text-white">{design.gemType} - {design.gemCut}</span>
                                    </div>
                                    <div className="p-2 rounded bg-[#1a1f35]">
                                        <span className="text-gray-500 block text-xs">Color</span>
                                        <span className="text-white">{design.gemColor}</span>
                                    </div>
                                    <div className="col-span-2 p-2 rounded bg-[#1a1f35]">
                                        <span className="text-gray-500 block text-xs">Refinements</span>
                                        <span className="text-[#D4AF37] font-medium">
                                            {design.refinements?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Original Prompt */}
                            <div className="pt-4 border-t border-gray-700">
                                <h3 className="text-sm font-medium text-white mb-2">
                                    Original Prompt
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
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
