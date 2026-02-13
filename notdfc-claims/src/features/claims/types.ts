export type ClaimStatus =
    | 'Open'
    | 'In Progress'
    | 'Approved'
    | 'Rejected'
    | 'Cancelled'
    | 'Closed';

export interface Claim {
    id: string;
    transactionId: string;
    transactionDate: string;
    amount: number;
    currency: string;
    status: ClaimStatus;
    disputeType: 'Card' | 'Non-Card';
    reason: string;
    createdAt: string;
    updatedAt: string;
    history?: ClaimHistoryEvent[];
    uploadedFiles?: Array<{
        id: string;
        name: string;
        size: number;
        type: string;
        uploadedAt: Date;
    }>;
}

export interface ClaimHistoryEvent {
    id: string;
    date: string;
    status: ClaimStatus;
    description: string;
    actor: 'System' | 'Bank Staff' | 'Customer';
}
