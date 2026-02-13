# Story 2.1: Transaction History Selection (Settled Filter)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Retail Customer**,
I want **to see a list of my transactions that are eligible for dispute**,
so that **I don't waste time trying to dispute "Pending" or invalid transactions**.

## Acceptance Criteria

1. **Given** I am in the "Create Claim" wizard (Step 1)
2. **When** the system loads my transaction history
3. **Then** only transactions with a "Settled" status are displayed (FR3)
4. **And** "Pending" transactions are hidden or clearly marked as ineligible
5. **And** I can select a single transaction to proceed to the next step

## Tasks / Subtasks

- [x] Define Transaction Types & Mock Data (AC: 2, 3)
  - [x] Create `src/features/transactions/types.ts`
  - [x] Create `src/features/transactions/mocks.ts` with Settled and Pending transactions
- [x] Implement Transaction Selection List (AC: 1, 3, 4)
  - [x] Create `src/features/claims/components/wizard/TransactionStep.tsx`
  - [x] Implement filtering logic for "Settled" status
- [x] Integration with Sidebar (AC: 1)
  - [x] Ensure "Create Claim" link in sidebar points to `/claims/new`
- [x] Implement Step Navigation (AC: 5)
  - [x] Added "Next" button enabled only when a transaction is selected

## Dev Notes

- **Filtering Logic**: `MOCK_TRANSACTIONS.filter(t => t.status === 'Settled')`.
- **UI Interaction**: Single selection required. Use NotDFC "Deep Navy" for selection state.

### Project Structure Notes

- Transaction related logic lives in `src/features/transactions`.
- Creating a claim lives in `src/features/claims/components/wizard`.

### References

- [Source: epics.md#Story 2.1]
- [Source: architecture.md#Implementation Patterns]

## Dev Agent Record

### Agent Model Used

Antigravity (Claude 3.5 Sonnet)

### Completion Notes List

- Implemented standard `Transaction` types and mock history.
- Built the `TransactionStep` with a strict `Settled` status filter (FR3).
- Added an amber warning toast for hidden pending transactions to reduce user confusion.
- Integrated the single-selection logic and multi-step wizard navigation.
- Verified all UX requirements via browser subagent.

### File List

- `src/features/transactions/types.ts`
- `src/features/transactions/mocks/data.ts`
- `src/features/claims/components/wizard/TransactionStep.tsx`
- `src/features/claims/components/wizard/ClaimWizard.tsx` (Partial)
- `src/app/claims/new/page.tsx`
- `src/components/layout/Sidebar.tsx`
