## Digital Claims Management – Compiled Planning Document

### 1. Executive Summary

The **Digital Claims Management** system is a standalone, self-service web application that allows banking customers to create, track, update, and cancel transaction disputes. It is accessed from the main bank website via SSO and is designed to reduce call-center volume while improving transparency and customer trust.

**Primary objectives:**
- Reduce assisted-support workload for claim creation and status checks.
- Digitally resolve at least 80% of routine disputes.
- Achieve high adoption and satisfaction with a fast, branded, and reliable portal.

### 2. Users & Entry Point

- **Retail customers / cardholders** using web or mobile banking.
- Entry from the authenticated bank dashboard via a **“Manage Claims” / “Claims”** link.
- Link opens the standalone claims app, reusing the upstream session via SSO.

### 3. Functional Scope (FRs)

**Claim Creation & Management**
- Users can:
  - Select dispute type (Card / Non-Card).
  - Choose an eligible **settled** transaction to dispute.
  - Provide dispute date and reason.
  - Submit and receive a unique **Claim ID**.
- **Guardrails:**
  - Only “Settled” transactions are eligible (no Pending disputes).
  - Duplicate prevention: no more than one **Open / In Progress** claim per Transaction ID.

**Lifecycle & Interaction**
- Statuses: **Open, In Progress, Approved, Rejected, Closed, Cancelled**.
- Users can:
  - View claim details, history, and status.
  - Upload supporting documents (PDF/JPG/PNG) when requested.
  - Update their dispute reason while the flow allows.
  - **Soft-delete** (cancel) claims in Open / In Progress states, leaving them visible but read-only as “Cancelled”.

**Notifications & Audit**
- Automated **email notifications** on claim status changes.
- Comprehensive **audit trail** capturing:
  - `actor_id`, `action_type` (CREATE/UPDATE/CANCEL),
  - `previous_state`, `new_state`,
  - `timestamp`.
- Audit records are immutable and retained for **7 years** to satisfy compliance.

### 4. Non-Functional Requirements (NFRs)

- **Security & SSO**
  - Integration with the main bank website for SSO and shared sessions.
  - Claims app must log out when the upstream bank session expires.
- **Compliance & Audit**
  - Immutable ledger and 7-year retention with appropriate partitioning/archival strategy.
- **Performance & UX**
  - Page loads and status lookups target **\< 2 seconds**.
  - Responsive, accessible, and aligned to the **NotDFC Deep Navy** brand.
  - Shimmer / skeleton loading states for async views.
- **Reliability**
  - **99.9% uptime** target.
  - Strong observability around claim mutations and notification delivery.

### 5. Architecture Overview

**Technology Stack**
- **Frontend & server runtime**: Next.js (App Router) + TypeScript.
- **Hosting**: Vercel.
- **Data & Auth**: Supabase (Postgres with Row-Level Security, Auth, potential Functions).
- **Styling**: Tailwind CSS + premium component library (e.g., shadcn-based UI).

**Key Architectural Decisions**
- **Starter**: Next.js + Supabase “secure vault” style starter for auth, relational data, and good defaults.
- **API pattern**: Next.js **Server Actions** for all core mutations to avoid broad public REST surfaces.
- **Data architecture**:
  - Relational Postgres schema, with claims linked to transactions by foreign key.
  - Dedicated `audit_logs` table for append-only audit events.
- **Auth & Security**:
  - Supabase Auth as identity provider.
  - SSO token handover from bank portal validated in `middleware.ts`.
  - RBAC / RLS ensure users only see their own claims (`customer_id`-scoped).
- **Infrastructure**:
  - Vercel for deployments and scaling of the Next.js app.
  - Supabase for DB, auth, and secure secret management.

### 6. Project Structure (Target)

```text
notdfc-claims/
├── src/
│   ├── app/                       (Routes)
│   │   ├── dashboard/             (My Claims summary)
│   │   ├── claims/                (Claims list & filters)
│   │   ├── create-claim/          (Multi-step wizard)
│   │   └── auth/                  (Login / Sign-up)
│   ├── components/                (Shared UI components)
│   │   ├── ui/                    (Design system primitives)
│   │   └── layout/                (Shell: header, sidebar)
│   ├── features/
│   │   └── claims/                (Domain logic, hooks, server actions)
│   ├── lib/
│   │   ├── supabase/              (Supabase clients & data helpers)
│   │   └── audit/                 (Audit log writer utilities)
│   └── middleware.ts              (SSO & security guard)
├── supabase/
│   ├── migrations/                (Schema & rules: claims, audit_logs, txn views)
│   └── seed.sql                   (Synthetic transactions & sample claims)
├── tests/
│   ├── __mocks__/
│   │   └── bank-sso.ts            (SSO mock token generator/validator)
│   └── e2e/                       (End-to-end flows)
└── README.md
```

### 7. Epics and Stories (Implementation Roadmap)

#### Epic 1: Portal Access & Dashboard Foundations

**Goal:** Establish a secure, branded shell and entry via SSO.

- **Story 1.1 – Project Infrastructure & SSO Mock Setup**
  - Configure `.env.local` with Supabase credentials.
  - Implement singleton Supabase client in `src/lib/supabase`.
  - Create `tests/__mocks__/bank-sso.ts` for mock SSO tokens.
  - Wire `src/middleware.ts` to validate mock SSO and guard routes.
  - Verify Supabase + SSO handshake with tests.

- **Story 1.2 – Global Branded Layout & Navigation**
  - Implement NotDFC Deep Navy header and responsive sidebar.
  - Provide navigation links for **Dashboard** and **Create Claim**.
  - Apply skeleton loading for initial dashboard data load.

- **Story 1.3 – “My Claims” Dashboard Summary**
  - Show a summary table of recent claims (Claim #, date, status).
  - Use colored status badges (e.g. Green/Amber/Red).

#### Epic 2: Transaction Discovery & Dispute Creation

**Goal:** Allow customers to discover eligible transactions and create a dispute via a wizard.

- **Story 2.1 – Transaction History Selection (Settled Filter)**
  - Step 1 of wizard: list only **Settled** transactions.
  - Hide or mark ineligible any Pending items.
  - Allow selection of a single transaction.

- **Story 2.2 – Dispute Configuration (Full vs Partial)**
  - Step 2: choose dispute type (Card / Non-Card) and reason.
  - Let users choose **Full** or **Partial** dispute amount.
  - Validate that partial amount ≤ original transaction amount.

- **Story 2.3 – Intelligent Submission & Duplicate Check**
  - Before submission, check for existing **Open / In Progress** claim for that Transaction ID.
  - Block duplicates with a clear warning.
  - On success, generate unique Claim ID and show success screen.

#### Epic 3: Claim Tracking & Interaction

**Goal:** Enable users to monitor and respond throughout the lifecycle.

- **Story 3.1 – Comprehensive Claim Details & History**
  - Detail view with transaction info, current status, and event timeline.
  - Status badges reflect severity and outcome.
  - Show customer-visible internal notes where relevant.

- **Story 3.2 – Evidence Submission & Reason Refinement**
  - When the state allows, permit document upload (PDF/JPG/PNG).
  - Enable edits to dispute reason text.
  - Create an audit entry on each update and surface clear success feedback.

#### Epic 4: Lifecycle Governance & Audit

**Goal:** Provide compliant lifecycle controls, notifications, and a 7-year audit trail.

- **Story 4.1 – Claim Cancellation (Soft Delete)**
  - Let users cancel Open / In Progress claims with confirmation.
  - Status becomes **Cancelled** and remains read-only but visible in history.
  - Log cancellation events in `audit_logs`.

- **Story 4.2 – Automated Status Notifications**
  - Email customers whenever claim status changes (e.g. Approved/Rejected).
  - Include Claim #, new status, and portal link.

- **Story 4.3 – Immutable Audit Ledger & Retention**
  - Automatically insert audit log row for every create/update/cancel.
  - Ensure logs are append-only at the application level.
  - Support 7-year retention via partitioning/archival strategy.

### 8. Implementation Readiness & Next Steps

- **Architecture status:** READY FOR IMPLEMENTATION with high confidence.
- **Immediate priorities:**
  - Finalize Supabase schema and run base migrations for `claim_records` and `audit_logs`.
  - Stand up dashboard, create-claim wizard shell, and SSO middleware using the structure above.
  - Implement initial E2E tests using the SSO mock and synthetic data.

This document is intended as your single “source of truth” summary across the PRD, architecture decisions, epics, and core stories for the Digital Claims Management project.

