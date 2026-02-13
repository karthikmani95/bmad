"use client";

import React from 'react';
import { MOCK_TRANSACTIONS } from '@/features/transactions/mocks/data';
import { Transaction } from '@/features/transactions/types';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface TransactionStepProps {
    selectedTransaction: Transaction | null;
    onSelect: (transaction: Transaction) => void;
    filterType: 'Card' | 'Non-Card';
}

/**
 * Transaction Step (Step 1 -> Now Step 2)
 * Displays settled transactions for selection. 
 * Filters by settled status AND transaction type (Card/Non-Card).
 */
export const TransactionStep: React.FC<TransactionStepProps> = ({
    selectedTransaction,
    onSelect,
    filterType
}) => {
    const settledTransactions = MOCK_TRANSACTIONS.filter(t =>
        t.status === 'Settled' && t.transactionType === filterType
    );
    const pendingTransactions = MOCK_TRANSACTIONS.filter(t =>
        t.status === 'Pending' && t.transactionType === filterType
    );

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-notdfc-navy-deep">Select Transaction</h3>
                <p className="text-gray-500 text-xs">
                    Please select the transaction you wish to dispute.
                </p>
            </div>

            <div className="space-y-2">
                {settledTransactions.map((tx) => (
                    <button
                        key={tx.id}
                        onClick={() => onSelect(tx)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between group ${selectedTransaction?.id === tx.id
                            ? 'border-notdfc-navy-light bg-notdfc-navy-light/5 shadow-md ring-1 ring-notdfc-navy-light/20'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg transition-colors ${selectedTransaction?.id === tx.id ? 'bg-notdfc-navy-light text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                                }`}>
                                {selectedTransaction?.id === tx.id ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-notdfc-navy-deep">{tx.merchant}</p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{tx.date} • {tx.category}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-base text-notdfc-navy-deep">
                                ${tx.amount.toFixed(2)}
                            </p>
                            <p className="text-[9px] font-bold text-green-600 border border-green-200 px-1 py-0.5 rounded bg-green-50 inline-block uppercase tracking-tighter">
                                {tx.status}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {pendingTransactions.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <div className="flex gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-amber-800">
                                {pendingTransactions.length} Pending Transactions Hidden
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
