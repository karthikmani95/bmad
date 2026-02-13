# Story 1.3: "My Claims" Dashboard Summary

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Retail Customer**,
I want **to see a high-level summary of my recently active claims**,
so that **I can quickly understand the status of my disputes**.

## Acceptance Criteria

1. **Given** I am on the Dashboard
2. **When** the page loads
3. **Then** I see a summary table displaying the 5 most recent claims
4. **And** each row shows the Claim #, Transaction Date, and Status badge
5. **And** the dashboard matches the premium aesthetics of the NotDFC prototype

## Tasks / Subtasks

- [x] Define Claim Types & Mock Data (AC: 3, 4)
  - [x] Create `src/features/claims/types.ts`
  - [x] Create `src/features/claims/mocks.ts` with diverse claim states
- [x] Implement Status Badge Component (AC: 4)
  - [x] Create `src/components/ui/StatusBadge.tsx` with color-coded states (Open, In Progress, Approved, Rejected, etc.)
- [x] Build Claims Summary Table (AC: 3, 4)
  - [x] Create `src/features/dashboard/components/ClaimsSummaryTable.tsx`
  - [x] Implement responsive table/card list for claims
- [x] Integrate Dashboard View (AC: 1, 5)
  - [x] Update `src/app/dashboard/page.tsx` to include the summary table
  - [x] Use `Skeleton` loaders for the initial data fetch simulation
- [x] Verify Dashboard Aesthetics (AC: 5)
  - [x] Ensure alignment with "Deep Navy" design system

## Dev Notes

- **Data Fetching**: Use a mock server action `getRecentClaims()` to simulate the Supabase fetch.
- **Status Colors**: 
  - Open: Blue
  - In Progress: Amber
  - Approved: Green
  - Rejected: Red
  - Cancelled: Gray
- **Responsiveness**: The table should switch to a card-list view on mobile devices.

### Project Structure Notes

- Dashboard specific features live in `src/features/dashboard`.
- Shared claim types live in `src/features/claims/types.ts`.

### References

- [Source: epics.md#Story 1.3]
- [Source: architecture.md#UX/UI Guidelines]

## Dev Agent Record

### Agent Model Used

Antigravity (Claude 3.5 Sonnet)

### Completion Notes List

- Defined core `Claim` and `ClaimStatus` types in `src/features/claims/types.ts`.
- Created robust mock data with 5+ varied claim states.
- Implemented `StatusBadge` for visual status feedback.
- Developed the `ClaimsSummaryTable` with skeleton loading states (NFR4).
- Built the main `DashboardPage` featuring account stats and recent activity.
- Verified visual fidelity and responsive behavior via browser subagent.

### File List

- `src/features/claims/types.ts`
- `src/features/claims/mocks/data.ts`
- `src/components/ui/StatusBadge.tsx`
- `src/features/dashboard/components/ClaimsSummaryTable.tsx`
- `src/app/dashboard/page.tsx`
- `scripts/generate-token.ts` (Dev utility)
