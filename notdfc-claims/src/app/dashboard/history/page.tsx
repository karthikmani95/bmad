"use client";

import React, { useState, useEffect } from 'react';
import { getClaims } from '@/lib/supabase/database';
import { Claim } from '@/features/claims/types';
import { StatusBadge } from '@/features/claims/components/details/StatusBadge';
import { ClaimStatus } from '@/features/claims/types';
import { FileText, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ClaimHistoryPage() {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'All'>('All');

    // Fetch claims on mount
    useEffect(() => {
        async function loadClaims() {
            const data = await getClaims();
            setClaims(data);
            setLoading(false);
        }
        loadClaims();
    }, []);

    // Filter claims based on search and status
    const filteredClaims = claims.filter(claim => {
        const matchesSearch = claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.reason.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-6 animate-in fade-in duration-700 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-notdfc-navy-deep tracking-tight">
                            Claim History
                        </h2>
                        <p className="text-gray-500 mt-1">
                            View and manage all your submitted claims.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Claim ID or reason..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-notdfc-navy-light/10 focus:border-notdfc-navy-light transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | 'All')}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-notdfc-navy-light/10 focus:border-notdfc-navy-light transition-all"
                            >
                                <option value="All">All Status</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-500">
                    Showing <span className="font-bold text-notdfc-navy-deep">{filteredClaims.length}</span> of {claims.length} claims
                </div>

                {/* Claims Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/30 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Claim ID</th>
                                    <th className="px-6 py-4">Transaction Date</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredClaims.length > 0 ? (
                                    filteredClaims.map((claim) => (
                                        <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <Link href={`/claims/${claim.id}`} className="block">
                                                    <span className="font-mono text-xs font-bold text-notdfc-navy-light bg-notdfc-navy-light/5 px-2 py-1 rounded hover:bg-notdfc-navy-light/10 transition-colors">
                                                        {claim.id}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(claim.transactionDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                                    {claim.disputeType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {claim.reason}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-notdfc-navy-deep">
                                                ${claim.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(claim.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <StatusBadge status={claim.status} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="text-gray-500 font-medium">No claims found</p>
                                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
