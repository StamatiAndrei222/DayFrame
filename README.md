# Dayframe

Dayframe is a modern AI Productivity Assistant built with Next.js and TypeScript.
It helps users turn messy thoughts into a clean daily execution plan using local-first task management, priority/deadline planning, and mock AI assistance.

## Why This Project

Most todo apps stop at storing tasks. Dayframe focuses on decision support:
- Capture rough goals quickly
- Prioritize with urgency and importance
- Generate a focused "Today Plan"
- Convert vague input into actionable steps

This project is designed as a portfolio-ready product for junior frontend/full-stack roles and freelance demos.

## Current MVP Features

- Dashboard with a calm, premium, responsive interface
- Add Task flow with validation
- Task List with edit, delete, and completion state
- Priority levels and deadline support
- Rule-based Today Plan ranking
- Mock AI Suggestions panel:
  - Rewrite goal
  - Break into steps
  - Suggest first action
  - Prioritize active tasks
- Local state + localStorage persistence

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Project Structure

- `app/` - App Router pages, layout, global styles
- `components/` - Reusable UI and feature components (`tasks`, `planner`, `ai`, `layout`)
- `hooks/` - Client-side state hooks (`useTasks`)
- `lib/` - Pure logic and helpers (`planner`, `storage`, `ai/mockSuggestions`)
- `types/` - Shared domain models (`Task`)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run build
```

## Product Notes

- MVP is intentionally local-first (no authentication yet).
- AI is mocked with deterministic logic to validate UX before real API integration.
- Architecture separates UI, data state, and assistant logic for clean iteration.

## Next Steps

- Real AI integration for suggestions and planning
- Optional auth + cloud sync
- Better analytics around completion and focus quality
- Drag-and-drop ordering and richer task grouping
