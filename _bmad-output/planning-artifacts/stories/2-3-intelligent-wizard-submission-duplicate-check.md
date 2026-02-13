# Story 2.3: Intelligent Wizard Submission & Duplicate Check

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Retail Customer**,
I want **the system to verify my dispute before submission and provide a reference number**,
so that **I have proof of my claim and won't create accidental duplicates**.

## Acceptance Criteria

1. **Given** I have completed the dispute configuration
2. **When** I click "Submit Dispute"
3. **Then** the system checks if an "Open" or "In Progress" claim already exists for this Transaction ID (FR2)
4. **And** if a duplicate is found, I am shown a warning and submission is blocked
5. **And** upon successful submission, a unique Claim # is generated (FR4)
6. **And** I am directed to a "Success" screen displaying my new Claim ID

## Tasks / Subtasks

- [ ] Implement Duplicate Check Logic (AC: 3, 4)
  - [ ] Validate against `MOCK_CLAIMS` or Supabase
- [ ] Implement Claim ID Generation (AC: 5)
  - [ ] Format: `CLM-[RANDOM]-[X]`
- [ ] Create Review & Submission Step (AC: 1, 2)
  - [ ] Create `src/features/claims/components/wizard/ReviewStep.tsx`
- [ ] Implement Success View (AC: 6)
  - [ ] Create `src/features/claims/components/wizard/SuccessStep.tsx`
- [ ] Finalize Multi-Step Wizard Container
  - [ ] Create `src/features/claims/components/wizard/ClaimWizard.tsx`
  - [ ] Route entry at `src/app/claims/new/page.tsx`

## Dev Notes

- **Duplicate Check**: Mock this by checking the `MOCK_CLAIMS` array.
- **Data Persistence**: Simulate a save to Supabase via a server action.

### References

- [Source: epics.md#Story 2.3]

## Dev Agent Record

### Agent Model Used

Antigravity (Claude 3.5 Sonnet)

### Debug Log References

### Completion Notes List

### File List
