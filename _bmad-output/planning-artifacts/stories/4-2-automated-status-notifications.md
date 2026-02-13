# Story 4.2: Automated Status Notifications

## Background
Customers want to be kept in the loop about their dispute status without constantly checking the dashboard. Automated emails provide peace of mind and transparency.

## User Story
As a **Retail Customer**,
I want to receive email notifications when my claim status changes,
So that I know immediately when the bank has made a decision or needs more info.

## Acceptance Criteria
- [ ] **Trigger Events**: Notifications are triggered on:
    -   Claim Submission (Email: Recieved)
    -   Status Change to 'In Progress' (Email: Update)
    -   Status Change to 'Approved'/'Rejected' (Email: Decision)
    -   Cancellation (Email: Confirmation)
- [ ] **Visual Feedback**: Since we cannot send real emails, display a **Toast Notification** indicating "Email sent to user@example.com".
- [ ] **Notification Center**: (Optional) A bell icon in the navbar showing a history of "sent" emails.
- [ ] **Mock Service**: A `NotificationService` that logs these events and triggers the UI feedback.

## Technical Notes
- **Component**: `Toaster` (using `sonner` or custom).
- **Service**: `MockEmailService.ts`.
- **Integration**: Call this service in `ClaimWizard` (submission), `ClaimDetails` (cancellation), and any administrative mock actions.
