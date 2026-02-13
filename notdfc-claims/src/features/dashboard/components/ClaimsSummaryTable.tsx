"use client";

import React, { useState, useEffect } from 'react';
import { Claim } from '@/features/claims/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

interface ClaimsSummaryTableProps {
    claims: Claim[];
}

/**
 * Claims Summary Table
 * Displays the 5 most recent claims with status badges.
 */
export const ClaimsSummaryTable: React.FC<ClaimsSummaryTableProps> = ({ claims }) => {
    const [loading, setLoading] = useState(true);

    // Simulate data fetching to show off the Skeleton loaders (NFR4)
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50">
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="p-0">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-3 w-1/6" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-notdfc-navy-deep flex items-center gap-2">
                    <FileText className="w-4 h-4 text-notdfc-navy-light" />
                    Recent Claims
                </h3>
                <Link
                    href="/dashboard/history"
                    className="text-xs font-semibold text-notdfc-navy-light hover:text-notdfc-navy-deep hover:underline flex items-center gap-1"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/30 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Claim ID</th>
                            <th className="px-6 py-3">Date Submitted</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {claims.slice(0, 5).map((claim) => (
                            <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <Link href={`/claims/${claim.id}`} className="block">
                                        <span className="font-mono text-xs font-bold text-notdfc-navy-light bg-notdfc-navy-light/5 px-2 py-1 rounded hover:bg-notdfc-navy-light/10 transition-colors">
                                            {claim.id}
                                        </span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(claim.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-notdfc-navy-deep">
                                    ${claim.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <StatusBadge status={claim.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
