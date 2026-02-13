"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, History, Settings, LogOut } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Initiate Claim', href: '/claims/new', icon: PlusCircle },
    { name: 'Claim History', href: '/dashboard/history', icon: History },
];

/**
 * Sidebar Navigation
 * Consistent with NotDFC "Deep Navy" branding.
 * Responsive behavior: Desktop persistent, Mobile side-drawer (logic handled by parent).
 */
export const Sidebar: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-notdfc-navy-deep text-white flex flex-col h-full border-r border-notdfc-navy-light shadow-xl">
            <div className="p-6">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <span className="bg-white text-notdfc-navy-deep px-2 py-0.5 rounded italic">NotDFC</span>
                    Claims
                </h2>
            </div>

            <nav className="flex-1 mt-4 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-notdfc-navy-light text-white shadow-inner border border-white/10'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-white transition-colors'}`} />
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-notdfc-navy-light/50">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </Link>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10 mt-1"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};
