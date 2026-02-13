import { Claim } from '../types';

export const MOCK_CLAIMS: Claim[] = [
    {
        id: 'CLM-7721-X',
        transactionId: 'TXN-9901-B',
        transactionDate: '2026-02-01',
        amount: 154.50,
        currency: 'USD',
        status: 'In Progress',
        disputeType: 'Card',
        reason: 'Unrecognized subscription charge',
        createdAt: '2026-02-02T10:00:00Z',
        updatedAt: '2026-02-10T14:30:00Z',
        uploadedFiles: [
            {
                id: 'file-001',
                name: 'bank_statement_jan2026.pdf',
                size: 245678,
                type: 'application/pdf',
                uploadedAt: new Date('2026-02-02T10:15:00Z')
            },
            {
                id: 'file-002',
                name: 'subscription_cancellation_email.png',
                size: 89234,
                type: 'image/png',
                uploadedAt: new Date('2026-02-02T10:16:00Z')
            }
        ],
        history: [
            {
                id: 'EVT-001',
                date: '2026-02-02T10:00:00Z',
                status: 'Open',
                description: 'Claim submitted by customer',
                actor: 'Customer'
            },
            {
                id: 'EVT-002',
                date: '2026-02-03T09:00:00Z',
                status: 'In Progress',
                description: 'Case assigned to dispute analyst',
                actor: 'System'
            },
            {
                id: 'EVT-003',
                date: '2026-02-10T14:30:00Z',
                status: 'In Progress',
                description: 'Analyst requested merchant documentation',
                actor: 'Bank Staff'
            }
        ]
    },
    {
        id: 'CLM-8832-Y',
        transactionId: 'TXN-9912-C',
        transactionDate: '2026-01-28',
        amount: 1200.00,
        currency: 'USD',
        status: 'Approved',
        disputeType: 'Non-Card',
        reason: 'Duplicate wire transfer',
        createdAt: '2026-01-29T09:15:00Z',
        updatedAt: '2026-02-05T16:45:00Z',
        uploadedFiles: [
            {
                id: 'file-101',
                name: 'wire_transfer_receipt_1.pdf',
                size: 156789,
                type: 'application/pdf',
                uploadedAt: new Date('2026-01-29T09:20:00Z')
            },
            {
                id: 'file-102',
                name: 'wire_transfer_receipt_2.pdf',
                size: 158234,
                type: 'application/pdf',
                uploadedAt: new Date('2026-01-29T09:21:00Z')
            },
            {
                id: 'file-103',
                name: 'account_statement.pdf',
                size: 312456,
                type: 'application/pdf',
                uploadedAt: new Date('2026-01-29T09:22:00Z')
            }
        ],
        history: [
            {
                id: 'EVT-101',
                date: '2026-01-29T09:15:00Z',
                status: 'Open',
                description: 'Claim submitted',
                actor: 'Customer'
            },
            {
                id: 'EVT-102',
                date: '2026-01-30T11:00:00Z',
                status: 'In Progress',
                description: 'Investigation started',
                actor: 'Bank Staff'
            },
            {
                id: 'EVT-103',
                date: '2026-02-05T16:45:00Z',
                status: 'Approved',
                description: 'Duplicate confirmed. Refund initiated.',
                actor: 'Bank Staff'
            }
        ]
    },
    {
        id: 'CLM-9943-Z',
        transactionId: 'TXN-9923-D',
        transactionDate: '2026-02-05',
        amount: 45.99,
        currency: 'USD',
        status: 'Open',
        disputeType: 'Card',
        reason: 'Incorrect item amount',
        createdAt: '2026-02-06T11:20:00Z',
        updatedAt: '2026-02-06T11:20:00Z',
        history: [
            {
                id: 'EVT-201',
                date: '2026-02-06T11:20:00Z',
                status: 'Open',
                description: 'Claim submitted',
                actor: 'Customer'
            }
        ]
    },
    {
        id: 'CLM-1154-A',
        transactionId: 'TXN-9934-E',
        transactionDate: '2026-01-15',
        amount: 320.00,
        currency: 'USD',
        status: 'Rejected',
        disputeType: 'Card',
        reason: 'Merchant provided proof of delivery',
        createdAt: '2026-01-16T14:00:00Z',
        updatedAt: '2026-01-25T10:00:00Z',
        history: [
            {
                id: 'EVT-301',
                date: '2026-01-16T14:00:00Z',
                status: 'Open',
                description: 'Claim submitted',
                actor: 'Customer'
            },
            {
                id: 'EVT-302',
                date: '2026-01-25T10:00:00Z',
                status: 'Rejected',
                description: 'Valid proof of delivery provided by merchant.',
                actor: 'Bank Staff'
            }
        ]
    },
    {
        id: 'CLM-2265-B',
        transactionId: 'TXN-9945-F',
        transactionDate: '2026-02-08',
        amount: 89.00,
        currency: 'USD',
        status: 'Cancelled',
        disputeType: 'Card',
        reason: 'Resolved directly with merchant',
        createdAt: '2026-02-09T08:30:00Z',
        updatedAt: '2026-02-10T09:00:00Z',
        history: [
            {
                id: 'EVT-401',
                date: '2026-02-09T08:30:00Z',
                status: 'Open',
                description: 'Claim submitted',
                actor: 'Customer'
            },
            {
                id: 'EVT-402',
                date: '2026-02-10T09:00:00Z',
                status: 'Cancelled',
                description: 'Customer cancelled the dispute.',
                actor: 'Customer'
            }
        ]
    }
];
