# Dayframe - Project Context and Handover

## 1. Product Overview

Dayframe is a modern productivity web app built as a portfolio-ready product.
Its goal is to help users transform messy goals into actionable plans, execute focused work, and review progress over time.

Core product direction:
- Calm, premium UI
- Local-first reliability
- Practical planning assistant behavior
- Incremental path from mock AI to real OpenAI integration

## 2. Stack and Architecture

- Framework: Next.js (App Router)
- Language: TypeScript
- UI: React + Tailwind CSS
- State: local React state via `useTasks` hook
- Persistence: browser `localStorage`
- AI:
  - Real server API endpoint using OpenAI SDK
  - Graceful fallback to local mock logic when API is unavailable

Main structure:
- `app/` app routes, layout, global styles, API routes
- `components/` UI and feature modules (`layout`, `tasks`, `planner`, `tracking`, `ai`, `ui`)
- `hooks/` local state and domain logic (`useTasks`)
- `lib/` helper modules (`storage`, `time`, `ai/*`)
- `types/` domain model types

## 3. Main App Flows (Current)

The app is split into 3 top-level views in `AppShell`:
- `Workspace`: Add Task + Task List
- `Focus`: Today Focus + Daily History
- `Assist`: AI planning and task generation

### Workspace
- Add tasks with:
  - title
  - notes (optional)
  - category/cadence (`daily`, `weekly`, `monthly`)
  - priority
  - deadline
- If deadline is omitted:
  - task is auto-assigned as `daily`
  - deadline defaults to today
- Task list has tabs: `daily`, `weekly`, `monthly`
- Full task controls:
  - Start/Pause timer
  - Edit
  - Mark Done/Pending
  - Delete

### Focus
- Shows tasks started today (not completed) as the active focus queue.
- Daily list excludes tasks that already moved into focus.
- Each focus task keeps full controls (start/pause/edit/done/delete).
- Focus stats include:
  - progress bar (`completedToday / startedToday`)
  - total focus time tracked today
  - active running timer count

### Daily History
- Not limited to 7 fixed days anymore.
- History starts from the first real app usage date.
- Per-day visual chart:
  - each task row shows tracked duration
  - bar length relative to that day total
  - completion marker

### Assist (AI)
- Uses real API endpoint: `POST /api/ai/suggestions`
- Supports fallback to mock suggestions when OpenAI is unavailable
- UX modes:
  - `Quick Plan` (compact priority output)
  - `Task Builder` (editable suggestion drafts)
- Includes:
  - source badge (`OpenAI` or `Mock fallback`)
  - loading state
  - prompt templates
  - dedup against existing tasks
  - `Add` individual and `Add All New`
  - advanced controls per draft (cadence, priority, deadline)

## 4. Domain Model

`Task` (see `types/task.ts`) includes:
- `id`, `title`, `notes`
- `cadence`: `daily | weekly | monthly`
- `priority`: `low | medium | high`
- `deadline`
- `completed`, `completedAt`
- `timeEntries[]` (per-day tracked seconds)
- `createdAt`

Tracking behavior:
- Start timer on a task
- Pause persists elapsed seconds into today's `timeEntries`
- Completing a running task auto-stops timer and persists elapsed time
- Only one task runs as active timer at a time

## 5. AI Module Details

### Server route
`app/api/ai/suggestions/route.ts`

Responsibilities:
- Read prompt + current tasks from request body
- Call OpenAI Responses API
- Request strict JSON output shape:
  - planning cards
  - suggested task drafts
- Validate/normalize response
- If invalid or failing, return fallback mock output

Environment variables:
- `OPENAI_API_KEY` (required for real AI)
- `OPENAI_MODEL` (optional, default `gpt-5.2`)

### Local fallback
`lib/ai/mockSuggestions.ts`

Provides deterministic fallback:
- cards (`Rewrite Goal`, `Break Into Steps`, etc.)
- suggested task drafts from rough prompt

Shared contracts:
- `lib/ai/types.ts`

## 6. Key Files to Know

- Layout and navigation:
  - `components/layout/AppShell.tsx`
- Task state + business logic:
  - `hooks/useTasks.ts`
- Task capture and management:
  - `components/tasks/AddTaskForm.tsx`
  - `components/tasks/TaskList.tsx`
  - `components/tasks/TaskItem.tsx`
- Focus execution:
  - `components/planner/TodayPlan.tsx`
- History visualization:
  - `components/tracking/TimeHistoryCalendar.tsx`
- AI UX + integration:
  - `components/ai/AISuggestionsPanel.tsx`
  - `app/api/ai/suggestions/route.ts`
  - `lib/ai/mockSuggestions.ts`
  - `lib/ai/types.ts`

## 7. Persistence and Compatibility Notes

- Local storage key: `dayframe.tasks.v1`
- Existing/legacy task data is normalized on load
- Missing cadence defaults to `daily` for backward compatibility
- Focus/daily view logic depends on tracked `timeEntries` for current day

## 8. Current UX Decisions

- App is intentionally local-first for MVP reliability.
- AI suggestions are usable in both online (OpenAI) and offline/fallback modes.
- One-page overload was addressed by splitting into clear views:
  - Workspace
  - Focus
  - Assist

## 9. Run and Validate

Install and run:
```bash
npm install
npm run dev
```

Quality checks:
```bash
npm run lint
npm run build
```

OpenAI setup (`.env.local`):
```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.2
```

## 10. Suggested Next Improvements

Priority next steps:
1. Add optimistic toast notifications for `Add`, `Start`, `Pause`, `Done`, `Delete`.
2. Add drag-and-drop ordering in focus queue.
3. Add explicit "resume last active task" quick action.
4. Add lightweight analytics cards (weekly trend, completion ratio, deep-work blocks).
5. Add auth + cloud sync only after local UX is fully stable.

Optional engineering improvements:
- Move `useTasks` into reducer-based state for cleaner action handling.
- Add unit tests for timer and focus transitions.
- Add integration tests for AI endpoint fallback behavior.
