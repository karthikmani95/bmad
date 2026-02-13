---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-02-11T15:21:00+05:30'
inputDocuments: 
  - /Users/Karthik.Mani/Desktop/bmad/_bmad-output/planning-artifacts/prd.md
  - /Users/Karthik.Mani/Desktop/bmad/_bmad-output/planning-artifacts/architecture.md
---

# bmad - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Digital Claims Management system (bmad project), decomposing the requirements from the PRD and Architecture decisions into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Claim Creation - Users can select a dispute type (Card/Non-Card), link a settled transaction, specify date, and reason.
FR2: Duplicate Restriction - The system must prevent multiple open claims for the same Transaction ID.
FR3: Settled Transactions Only - Disputes can only be initiated for transactions with a "Settled" status (not Pending).
FR4: Claim Number - Generate and display a unique claim number upon submission.
FR5: Status Tracking - Real-time viewing of claim status: Open, In Progress, Approved, Rejected, Closed, Cancelled.
FR6: Claim Updates - Users can modify dispute reason or upload additional documents (PDF, JPG, PNG) when prompted.
FR7: Soft Deletion - Users can cancel a claim if "Open" or "In Progress". Record is kept as "Cancelled" and remains viewable.
FR8: Partial Disputes - Users dispute the full transaction, but can specify partial amount reasons in the description.
FR9: Email Notifications - Automatic email alerts on claim status updates.

### NonFunctional Requirements

NFR1: Security - SSO integration with the main bank website. Claims system forces logout if session expires.
NFR2: Non-Repudiation - Every claim mutation (Create, Update, Cancel) must be recorded in an immutable ledger.
NFR3: Retention - Records must be preserved for 7 years to meet regulatory compliance standards.
NFR4: Performance - Page load and status retrieval < 2 seconds.
NFR5: Usability - Consistent with bank brand; responsive design.
NFR6: Reliability - 99.9% uptime.

### Additional Requirements

- **Starter Template**: Next.js + Supabase (Secure Vault) stack.
- **Database**: PostgreSQL with Row-Level Security (RLS) enabled.
- **Audit Logging**: Dedicated `audit_logs` table capturing `actor_id`, `action_type`, `previous_state`, `new_state`, and `timestamp`.
- **Authentication**: SSO Token Handover & Shared Session sync listeners.
- **API Patterns**: Use Next.js Server Actions for all mutations.
- **Project Structure**: Feature-based directory organization (e.g., `src/features/claims`).
- **Test Infrastructure**: SSO mock utility mapped to `tests/__mocks__/bank-sso.ts`.
- **UX/UI Guidelines**: Multi-step wizard, Shimmer/Skeleton loading states, and premium NotDFC Deep Navy theme.

### FR Coverage Map

FR1: Epic 2 - Transaction selection and wizard submission.
FR2: Epic 2 - Pre-submission duplicate check.
FR3: Epic 2 - Transaction filter (Settled status).
FR4: Epic 2 - Claim ID generation logic.
FR5: Epic 3 - Claim details view and real-time status updates.
FR6: Epic 3 - Document upload interface and status transition.
FR7: Epic 4 - Cancellation/Soft-delete functionality.
FR8: Epic 2 - Partial amount field in the creation wizard.
FR9: Epic 4 - Email trigger integration.

## Epic List

### Epic 1: Portal Access & Dashboard Foundations
**Goal:** Establish the secure foundation where users can enter via Bank SSO and view their claims dashboard.
**FRs covered:** NFR1, NFR4, NFR5, NFR6.

#### Story 1.1: Project Infrastructure & SSO Mock Setup
As a **Developer**,
I want to configure the Next.js + Supabase environment and establish the SSO mock layer,
So that the team can build features against a stable foundation.

**Acceptance Criteria:**
- **Given** the `notdfc-claims` project is initialized
- **When** I configure `.env.local` with Supabase credentials
- **Then** the application successfully connects to the Supabase client
- **And** the `tests/__mocks__/bank-sso.ts` utility is implemented to simulate session tokens
- **And** the `src/middleware.ts` is configured to intercept and validate these mock tokens

#### Story 1.2: Global Branded Layout & Navigation
As a **Retail Customer**,
I want to see a consistent NotDFC dashboard with a secure sidebar,
So that I feel confident navigating the claims system.

**Acceptance Criteria:**
- **Given** I am successfully authenticated
- **When** I view any page in the claims portal
- **Then** I see the NotDFC "Deep Navy" header and a responsive sidebar
- **And** the sidebar contains links for "Dashboard" and "Create Claim"
- **And** the layout uses the Shimmer/Skeleton pattern during initial data load (NFR4)

#### Story 1.3: "My Claims" Dashboard Summary
As a **Retail Customer**,
I want to see a high-level summary of my recently active claims,
So that I can quickly understand the status of my disputes.

**Acceptance Criteria:**
- **Given** I have existing claims in various states (Open, In Progress, Resolved)
- **When** I land on the Dashboard
- **Then** I see a summary table displaying the 5 most recent claims
- **And** each row shows the Claim #, Transaction Date, and Status badge
- **And** the dashboard matches the premium aesthetics of the NotDFC prototype

### Epic 2: Transaction Discovery & Dispute Creation
**Goal:** Enable users to filter valid transactions and create a dispute through a multi-step wizard.
**FRs covered:** FR1, FR2, FR3, FR4, FR8.

#### Story 2.1: Transaction History Selection (Settled Filter)
As a **Retail Customer**,
I want to see a list of my transactions that are eligible for dispute,
So that I don't waste time trying to dispute "Pending" or invalid transactions.

**Acceptance Criteria:**
- **Given** I am in the "Create Claim" wizard (Step 1)
- **When** the system loads my transaction history
- **Then** only transactions with a "Settled" status are displayed (FR3)
- **And** "Pending" transactions are hidden or clearly marked as ineligible
- **And** I can select a single transaction to proceed to the next step

#### Story 2.2: Dispute Configuration (Full vs Partial)
As a **Retail Customer**,
I want to specify the dispute type and amount for my selected transaction,
So that the bank understands the exact nature of my claim.

**Acceptance Criteria:**
- **Given** I have selected a "Settled" transaction
- **When** I proceed to Step 2 of the wizard
- **Then** I must select a Dispute Type (Card vs Non-Card) and a Dispute Reason
- **And** I can choose to dispute the "Full Amount" or specify a "Partial Amount" (FR8)
- **And** the UI prevents entering a partial amount greater than the original transaction total

#### Story 2.3: Intelligent Wizard Submission & Duplicate Check
As a **Retail Customer**,
I want the system to verify my dispute before submission and provide a reference number,
So that I have proof of my claim and won't create accidental duplicates.

**Acceptance Criteria:**
- **Given** I have completed the dispute configuration
- **When** I click "Submit Dispute"
- **Then** the system checks if an "Open" or "In Progress" claim already exists for this Transaction ID (FR2)
- **And** if a duplicate is found, I am shown a warning and submission is blocked
- **And** upon successful submission, a unique Claim # is generated (FR4)
- **And** I am directed to a "Success" screen displaying my new Claim ID

### Epic 3: Claim Tracking & Interaction
**Goal:** Empower users to track their dispute progress and respond to document requests.
**FRs covered:** FR5, FR6.

#### Story 3.1: Comprehensive Claim Details & History
As a **Retail Customer**,
I want to view the full history and current status of my dispute,
So that I stay informed about the bank's progress.

**Acceptance Criteria:**
- **Given** I am on the Dashboard
- **When** I click on a specific Claim #
- **Then** I am shown a detailed view including Transaction Details, Current Status, and an Event Timeline
- **And** the status badge color reflects the severity (e.g., Red for Rejected, Green for Approved, Amber for In Progress)
- **And** I can see any internal notes shared by the bank with the customer

#### Story 3.2: Evidence Submission & Reason Refinement
As a **Retail Customer**,
I want to be able to upload documents or update my dispute reason if requested,
So that I can provide the necessary proof to resolve my claim.

**Acceptance Criteria:**
- **Given** a claim is in a state that allows updates (e.g., "In Progress" with a request for info)
- **When** I view the claim details
- **Then** I see an interface to upload PDF, JPG, or PNG files (FR6)
- **And** I can edit my "Dispute Reason" text
- **And** upon saving, an "Audit Log" entry is created (linked to Epic 4)
- **And** the UI provides clear feedback on successful file upload

### Epic 4: Lifecycle Governance & Audit
**Goal:** Ensure regulatory compliance through "Soft-delete" cancellations, automated notifications, and 7-year audit logging.
**FRs covered:** FR7, FR9, NFR2, NFR3.

#### Story 4.1: Claim Cancellation (Soft Delete)
As a **Retail Customer**,
I want to cancel my dispute if it's still in the early stages,
So that I can stop a claim I no longer wish to pursue while keeping the record for my history.

**Acceptance Criteria:**
- **Given** I have an "Open" or "In Progress" claim
- **When** I view the claim details and select "Cancel Claim"
- **Then** the system prompts for confirmation
- **And** upon confirmation, the status updates to "Cancelled" (FR7)
- **And** the record remains viewable in my history but cannot be further updated
- **And** an audit log entry is generated for the cancellation

#### Story 4.2: Automated Status Notifications
As a **Retail Customer**,
I want to receive an email whenever my claim status changes,
So that I don't have to check the portal manually for updates.

**Acceptance Criteria:**
- **Given** my email address is registered with my NotDFC account
- **When** the bank or system updates the status of my claim (e.g., to "Approved" or "Rejected")
- **Then** an automated email notification is triggered to my address (FR9)
- **And** the email contains the Claim #, New Status, and a link to view details in the portal

#### Story 4.3: Immutable Audit Ledger & Retention
As a **Compliance Officer**,
I want every claim mutation to be recorded permanently and retained for 7 years,
So that the bank meets regulatory audit standards.

**Acceptance Criteria:**
- **Given** any create, update, or cancel action is performed on a claim
- **When** the database mutation occurs
- **Then** a record is automatically inserted into the `audit_logs` table (NFR2)
- **And** the log captures the `actor_id`, `action_type`, `previous_state`, `new_state`, and `timestamp`
- **And** the system architecture supports data partitioning or archival to ensure 7-year retention (NFR3)
- **And** audit logs are immutable (read-only/append-only for the application level)
