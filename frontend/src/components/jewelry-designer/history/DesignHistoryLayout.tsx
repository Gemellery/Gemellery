import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DesignHistorySidebar } from './DesignHistorySidebar';
import { PanelLeftOpen } from 'lucide-react';
import Navbar from '../../Navbar';

// Layout wrapper: Navbar + sidebar + child route content
export const DesignHistoryLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100%',
                background: '#FAFAF8',
                overflow: 'hidden',
            }}
        >
            {/* Common Navbar */}
            <Navbar />

            {/* Below the navbar: sidebar + content */}
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                {/* Sidebar */}
                <DesignHistorySidebar
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                />

                {/* Toggle button when sidebar is closed */}
                {!sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            position: 'fixed',
                            top: '80px',
                            left: '8px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: '#F3F4F6',
                            border: '1px solid #E5E7EB',
                            color: '#6B7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 50,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#E5E7EB';
                            e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#F3F4F6';
                            e.currentTarget.style.color = '#6B7280';
                        }}
                    >
                        <PanelLeftOpen size={16} />
                    </div>
                )}

                {/* Main content area — renders the child route */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        height: '100%',
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DesignHistoryLayout;
