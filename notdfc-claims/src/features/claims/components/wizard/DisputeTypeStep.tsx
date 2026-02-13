"use client";

import React from 'react';
import { CreditCard, Landmark } from 'lucide-react';

interface DisputeTypeStepProps {
    selectedType: 'Card' | 'Non-Card' | null;
    onSelect: (type: 'Card' | 'Non-Card') => void;
}

export const DisputeTypeStep: React.FC<DisputeTypeStepProps> = ({ selectedType, onSelect }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-notdfc-navy-deep">What would you like to dispute?</h3>
                <p className="text-gray-500 text-xs">
                    Please select the type of transaction you wish to contest.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => onSelect('Card')}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group relative overflow-hidden ${selectedType === 'Card'
                        ? 'border-notdfc-navy-deep bg-notdfc-navy-deep/5 shadow-lg'
                        : 'border-gray-100 hover:border-notdfc-navy-deep/30 hover:bg-gray-50'
                        }`}
                >
                    <div className={`p-4 rounded-full transition-colors ${selectedType === 'Card' ? 'bg-notdfc-navy-deep text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-notdfc-navy-deep/10 group-hover:text-notdfc-navy-deep'}`}>
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <span className={`font-bold text-sm ${selectedType === 'Card' ? 'text-notdfc-navy-deep' : 'text-gray-500'}`}>
                        Card Transaction
                    </span>
                    {selectedType === 'Card' && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-notdfc-navy-deep animate-pulse" />
                    )}
                </button>

                <button
                    onClick={() => onSelect('Non-Card')}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group relative overflow-hidden ${selectedType === 'Non-Card'
                        ? 'border-notdfc-navy-deep bg-notdfc-navy-deep/5 shadow-lg'
                        : 'border-gray-100 hover:border-notdfc-navy-deep/30 hover:bg-gray-50'
                        }`}
                >
                    <div className={`p-4 rounded-full transition-colors ${selectedType === 'Non-Card' ? 'bg-notdfc-navy-deep text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-notdfc-navy-deep/10 group-hover:text-notdfc-navy-deep'}`}>
                        <Landmark className="w-8 h-8" />
                    </div>
                    <span className={`font-bold text-sm ${selectedType === 'Non-Card' ? 'text-notdfc-navy-deep' : 'text-gray-500'}`}>
                        Non-Card / ACH
                    </span>
                    {selectedType === 'Non-Card' && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-notdfc-navy-deep animate-pulse" />
                    )}
                </button>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-[10px] text-blue-800 leading-relaxed text-center">
                <strong>Note:</strong> Card disputes cover debit/credit card purchases. Non-Card disputes cover ACH transfers, checks, and wire transfers.
            </div>
        </div>
    );
};
