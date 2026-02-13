# Story 4.1: Claim Cancellation (Soft Delete)

## Background
Users may realize they made a mistake or resolved the dispute directly with the merchant. In these cases, they need a way to withdraw their claim without contacting support.

## User Story
As a **Retail Customer**,
I want to cancel my active dispute,
So that I don't waste bank resources investigating a resolved issue.

## Acceptance Criteria
- [ ] **Cancel Action**: A "Cancel Claim" button is available on the Claim Details page.
- [ ] **Conditional Visibility**: The button is ONLY visible for "Open" or "In Progress" claims.
- [ ] **Confirmation**: Clicking cancel triggers a confirmation modal/dialog to prevent accidental clicks.
- [ ] **Soft Delete**: The claim status updates to "Cancelled". The record is NOT removed from the database/list.
- [ ] **History Log**: A system event "Claim cancelled by user" is added to the timeline.
- [ ] **UI Feedback**: The status badge immediately updates to "Cancelled" (Grey).

## Technical Notes
- **Component**: `CancellationModal.tsx` (using Radix UI Dialog).
- **Integration**: Add to `ClaimDetails.tsx` actions area.
- **Mock Logic**: Update the local state in `ClaimDetails` and add a history entry.
