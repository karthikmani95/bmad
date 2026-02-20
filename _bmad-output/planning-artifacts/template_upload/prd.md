---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-07-project-type', 'step-08-scoping', 'step-09-functional']
inputDocuments: []
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
workflowType: 'prd'
classification:
  projectType: web_app
  domain: legaltech
  complexity: high
  projectContext: brownfield
---

# Product Requirements Document - template_upload

**Author:** Karthik.Mani
**Date:** 2026-02-18

## 1. Project Discovery Summary

Admin-console feature for uploading standard contract templates used in deviation and missing-clause analysis. Templates are scoped by legal entity and contract type (extracted from the document). Each clause carries standard values; admins define per-clause deviation rules (e.g., payment terms > 60 days). Versioning is immutable; new contracts use the latest version; contracts keep the template version from ingestion time.

## 2. Success Criteria

### User Success

- Admins can view template version in the relevant section by legal entity and contract type.
- Admins can open the template on demand in a pop-up to verify the correct template has been uploaded.
- Draft state with Save allows multi-day workflow; Apply is explicit and separate—no surprise activation.
- **Active** badge on the template applied to new contracts for clear differentiation.
- Admins can edit deviation rules at any time without re-uploading the template.
- Admin completes first template setup (upload → review → rules → activate) in under 2 hours of effort, even if spread across multiple days.
- Admin can visually confirm the correct template is applied before any contract is compared (via pop-up and Active badge).

### Business Success

- **Faster onboarding:** New templates go live without product team involvement.
- **Self-service:** Product team decoupled from template uploads; admins own the full lifecycle.
- Seamless transition—runs in parallel with manual uploads during rollout.
- Measurable target: Define X% of templates migrated to admin upload within Y weeks, or product team no longer required for template uploads after Z days.

### Technical Success

- Immutable version history; no-delete policy for audit/compliance.
- Full audit trail: every template upload, edit, and activation attributed and timestamped.
- Deviation rule changes are auditable.
- Standard reliability for the admin console.

### Measurable Outcomes

- Admins complete their first template upload and activation without product team involvement.
- Version history shows contract count per template version.
- Admin can verify the active template within under a minute via pop-up preview.

## 3. Product Scope

### MVP - Minimum Viable Product

- Upload template (Word/PDF) → draft state with Save.
- Extraction of contract type, legal entity, business unit; admin review and correction.
- Per-clause deviation rules (text-based, e.g. "> 60 days = deviation").
- Activate/Apply flow separate from Save.
- Version history with contract count per version.
- **Active** badge on template used for new contracts.
- Pop-up preview to verify the correct template.
- Edit deviation rules on active templates.
- Template visibility by legal entity and contract type.
- Explicit UI indication of which template version applies to new vs. existing contracts during parallel run.
- **Create new metadata at upload time:** Admin can create new contract types, new legal entities (tagged to existing or new BU), and new business units when extraction returns values not in the system.

### Growth Features (Post-MVP)

- Bulk upload or batch operations.
- In-app approval workflow before activation.
- Analytics (adoption, deviation trends).

### Vision (Future)

- AI-assisted extraction validation or deviation suggestions.
- More advanced rule definition (structured conditions).
- Cross-tenant or cross-entity template reuse.

## 4. User Journeys

### Journey 1: Admin - First Template Upload (Success Path)

**Persona:** Priya, Legal Operations Admin at a group company with multiple legal entities and contract types.

**Opening scene:** Priya needs to onboard a standard SOW template for Legal Entity Alpha. She used to wait for the product team. Now she goes to the admin console.

**Rising action:** She uploads the Word document. The system extracts contract type (SOW), legal entity (Alpha), and business unit (BU-East). She reviews and corrects a mis-extracted field. She defines the deviation rule for payment terms: "If > 60 days, flag as deviation." She saves as draft, comes back the next day to add rules for a few more clauses, saves again.

**Climax:** She clicks **Apply**. The template shows an **Active** badge. She opens the pop-up to verify the correct template is now used for new SOW contracts from Legal Entity Alpha.

**Resolution:** She's done without involving the product team. New contracts will use this template for comparison automatically.

**Capabilities revealed:** Upload, extraction + review, per-clause deviation rules, draft Save, Apply, Active badge, template preview pop-up.

### Journey 2: Admin - Multi-Day Draft Refinement (Edge Case)

**Persona:** Same as Journey 1.

**Opening scene:** Priya uploads a complex Master Agreement template. Extraction gets most fields right but mis-identifies the business unit. She has dozens of clauses to define rules for—needs several days.

**Rising action:** She corrects the business unit, saves. Over the next few days she returns to add rules for termination, indemnification, liability—saving each time without applying. She's relieved she can leave and come back without losing work or accidentally activating.

**Climax:** She notices extraction changed when she reloads (maybe backend improved)—but her deviation rule edits are preserved. She verifies, then applies.

**Resolution:** Draft state supports real-world multi-day workflow. No surprise activation. Edits persist.

**Capabilities revealed:** Draft Save without Apply, extraction correction, rule preservation across sessions, multi-day workflow support.

### Journey 3: Admin - Verifying Template & Editing Rules

**Persona:** Marcus, Contract Admin overseeing multiple legal entities.

**Opening scene:** A stakeholder asks: "Which template is being used for Contract #4521? Is it our current standard?"

**Rising action:** Marcus navigates to the template section, filters by legal entity and contract type. He sees version history with contract counts per version. **Active** badge on the latest. He opens the pop-up to view the template.

**Climax:** He realizes payment terms are being flagged too aggressively. He edits the deviation rule from "> 30 days" to "> 60 days" and saves. Change is auditable. No re-upload needed.

**Resolution:** He can verify the active template in under a minute and adjust rules on the fly.

**Capabilities revealed:** Template section by legal entity + contract type, version history with contract counts, Active badge, pop-up preview, edit deviation rules on active template.

### Journey 4: Support - Investigating Template Mismatch

**Persona:** Support or senior admin investigating a report.

**Opening scene:** An admin reports: "Contract #3892 shows deviations but we updated our template—wrong one must be applied."

**Rising action:** Investigator checks version history. Contract #3892 was ingested when v2 was active; admin expected v3. Version history and contract count clarify: old contracts use ingestion-time version; only *new* contracts use latest. No bug—expected behavior.

**Climax:** Investigator confirms correct template is applied. Explains versioning model using the UI.

**Resolution:** Admin understands. Feature surfaces which version applies to which contract set.

**Capabilities revealed:** Version history with contract counts, explicit indication of new vs. existing contract template application, audit trail for investigation.

### Journey Requirements Summary

| Journey | Capabilities Revealed |
| :--- | :--- |
| 1. First upload (success) | Upload, extraction + review, deviation rules, Save, Apply, Active badge, preview |
| 2. Multi-day draft | Draft state, Save without Apply, extraction correction, rule preservation across sessions |
| 3. Verify & edit | Browse by entity/type, version history + contract counts, preview pop-up, edit rules on active template |
| 4. Investigation | Version history, contract counts, explicit new vs. existing contract version indication |

## 5. Domain-Specific Requirements

### Compliance & Regulatory

- Templates retained in perpetuity (master service agreements); no delete.
- Regulatory requirements out of scope for this PRD.

### Technical Constraints

- Full audit trail: every upload, edit, and activation recorded with user name and timestamp.
- Tenant isolation: admins only see templates for their tenant.
- All admins within a tenant can access all templates for that tenant.

### Audit Requirements

- Action record: action type, user name, timestamp.
- No justification or approval records required.

### Integration Scope

- Template upload via React admin console only.
- **ERP:** Contract types, legal entities, and business units are consumed from ERP (read-only). New metadata created by admins is stored locally; no sync back to ERP.
- Integrations with other tools (CLM, etc.) = future scope.

### Risk Mitigations

- **Primary risk:** Wrong template applied to a contract.
- **Mitigations:** Active badge, pop-up preview for verification; version history with contract counts; explicit indication of which version applies to new vs. existing contracts; extraction review in draft before activation.

## 6. Edge Cases: New Metadata at Upload Time

### 6.1 Problem

During template upload, extraction may identify:
- A **contract type** that does not yet exist in the system (e.g., NDA, Amendment, Framework Agreement)
- A **legal entity** that does not yet exist
- A **business unit** that does not yet exist

Without the ability to create these, the admin would be blocked from completing the template setup.

### 6.2 Required Capabilities

Admins must have the option to create new metadata when extraction returns values not in the system:

| Metadata | Admin Action | Notes |
| :--- | :--- | :--- |
| **Contract Type** | Create new contract type | Extensible list (not fixed); admin can add types as business needs evolve |
| **Legal Entity** | Create new legal entity | Must be tagged to an existing business unit **or** a new business unit |
| **Business Unit** | Create new business unit | Enables onboarding new BUs without product/IT involvement |

### 6.3 Flows

**Flow A: New contract type**
1. Admin uploads template; extraction identifies contract type "NDA."
2. "NDA" is not in the system.
3. Admin sees option: "Create new contract type: NDA" (or similar).
4. Admin creates "NDA"; draft continues with contract type set.
5. Template is saved/activated with the new type.

**Flow B: New legal entity**
1. Extraction identifies legal entity "Gamma Corp" (not in system).
2. Admin sees option: "Create new legal entity: Gamma Corp" (or similar).
3. Admin must associate Gamma Corp to a business unit—select existing BU or create new BU.
4. New legal entity (and new BU if created) are created; draft continues.
5. Template is scoped to the new entity.

**Flow C: New business unit**
1. Admin uploads template for a newly acquired subsidiary.
2. Extraction or admin identifies business unit "BU-West" (does not exist).
3. Admin creates new business unit "BU-West."
4. Legal entity is created under BU-West (or associated if extraction found it).
5. Template proceeds with new BU + LE.

### 6.4 Implications for MVP

- **Create new contract type** – Include in MVP (low complexity; maintains self-service).
- **Create new legal entity** – Include in MVP (required for Flow B).
- **Create new business unit** – Include in MVP (required for new subsidiaries/restructures).

All three capabilities are needed to support "upload template for net-new contract type / legal entity / BU" without product team involvement.

### 6.5 Data Source & Sync

- **Contract types, legal entities, and business units** are sourced from the ERP.
- The application **consumes** (reads) this metadata from the ERP; it is the source of truth for existing entities.
- When an admin **creates** new contract type, legal entity, or business unit, that creation is **local to this application**—we do **not** sync back to the ERP.
- ERP remains the master for data that exists there; the app may hold additional metadata (e.g., new types or entities) before or independent of ERP.

### 6.6 Proactive Template Setup

- A new template may be added **before** any contracts for that type/entity exist in the database.
- This is expected: admins can set up templates proactively so they are ready when contracts are ingested from the ERP.
- No requirement that contracts must exist for a template to be uploaded, activated, or displayed.

## 7. Web App–Specific Requirements

### Project-Type Overview

Admin-console feature delivered as a web application (React.js). Delivered as part of an existing multi-tenant platform; no SEO or public indexing needs.

### Technical Architecture Considerations

- **Architecture model:** SPA (single-page application); React admin console.
- **Delivery:** Embedded within existing admin console; not a standalone app.

### Browser Matrix

- Modern evergreen browsers: Chrome, Edge, Firefox, Safari (latest 2 versions).
- No legacy browser support (IE11 out of scope).
- Primary use: desktop/laptop; tablet optional.

### Responsive Design

- Admin console is desktop-first.
- Layout usable on tablet (1024px+) for on-the-go checks.
- Mobile not required for MVP (admin workflows are typically desktop).

### Performance Targets

- Template upload: completion feedback within reasonable time (no hard SLA from discovery).
- Page loads: consistent with existing admin console performance.
- Extraction review, version history, and template preview: responsive without noticeable delay.

### SEO Strategy

- Not applicable; admin console is behind authentication and not indexed.

### Accessibility Level

- Target WCAG 2.1 Level AA for admin UI (aligned with typical enterprise admin expectations).
- Keyboard navigation for core flows (upload, review, apply).
- Screen reader–friendly for template metadata, version history, and deviation rules.

## 8. Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP approach:** Problem-solving MVP—the minimum that eliminates the product-team bottleneck and lets admins self-serve template uploads. Success = admins can onboard templates without product involvement.

**Resource implications:** Frontend-focused (React admin console); backend extraction and versioning are existing or parallel work. Minimal net-new team beyond frontend + integration.

### MVP Feature Set (Phase 1)

**Core journeys supported:**
- Journey 1: First template upload (success path)
- Journey 2: Multi-day draft refinement
- Journey 3: Verify & edit deviation rules
- Journey 4: Support investigation (version clarity)

**Must-have capabilities:**
- Upload (Word/PDF), draft state, Save, Apply
- Extraction review (contract type, legal entity, BU) with admin correction
- Per-clause deviation rules (text-based)
- Version history with contract count per version
- Active badge, pop-up preview, edit rules on active templates
- Create new contract type, legal entity, business unit at upload time
- Explicit indication of new vs. existing contract template versioning
- Full audit trail (action, user, timestamp)

### Post-MVP Features

**Phase 2 (Growth):**
- Bulk upload or batch operations
- In-app approval workflow before activation
- Analytics (adoption, deviation trends)

**Phase 3 (Expansion):**
- AI-assisted extraction validation or deviation suggestions
- Advanced rule definition (structured conditions)
- Cross-tenant or cross-entity template reuse
- Integrations with CLM and other tools

### Risk Mitigation Strategy

**Technical:** Extraction accuracy is the main unknown. Draft state + admin review de-risks; admins can correct before activation. Backend versioning must align with frontend expectations.

**Market/Adoption:** Parallel run with manual uploads during rollout. No big-bang cutover; admins migrate when ready.

**Resource:** MVP is frontend-heavy. If backend (extraction, versioning) is delayed, draft UX can be built first; activation depends on backend readiness.

## 9. Functional Requirements

*This section defines the capability contract for all downstream work. Each FR is a testable capability; implementation details are deferred.*

### Template Upload & Draft Management

- FR1: Admin can upload a contract template file (Word or PDF format).
- FR2: Admin can save a template in draft state without activating it.
- FR3: Admin can return to a draft template across sessions and continue editing.
- FR4: Admin can apply (activate) a draft template; activation is explicit and separate from save.
- FR5: System preserves deviation rule edits when extraction results change on reload.

### Extraction & Metadata Review

- FR6: System extracts contract type, legal entity, and business unit from the uploaded template.
- FR7: Admin can review extracted contract type, legal entity, and business unit before activation.
- FR8: Admin can correct mis-extracted metadata before saving or applying.
- FR9: Admin can create a new contract type when extraction returns a value not in the system.
- FR10: Admin can create a new legal entity when extraction returns a value not in the system; admin must associate it to an existing or new business unit.
- FR11: Admin can create a new business unit when extraction or admin identifies one not in the system.

### Deviation Rules

- FR12: Admin can define per-clause deviation rules (text-based, e.g. "> 60 days = deviation") for each extracted clause.
- FR13: Admin can edit deviation rules on an active template without re-uploading the template.
- FR14: Deviation rule changes are auditable (action, user, timestamp).

### Template Versioning & Activation

- FR15: Each template has an immutable version history; templates cannot be deleted.
- FR16: New contracts are compared against the latest (active) template version for that legal entity and contract type.
- FR17: Existing contracts retain the template version that was active at ingestion time.
- FR18: Admin can see which template version is active (used for new contracts) via an Active badge or equivalent indication.
- FR19: Admin can see contract count per template version in version history.
- FR20: Admin can see explicit indication of which template version applies to new vs. existing contracts.

### Template Discovery & Verification

- FR21: Admin can view templates by legal entity and contract type.
- FR22: Admin can filter or browse templates by legal entity and contract type.
- FR23: Admin can open the template file on demand (e.g. pop-up preview) to verify the correct template has been uploaded.
- FR24: Admin can verify the active template for a given legal entity and contract type within one minute.

### Audit & Compliance

- FR25: System records every template upload with user name and timestamp.
- FR26: System records every template edit with user name and timestamp.
- FR27: System records every template activation with user name and timestamp.
- FR28: Audit records include action type, user name, and timestamp.

### Tenant & Access

- FR29: Admin sees only templates for their tenant (tenant isolation).
- FR30: All admins within a tenant can access all templates for that tenant.
