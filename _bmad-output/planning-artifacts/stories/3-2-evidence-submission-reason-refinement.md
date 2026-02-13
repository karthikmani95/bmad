# Story 3.2: Evidence Submission & Reason Refinement

## Background
Disputes often require additional evidence (receipts, contracts) or clarification from the customer after the initial submission. This story enables users to upload documents and refine their dispute reason when requested by the bank.

## User Story
As a **Retail Customer**,
I want to be able to upload documents or update my dispute reason if requested,
So that I can provide the necessary proof to resolve my claim without calling customer support.

## Acceptance Criteria
- [ ] **Document Upload**: Users can select and "upload" files (PDF, JPG, PNG).
- [ ] **Mock Upload**: The system simulates an upload delay and success state (since no real backend storage exists).
- [ ] **Upload List**: Display a list of uploaded files with their names and upload timestamps.
- [ ] **Edit Reason**: Users can click an "Edit" button next to the Dispute Reason to modify their explanation.
- [ ] **Actionable State**: These actions should be prominent when the claim status is "In Progress" or "Info Requested".
- [ ] **Audit Log**: (Mock) Updates to the reason or file uploads should trigger a new entry in the Claim Timeline.

## Technical Notes
- **Component**: `EvidenceUpload.tsx` (File input + list).
- **Component**: `ReasonEditor.tsx` (Inline textarea or modal).
- **Integration**: Add these components to `ClaimDetails.tsx`.
- **State**: Local state to manage the list of "uploaded" files and the current reason text.
