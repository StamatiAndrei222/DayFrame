import type { Task } from "@/types/task";

export const TASKS_STORAGE_KEY = "dayframe.tasks.v1";

function isTimeEntries(value: unknown): value is Task["timeEntries"] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        typeof (entry as { date?: unknown }).date === "string" &&
        typeof (entry as { seconds?: unknown }).seconds === "number",
    )
  );
}

function isTaskRecord(value: unknown): value is Task {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Task>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    (candidate.notes === undefined || typeof candidate.notes === "string") &&
    (candidate.priority === "low" ||
      candidate.priority === "medium" ||
      candidate.priority === "high") &&
    (candidate.deadline === undefined || typeof candidate.deadline === "string") &&
    typeof candidate.completed === "boolean" &&
    (candidate.completedAt === undefined || typeof candidate.completedAt === "string") &&
    (candidate.timeEntries === undefined || isTimeEntries(candidate.timeEntries)) &&
    typeof candidate.createdAt === "string"
  );
}

function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTaskRecord);
}

export function loadTasks(): Task[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);
    return isTaskArray(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Intentionally no-op for private mode or storage limits.
  }
}

export function createSeedTasks(): Task[] {
  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  return [
    {
      id: "seed-cv-refresh",
      title: "Refresh CV with 2026 portfolio work",
      notes: "Update project bullets and metrics for each build.",
      priority: "high",
      deadline: formatDate(new Date(now.getTime() + oneDayMs)),
      completed: false,
      timeEntries: [],
      createdAt: now.toISOString(),
    },
    {
      id: "seed-github-cleanup",
      title: "Clean up top 3 GitHub repos",
      notes: "Improve README and pin strongest projects.",
      priority: "medium",
      deadline: formatDate(new Date(now.getTime() + 2 * oneDayMs)),
      completed: false,
      timeEntries: [],
      createdAt: now.toISOString(),
    },
    {
      id: "seed-job-apps",
      title: "Prepare shortlist of 5 junior roles",
      notes: "Collect role links and key requirements.",
      priority: "high",
      deadline: formatDate(now),
      completed: false,
      timeEntries: [],
      createdAt: now.toISOString(),
    },
  ];
}
