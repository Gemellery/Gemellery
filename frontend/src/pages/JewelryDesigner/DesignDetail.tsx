import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Gem, Palette, Sparkles, ArrowLeft,
    Wand2, Image as ImageIcon, Clock, ChevronDown, ChevronUp,
} from 'lucide-react';
import { getDesignById } from '../../lib/jewelry-designer/api';
import type { JewelryDesign, Refinement } from '../../lib/jewelry-designer/types';

const DesignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [design, setDesign] = useState<JewelryDesign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showSpecs, setShowSpecs] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getDesignById(parseInt(id))
            .then((d) => {
                setDesign(d);
                // Set first image as selected
                if (d.generatedImages && d.generatedImages.length > 0) {
                    setSelectedImage(d.generatedImages[0].url);
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                    <Clock size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
                    <p>Loading design...</p>
                </div>
            </div>
        );
    }

    if (error || !design) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p style={{ color: '#EF4444', fontSize: '16px' }}>{error || 'Design not found'}</p>
                    <button
                        onClick={() => navigate('/jewelry-designer')}
                        style={backBtnStyle}
                    >
                        <ArrowLeft size={16} /> Back to Designer
                    </button>
                </div>
            </div>
        );
    }

    const refinements = design.refinements || [];

    // Get refinements for a specific original image
    const getRefinementsForImage = (imageId: string): Refinement[] => {
        return refinements.filter(
            (r) =>
                (r.baseImageId && r.baseImageId === imageId) ||
                (!r.baseImageId && r.baseImageUrl === design.generatedImages.find(img => img.id === imageId)?.url)
        );
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <button onClick={() => navigate('/jewelry-designer')} style={backBtnStyle}>
                    <ArrowLeft size={16} /> Back to Designer
                </button>
                <h1 style={{ color: '#E5E7EB', fontSize: '20px', fontWeight: 600, margin: 0 }}>
                    {design.gemType} {design.gemCut} Design
                </h1>
                <span style={{ color: '#6B7280', fontSize: '12px' }}>
                    Created {new Date(design.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                    })}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* Left: Images Section */}
                <div style={{ flex: '1 1 600px' }}>
                    {/* Selected Image (large) */}
                    {selectedImage && (
                        <div style={largeImageContainerStyle}>
                            <img
                                src={selectedImage}
                                alt="Design"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
                            />
                        </div>
                    )}

                    {/* Generated Images Gallery */}
                    <div style={{ marginTop: '16px' }}>
                        <h3 style={sectionTitleStyle}>
                            <ImageIcon size={16} color="#D4AF37" />
                            Generated Images ({design.generatedImages.length})
                        </h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {design.generatedImages.map((img, idx) => {
                                const imgRefinements = getRefinementsForImage(img.id);
                                const isSelected = selectedImage === img.url;

                                return (
                                    <div key={img.id} style={{ position: 'relative' }}>
                                        <div
                                            onClick={() => setSelectedImage(img.url)}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: isSelected
                                                    ? '2px solid #D4AF37'
                                                    : '2px solid transparent',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <img
                                                src={img.thumbnailUrl || img.url}
                                                alt={`Design ${idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <span style={{
                                            position: 'absolute',
                                            bottom: '4px',
                                            left: '4px',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: '#fff',
                                            fontSize: '10px',
                                            padding: '1px 5px',
                                            borderRadius: '4px',
                                        }}>
                                            #{idx + 1}
                                        </span>
                                        {imgRefinements.length > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                background: '#D4AF37',
                                                color: '#000',
                                                fontSize: '9px',
                                                fontWeight: 700,
                                                padding: '1px 4px',
                                                borderRadius: '4px',
                                            }}>
                                                {imgRefinements.length} refined
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Refinements Section */}
                    {refinements.length > 0 && (
                        <div style={{ marginTop: '24px' }}>
                            <h3 style={sectionTitleStyle}>
                                <Wand2 size={16} color="#D4AF37" />
                                Refinements ({refinements.length})
                            </h3>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {refinements.map((ref, idx) => {
                                    const isSelected = selectedImage === ref.imageUrl;
                                    return (
                                        <div key={ref.id} style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setSelectedImage(ref.imageUrl)}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: isSelected
                                                        ? '2px solid #A855F7'
                                                        : '2px solid transparent',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <img
                                                    src={ref.thumbnailUrl || ref.imageUrl}
                                                    alt={`Refinement ${idx + 1}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <span style={{
                                                position: 'absolute',
                                                bottom: '4px',
                                                left: '4px',
                                                background: 'rgba(168, 85, 247, 0.8)',
                                                color: '#fff',
                                                fontSize: '10px',
                                                padding: '1px 5px',
                                                borderRadius: '4px',
                                            }}>
                                                R{idx + 1}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Refinement prompts */}
                            <div style={{ marginTop: '12px' }}>
                                {refinements.map((ref, idx) => (
                                    <div
                                        key={ref.id}
                                        style={{
                                            padding: '8px 12px',
                                            background: 'rgba(168, 85, 247, 0.06)',
                                            border: '1px solid rgba(168, 85, 247, 0.15)',
                                            borderRadius: '6px',
                                            marginBottom: '6px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setSelectedImage(ref.imageUrl)}
                                    >
                                        <span style={{ fontSize: '11px', color: '#A855F7', fontWeight: 600 }}>
                                            Refinement {idx + 1}:
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#D1D5DB', marginLeft: '8px' }}>
                                            "{ref.prompt}"
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Design Details Panel */}
                <div style={{ flex: '0 0 320px', minWidth: '280px' }}>
                    {/* Prompt */}
                    <div style={panelCardStyle}>
                        <h3 style={sectionTitleStyle}>
                            <Sparkles size={16} color="#D4AF37" />
                            Design Prompt
                        </h3>
                        <p style={{ color: '#D1D5DB', fontSize: '14px', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                            "{design.designPrompt}"
                        </p>
                    </div>

                    {/* Gem Specifications (collapsible) */}
                    <div style={{ ...panelCardStyle, marginTop: '12px' }}>
                        <div
                            onClick={() => setShowSpecs(!showSpecs)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                        >
                            <h3 style={{ ...sectionTitleStyle, marginBottom: 0 }}>
                                <Gem size={16} color="#D4AF37" />
                                Gem Specifications
                            </h3>
                            {showSpecs ? <ChevronUp size={16} color="#6B7280" /> : <ChevronDown size={16} color="#6B7280" />}
                        </div>

                        {showSpecs && (
                            <div style={{ marginTop: '12px' }}>
                                <SpecRow label="Type" value={design.gemType} />
                                <SpecRow label="Cut" value={design.gemCut} />
                                <SpecRow label="Color" value={design.gemColor} />
                                <SpecRow label="Transparency" value={design.gemTransparency} />
                                {design.gemSizeMode === 'simple' && design.gemSizeSimple && (
                                    <SpecRow label="Size" value={design.gemSizeSimple} />
                                )}
                                {design.gemSizeMode === 'advanced' && (
                                    <>
                                        {design.gemSizeLengthMm && <SpecRow label="Length" value={`${design.gemSizeLengthMm}mm`} />}
                                        {design.gemSizeWidthMm && <SpecRow label="Width" value={`${design.gemSizeWidthMm}mm`} />}
                                        {design.gemSizeHeightMm && <SpecRow label="Height" value={`${design.gemSizeHeightMm}mm`} />}
                                        {design.gemSizeCarat && <SpecRow label="Carat" value={`${design.gemSizeCarat}ct`} />}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Materials */}
                    {design.materials && design.materials.metals && design.materials.metals.length > 0 && (
                        <div style={{ ...panelCardStyle, marginTop: '12px' }}>
                            <h3 style={sectionTitleStyle}>
                                <Palette size={16} color="#D4AF37" />
                                Materials
                            </h3>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {design.materials.metals.map((metal) => (
                                    <span
                                        key={metal}
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            background: 'rgba(212, 175, 55, 0.1)',
                                            border: '1px solid rgba(212, 175, 55, 0.2)',
                                            color: '#D4AF37',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {metal}
                                    </span>
                                ))}
                            </div>
                            {design.materials.finish && (
                                <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '8px' }}>
                                    Finish: {design.materials.finish}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ marginTop: '16px' }}>
                        <button
                            onClick={() => navigate(`/jewelry-designer/refine/${design.id}`)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                color: '#000',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'opacity 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                        >
                            <Wand2 size={16} />
                            Refine This Design
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Spec row helper
const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '6px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
        <span style={{ color: '#6B7280', fontSize: '13px' }}>{label}</span>
        <span style={{ color: '#D1D5DB', fontSize: '13px', fontWeight: 500 }}>{value}</span>
    </div>
);

// Styles
const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px',
    flexWrap: 'wrap',
};

const backBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#9CA3AF',
    fontSize: '13px',
    cursor: 'pointer',
};

const largeImageContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const sectionTitleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#E5E7EB',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '12px',
};

const panelCardStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
};

export default DesignDetail;
