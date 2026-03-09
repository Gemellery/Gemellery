import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, History, ChevronLeft, ChevronRight, Gem, Clock } from 'lucide-react';
import { getUserDesigns } from '../../../lib/jewelry-designer/api';
import type { JewelryDesign } from '../../../lib/jewelry-designer/types';

interface DesignHistorySidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    onDesignCreated?: number; // design ID to trigger refresh
}

// Group designs by date
function groupByDate(designs: JewelryDesign[]): { label: string; designs: JewelryDesign[] }[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    const groups: { label: string; designs: JewelryDesign[] }[] = [
        { label: 'Today', designs: [] },
        { label: 'Yesterday', designs: [] },
        { label: 'This Week', designs: [] },
        { label: 'Older', designs: [] },
    ];

    designs.forEach((d) => {
        const date = new Date(d.createdAt);
        if (date >= today) groups[0].designs.push(d);
        else if (date >= yesterday) groups[1].designs.push(d);
        else if (date >= weekAgo) groups[2].designs.push(d);
        else groups[3].designs.push(d);
    });

    return groups.filter((g) => g.designs.length > 0);
}

// Get a small thumbnail from the first generated image (or a placeholder)
function getDesignThumbnail(design: JewelryDesign): string | null {
    if (design.generatedImages && design.generatedImages.length > 0) {
        return design.generatedImages[0].thumbnailUrl || design.generatedImages[0].url;
    }
    return null;
}

export const DesignHistorySidebar: React.FC<DesignHistorySidebarProps> = ({
    isOpen,
    onToggle,
    onDesignCreated,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [designs, setDesigns] = useState<JewelryDesign[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDesigns = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserDesigns();
            // Sort newest first
            setDesigns(data.sort((a: JewelryDesign, b: JewelryDesign) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (err) {
            console.error('Failed to load design history:', err);
            setDesigns([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDesigns();
    }, [fetchDesigns, onDesignCreated, location.pathname]);

    const groups = groupByDate(designs);

    // Check if a design is currently selected
    const getActiveDesignId = (): number | null => {
        const match = location.pathname.match(/\/jewelry-designer\/design\/(\d+)/);
        return match ? parseInt(match[1]) : null;
    };
    const activeDesignId = getActiveDesignId();

    const handleDesignClick = (designId: number) => {
        navigate(`/jewelry-designer/design/${designId}`);
    };

    const handleNewDesign = () => {
        navigate('/jewelry-designer');
    };

    // Sidebar styles
    const sidebarStyle: React.CSSProperties = {
        width: isOpen ? '280px' : '0px',
        minWidth: isOpen ? '280px' : '0px',
        height: '100%',
        background: '#FFFFFF',
        borderRight: isOpen ? '1px solid #E5E7EB' : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        position: 'relative',
        fontFamily: "'Market Sans', sans-serif",
    };

    const toggleBtnStyle: React.CSSProperties = {
        position: 'absolute',
        top: '16px',
        right: isOpen ? '12px' : '-36px',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        background: '#F3F4F6',
        border: '1px solid #E5E7EB',
        color: '#6B7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
        transition: 'all 0.2s ease',
    };

    return (
        <div style={sidebarStyle}>
            {/* Toggle button */}
            <div
                style={toggleBtnStyle}
                onClick={onToggle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#E5E7EB';
                    e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F3F4F6';
                    e.currentTarget.style.color = '#6B7280';
                }}
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </div>

            {isOpen && (
                <>
                    {/* Header */}
                    <div style={{ padding: '16px 16px 8px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <History size={18} color="#D4AF37" />
                            <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: 600 }}>
                                Design History
                            </span>
                        </div>

                        {/* New Design button */}
                        <button
                            onClick={handleNewDesign}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px dashed rgba(212, 175, 55, 0.4)',
                                background: 'rgba(212, 175, 55, 0.05)',
                                color: '#B8860B',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                            }}
                        >
                            <Plus size={16} />
                            New Design
                        </button>
                    </div>

                    {/* Design list */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
                                <Clock size={20} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                                <span style={{ fontSize: '12px' }}>Loading...</span>
                            </div>
                        ) : designs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
                                <Gem size={24} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
                                <p style={{ fontSize: '12px', margin: 0 }}>No designs yet</p>
                                <p style={{ fontSize: '11px', margin: '4px 0 0', opacity: 0.7 }}>
                                    Create your first design!
                                </p>
                            </div>
                        ) : (
                            groups.map((group) => (
                                <div key={group.label} style={{ marginBottom: '12px' }}>
                                    {/* Group label */}
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: '#6B7280',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            padding: '4px 8px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {group.label}
                                    </div>

                                    {/* Designs in group */}
                                    {group.designs.map((design) => {
                                        const isActive = activeDesignId === design.id;
                                        const thumb = getDesignThumbnail(design);

                                        return (
                                            <div
                                                key={design.id}
                                                onClick={() => handleDesignClick(design.id)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    background: isActive
                                                        ? 'rgba(212, 175, 55, 0.12)'
                                                        : 'transparent',
                                                    border: isActive
                                                        ? '1px solid rgba(212, 175, 55, 0.25)'
                                                        : '1px solid transparent',
                                                    marginBottom: '2px',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isActive) {
                                                        e.currentTarget.style.background = '#F9FAFB';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isActive) {
                                                        e.currentTarget.style.background = 'transparent';
                                                    }
                                                }}
                                            >
                                                {/* Thumbnail */}
                                                <div
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '6px',
                                                        background: '#F3F4F6',
                                                        flexShrink: 0,
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {thumb ? (
                                                        <img
                                                            src={thumb}
                                                            alt=""
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    ) : (
                                                        <Gem size={16} color="#4B5563" />
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div
                                                        style={{
                                                            fontSize: '13px',
                                                            color: isActive ? '#B8860B' : '#374151',
                                                            fontWeight: isActive ? 600 : 400,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {design.gemType} {design.gemCut}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: '11px',
                                                            color: '#6B7280',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {design.designPrompt.length > 30
                                                            ? design.designPrompt.slice(0, 30) + '…'
                                                            : design.designPrompt}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DesignHistorySidebar;
