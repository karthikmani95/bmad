import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Claim, ClaimHistoryEvent } from '@/features/claims/types';
import { Transaction } from '@/features/transactions/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbClaim {
    id: string;
    transaction_id: string;
    transaction_date: string;
    amount: number;
    currency: string;
    status: string;
    dispute_type: 'Card' | 'Non-Card';
    reason: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface DbClaimHistory {
    id: string;
    claim_id: string;
    status: string;
    description: string;
    actor: string;
    created_at: string;
}

export interface DbClaimAttachment {
    id: string;
    claim_id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    storage_path: string;
    uploaded_at: string;
}

export interface DbTransaction {
    id: string;
    user_id: string;
    date: string;
    merchant: string;
    amount: number;
    currency: string;
    status: string;
    category: string;
    transaction_type: 'Card' | 'Non-Card';
    created_at: string;
}

/**
 * Get all claims for the current user
 */
export async function getClaims(): Promise<Claim[]> {
    const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

    if (claimsError) {
        console.error('Error fetching claims:', claimsError);
        return [];
    }

    // Fetch history and attachments for each claim
    const claimsWithDetails = await Promise.all(
        claims.map(async (claim) => {
            const { data: history } = await supabase
                .from('claim_history')
                .select('*')
                .eq('claim_id', claim.id)
                .order('created_at', { ascending: false });

            const { data: attachments } = await supabase
                .from('claim_attachments')
                .select('*')
                .eq('claim_id', claim.id);

            return {
                id: claim.id,
                transactionId: claim.transaction_id,
                transactionDate: claim.transaction_date,
                amount: claim.amount,
                currency: claim.currency,
                status: claim.status as Claim['status'],
                disputeType: claim.dispute_type,
                reason: claim.reason,
                createdAt: claim.created_at,
                updatedAt: claim.updated_at,
                history: history?.map(h => ({
                    id: h.id,
                    date: h.created_at,
                    status: h.status,
                    description: h.description,
                    actor: h.actor as ClaimHistoryEvent['actor']
                })) || [],
                uploadedFiles: attachments?.map(a => ({
                    id: a.id,
                    name: a.file_name,
                    size: a.file_size,
                    type: a.file_type,
                    uploadedAt: new Date(a.uploaded_at)
                })) || []
            };
        })
    );

    return claimsWithDetails;
}

/**
 * Get a single claim by ID
 */
export async function getClaimById(claimId: string): Promise<Claim | null> {
    const { data: claim, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', claimId)
        .single();

    if (error || !claim) {
        console.error('Error fetching claim:', error);
        return null;
    }

    const { data: history } = await supabase
        .from('claim_history')
        .select('*')
        .eq('claim_id', claim.id)
        .order('created_at', { ascending: false });

    const { data: attachments } = await supabase
        .from('claim_attachments')
        .select('*')
        .eq('claim_id', claim.id);

    return {
        id: claim.id,
        transactionId: claim.transaction_id,
        transactionDate: claim.transaction_date,
        amount: claim.amount,
        currency: claim.currency,
        status: claim.status as Claim['status'],
        disputeType: claim.dispute_type,
        reason: claim.reason,
        createdAt: claim.created_at,
        updatedAt: claim.updated_at,
        history: history?.map(h => ({
            id: h.id,
            date: h.created_at,
            status: h.status,
            description: h.description,
            actor: h.actor as ClaimHistoryEvent['actor']
        })) || [],
        uploadedFiles: attachments?.map(a => ({
            id: a.id,
            name: a.file_name,
            size: a.file_size,
            type: a.file_type,
            uploadedAt: new Date(a.uploaded_at)
        })) || []
    };
}

/**
 * Create a new claim.
 * @param data - Claim data
 * @param authClient - Supabase client with user session (required for RLS). Pass the server client from createClient().
 */
export async function createClaim(
    data: {
        transactionId: string;
        transactionDate: string;
        amount: number;
        disputeType: 'Card' | 'Non-Card';
        reason: string;
        userId: string;
    },
    authClient: SupabaseClient
): Promise<{ success: boolean; claimId?: string; error?: string }> {
    // Check for duplicate claims
    const { data: existingClaims } = await authClient
        .from('claims')
        .select('id')
        .eq('transaction_id', data.transactionId)
        .in('status', ['Open', 'In Progress']);

    if (existingClaims && existingClaims.length > 0) {
        return {
            success: false,
            error: 'A dispute for this transaction is already currently being processed.'
        };
    }

    // Create the claim (authClient has user session, so RLS auth.uid() passes)
    const { data: claim, error: claimError } = await authClient
        .from('claims')
        .insert({
            transaction_id: data.transactionId,
            transaction_date: data.transactionDate,
            amount: data.amount,
            dispute_type: data.disputeType,
            reason: data.reason,
            user_id: data.userId,
            status: 'Open',
            currency: 'USD'
        })
        .select()
        .single();

    if (claimError || !claim) {
        console.error('Error creating claim:', claimError);
        return {
            success: false,
            error: 'Failed to create claim. Please try again.'
        };
    }

    // Create initial history entry
    await authClient
        .from('claim_history')
        .insert({
            claim_id: claim.id,
            status: 'Open',
            description: 'Claim submitted by customer',
            actor: 'Customer'
        });

    return {
        success: true,
        claimId: claim.id
    };
}

/**
 * Update a claim
 */
export async function updateClaim(
    claimId: string,
    updates: Partial<Pick<Claim, 'reason' | 'status'>>
): Promise<{ success: boolean; error?: string }> {
    const updateData: any = {};

    if (updates.reason !== undefined) updateData.reason = updates.reason;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { error } = await supabase
        .from('claims')
        .update(updateData)
        .eq('id', claimId);

    if (error) {
        console.error('Error updating claim:', error);
        return {
            success: false,
            error: 'Failed to update claim.'
        };
    }

    return { success: true };
}

/**
 * Get all transactions for the current user
 */
export async function getTransactions(filters?: {
    type?: 'Card' | 'Non-Card';
    status?: string;
}): Promise<Transaction[]> {
    let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

    if (filters?.type) {
        query = query.eq('transaction_type', filters.type);
    }

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }

    return data.map(t => ({
        id: t.id,
        date: t.date,
        merchant: t.merchant,
        amount: t.amount,
        currency: t.currency,
        status: t.status as Transaction['status'],
        category: t.category,
        transactionType: t.transaction_type
    }));
}

/**
 * Get a transaction by ID
 */
export async function getTransactionById(transactionId: string): Promise<Transaction | null> {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id,
        date: data.date,
        merchant: data.merchant,
        amount: data.amount,
        currency: data.currency,
        status: data.status as Transaction['status'],
        category: data.category,
        transactionType: data.transaction_type
    };
}

/**
 * Upload file attachment for a claim
 */
export async function uploadClaimAttachment(
    claimId: string,
    file: File
): Promise<{ success: boolean; attachmentId?: string; error?: string }> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    // Upload file to storage
    const filePath = `${user.id}/${claimId}/${file.name}`;
    const { error: uploadError } = await supabase.storage
        .from('claim-attachments')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return { success: false, error: 'Failed to upload file' };
    }

    // Create attachment record
    const { data: attachment, error: dbError } = await supabase
        .from('claim_attachments')
        .insert({
            claim_id: claimId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: filePath
        })
        .select()
        .single();

    if (dbError || !attachment) {
        console.error('Error creating attachment record:', dbError);
        return { success: false, error: 'Failed to save attachment' };
    }

    return { success: true, attachmentId: attachment.id };
}
