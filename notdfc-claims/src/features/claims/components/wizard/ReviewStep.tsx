"use client";

import React from 'react';
import { Transaction } from '@/features/transactions/types';
import { ShieldCheck, Info, FileText, IndianRupee } from 'lucide-react';

interface ReviewStepProps {
    transaction: Transaction;
    disputeType: 'Card' | 'Non-Card';
    disputeReason: string;
    isPartialAmount: boolean;
    partialAmount: string;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
    transaction,
    disputeType,
    disputeReason,
    isPartialAmount,
    partialAmount
}) => {
    const finalAmount = isPartialAmount ? parseFloat(partialAmount) : transaction.amount;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-notdfc-navy-deep">Review Your Claim</h3>
                <p className="text-gray-500 text-xs">
                    Please verify all details before submitting your dispute.
                </p>
            </div>

            <div className="bg-notdfc-navy-deep/5 border border-notdfc-navy-deep/10 rounded-xl overflow-hidden divide-y divide-notdfc-navy-deep/10">
                {/* Merchant & Original Trans */}
                <div className="p-3 flex justify-between items-center bg-white/50">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Transaction</p>
                        <p className="font-bold text-notdfc-navy-deep">{transaction.merchant}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                        <p className="text-xs font-bold text-notdfc-navy-deep">{transaction.date}</p>
                    </div>
                </div>

                {/* Dispute Details Grid */}
                <div className="p-3 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> Type
                        </p>
                        <p className="text-xs font-bold text-notdfc-navy-deep">{disputeType} Dispute</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5" /> Reason
                        </p>
                        <p className="text-xs font-bold text-notdfc-navy-deep break-words whitespace-pre-wrap">{disputeReason}</p>
                    </div>
                </div>

                {/* Amount Summary */}
                <div className="p-3 bg-notdfc-navy-deep/10 flex justify-between items-center">
                    <div>
                        <p className="text-[9px] font-bold text-notdfc-navy-light uppercase tracking-widest">Disputed Amount</p>
                        <p className="text-xs font-medium text-notdfc-navy-deep">
                            {isPartialAmount ? 'Partial Adjustment' : 'Full Transaction Value'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black text-notdfc-navy-deep tracking-tight">
                            ${finalAmount.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex gap-3">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                    By submitting this dispute, you confirm that the information provided is accurate. NotDFC Bank will investigate and provide an update within 5-10 business days.
                </p>
            </div>
        </div>
    );
};
