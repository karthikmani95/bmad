# Product Requirements Document: Digital Claims Management

## 1. Executive Summary
The Digital Claims Management system is a self-service, standalone web application accessible via the main bank website. It empowers customers to autonomously manage transaction disputes (Creation, Status, Update, Deletion), reducing call center volume and improving transparency.

## 2. Goals & Success Metrics
**Objective:** Reduce operational pressure on assisted support channels.
**KPIs:**
- Significant reduction in call center inquiries related to claim status and creation.
- Successful digital resolution of at least 80% of routine disputes.
- High user adoption of the digital claims portal.

## 3. User Personas
- **Retail Customers:** Individuals using mobile or web banking to manage their accounts.
- **Cardholders:** Users of debit or credit cards seeking to dispute specific transactions.

## 4. Architecture & Entry Point
- **Access Method:** Users click a "Manage Claims" or "Claims" link/icon on the main bank website's authenticated dashboard.
- **System Type:** Standalone Web Application.
- **Main Dashboard Options:**
  - Create Claim
  - Manage/View Claims (Soft Delete/Status/Update)

## 5. Functional Requirements
### 5.1 Claim Management
| ID | Requirement | Description |
| :--- | :--- | :--- |
| **FR1** | **Claim Creation** | Users can select a dispute type (Card/Non-Card), link a settled transaction, specify date, and reason. |
| **FR2** | **Duplicate Restriction** | The system must prevent multiple open claims for the same **Transaction ID**. |
| **FR3** | **Settled Transactions Only** | Disputes can only be initiated for transactions with a "Settled" status (not Pending). |
| **FR4** | **Claim Number** | Generate and display a unique claim number upon submission. |
| **FR5** | **Status Tracking** | Real-time viewing of claim status: Open, In Progress, Approved, Rejected, Closed, Cancelled. |
| **FR6** | **Claim Updates** | Users can modify dispute reason or upload additional documents (PDF, JPG, PNG) when prompted. |
| **FR7** | **Soft Deletion** | Users can cancel a claim if "Open" or "In Progress". Record is kept as "Cancelled" and remains viewable. |
| **FR8** | **Partial Disputes** | Users dispute the full transaction, but can specify partial amount reasons in the description. |

### 5.2 Data Capture
- **Mandatory:** Dispute Type, Transaction ID, Transaction Date, Dispute Reason.
- **Optional:** Supporting Documents (PDF, JPG, PNG).

### 5.3 Notifications
- **Email Alerts:** Users must receive an automated email notification whenever a claim status is updated.

## 6. Non-Functional Requirements
- **Security:** SSO integration with the main bank website. Claims system forces logout if session expires.

### 6.1 Audit Trail Requirements
- **Non-Repudiation**: Every claim mutation (Create, Update, Cancel) must be recorded in an immutable ledger.
- **Retention**: **[Updated]** Records must be preserved for **7 years** to meet regulatory compliance standards.
- **Data Points**: Actor ID, Action Type, Previous State, New State, Timestamp.

### 6.2 Implementation & Testability
- **SSO Simulation**: To ensure the SSO handover is reliable, an SSO mock utility must be used for E2E testing to simulate bank portal session termination.
- **Audit Logs:** Full audit trail for all claim modifications and status changes.
- **Performance:** Page load and status retrieval < 2 seconds.
- **Usability:** Consistent with bank brand; responsive design.
- **Reliability:** 99.9% uptime.

## 7. User Flow
### 7.1 Entry Flow
1. User clicks "Manage Claims" on Bank Dashboard.
2. Standalone app opens via shared session.

### 7.2 Creation Flow
1. User selects "Create Claim".
2. System filters for "Settled" transactions.
3. User selects transaction and reason.
4. User submits; System checks for duplicates and generates Claim ID.

### 7.3 Management Flow
1. User views "My Claims".
2. User selects a claim to view details or update (if prompted for documents).
3. User cancels claim (Soft Delete) → Status becomes "Cancelled".

## 8. Milestones
- **PRD Finalization:** Feb 10, 2026
- **UX/UI Design:** Feb 11, 2026
- **Development & Testing:** Feb 12, 2026
- **Target Launch:** Feb 13, 2026

## 9. Risks & Assumptions
- **Assumption:** Seamless SSO integration.
- **Risk:** Integration with legacy resolution systems could delay the tight Feb 13 launch.

## 10. Synthetic Data
- **Users:** 3-5 mock retail users.
- **Claims:** 5-10 mock claims across various states.
- **Transactions:** Diverse set of settled card and non-card transactions.
