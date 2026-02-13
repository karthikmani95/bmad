
# Story 1.2: Global Branded Layout & Navigation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Retail Customer**,
I want **to see a consistent NotDFC dashboard with a secure sidebar**,
so that **I feel confident navigating the claims system**.

## Acceptance Criteria

1. **Given** I am successfully authenticated
2. **When** I view any page in the claims portal
3. **Then** I see the NotDFC "Deep Navy" header and a responsive sidebar
4. **And** the sidebar contains links for "Dashboard" and "Create Claim"
5. **And** the layout uses the Shimmer/Skeleton pattern during initial data load (NFR4)

## Tasks / Subtasks

- [x] Define Theme & Tokens (AC: 3)
  - [x] Set up Tailwind configuration for "Deep Navy" (#001F3F / #003366)
  - [x] Define silver/warm white accents in `globals.css`
- [x] Implement Global Layout Component (AC: 2, 3)
  - [x] Create `src/components/layout/MainLayout.tsx`
  - [x] Implement Navbar with NotDFC Logo and Logout trigger
- [x] Build Responsive Sidebar (AC: 4)
  - [x] Create `src/components/layout/Sidebar.tsx`
  - [x] Add navigation links for `/dashboard` and `/claims/new`
  - [x] Implement mobile-responsive toggle
- [x] Implement Shimmer/Skeleton Pattern (AC: 5)
  - [x] Create `src/components/ui/Skeleton.tsx`
  - [x] Integrate skeletons into the dashboard/list loading states
- [x] Update Root Layout
  - [x] Wrap the application in `MainLayout`

## Dev Notes

- **Design System**: NotDFC Deep Navy (#001F3F). Warm white backgrounds (#FDFDFD). Silver accents (#C0C0C0).
- **Icons**: Use Lucide-React or similar for professional-grade icons.
- **Responsiveness**: Ensure the sidebar collapses to a hamburger menu on small screens.

### Project Structure Notes

- Layout components should live in `src/components/layout`.
- UI primitives live in `src/components/ui`.

### References

- [Source: implementation_plan.md#Design System]
- [Source: architecture.md#UX/UI Guidelines]

## Dev Agent Record

### Agent Model Used

Antigravity (Claude 3.5 Sonnet)

### Completion Notes List

- Defined the NotDFC "Deep Navy" design system in `tailwind.config.ts` and `globals.css`.
- Built the responsive `MainLayout` and `Sidebar` components with Lucide icons.
- Implemented the `Skeleton` shimmer loader to ensure perceptual performance (NFR4).
- Integrated the branded shell into `RootLayout`.
- Ensured the navigation structure supports the full claim lifecycle, including future "Edit" flows as per user request.

### File List

- `tailwind.config.ts`
- `src/app/globals.css`
- `src/components/ui/Skeleton.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/app/layout.tsx`
