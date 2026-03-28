import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, History, ChevronLeft, ChevronRight, Gem, Clock, MoreHorizontal, Pin, Trash2 } from 'lucide-react';
import { getUserDesigns, deleteDesign } from '../../../lib/jewelry-designer/api';
import type { JewelryDesign } from '../../../lib/jewelry-designer/types';

interface DesignHistorySidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    onDesignCreated?: number; // design ID to trigger refresh
}

// Group designs by date (pinned designs always on top)
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
    const [loading, setLoading] = useState(true);
    const [pinnedIds, setPinnedIds] = useState<Set<number>>(() => {
        try {
            const stored = localStorage.getItem('pinnedDesigns');
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
            return new Set();
        }
    });
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const fetchDesigns = useCallback(async () => {
        try {
            const data = await getUserDesigns();
            setDesigns(data.sort((a: JewelryDesign, b: JewelryDesign) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (err) {
            console.error('Failed to load design history:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDesigns();
    }, [fetchDesigns, onDesignCreated, location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuId(null);
            }
        };
        if (openMenuId !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const togglePin = (designId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(null);
        setPinnedIds(prev => {
            const next = new Set(prev);
            if (next.has(designId)) {
                next.delete(designId);
            } else {
                next.add(designId);
            }
            localStorage.setItem('pinnedDesigns', JSON.stringify([...next]));
            return next;
        });
    };

    const handleDelete = async (designId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(null);
        setDeletingId(designId);
        try {
            await deleteDesign(designId);
            setDesigns(prev => prev.filter(d => d.id !== designId));
            // If we're viewing the deleted design, navigate away
            if (location.pathname.includes(`/jewelry-designer/design/${designId}`)) {
                navigate('/jewelry-designer');
            }
        } catch (err) {
            console.error('Failed to delete design:', err);
        } finally {
            setDeletingId(null);
        }
    };

    // Sort: pinned first, then by date
    const sortedDesigns = [
        ...designs.filter(d => pinnedIds.has(d.id)),
        ...designs.filter(d => !pinnedIds.has(d.id)),
    ];

    // Pinned group + date groups for unpinned
    const pinnedDesigns = sortedDesigns.filter(d => pinnedIds.has(d.id));
    const unpinnedDesigns = sortedDesigns.filter(d => !pinnedIds.has(d.id));
    const dateGroups = groupByDate(unpinnedDesigns);

    const allGroups: { label: string; designs: JewelryDesign[] }[] = [
        ...(pinnedDesigns.length > 0 ? [{ label: '📌 Pinned', designs: pinnedDesigns }] : []),
        ...dateGroups,
    ];

    const getActiveDesignId = (): number | null => {
        const match = location.pathname.match(/\/jewelry-designer\/design\/(\d+)/);
        return match ? parseInt(match[1]) : null;
    };
    const activeDesignId = getActiveDesignId();

    const handleDesignClick = (designId: number) => {
        navigate(`/jewelry-designer/design/${designId}`);
    };

    const sidebarClasses = `
        h-full bg-white flex flex-col overflow-hidden transition-all duration-300 relative
        ${isOpen ? 'w-[280px] min-w-[280px] border-r border-gray-200' : 'w-0 min-w-0 border-r-0'}
    `;

    return (
        <div className={sidebarClasses} style={{ fontFamily: "'Market Sans', sans-serif" }}>
            {/* Toggle button */}
            <div
                className={`absolute top-4 ${isOpen ? 'right-3' : '-right-9'} w-7 h-7 rounded-md bg-gray-100 border border-gray-200 text-gray-500 flex items-center justify-center cursor-pointer z-10 transition-all duration-200 hover:bg-gray-200 hover:text-gray-900 md:flex hidden`}
                onClick={onToggle}
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
                        <button
                            onClick={() => navigate('/jewelry-designer')}
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
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }} ref={menuRef}>
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
                            allGroups.map((group) => (
                                <div key={group.label} style={{ marginBottom: '12px' }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#6B7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        padding: '4px 8px',
                                        fontWeight: 600,
                                    }}>
                                        {group.label}
                                    </div>

                                    {group.designs.map((design) => {
                                        const isActive = activeDesignId === design.id;
                                        const isPinned = pinnedIds.has(design.id);
                                        const isDeleting = deletingId === design.id;
                                        const isMenuOpen = openMenuId === design.id;
                                        const thumb = getDesignThumbnail(design);

                                        return (
                                            <div
                                                key={design.id}
                                                style={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    cursor: isDeleting ? 'wait' : 'pointer',
                                                    background: isActive
                                                        ? 'rgba(212, 175, 55, 0.12)'
                                                        : 'transparent',
                                                    border: isActive
                                                        ? '1px solid rgba(212, 175, 55, 0.25)'
                                                        : '1px solid transparent',
                                                    marginBottom: '2px',
                                                    transition: 'all 0.15s ease',
                                                    opacity: isDeleting ? 0.4 : 1,
                                                }}
                                                onClick={() => !isDeleting && handleDesignClick(design.id)}
                                                onMouseEnter={(e) => {
                                                    if (!isActive) e.currentTarget.style.background = '#F9FAFB';
                                                    // Show the three-dot button
                                                    const btn = e.currentTarget.querySelector<HTMLElement>('.three-dot-btn');
                                                    if (btn) btn.style.opacity = '1';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isActive) e.currentTarget.style.background = 'transparent';
                                                    if (!isMenuOpen) {
                                                        const btn = e.currentTarget.querySelector<HTMLElement>('.three-dot-btn');
                                                        if (btn) btn.style.opacity = '0';
                                                    }
                                                }}
                                            >
                                                {/* Thumbnail */}
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '6px',
                                                    background: '#F3F4F6',
                                                    flexShrink: 0,
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    {thumb ? (
                                                        <img
                                                            src={thumb}
                                                            alt=""
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <Gem size={16} color="#4B5563" />
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: isActive ? '#B8860B' : '#374151',
                                                        fontWeight: isActive ? 600 : 400,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                                        {isPinned && <span style={{ marginRight: '4px', fontSize: '11px' }}>📌</span>}
                                                        {design.gemType} {design.gemCut}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '11px',
                                                        color: '#6B7280',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                                        {design.designPrompt.length > 28
                                                            ? design.designPrompt.slice(0, 28) + '…'
                                                            : design.designPrompt}
                                                    </div>
                                                </div>

                                                {/* Three-dot menu button */}
                                                <button
                                                    className="three-dot-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(isMenuOpen ? null : design.id);
                                                    }}
                                                    style={{
                                                        opacity: isMenuOpen ? 1 : 0,
                                                        flexShrink: 0,
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '4px',
                                                        border: 'none',
                                                        background: isMenuOpen ? '#F3F4F6' : 'transparent',
                                                        color: '#6B7280',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'opacity 0.15s ease, background 0.15s ease',
                                                        padding: 0,
                                                    }}
                                                    title="More options"
                                                >
                                                    <MoreHorizontal size={14} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {isMenuOpen && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            right: '4px',
                                                            zIndex: 100,
                                                            background: '#FFFFFF',
                                                            border: '1px solid #E5E7EB',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                                            minWidth: '140px',
                                                            overflow: 'hidden',
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={(e) => togglePin(design.id, e)}
                                                            style={{
                                                                width: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                padding: '9px 12px',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                color: '#374151',
                                                                textAlign: 'left',
                                                            }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                                                        >
                                                            <Pin size={13} color="#D4AF37" />
                                                            {isPinned ? 'Unpin' : 'Pin'}
                                                        </button>
                                                        <div style={{ height: '1px', background: '#F3F4F6' }} />
                                                        <button
                                                            onClick={(e) => handleDelete(design.id, e)}
                                                            style={{
                                                                width: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                padding: '9px 12px',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                color: '#DC2626',
                                                                textAlign: 'left',
                                                            }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                                                        >
                                                            <Trash2 size={13} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
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
