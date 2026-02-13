-- Create claims table
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('Open', 'In Progress', 'Approved', 'Rejected', 'Cancelled', 'Closed')),
    dispute_type TEXT NOT NULL CHECK (dispute_type IN ('Card', 'Non-Card')),
    reason TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create claim_history table
CREATE TABLE IF NOT EXISTS public.claim_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    description TEXT NOT NULL,
    actor TEXT NOT NULL CHECK (actor IN ('Customer', 'Bank Staff', 'System')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create claim_attachments table
CREATE TABLE IF NOT EXISTS public.claim_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    merchant TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('Settled', 'Pending')),
    category TEXT,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Card', 'Non-Card')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON public.claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON public.claims(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_claim_history_claim_id ON public.claim_history(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_attachments_claim_id ON public.claim_attachments(claim_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);

-- Enable Row Level Security
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for claims
CREATE POLICY "Users can view own claims"
    ON public.claims FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own claims"
    ON public.claims FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own claims"
    ON public.claims FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for claim_history
CREATE POLICY "Users can view own claim history"
    ON public.claim_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.claims
            WHERE claims.id = claim_history.claim_id
            AND claims.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create claim history"
    ON public.claim_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.claims
            WHERE claims.id = claim_history.claim_id
            AND claims.user_id = auth.uid()
        )
    );

-- RLS Policies for claim_attachments
CREATE POLICY "Users can view own claim attachments"
    ON public.claim_attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.claims
            WHERE claims.id = claim_attachments.claim_id
            AND claims.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create claim attachments"
    ON public.claim_attachments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.claims
            WHERE claims.id = claim_attachments.claim_id
            AND claims.user_id = auth.uid()
        )
    );

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for claims table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.claims
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
