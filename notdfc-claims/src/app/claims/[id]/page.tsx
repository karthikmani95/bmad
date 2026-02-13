import { MOCK_CLAIMS } from '@/features/claims/mocks/data';


export const dynamic = 'force-dynamic';
import { ClaimDetails } from '@/features/claims/components/details/ClaimDetails';
import { MOCK_TRANSACTIONS } from '@/features/transactions/mocks/data'; // Import transactions to look up merchant name
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ClaimDetailsPage({ params }: PageProps) {
    const { id } = await params;

    // Simulate API fetch delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const claim = MOCK_CLAIMS.find(c => c.id === id);

    if (!claim) {
        notFound();
    }

    // Enhance claim with merchant name if we can find the transaction
    // In a real app, this would be a JOIN fetch
    const transaction = MOCK_TRANSACTIONS.find(t => t.id === claim.transactionId);
    if (!transaction) {
        // Fallback if transaction not found in mocks (shouldn't happen with consistent data)
        // console.warn(`Transaction ${claim.transactionId} not found for claim ${claim.id}`);
    }

    // We can't easily modify the type on the fly without changing the props interface
    // For now, we'll just pass the claim as is, but Update ClaimDetails to maybe accept merchantName prop optionally?
    // OR we can just rely on the claim data. The mockup in ClaimDetails had "Merchant Name (Placeholder)".
    // Let's stick with the placeholder or if we want to be fancy, pass a composite object.

    // Let's pass the claim to the client component. 
    // NOTE: The ClaimDetails component currently has a placeholder for Merchant Name. 
    // Ideally we update ClaimDetails to take an optional merchantName or enhanced object.

    // We pass the merchant name if found
    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <ClaimDetails claim={claim} merchantName={transaction?.merchant} />
        </div>
    );
}

// export async function generateStaticParams() {
//     return MOCK_CLAIMS.map((claim) => ({
//         id: claim.id,
//     }));
// }
