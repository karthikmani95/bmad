"use client";

import React, { useState } from 'react';
import { Transaction } from '@/features/transactions/types';
import { CreditCard, Landmark, Info } from 'lucide-react';
import { EvidenceUpload, UploadedFile } from '../details/EvidenceUpload';

interface DisputeConfigStepProps {
    transaction: Transaction;
    disputeType: 'Card' | 'Non-Card';
    setDisputeType: (type: 'Card' | 'Non-Card') => void;
    disputeReason: string;
    setDisputeReason: (reason: string) => void;
    isPartialAmount: boolean;
    setIsPartialAmount: (isPartial: boolean) => void;
    partialAmount: string;
    setPartialAmount: (amount: string) => void;
    evidenceFiles: UploadedFile[];
    setEvidenceFiles: (files: UploadedFile[]) => void;
    readOnlyType?: boolean;
}


/**
 * Dispute Configuration Step (Step 2 -> Now Step 3)
 * Handles Dispute Type (FR1), Reason, and Full/Partial Amount logic (FR8).
 */
export const DisputeConfigStep: React.FC<DisputeConfigStepProps> = ({
    transaction,
    disputeType,
    setDisputeType,
    disputeReason,
    setDisputeReason,
    isPartialAmount,
    setIsPartialAmount,
    partialAmount,
    setPartialAmount,
    evidenceFiles,
    setEvidenceFiles,
    readOnlyType
}) => {
    const [error, setError] = useState<string | null>(null);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Allow only numbers and one decimal point
        if (/^\d*\.?\d*$/.test(val)) {
            setPartialAmount(val);
            const numericVal = parseFloat(val);
            if (!isNaN(numericVal) && numericVal > transaction.amount) {
                setError(`Amount cannot exceed total transaction value ($${transaction.amount.toFixed(2)})`);
            } else {
                setError(null);
            }
        }
    };

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500 text-sm">
            {/* Header (Minimal) */}
            <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-notdfc-navy-deep">Dispute: {transaction.merchant}</h3>
                <span className="font-black text-notdfc-navy-deep">${transaction.amount.toFixed(2)}</span>
            </div>

            {/* Dispute Type Selection */}
            <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">1. Type</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => !readOnlyType && setDisputeType('Card')}
                        disabled={readOnlyType}
                        className={`py-2 px-3 rounded-lg border-2 transition-all flex items-center gap-2 ${disputeType === 'Card'
                            ? 'border-notdfc-navy-light bg-notdfc-navy-light/5 ring-1 ring-notdfc-navy-light/10'
                            : 'border-gray-50 bg-white hover:border-gray-100'
                            } ${readOnlyType ? 'opacity-100 cursor-default' : ''} ${readOnlyType && disputeType !== 'Card' ? 'opacity-40' : ''}`}
                    >
                        <CreditCard className={`w-3.5 h-3.5 ${disputeType === 'Card' ? 'text-notdfc-navy-light' : 'text-gray-300'}`} />
                        <span className={`text-[11px] font-bold ${disputeType === 'Card' ? 'text-notdfc-navy-deep' : 'text-gray-400'}`}>Card</span>
                    </button>
                    <button
                        onClick={() => !readOnlyType && setDisputeType('Non-Card')}
                        disabled={readOnlyType}
                        className={`py-2 px-3 rounded-lg border-2 transition-all flex items-center gap-2 ${disputeType === 'Non-Card'
                            ? 'border-notdfc-navy-light bg-notdfc-navy-light/5 ring-1 ring-notdfc-navy-light/10'
                            : 'border-gray-50 bg-white hover:border-gray-100'
                            } ${readOnlyType ? 'opacity-100 cursor-default' : ''} ${readOnlyType && disputeType !== 'Non-Card' ? 'opacity-40' : ''}`}
                    >
                        <Landmark className={`w-3.5 h-3.5 ${disputeType === 'Non-Card' ? 'text-notdfc-navy-light' : 'text-gray-300'}`} />
                        <span className={`text-[11px] font-bold ${disputeType === 'Non-Card' ? 'text-notdfc-navy-deep' : 'text-gray-400'}`}>Non-Card</span>
                    </button>
                </div>
            </div>

            {/* Dispute Reason Selection */}
            <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">2. Reason</label>
                <div className="relative">
                    <textarea
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        placeholder="Please describe the reason for this dispute..."
                        rows={3}
                        className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs text-notdfc-navy-deep font-medium focus:ring-2 focus:ring-notdfc-navy-light/10 focus:border-notdfc-navy-light transition-all resize-none placeholder:text-gray-300"
                    />
                </div>
            </div>

            {/* Evidence Upload - Directly under Reason */}
            <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Evidence (Optional)</label>
                <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <EvidenceUpload files={evidenceFiles} onFilesChange={setEvidenceFiles} />
                </div>
            </div>

            {/* Full vs Partial Amount */}
            <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">3. Amount</label>
                <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3 space-y-3">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsPartialAmount(false)} className="flex items-center gap-1.5 cursor-pointer">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${!isPartialAmount ? 'border-notdfc-navy-light bg-notdfc-navy-light/5' : 'border-gray-300'}`}>
                                {!isPartialAmount && <div className="w-1.5 h-1.5 rounded-full bg-notdfc-navy-light" />}
                            </div>
                            <span className={`text-[11px] font-bold ${!isPartialAmount ? 'text-notdfc-navy-deep' : 'text-gray-400'}`}>Full</span>
                        </button>
                        <button onClick={() => setIsPartialAmount(true)} className="flex items-center gap-1.5 cursor-pointer">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isPartialAmount ? 'border-notdfc-navy-light bg-notdfc-navy-light/5' : 'border-gray-300'}`}>
                                {isPartialAmount && <div className="w-1.5 h-1.5 rounded-full bg-notdfc-navy-light" />}
                            </div>
                            <span className={`text-[11px] font-bold ${isPartialAmount ? 'text-notdfc-navy-deep' : 'text-gray-400'}`}>Partial</span>
                        </button>
                    </div>

                    {isPartialAmount && (
                        <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                            <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-notdfc-navy-deep text-xs">$</span>
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    value={partialAmount}
                                    onChange={handleAmountChange}
                                    className={`w-full bg-white border rounded pl-5 pr-2 py-1.5 font-bold text-sm text-notdfc-navy-deep focus:ring-2 transition-all ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200 focus:ring-notdfc-navy-light/10'}`}
                                />
                            </div>
                            {error && <p className="text-[9px] text-red-600 font-bold">{error}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
