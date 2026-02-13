stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-11T15:05:00+05:30'
inputDocuments: 
  - /Users/Karthik.Mani/Desktop/bmad/_bmad-output/planning-artifacts/prd.md
  - /Users/Karthik.Mani/Desktop/bmad/_bmad-output/prototype/index.html
  - /Users/Karthik.Mani/Desktop/bmad/_bmad-output/prototype/styles.css
  - /Users/Karthik.Mani/Desktop/bmad/_bmad-output/prototype/app.js
project_name: 'bmad'
user_name: 'Karthik.Mani'
date: '2026-02-11T15:02:39+05:30'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Step 1: Initialization
The architecture workflow has been initialized with the following inputs:
- **PRD**: Digital Claims Management PRD v1.1
- **UX Prototype**: Interactive prototype (NotDFC Bank theme)

## Step 2: Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- **Dispute Lifecycle**: Support for full lifecycle from "Open" to "Cancelled/Resolved" with strict status transitions.
- **Data Guardrails**: Hard validation for settlement status and duplicate transaction IDs at the point of creation.
- **Notification Events**: Outbound email triggers on claim status updates.
- **Partial Amount Logic**: The ability to specify a portion of the transaction amount for the dispute while keeping the original transaction reference.

**Non-Functional Requirements:**
- **Security**: SSO and shared session synchronization between the main portal and the claims application.
- **Observability**: Comprehensive audit logging for all customer-led updates and system-led status changes.
- **Performance**: High interaction responsiveness (< 2s) for the infinite txn list and wizard transitions.
- **Decoupling**: The claims service must be architecturally isolated from volatile legacy resolution systems to ensure high reliability.

**Scale & Complexity:**
- **Primary Domain**: Web / API (Standalone Greenfield App).
- **Complexity Level**: Medium.
- **Estimated Architectural Components**: ~5 (UI, API Gateway, Claims Microservice, Audit/Event Log, Integration/Adapter Layer).

### Technical Constraints & Dependencies
- Dependency on a "Main Bank Website" for SSO and transaction history data.
- Requirement for PDF/JPG/PNG file persistence and association with Claim IDs.
- Requirement for consistent branding (theme tokens) across the "authenticated dashboard" jump.

### Cross-Cutting Concerns Identified
- **Session Liquidity**: Propagating logout state and maintaining session consistency across two applications.
- **Audit Logging**: Capturing the "Who, What, When" for every claim mutation for regulatory compliance.
- **Notification Latency**: Ensuring near real-time delivery of claim acknowledgments to reduce call center volume.

## Step 3: Starter Template Selection

### Primary Technology Domain
**Full-stack Web Application** based on project requirements analysis (Standalone app, high security, interactive UI).

### Selected Starter: Next.js + Supabase
**Rationale for Selection:**
The "Secure Vault" stack was chosen for its robust handling of authentication, relational data (PostgreSQL), and premium UI components. It ensures that security and auditability—key for a banking application—are built-in from the foundation.

**Initialization Command:**
```bash
npx create-next-app -e with-supabase
```

**Architectural Decisions Provided by Starter:**
- **Language & Runtime**: TypeScript by default, ensuring type safety for transaction data.
- **Styling Solution**: Tailwind CSS for a highly customized, mobile-friendly design system.
- **Build Tooling**: Next.js App Router for optimized server-side rendering and client-side transitions.
- **Testing Framework**: Ready for integration with Jest or Vitest for claim logic validation.
- **Code Organization**: Feature-based directory structure (App Router pattern).
- **Development Experience**: Fast refresh, built-in environment variable management, and seamless Vercel/Supabase integration.

## Step 4: Core Architectural Decisions

### Data Architecture
- **Decision**: Relational PostgreSQL Schema with Audit Tables.
- **Rationale**: Ensures Transaction Integrity. Claims are hard-linked to Transaction IDs via Foreign Keys.
- **Audit Strategy**: Implementation of a dedicated `audit_logs` table capturing `actor_id`, `action_type` (CREATE/UPDATE/CANCEL), `previous_state`, `new_state`, and `timestamp`. This is non-repudiable and required for regulatory compliance.

### Authentication & Security
- **Decision**: SSO Token Handover & Shared Session Management.
- **Rationale**: Users entering from the Main Bank portal must experience a seamless transition without re-logging. The architecture will implement a session sync listener to terminate the local session if the upstream bank session expires.
- **Authorization**: Role-Based Access Control (RBAC) ensuring users can only query/mutation claims associated with their `customer_id`.

### API & Communication Patterns
- **Decision**: Next.js Server Actions.
- **Rationale**: Provides a type-safe, secure bridge between the UI and the backend services. Eliminates the need for public REST endpoints for internal mutations, reducing the application's attack surface.

### Infrastructure & Deployment
- **Decision**: Vercel (Front-end) + Supabase (Database/Auth).
- **Rationale**: Optimized for the Next.js ecosystem, providing instant scaling and built-in security features (Auth, Vault) perfect for the NotDFC demo.

## Step 5: Implementation Patterns & Consistency Rules

### Naming Patterns
- **Database Naming**: `snake_case` for tables and columns (e.g., `claim_records.claim_id`).
- **Code Naming**: `PascalCase` for React components (`ClaimWizard.tsx`), `camelCase` for variables and functions (`submitDispute`).
- **File Naming**: Match the entity; `PascalCase` for components, `kebab-case` for utility files (e.g., `date-utils.ts`).

### Structure Patterns
- **Feature-Based Organization**: Grouping by domain rather than file type (e.g., `/features/claims` contains its own components, actions, and hooks).
- **Test Co-location**: `*.test.tsx` files must reside in the same directory as the code they test.

### Format Patterns
- **API Response**: Standardized `{ data: T | null, error: string | null }` wrapper for all Server Actions.
- **Date/Time**: ISO 8601 strings for storage and communication.

### Process Patterns
- **Error Handling**: Use of "Error Boundaries" for UI crashes and "Toast Notifications" for recoverable user errors.
- **Loading UX**: Implementation of Shimmer/Skeleton loading states for all async data fetches.

## Step 6: Project Structure & Boundaries

### Complete Project Directory Structure
```text
notdfc-claims/
├── .github/workflows/ci.yml       (Automated Quality Checks)
├── src/
│   ├── app/                       (The Pages)
│   │   ├── dashboard/             (Summary View)
│   │   ├── claims/                (Management List)
│   │   └── create-claim/          (The Wizard)
│   ├── components/                (Shared UI Components)
│   │   ├── ui/                    (Buttons, Inputs - Shadcn)
│   │   └── layout/                (The Sidebar & Header)
│   ├── features/                  (Core Business Logic)
│   │   └── claims/                (Wizard Logic, Data Validation)
│   ├── lib/                       (Shared Libraries)
│   │   ├── supabase/              (Database Client)
│   │   └── audit/                 (Audit Log Helpers)
│   └── middleware.ts              (SSO & Security Guard)
├── tests/
│   ├── __mocks__/
│   │   └── bank-sso.ts            (SSO Mock Utility)
│   └── e2e/
├── supabase/
│   ├── migrations/                (Database Folder/Rules)
│   └── seed.sql                   (Sample Bank Data)
└── README.md                      (Project Documentation)
```

### Architectural Boundaries
- **API Boundaries**: All data mutations handled via Next.js Server Actions. No public-facing REST API exposed for core features.
- **Component Boundaries**: Shared UI components (`/ui`) are stateless. Feature components handle their own state via hooks.
- **Data Boundaries**: Direct database access restricted to Server Actions. Secure Row-Level Security (RLS) forced at the Supabase/Database layer.

### Requirements to Structure Mapping
- **Dispute Lifecycle (Wizard)**: `src/features/claims/components/` & `src/app/create-claim/`
- **Audit Logging**: `src/lib/audit/` & `supabase/migrations/`
- **Transactional Ledger Data**: `src/lib/supabase/` (Read-only access to transaction views)
- **Dashboard & Navigation**: `src/app/dashboard/` & `src/components/layout/`
- **SSO Security**: `src/middleware.ts` & `src/lib/auth.ts`

## Step 7: Architecture Validation & Completion

### Coherence Validation ✅
- **Decision Compatibility**: Next.js + Supabase provides a unified auth/data foundation essential for banking-grade security.
- **Pattern Consistency**: Enforced naming conventions (`snake_case` DB, `PascalCase` UI) prevent cross-agent implementation drift.

### Requirements Coverage Validation ✅
- **Functional Requirements**: 100% coverage including wizard logic, status guards, and partial amount handling.
- **Non-Functional Requirements**: 
  - **Audit Integrity**: Dedicated audit table implemented via PostgreSQL triggers.
  - **SSO Liquidity**: Middleware-based session sync ensures logout propagation.

### Gap Analysis & Party Mode Findings 🔍
- **Data Retention**: All audit logs MUST be retained for a **7-year period** per NotDFC compliance standards. This will be enforced via a DB partition strategy.
- **Test Infrastructure**: Added `tests/__mocks__/bank-sso.ts` to simulate bank portal handovers for E2E validation.

### Architecture Readiness Assessment
**Overall Status**: READY FOR IMPLEMENTATION
**Confidence Level**: HIGH

### Implementation Handoff
**First Priority**: Initialize the Supabase project and execute the base migrations for `claim_records` and `audit_logs`.
