"use server";

import { createClaim } from '@/lib/supabase/database';
import { supabase } from '@/lib/supabase/database';

export interface DisputeSubmission {
    transactionId: string;
    disputeType: 'Card' | 'Non-Card';
    disputeReason: string;
    amount: number;
    merchant: string;
    uploadedFiles?: Array<{
        id: string;
        name: string;
        size: number;
        type: string;
        uploadedAt: Date;
    }>;
}

export interface SubmissionResult {
    success: boolean;
    claimId?: string;
    error?: string;
    isDuplicate?: boolean;
}

/**
 * Server action to handle dispute submission.
 * Performs duplicate checks (FR2) and generates a unique Claim ID (FR4).
 */
export async function submitDispute(data: DisputeSubmission): Promise<SubmissionResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            success: false,
            error: 'User not authenticated. Please log in and try again.'
        };
    }

    // Get transaction date (we'll need to fetch the transaction)
    const { data: transaction } = await supabase
        .from('transactions')
        .select('date')
        .eq('id', data.transactionId)
        .single();

    const transactionDate = transaction?.date || new Date().toISOString().split('T')[0];

    // Create claim in database
    const result = await createClaim({
        transactionId: data.transactionId,
        transactionDate,
        amount: data.amount,
        disputeType: data.disputeType,
        reason: data.disputeReason,
        userId: user.id
    });

    if (!result.success) {
        return {
            success: false,
            isDuplicate: result.error?.includes('already') ? true : false,
            error: result.error
        };
    }

    // If files were uploaded, store them
    if (data.uploadedFiles && data.uploadedFiles.length > 0 && result.claimId) {
        // Store attachment metadata in database
        const attachments = data.uploadedFiles.map(file => ({
            claim_id: result.claimId!,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: `${user.id}/${result.claimId}/${file.name}` // Path for future upload
        }));

        await supabase
            .from('claim_attachments')
            .insert(attachments);
    }

    // Log (Simulate Save to Supabase - already done above)
    console.log(`[Supabase] New Claim Created: ${result.claimId}`, data);

    return {
        success: true,
        claimId: result.claimId
    };
}
