# Story 1.1: Project Infrastructure & SSO Mock Setup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Developer**,
I want **to configure the Next.js + Supabase environment and establish the SSO mock layer**,
so that **the team can build features against a stable foundation**.

## Acceptance Criteria

1. **Given** the `notdfc-claims` project is initialized
2. **When** I configure `.env.local` with Supabase credentials
3. **Then** the application successfully connects to the Supabase client
4. **And** the `tests/__mocks__/bank-sso.ts` utility is implemented to simulate session tokens
5. **And** the `src/middleware.ts` is configured to intercept and validate these mock tokens

## Tasks / Subtasks

- [x] Configure Environment Variables (AC: 1, 2)
  - [x] Create `.env.local` from template
  - [x] Add dummy Supabase credentials for initial setup
- [x] Implement Supabase Client (AC: 3)
  - [x] Create `src/lib/supabase/client.ts`
  - [x] Verify connection logic
- [x] Implement SSO Mock Utility (AC: 4)
  - [x] Create `tests/__mocks__/bank-sso.ts`
  - [x] Implement `generateMockSessionToken` and `validateMockToken` functions
- [x] Configure Security Middleware (AC: 5)
  - [x] Update `src/middleware.ts` to use the SSO mock logic
  - [x] Ensure unauthorized access is redirected to mock login or blocked
- [x] Verify Connectivity & Security
  - [x] Run a simple integration test to confirm Supabase + SSO Mock handshake

## Dev Notes

- **Architecture Pattern**: Secure Vault (Next.js server-side validation + Supabase RLS).
- **Source Paths**: 
  - `src/lib/supabase/`
  - `src/middleware.ts`
  - `tests/__mocks__/bank-sso.ts`
- **Security Standards**: Use JWT-like structure for the Mock SSO to mirror Bank Portal behavior.

### Project Structure Notes

- Aligned with `src/features` pattern.
- Middleware handles the global security guard.

### References

- [Source: architecture.md#Implementation Patterns]
- [Source: prd.md#Security Requirements]

## Dev Agent Record

### Agent Model Used

Antigravity (Claude 3.5 Sonnet)

### Completion Notes List

- Established `.env.local` with mock secrets.
- Implemented singleton Supabase client in `src/lib/supabase/client.ts`.
- Developed signable JWT-like mock token utility in `tests/__mocks__/bank-sso.ts`.
- Integrated `src/middleware.ts` with SSO verification logic.
- Verified everything with `tests/unit/sso-verification.ts`.

### File List

- `.env.local`
- `src/lib/supabase/client.ts`
- `tests/__mocks__/bank-sso.ts`
- `src/middleware.ts`
- `tests/unit/sso-verification.ts`
