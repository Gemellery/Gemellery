import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DesignHistorySidebar } from './DesignHistorySidebar';
import { PanelLeftOpen, Menu } from 'lucide-react';
import Navbar from '../../Navbar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Layout wrapper: Navbar + sidebar + child route content
export const DesignHistoryLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex flex-col h-screen w-full bg-[#FAFAF8] overflow-hidden">
            {/* Common Navbar */}
            <Navbar />

            {/* Below the navbar: sidebar + content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Hamburger Menu - Only shows on < md screens */}
                <div className="md:hidden absolute top-4 left-4 z-50">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="p-2 bg-white/50 backdrop-blur-md border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:bg-white/80 transition-all flex items-center justify-center">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px] bg-white border-r">
                            {/* Pass a dummy toggle since mobile Sheet handles its own close behavior automatically */}
                            <DesignHistorySidebar isOpen={true} onToggle={() => {}} />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Sidebar - Hidden on < md screens */}
                <div className="hidden md:flex h-full relative z-40">
                    <DesignHistorySidebar
                        isOpen={sidebarOpen}
                        onToggle={() => setSidebarOpen(!sidebarOpen)}
                    />
                </div>

                {/* Toggle button when desktop sidebar is closed */}
                {!sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(true)}
                        className="hidden md:flex absolute top-4 left-4 w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-500 items-center justify-center cursor-pointer z-50 transition-all hover:bg-gray-100 hover:text-gray-900 shadow-sm shadow-gray-200/50"
                    >
                        <PanelLeftOpen size={16} />
                    </div>
                )}

                {/* Main content area — renders the child route */}
                <div className="flex-1 overflow-y-auto h-full w-full relative">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DesignHistoryLayout;
