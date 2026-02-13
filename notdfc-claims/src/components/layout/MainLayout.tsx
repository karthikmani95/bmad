"use client";

import React, { useState, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X, User } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

/**
 * Global Layout Wrapper
 * Implements the responsive shell with Top Navbar and Sidebar.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#FDFDFD]">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex h-full">
                <Suspense fallback={<div className="w-64 bg-notdfc-navy-deep h-full" />}>
                    <Sidebar />
                </Suspense>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <Suspense fallback={<div className="w-64 bg-notdfc-navy-deep h-full" />}>
                    <Sidebar />
                </Suspense>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-semibold text-notdfc-navy-deep hidden sm:block">
                            Secure Claim Management
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-sm font-medium text-gray-900 leading-none">Karthik Mani</span>
                            <span className="text-xs text-notdfc-navy-light/60">Retail Customer</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-notdfc-navy-deep flex items-center justify-center text-white ring-2 ring-notdfc-silver ring-offset-2">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                </header>

                {/* Content Body - No global scroll, children handle internal scroll */}
                <main className="flex-1 flex flex-col min-h-0 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
