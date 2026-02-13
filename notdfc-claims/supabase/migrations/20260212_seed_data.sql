-- Seed data for demo users
-- NOTE: Replace USER_ID_1, USER_ID_2, USER_ID_3 with actual user IDs after creating users in Supabase Auth

-- ========== TRANSACTIONS FOR USER 1 (karthik.mani@kore.com) ==========
INSERT INTO public.transactions (id, user_id, date, merchant, amount, currency, status, category, transaction_type) VALUES
('TXN-CARD-001', 'ee6a239d-7ef3-4a5a-9b5e-3f4236311742', '2026-02-10', 'Amazon.com', 249.99, 'USD', 'Settled', 'Shopping', 'Card'),
('TXN-CARD-002', 'ee6a239d-7ef3-4a5a-9b5e-3f4236311742', '2026-02-09', 'Netflix Subscription', 15.99, 'USD', 'Settled', 'Entertainment', 'Card'),
('TXN-CARD-003', 'ee6a239d-7ef3-4a5a-9b5e-3f4236311742', '2026-02-08', 'Whole Foods Market', 87.45, 'USD', 'Settled', 'Groceries', 'Card'),
('TXN-CARD-004', 'ee6a239d-7ef3-4a5a-9b5e-3f4236311742', '2026-02-07', 'Shell Gas Station', 52.30, 'USD', 'Settled', 'Auto', 'Card'),
('TXN-CARD-005', 'ee6a239d-7ef3-4a5a-9b5e-3f4236311742', '2026-02-06', 'Starbucks Coffee', 12.75, 'USD', 'Settled', 'Dining', 'Card'),
('TXN-NONCARD-001', 'ee6a239d-7ef3-4a5a-9b5e-3f4236311742', '2026-02-10', 'Rent Payment - Landlord', 2500.00, 'USD', 'Settled', 'Housing', 'Non-Card'),
('TXN-NONCARD-002', 'ee6a239d-7ef3-4a5a-9b5e-3f4236311742', '2026-02-09', 'Wire Transfer - John Smith', 1200.00, 'USD', 'Settled', 'Transfer', 'Non-Card'),
('TXN-NONCARD-003', 'ee6a239d-7ef3-4a5a-9b5e-3f4236311742', '2026-02-08', 'ACH Payment - Electric Company', 145.67, 'USD', 'Settled', 'Utilities', 'Non-Card');

-- ========== TRANSACTIONS FOR USER 2 (sarah.johnson@business.com) ==========
INSERT INTO public.transactions (id, user_id, date, merchant, amount, currency, status, category, transaction_type) VALUES
('TXN-BIZ-CARD-001', 'b86fdff7-bd4c-4c34-b171-6cdcfb8bc918', '2026-02-10', 'Office Depot', 456.78, 'USD', 'Settled', 'Business Supplies', 'Card'),
('TXN-BIZ-CARD-002', 'b86fdff7-bd4c-4c34-b171-6cdcfb8bc918', '2026-02-09', 'LinkedIn Premium', 79.99, 'USD', 'Settled', 'Business Services', 'Card'),
('TXN-BIZ-NONCARD-001', 'b86fdff7-bd4c-4c34-b171-6cdcfb8bc918', '2026-02-10', 'Wire Transfer - Vendor Payment', 8500.00, 'USD', 'Settled', 'Business', 'Non-Card'),
('TXN-BIZ-NONCARD-002', 'b86fdff7-bd4c-4c34-b171-6cdcfb8bc918', '2026-02-09', 'ACH Payment - Payroll', 12000.00, 'USD', 'Settled', 'Payroll', 'Non-Card'),
('TXN-BIZ-NONCARD-003', 'b86fdff7-bd4c-4c34-b171-6cdcfb8bc918', '2026-02-08', 'Wire Transfer - Equipment Purchase', 15000.00, 'USD', 'Settled', 'Equipment', 'Non-Card'),
('TXN-BIZ-NONCARD-004', 'b86fdff7-bd4c-4c34-b171-6cdcfb8bc918', '2026-02-07', 'ACH Payment - Office Rent', 3500.00, 'USD', 'Settled', 'Rent', 'Non-Card');

-- ========== TRANSACTIONS FOR USER 3 (michael.chen@premium.com) ==========
INSERT INTO public.transactions (id, user_id, date, merchant, amount, currency, status, category, transaction_type) VALUES
('TXN-PREM-CARD-001', 'bf4ce45e-0765-4765-be60-0d99d1e31569', '2026-02-10', 'Delta Airlines', 2487.00, 'USD', 'Settled', 'Travel', 'Card'),
('TXN-PREM-CARD-002', 'bf4ce45e-0765-4765-be60-0d99d1e31569', '2026-02-09', 'Four Seasons Hotel', 1850.00, 'USD', 'Settled', 'Travel', 'Card'),
('TXN-PREM-CARD-003', 'bf4ce45e-0765-4765-be60-0d99d1e31569', '2026-02-08', 'Louis Vuitton', 3200.00, 'USD', 'Settled', 'Luxury Goods', 'Card'),
('TXN-PREM-NONCARD-001', 'bf4ce45e-0765-4765-be60-0d99d1e31569', '2026-02-10', 'Wire Transfer - Investment Account', 50000.00, 'USD', 'Settled', 'Investment', 'Non-Card');

-- ========== SAMPLE CLAIMS FOR USER 1 (karthik.mani@kore.com) ==========
-- Claim 1: Unrecognized Amazon charge
DO $$
DECLARE
    claim1_id UUID;
    claim2_id UUID;
BEGIN
    INSERT INTO public.claims (id, transaction_id, transaction_date, amount, currency, status, dispute_type, reason, user_id)
    VALUES (
        gen_random_uuid(),
        'TXN-CARD-001',
        '2026-02-10',
        249.99,
        'USD',
        'In Progress',
        'Card',
        'I did not authorize this Amazon purchase. My card may have been compromised.',
        'ee6a239d-7ef3-4a5a-9b5e-3f4236311742'
    ) RETURNING id INTO claim1_id;

    -- Add history for Claim 1
    INSERT INTO public.claim_history (claim_id, status, description, actor, created_at) VALUES
    (claim1_id, 'Open', 'Claim submitted by customer', 'Customer', '2026-02-10 10:00:00'),
    (claim1_id, 'In Progress', 'Assigned to fraud investigation team', 'Bank Staff', '2026-02-10 14:30:00');

    -- Claim 2: Duplicate charge
    INSERT INTO public.claims (id, transaction_id, transaction_date, amount, currency, status, dispute_type, reason, user_id)
    VALUES (
        gen_random_uuid(),
        'TXN-CARD-003',
        '2026-02-08',
        87.45,
        'USD',
        'Open',
        'Card',
        'I was charged twice for the same grocery purchase at Whole Foods.',
        'ee6a239d-7ef3-4a5a-9b5e-3f4236311742'
    ) RETURNING id INTO claim2_id;

    INSERT INTO public.claim_history (claim_id, status, description, actor) VALUES
    (claim2_id, 'Open', 'Claim submitted by customer', 'Customer');
END $$;

-- ========== SAMPLE CLAIMS FOR USER 2 (nandini.muthyala@kore.com) ==========
-- Claim 3: Unauthorized wire transfer
DO $$
DECLARE
    claim3_id UUID;
BEGIN
    INSERT INTO public.claims (id, transaction_id, transaction_date, amount, currency, status, dispute_type, reason, user_id)
    VALUES (
        gen_random_uuid(),
        'TXN-BIZ-NONCARD-001',
        '2026-02-10',
        8500.00,
        'USD',
        'In Progress',
        'Non-Card',
        'This wire transfer was not authorized by our company. Possible fraud.',
        'b86fdff7-bd4c-4c34-b171-6cdcfb8bc918'
    ) RETURNING id INTO claim3_id;

    INSERT INTO public.claim_history (claim_id, status, description, actor, created_at) VALUES
    (claim3_id, 'Open', 'Claim submitted by customer', 'Customer', '2026-02-10 09:00:00'),
    (claim3_id, 'In Progress', 'Escalated to wire fraud department', 'Bank Staff', '2026-02-10 11:00:00');
END $$;

-- ========== SAMPLE CLAIMS FOR USER 3 (suman.chittimuri@kore.com) ==========
-- Claim 4: Service not received
DO $$
DECLARE
    claim4_id UUID;
BEGIN
    INSERT INTO public.claims (id, transaction_id, transaction_date, amount, currency, status, dispute_type, reason, user_id)
    VALUES (
        gen_random_uuid(),
        'TXN-PREM-CARD-002',
        '2026-02-09',
        1850.00,
        'USD',
        'Approved',
        'Card',
        'Hotel reservation was cancelled but I was still charged. Hotel confirmed cancellation.',
        'bf4ce45e-0765-4765-be60-0d99d1e31569'
    ) RETURNING id INTO claim4_id;

    INSERT INTO public.claim_history (claim_id, status, description, actor, created_at) VALUES
    (claim4_id, 'Open', 'Claim submitted by customer', 'Customer', '2026-02-09 08:00:00'),
    (claim4_id, 'In Progress', 'Requested documentation from merchant', 'Bank Staff', '2026-02-09 10:00:00'),
    (claim4_id, 'Approved', 'Merchant confirmed cancellation. Refund approved.', 'Bank Staff', '2026-02-11 15:00:00');
END $$;
