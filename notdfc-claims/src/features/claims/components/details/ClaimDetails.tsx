"use client";

import React, { useState } from 'react';
import { Claim, ClaimHistoryEvent } from '../../types';
import { StatusBadge } from './StatusBadge';
import { ClaimTimeline } from './ClaimTimeline';
import { EvidenceUpload, UploadedFile } from './EvidenceUpload';
import { ReasonEditor } from './ReasonEditor';
import { emailService } from '@/lib/mock-email-service';
import { CancellationModal } from './CancellationModal';
import { ChevronLeft, CreditCard, Receipt, FileText, BarChart3, AlertCircle, Ban } from 'lucide-react';
import Link from 'next/link';

interface ClaimDetailsProps {
    claim: Claim;
    merchantName?: string;
}

export const ClaimDetails: React.FC<ClaimDetailsProps> = ({ claim, merchantName }) => {
    // Local state for optimistic updates
    const [reason, setReason] = useState(claim.reason);
    const [status, setStatus] = useState(claim.status);
    const [history, setHistory] = useState<ClaimHistoryEvent[]>(claim.history || []);
    const [evidenceFiles, setEvidenceFiles] = useState<UploadedFile[]>(
        claim.uploadedFiles?.map(f => ({
            ...f,
            uploadedAt: f.uploadedAt instanceof Date ? f.uploadedAt : new Date(f.uploadedAt)
        })) || []
    );
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const handleReasonUpdate = (newReason: string) => {
        setReason(newReason);
        // Add optimistic history event
        const newEvent: ClaimHistoryEvent = {
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString(),
            status: status,
            description: 'Reason updated by customer',
            actor: 'Customer'
        };
        setHistory(prev => [newEvent, ...prev]);
    };

    const handleCancelClaim = () => {
        emailService.sendEmail(
            'customer@example.com',
            `Dispute #${claim.id} Cancelled`,
            'You have successfully withdrawn your claim. No further action is required.'
        );

        setStatus('Cancelled');
        setIsCancelModalOpen(false);
        const newEvent: ClaimHistoryEvent = {
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString(),
            status: 'Cancelled',
            description: 'Claim cancelled by customer',
            actor: 'Customer'
        };
        setHistory(prev => [newEvent, ...prev]);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation */}
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-notdfc-navy-deep transition-colors group">
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-notdfc-navy-deep tracking-tight">
                            Claim #{claim.id}
                        </h1>
                        <StatusBadge status={status} />
                    </div>
                    <p className="text-sm text-gray-500">
                        Created on {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Disputed Amount</p>
                        <p className="text-2xl font-black text-notdfc-navy-deep">
                            ${claim.amount.toFixed(2)} <span className="text-sm text-gray-400 font-medium">{claim.currency}</span>
                        </p>
                    </div>

                    {/* Cancel Action */}
                    {(status === 'Open' || status === 'In Progress') && (
                        <button
                            onClick={() => setIsCancelModalOpen(true)}
                            className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <Ban className="w-3.5 h-3.5" />
                            Cancel Claim
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Action Required Alert (Mock) */}
                    {(status === 'In Progress' || status === 'Open') && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-800">Additional Information may be required</h4>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                    Our team is reviewing your claim. You can upload supporting documents (receipts, correspondence) below to speed up the process.
                                </p>
                            </div>
                        </div>
                    )}
                    {(status === 'Cancelled') && (
                        <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <Ban className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-700">Dispute Cancelled</h4>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    You have withdrawn this claim. No further action is required.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Transaction Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Transaction Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Transaction ID</p>
                                <p className="font-mono text-sm text-notdfc-navy-deep">{claim.transactionId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Date</p>
                                <p className="text-sm text-notdfc-navy-deep font-medium">{new Date(claim.transactionDate).toLocaleDateString()}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Original Merchant</p>
                                <p className="text-lg font-bold text-notdfc-navy-deep">{merchantName ?? 'Unknown Merchant'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dispute Info Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Dispute Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Type</p>
                                    <div className="flex items-center gap-2 text-notdfc-navy-deep font-bold text-sm">
                                        <CreditCard className="w-4 h-4 text-notdfc-navy-light" />
                                        {claim.disputeType}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Reason</p>
                                    {status === 'Cancelled' || status === 'Closed' ? (
                                        <p className="text-sm text-notdfc-navy-deep font-medium">{reason}</p>
                                    ) : (
                                        <ReasonEditor initialReason={reason} onSave={handleReasonUpdate} />
                                    )}
                                </div>
                            </div>

                            {/* Evidence Upload - Inline with Reason */}
                            {status !== 'Cancelled' && status !== 'Closed' && (
                                <div className="pt-4 border-t border-gray-100">
                                    <EvidenceUpload files={evidenceFiles} onFilesChange={setEvidenceFiles} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Timeline */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
                        {history.length > 0 ? (
                            <ClaimTimeline history={history} />
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                No history events recorded.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CancellationModal
                open={isCancelModalOpen}
                onOpenChange={setIsCancelModalOpen}
                onConfirm={handleCancelClaim}
            />
        </div>
    );
};
