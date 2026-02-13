# Story 2.2: Dispute Configuration (Full vs Partial)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Retail Customer**,
I want **to specify the dispute type and amount for my selected transaction**,
so that **the bank understands the exact nature of my claim**.

## Acceptance Criteria

1. **Given** I have selected a "Settled" transaction
2. **When** I proceed to Step 2 of the wizard
3. **Then** I must select a Dispute Type (Card vs Non-Card) and a Dispute Reason
4. **And** I can choose to dispute the "Full Amount" or specify a "Partial Amount" (FR8)
5. **And** the UI prevents entering a partial amount greater than the original transaction total

## Tasks / Subtasks

- [x] Implement Dispute Type Selection (AC: 3)
  - [x] Radio/Toggle for Card vs Non-Card
- [x] Implement Dispute Reason Selection (AC: 3)
  - [x] Dropdown with predefined reasons
- [x] Implement Amount Selection Logic (AC: 4, 5)
  - [x] Toggle for Full vs Partial
  - [x] Numeric input for partial amount with validation against transaction total
- [x] Create Dispute Config Component (AC: 1, 2)
  - [x] Create `src/features/claims/components/wizard/DisputeConfigStep.tsx`

## Dev Notes

- **Validation**: Ensure `partialAmount <= transactionAmount`.
- **State Management**: Pass selection from Step 1 to Step 2 via React state (or Context).

### References

- [Source: epics.md#Story 2.2]

## Dev Agent Record

### Agent Model Used

Antigravity (Claude 3.5 Sonnet)

### Debug Log References

### Completion Notes List

- Implemented `DisputeConfigStep` with the required fields.
- Added logic for Full vs Partial amount with live validation.
- Optimized the wizard layout to ensure ergonomics (header/footer always visible).
- Unified CTA naming to "Initiate Claim" and removed duplicates.

### File List

- [DisputeConfigStep.tsx](file:///Users/Karthik.Mani/Desktop/bmad/notdfc-claims/src/features/claims/components/wizard/DisputeConfigStep.tsx)
- [ClaimWizard.tsx](file:///Users/Karthik.Mani/Desktop/bmad/notdfc-claims/src/features/claims/components/wizard/ClaimWizard.tsx)
- [ClaimsSummaryTable.tsx](file:///Users/Karthik.Mani/Desktop/bmad/notdfc-claims/src/features/dashboard/components/ClaimsSummaryTable.tsx)
- [MainLayout.tsx](file:///Users/Karthik.Mani/Desktop/bmad/notdfc-claims/src/components/layout/MainLayout.tsx)
- [page.tsx (Dashboard)](file:///Users/Karthik.Mani/Desktop/bmad/notdfc-claims/src/app/dashboard/page.tsx)
- [page.tsx (New Claim)](file:///Users/Karthik.Mani/Desktop/bmad/notdfc-claims/src/app/claims/new/page.tsx)
- [Sidebar.tsx](file:///Users/Karthik.Mani/Desktop/bmad/notdfc-claims/src/components/layout/Sidebar.tsx)
