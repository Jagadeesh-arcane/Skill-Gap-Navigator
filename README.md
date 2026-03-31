Skill Gap Navigator
===================

Plan and close skill gaps for target roles with a client-side Next.js App Router app built with TypeScript and Tailwind.

Overview
- Compare your current skills to role requirements (required + recommended) using a deterministic, explainable rule set.
- Generate gap analysis with missing vs weak skills, readiness score, and category badges.
- Build a 4-week learning plan with learn/practice/review items and role-specific weekly themes.
- Create a per-skill roadmap of actionable steps.
- Export a shareable summary to the clipboard and preview it in-app.
- Persist state (target role, skills, gaps, roadmap, weekly plan) in localStorage; app is safe for SSR via browser guards.

Tech Stack
- Next.js App Router (TypeScript)
- Tailwind CSS v4 (globals.css)
- React state only; no backend/API calls
- Playwright for smoke testing

Project Structure
- src/app/page.tsx — main UI and client logic
- src/app/layout.tsx — metadata and root layout
- src/app/globals.css — Tailwind base styles
- tests/smoke.spec.ts — Playwright smoke test
- playwright.config.ts — auto-starts dev server for tests

Role Requirements Map (built-in)
- Frontend Engineer: JS, TS, React, Next.js, CSS, Testing, Accessibility; recommends Tailwind, Performance, Design Systems.
- Backend Engineer: API Design, Databases, Testing, Auth, Cloud; recommends Caching, Observability, Security.
- Data Analyst: SQL, Python, Dashboards, Statistics, Stakeholder Comms; recommends Experimentation, dbt/Modeling, Data Viz.
- Product Manager: Discovery, Prioritization, Roadmapping, Analytics, Communication; recommends Design Collaboration, Tech Fluency.
- General Professional baseline for generic use.
Each role also defines a 4-week focus theme used by the planner.

Deterministic Gap Logic
- Skills are normalized (case, &, dots, spacing) before matching.
- For each required/recommended skill:
  - Missing if not present.
  - Weak if present but below required level (Beginner < Intermediate < Strong < Advanced < Expert).
- Readiness score = required skills at/above target ÷ total required.
- Recommended gaps are shown but do not reduce readiness.

Running Locally
pnpm install
pnpm dev
Open http://localhost:3000

Building
pnpm build
pnpm start

Testing (Playwright)
pnpm exec playwright install --with-deps
pnpm exec playwright test
(Dev server auto-starts via playwright.config.ts; baseURL http://localhost:3000)

Key UI Interactions
- Target role input auto-selects a baseline.
- Add skills individually or comma/newline separated; per-skill level toggles (Beginner/Intermediate/Strong).
- Compare skills → gaps, readiness, roadmaps, weekly plan regenerate.
- Export summary → copies text and updates on-page preview.

Notes
- All data is client-side; no external APIs.
- localStorage guarded by `typeof window` to avoid SSR errors.
