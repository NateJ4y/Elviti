# Elviti Works Portal — implementation blueprint

## Product boundary

- The existing Elviti Works public website remains separate and unchanged.
- This application is the private operations portal for internal users and approved external clients.
- The first product priority is Health & Safety operations.
- The portal UI is a foundation only. Do not enter real personal, incident, medical, contractor, or compliance information until authentication, authorization, persistence, and audit controls are implemented and verified.

## Experience direction

Use Mitti (by SafetyCulture) as visual inspiration, not as a brand or component library to copy:
- calm, light neutral workspace surfaces and generous spacing;
- compact, predictable left navigation;
- clear information hierarchy and readable data tables;
- restrained colour used to communicate status;
- cards and small visual summaries that make operational work approachable;
- responsive, task-first mobile layouts for frontline staff.

Retain Elviti Works identity: charcoal, white, and Safety Yellow (#F4B400). Avoid turning every component yellow.

## User groups and access boundaries

| Role | Intended access |
| --- | --- |
| Organisation administrator | Organisation configuration, user invitations, role assignment, all authorised organisation records |
| H&S manager / officer | Safety registers, risk assessments, inspections, investigations, corrective actions, controlled safety documents |
| Site supervisor | Records and actions for assigned sites; submit and review site-level items |
| Employee | Own profile and training; submit hazards/incidents; view assigned tasks and approved safety information |
| Contractor | Assigned project/site only; induction, competency evidence, permits and assigned actions |
| Client / external stakeholder | Explicitly shared project information and approved reports only; no access to internal personnel or unrelated sites |

Access must be enforced server-side and at the database row level. Hiding a menu item in the browser is not authorization. Every user must be scoped to an organisation and, where applicable, assigned projects/sites.

## Core modules

1. Overview — safety indicators, actions due, recent activity and site status.
2. Incidents & observations — incident/near-miss/hazard reporting, triage, investigation, root cause, corrective actions and closure.
3. Inspections — templates, schedules, field checklists, findings and follow-up actions.
4. Risk assessments — hazard register, risk scoring, controls, reviews and approvals.
5. Documents — controlled safety files, versions, expiry dates, approvals and access history.
6. Training & inductions — training matrix, competency evidence, induction status and renewal alerts.
7. People & contractors — profiles, role/site assignments and required evidence.
8. Sites & projects — site register, contacts, scope and safety requirements.
9. Reports — incident trends, inspection performance, open actions and compliance summaries.
10. Administration — organisation settings, roles, permissions and audit history.

## Proposed technical architecture

The current repository is a static HTML public website. The portal is intentionally isolated in /portal as a React + TypeScript + Vite application, suitable for its own Vercel project with the project root set to portal.

Proposed production backend: Supabase (PostgreSQL, Auth and private Storage), subject to final configuration and security review.

Required backend controls before launch:
- Supabase Auth with verified email and invitation-based onboarding; MFA for privileged roles.
- PostgreSQL Row Level Security policies for every tenant-owned table.
- Server-side authorization for privileged actions; never trust client-supplied role or organisation IDs.
- Private Storage buckets with short-lived signed URLs and per-record access checks.
- Immutable audit events for access-sensitive changes, approvals, exports and record closure.
- Server-side input validation, safe file type/size checks and malware scanning strategy.
- Backups, retention rules, incident response and recovery testing.
- Secrets only in deployment environment variables; never in source control.
- Privacy-by-design: collect only necessary information, restrict sensitive records, define retention and access review.

## Initial data domains

- organisations
- users / memberships / role assignments
- projects and sites
- people and contractor profiles
- incidents and observations
- investigations and corrective actions
- inspection templates, schedules, submissions and findings
- risk assessments, hazards and controls
- documents, versions, approvals and expiry metadata
- training courses, completions and competencies
- audit events and notification preferences

Each operational record should carry an organisation scope and, where relevant, a project/site scope. Use stable IDs, created/updated timestamps, actor IDs and explicit status transitions.

## Delivery sequence

### Phase 1 — secure foundation
- Finalise identity and role model.
- Configure Supabase Auth and database.
- Implement organisation, project and site scoping.
- Add RLS policies, audit events and private file storage.
- Build invitation, sign-in, password recovery and session handling.
- Add automated authorization tests.

### Phase 2 — core Health & Safety
- Incident and hazard reporting.
- Triage, investigation and corrective action workflow.
- Inspection templates, schedules and submissions.
- Risk assessments and review approvals.
- Safety dashboard backed by real, permission-filtered data.

### Phase 3 — workforce and document control
- Employee and contractor records.
- Inductions, training and competencies.
- Controlled safety files, versions and expiry alerts.
- Mobile-first frontline workflows.

### Phase 4 — client visibility and management insight
- Client-scoped access to explicitly shared records.
- Reports, exports and management analytics.
- Notifications, dashboards and operational refinements.

## Current implementation status

The UI foundation is in src/. It includes responsive navigation, an empty operational dashboard, empty incident register, and clearly labelled module foundations. All illustrative records, fabricated metrics, sample sites, demo labels, and in-memory incident submission have been removed. No backend, authentication, authorization, persistent storage, audit log, or real notification system is connected yet. The portal currently displays empty states and must not be used for real safety records until the secure foundation is complete.
