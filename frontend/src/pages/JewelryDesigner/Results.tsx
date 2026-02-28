import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Share2, AlertTriangle } from 'lucide-react';
import type { JewelryDesign, GeneratedImage } from '../../lib/jewelry-designer/types';
import { saveDesign } from '../../lib/jewelry-designer/api';
import { DesignGallery } from '../../components/jewelry-designer/results/DesignGallery';

const JewelryResults: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Try location.state first, then sessionStorage fallback (for back-navigation)
    const design = (location.state?.design ||
        (() => {
            try { return JSON.parse(sessionStorage.getItem('lastJewelryDesign') || ''); } catch { return null; }
        })()
    ) as JewelryDesign | undefined;

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Persist design to sessionStorage whenever it changes
    useEffect(() => {
        if (design) {
            try { sessionStorage.setItem('lastJewelryDesign', JSON.stringify(design)); } catch { /* quota exceeded */ }
        }
    }, [design]);

    useEffect(() => {
        if (!design) {
            navigate('/jewelry-designer');
        }
    }, [design, navigate]);

    if (!design) {
        return (
            <div style={{ minHeight: '100vh', background: '#0A1128', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#9CA3AF' }}>Redirecting...</p>
            </div>
        );
    }

    // Safe access for potentially missing fields
    const generatedImages = design.generatedImages || [];
    const metals = design.materials?.metals || [];


    const handleSelectDesign = async (image: GeneratedImage) => {
        setSaving(true);
        setError('');

        try {
            await saveDesign(design.id, image.url);
            setSaved(true);

            // Navigate to refinement page (Phase 5)
            setTimeout(() => {
                navigate(`/jewelry-designer/refine/${design.id}`, {
                    state: { design, selectedImage: image },
                });
            }, 1500);
        } catch (err: unknown) {
            console.error('Save error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to save design';
            setError(errorMessage);
            setSaving(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My AI Jewelry Design',
                text: 'Check out my custom jewelry design created with AI!',
                url: window.location.href,
            }).catch(() => {
                // User cancelled or share failed
            });
        } else {
            // Fallback: Copy URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1128]">
            <div className="max-w-6xl mx-auto py-12 px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/jewelry-designer"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Designer
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif text-[#D4AF37] mb-2">
                                Your Designs are Ready! ✨
                            </h1>
                            <p className="text-gray-400">
                                We created {generatedImages.length} unique concept{generatedImages.length !== 1 ? 's' : ''} based on your specifications
                            </p>
                        </div>
                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                {/* Design Summary */}
                <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 mb-8">
                    <h2 className="text-lg font-medium text-white mb-4">
                        Design Specifications
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-[#1a1f35]">
                            <p className="text-xs text-gray-500 mb-1">Gem Type</p>
                            <p className="text-white font-medium">{design.gemType}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#1a1f35]">
                            <p className="text-xs text-gray-500 mb-1">Cut</p>
                            <p className="text-white font-medium">{design.gemCut}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#1a1f35]">
                            <p className="text-xs text-gray-500 mb-1">Color</p>
                            <p className="text-white font-medium">{design.gemColor}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#1a1f35]">
                            <p className="text-xs text-gray-500 mb-1">Materials</p>
                            <p className="text-white font-medium text-sm">
                                {metals.length > 0 ? metals.join(', ') : 'Not specified'}
                            </p>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#1a1f35]">
                        <p className="text-xs text-gray-500 mb-1">Your Prompt</p>
                        <p className="text-white text-sm">{design.designPrompt}</p>
                    </div>
                </div>

                {/* Success Message */}
                {saved && (
                    <div className="mb-6 p-4 rounded-xl bg-green-900/30 border border-green-700/50">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <p className="text-green-200">
                                Design saved successfully! Redirecting to refinement...
                            </p>
                        </div>
                    </div>
                )}

                {/* Saving State */}
                {saving && !saved && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-900/30 border border-blue-700/50">
                        <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
                            <p className="text-blue-200">Saving your design...</p>
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

                {/* Gallery */}
                <DesignGallery
                    images={generatedImages}
                    refinements={design.refinements || []}
                    onSelectDesign={handleSelectDesign}
                />

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <h3 className="text-xl text-white mb-2">
                        Love your design? Take the next step!
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Select your favorite design to refine it further, or create a new design from scratch.
                    </p>
                    <Link
                        to="/jewelry-designer"
                        className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                    >
                        Create New Design
                    </Link>
                </div>

                {/* Disclaimer */}
                <div className="mt-12 p-6 rounded-xl bg-amber-900/20 border border-amber-700/30">
                    <div className="flex items-start">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mr-4 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-amber-200 font-medium mb-2">
                                Important: These are AI-Generated Concept Renderings
                            </h4>
                            <p className="text-amber-200/80 text-sm leading-relaxed">
                                The jewelry designs created by this tool are AI-generated concept visualizations for inspiration and reference purposes only.
                                They are NOT production-ready technical drawings, guaranteed to be structurally sound or manufacturable, or accurate representations
                                of gem color, clarity, or cut. Before manufacturing any jewelry based on these designs, please consult with a licensed professional
                                jeweler who can assess structural feasibility, verify proper gem setting techniques, ensure wearability and durability, and provide
                                accurate cost estimates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JewelryResults;
