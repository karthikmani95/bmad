"use client";

import React, { useState } from 'react';
import { TransactionStep } from './TransactionStep';
import { Transaction } from '@/features/transactions/types';
import { ChevronRight, ChevronLeft, ShieldCheck, AlertCircle, Circle } from 'lucide-react';
import Link from 'next/link';
import { DisputeConfigStep } from './DisputeConfigStep';
import { DisputeTypeStep } from './DisputeTypeStep';
import { ReviewStep } from './ReviewStep';
import { SuccessStep } from './SuccessStep';
import { submitDispute } from '@/features/claims/actions';
import { emailService } from '@/lib/mock-email-service';
import { UploadedFile } from '@/features/claims/components/details/EvidenceUpload';
import { useRouter } from 'next/navigation';

type WizardStep = 'type-select' | 'transaction' | 'config' | 'review' | 'success';

/**
 * Claim Wizard
 * State-controlled multi-step dispute process.
 * Optimized for viewport visibility (Progress and Buttons always visible).
 */
export const ClaimWizard: React.FC = () => {
    const router = useRouter();

    // Wizard State
    const [currentStep, setCurrentStep] = useState<WizardStep>('type-select');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    // Step 1: Dispute Type (New)
    const [disputeType, setDisputeType] = useState<'Card' | 'Non-Card' | null>(null);

    // Step 3: Configuration (Was Step 2)
    const [disputeReason, setDisputeReason] = useState<string>('');
    const [isPartialAmount, setIsPartialAmount] = useState(false);
    const [partialAmount, setPartialAmount] = useState('');
    const [evidenceFiles, setEvidenceFiles] = useState<UploadedFile[]>([]);

    // Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedClaimId, setGeneratedClaimId] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const steps: { key: WizardStep; label: string }[] = [
        { key: 'type-select', label: 'Type' },
        { key: 'transaction', label: 'Select' },
        { key: 'config', label: 'Details' },
        { key: 'review', label: 'Review' },
        { key: 'success', label: 'Done' },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === currentStep);

    const isNextDisabled = () => {
        if (isSubmitting) return true;
        if (currentStep === 'type-select') return !disputeType;
        if (currentStep === 'transaction') return !selectedTransaction;
        if (currentStep === 'config') {
            const hasReason = disputeReason !== '';
            const amountValid = !isPartialAmount || (
                partialAmount !== '' &&
                !isNaN(parseFloat(partialAmount)) &&
                parseFloat(partialAmount) > 0 &&
                parseFloat(partialAmount) <= (selectedTransaction?.amount || 0)
            );
            return !hasReason || !amountValid;
        }
        return false;
    };

    const handleNext = async () => {
        if (currentStep === 'type-select' && disputeType) {
            setCurrentStep('transaction');
            // Reset selection if type changes? Maybe safer to keep it but verify type.
            if (selectedTransaction?.transactionType !== disputeType) {
                setSelectedTransaction(null);
            }
        } else if (currentStep === 'transaction' && selectedTransaction) {
            setCurrentStep('config');
        } else if (currentStep === 'config') {
            setCurrentStep('review');
        } else if (currentStep === 'review' && selectedTransaction && disputeType) {
            setIsSubmitting(true);
            setSubmissionError(null);

            try {
                const result = await submitDispute({
                    transactionId: selectedTransaction.id,
                    merchant: selectedTransaction.merchant,
                    disputeType,
                    disputeReason,
                    amount: isPartialAmount ? parseFloat(partialAmount) : selectedTransaction.amount,
                    uploadedFiles: evidenceFiles
                });

                if (result.success && result.claimId) {
                    setGeneratedClaimId(result.claimId);

                    // Trigger email notification
                    const emailBody = `Dear Valued Customer,

Thank you for submitting your dispute claim with NotDFC.

CLAIM DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claim ID: ${result.claimId}
Transaction: ${selectedTransaction.merchant}
Amount: $${(isPartialAmount ? parseFloat(partialAmount) : selectedTransaction.amount).toFixed(2)}
Dispute Type: ${disputeType}
Reason: ${disputeReason}
${evidenceFiles.length > 0 ? `Attachments: ${evidenceFiles.length} file(s) uploaded` : ''}

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Your claim has been assigned to our dispute resolution team
• You will receive updates via email as your case progresses
• Typical resolution time: 5-10 business days
• You can track your claim status at any time in your dashboard

If you have any questions or need to provide additional information, please reference your Claim ID: ${result.claimId}

Thank you for your patience.

Best regards,
NotDFC Dispute Resolution Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message. Please do not reply to this email.`;

                    emailService.sendEmail(
                        'karthik.mani@kore.com',
                        `Claim Confirmation: ${result.claimId} - ${selectedTransaction.merchant}`,
                        emailBody
                    );

                    setCurrentStep('success');
                } else {
                    setSubmissionError(result.error || "An unexpected error occurred.");
                }
            } catch (err) {
                setSubmissionError("System error. Please try again later.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep === 'transaction') setCurrentStep('type-select');
        if (currentStep === 'config') setCurrentStep('transaction');
        if (currentStep === 'review') {
            setSubmissionError(null);
            setCurrentStep('config');
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-xl shadow-notdfc-navy-deep/5 overflow-hidden">
            {/* Wizard Progress Bar - Header Segment */}
            <div className="p-6 pb-2 border-b bg-white shrink-0">
                <div className="relative mb-4 mx-4">
                    <div className="flex justify-between relative z-10">
                        {steps.map((step, idx) => (
                            <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-300 ${idx <= currentStepIndex
                                    ? 'bg-notdfc-navy-deep text-white shadow-lg ring-4 ring-notdfc-navy-deep/10'
                                    : 'bg-white text-gray-400 border-2 border-gray-100'
                                    }`}>
                                    {idx < currentStepIndex ? <ShieldCheck className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${idx <= currentStepIndex ? 'text-notdfc-navy-deep' : 'text-gray-300'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="absolute top-3.5 left-0 w-full h-0.5 bg-gray-100 -z-0">
                        <div
                            className="h-full bg-notdfc-navy-deep transition-all duration-500 ease-out"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Step Content Shell - SCROLLABLE area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {currentStep === 'type-select' && (
                    <DisputeTypeStep
                        selectedType={disputeType}
                        onSelect={setDisputeType}
                    />
                )}

                {currentStep === 'transaction' && disputeType && (
                    <TransactionStep
                        selectedTransaction={selectedTransaction}
                        onSelect={setSelectedTransaction}
                        filterType={disputeType}
                    />
                )}

                {currentStep === 'config' && selectedTransaction && disputeType && (
                    <DisputeConfigStep
                        transaction={selectedTransaction}
                        disputeType={disputeType}
                        // Remove setDisputeType prop or make it no-op since it's now set in step 1
                        setDisputeType={() => { }}
                        disputeReason={disputeReason}
                        setDisputeReason={setDisputeReason}
                        isPartialAmount={isPartialAmount}
                        setIsPartialAmount={setIsPartialAmount}
                        partialAmount={partialAmount}
                        setPartialAmount={setPartialAmount}
                        evidenceFiles={evidenceFiles}
                        setEvidenceFiles={setEvidenceFiles}
                        readOnlyType={true} // Add this prop to indicate it shouldn't be changeable
                    />
                )}

                {currentStep === 'review' && selectedTransaction && disputeType && (
                    <ReviewStep
                        transaction={selectedTransaction}
                        disputeType={disputeType}
                        disputeReason={disputeReason}
                        isPartialAmount={isPartialAmount}
                        partialAmount={partialAmount}
                    />
                )}

                {currentStep === 'success' && generatedClaimId && (
                    <SuccessStep claimId={generatedClaimId} />
                )}

                {submissionError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-red-800">{submissionError}</p>
                    </div>
                )}
            </div>

            {/* Action Bar - Footer Segment (Always Visible) */}
            <div className="p-4 bg-gray-50/50 border-t flex justify-between items-center shrink-0">
                {currentStep !== 'type-select' && currentStep !== 'success' ? (
                    <button
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-notdfc-navy-deep transition-colors bg-white px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                ) : currentStep !== 'success' ? (
                    <Link
                        href="/dashboard"
                        className="text-sm font-bold text-gray-400 hover:text-notdfc-navy-deep"
                    >
                        Cancel
                    </Link>
                ) : <div />}

                {currentStep !== 'success' && (
                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isNextDisabled()
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-notdfc-navy-deep text-white hover:bg-notdfc-navy-light shadow-lg shadow-notdfc-navy-deep/20 active:translate-y-0.5'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            <>
                                {currentStep === 'review' ? 'Submit Claim' : 'Continue'}
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
