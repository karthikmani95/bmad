import { getClaimById, getTransactionById } from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/server';
import { ClaimDetails } from '@/features/claims/components/details/ClaimDetails';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ClaimDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const claim = await getClaimById(id, supabase);

    if (!claim) {
        notFound();
    }

    const transaction = await getTransactionById(claim.transactionId, supabase);

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <ClaimDetails claim={claim} merchantName={transaction?.merchant} />
        </div>
    );
}
