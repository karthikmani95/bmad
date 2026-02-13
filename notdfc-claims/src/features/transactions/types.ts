export type TransactionStatus = 'Pending' | 'Settled';

export interface Transaction {
    id: string;
    date: string;
    merchant: string;
    amount: number;
    currency: string;
    status: TransactionStatus;
    category: string;
    transactionType: 'Card' | 'Non-Card';
}
