"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Copy, ArrowRight, ExternalLink, PlusCircle } from 'lucide-react';

interface SuccessStepProps {
    claimId: string;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ claimId }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(claimId);
        // Simple visual feedback could be added here
    };

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-4 animate-in zoom-in-95 fade-in duration-700">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center border-4 border-green-100 shadow-xl shadow-green-500/10">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-black text-notdfc-navy-deep tracking-tight">Dispute Submitted</h3>
                <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
                    Your claim has been successfully registered in our secure system. You can track its status in your dashboard.
                </p>
            </div>

            <div className="w-full max-w-xs bg-notdfc-navy-deep/5 rounded-xl border border-notdfc-navy-deep/10 p-4 relative group">
                <p className="text-[10px] font-bold text-notdfc-navy-light uppercase tracking-widest mb-1">Claim Reference Number</p>
                <div className="flex items-center justify-center gap-3">
                    <span className="text-xl font-black text-notdfc-navy-deep font-mono tracking-tighter">
                        {claimId}
                    </span>
                    <button
                        onClick={copyToClipboard}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors text-notdfc-navy-light border border-transparent hover:border-gray-100 shadow-sm"
                        title="Copy to clipboard"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-notdfc-navy-deep text-white rounded-lg font-bold hover:bg-notdfc-navy-light transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                    <ArrowRight className="w-4 h-4" />
                    View My Claims
                </Link>
                <Link
                    href="/claims/new"
                    className="px-6 py-3 bg-white border-2 border-gray-200 text-notdfc-navy-deep rounded-lg font-bold hover:border-notdfc-navy-light transition-all flex items-center justify-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    Submit Another Claim
                </Link>
            </div>
        </div>
    );
};
