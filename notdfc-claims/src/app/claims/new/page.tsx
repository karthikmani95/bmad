import React from 'react';
import { ClaimWizard } from '@/features/claims/components/wizard/ClaimWizard';
import { ShieldAlert } from 'lucide-react';

export default function NewClaimPage() {
    return (
        <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700 overflow-hidden">
            <div className="mb-4 shrink-0">
                <h2 className="text-2xl font-bold text-notdfc-navy-deep tracking-tight flex items-center gap-3">
                    Initiate Dispute
                </h2>
                <p className="text-gray-500 text-xs mt-1">
                    Follow the secure steps to dispute a transaction with NotDFC.
                </p>

                <div className="bg-notdfc-navy-deep/5 border border-notdfc-navy-deep/10 rounded-xl p-3 flex gap-4 items-center mt-4">
                    <ShieldAlert className="w-4 h-4 text-notdfc-navy-light" />
                    <p className="text-[10px] text-notdfc-navy-light font-bold uppercase tracking-widest">
                        Step 1: Select a valid settled transaction
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ClaimWizard />
            </div>
        </div>
    );
}
