import React from 'react';
import { ClaimsSummaryTable } from '@/features/dashboard/components/ClaimsSummaryTable';
import { PlusCircle, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { getClaims } from '@/lib/supabase/database';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // Fetch claims from database
    const claims = await getClaims();

    // Calculate dynamic metrics
    const activeDisputes = claims.filter(c => c.status === 'Open' || c.status === 'In Progress').length;

    // Resolved in last 30 days (Approved or Rejected)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const resolvedLast30Days = claims.filter(c => {
        const updatedDate = new Date(c.updatedAt);
        return (c.status === 'Approved' || c.status === 'Rejected') && updatedDate >= thirtyDaysAgo;
    }).length;

    // Action required (Open status)
    const actionRequired = claims.filter(c => c.status === 'Open').length;

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-8 animate-in fade-in duration-700 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-notdfc-navy-deep tracking-tight">
                            Account Dashboard
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Securely manage your disputes and track resolution progress.
                        </p>
                    </div>
                </div>

                {/* Stats Quick Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Disputes</p>
                            <p className="text-2xl font-bold text-notdfc-navy-deep">{activeDisputes}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Resolved (30d)</p>
                            <p className="text-2xl font-bold text-notdfc-navy-deep">{resolvedLast30Days}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Action Required</p>
                            <p className="text-2xl font-bold text-notdfc-navy-deep">{actionRequired}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-notdfc-navy-deep">Recent Activity</h3>
                    </div>
                    <ClaimsSummaryTable claims={claims} />
                </div>

                {/* Security Disclaimer */}
                <div className="bg-notdfc-navy-deep/5 border border-notdfc-navy-deep/10 rounded-2xl p-6 flex gap-4 items-center">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <ShieldCheck className="w-5 h-5 text-notdfc-navy-deep" />
                    </div>
                    <p className="text-sm text-notdfc-navy-deep/80 font-medium">
                        <span className="font-bold">Security Notice:</span> Every action on this dashboard is logged and verified against NotDFC security protocols. Your IP address and session ID are recorded for audit purposes (NFR2).
                    </p>
                </div>
            </div>
        </div>
    );
}
