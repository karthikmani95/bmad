# Story 3.1: Comprehensive Claim Details & History

## Background
Users need a dedicated view to track the progress of their disputes. The dashboard provides a summary, but the Details view is where they can see the full history, current status context, and specific transaction details.

## User Story
As a **Retail Customer**,
I want to view the full history and current status of my dispute,
So that I stay informed about the bank's progress and understand strictly what is happening with my funds.

## Acceptance Criteria
- [ ] **Navigation**: Clicking a claim in the Dashboard list navigates to `/claims/[id]`.
- [ ] **Header Information**: Displays Claim ID, Status Badge (with appropriate color coding), and Created Date.
- [ ] **Transaction Summary**: Shows the original transaction details (Merchant, Date, Amount) for context.
- [ ] **Dispute Details**: Shows the Dispute Type (Card/Non-Card) and the Reason provided by the user.
- [ ] **Timeline/History**: A visual timeline showing the progression of the claim (e.g., Submitted -> In Progress -> Approved/Rejected).
- [ ] **Responsive Design**: The layout adapts to mobile and desktop viewports, maintaining the "Deep Navy" premium aesthetic.

## Technical Notes
- Page Route: `src/app/claims/[id]/page.tsx`
- Component: `ClaimDetailsView.tsx`
- Data Fetching: Needs to fetch claim by ID (mocked for now, or unified mock data).
- Timeline Component: Reusable `Timeline` component for the audit trail/history.
