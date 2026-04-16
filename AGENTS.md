# AGENTS.md

## Project Overview
This is a Skill Gap Navigator web app built using Next.js, TypeScript, and Tailwind CSS.

The application allows users to:
- Input a target job role
- Add current skills with levels
- Identify skill gaps
- Generate a weekly learning roadmap
- Export a summary

## Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Package Manager: pnpm
- Testing: Playwright

## Coding Guidelines
- Use functional React components
- Use TypeScript types for all data structures
- Keep components modular and reusable
- Use Tailwind for styling (no inline CSS)
- Avoid unnecessary libraries

## Project Structure
- `src/app` → pages and routing
- `src/components` → UI components
- `src/lib` → logic (gap analysis, roadmap)
- `tests` → Playwright tests

## Behavior Rules for Agents
- Do not break existing functionality
- Prefer simple and readable code
- Keep UI clean and responsive
- Ensure browser compatibility
- Always maintain state consistency

## Testing Instructions
- Use Playwright for end-to-end testing
- Validate core user flows:
  - adding skills
  - comparing skills
  - generating roadmap

## Notes
- App uses localStorage for persistence
- No backend is used in this version
