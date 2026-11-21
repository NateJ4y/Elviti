# Elviti Works — Health & Safety Operations Portal

A separate React + TypeScript application for the private Elviti Works operations portal. It lives in `/portal` so the existing public company website remains untouched.

## Run locally

```bash
cd portal
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Current status

This first delivery is a responsive UI foundation with a working client-side navigation shell and a sample incident-reporting interaction. All dashboard figures, activity and records are illustrative demo content held in browser memory only.

**Not production-ready for real safety records.** Authentication, role-based authorization, database persistence, file storage, audit logging, backups, and server-side validation must be implemented and tested before real employees, contractors, incidents or compliance documents are entered.

## Deployment

Deploy as a separate Vercel project with the project root directory set to `portal`. This keeps the public website deployment independent.
