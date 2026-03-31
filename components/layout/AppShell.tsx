"use client";

import { useState } from "react";

import { AISuggestionsPanel } from "@/components/ai/AISuggestionsPanel";
import { SectionCard } from "@/components/dashboard/SectionCard";
import type { DailyHistory, FocusProgress, FocusSummary } from "@/hooks/useTasks";
import { TodayPlan } from "@/components/planner/TodayPlan";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TimeHistoryCalendar } from "@/components/tracking/TimeHistoryCalendar";
import { formatDuration } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";
import type { TaskCadence, TaskPriority } from "@/types/task";

type AppShellProps = {
  tasks: Task[];
  isHydrated: boolean;
  onAddTask: (input: {
    title: string;
    notes?: string;
    cadence: TaskCadence;
    priority: TaskPriority;
    deadline?: string;
  }) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (
    taskId: string,
    input: {
      title?: string;
      notes?: string;
      cadence?: TaskCadence;
      priority?: TaskPriority;
      deadline?: string;
    },
  ) => void;
  activeTimerTaskId: string | null;
  focusTaskIdsToday: string[];
  focusTasksToday: Task[];
  onStartTaskTimer: (taskId: string) => void;
  onPauseTaskTimer: () => void;
  getTaskTodaySeconds: (taskId: string) => number;
  getTaskTotalSeconds: (taskId: string) => number;
  dailyHistory: DailyHistory[];
  focusProgress: FocusProgress;
  focusSummary: FocusSummary;
  stats: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
    dueToday: number;
    trackedTodaySeconds: number;
  };
};

type AppView = "workspace" | "focus" | "assist";

const viewConfig: { id: AppView; label: string; description: string }[] = [
  {
    id: "workspace",
    label: "Workspace",
    description: "Capture and manage tasks",
  },
  {
    id: "focus",
    label: "Focus",
    description: "Run active tasks and track progress",
  },
  {
    id: "assist",
    label: "Assist",
    description: "Turn rough goals into actionable tasks",
  },
];

export function AppShell({
  tasks,
  isHydrated,
  stats,
  onAddTask,
  onToggleTaskCompletion,
  onDeleteTask,
  onUpdateTask,
  activeTimerTaskId,
  focusTaskIdsToday,
  focusTasksToday,
  onStartTaskTimer,
  onPauseTaskTimer,
  getTaskTodaySeconds,
  getTaskTotalSeconds,
  dailyHistory,
  focusProgress,
  focusSummary,
}: AppShellProps) {
  const [activeView, setActiveView] = useState<AppView>("workspace");

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
      <header className="max-w-4xl space-y-5 opacity-0 animate-[fade-up_520ms_var(--ease-standard)_forwards] motion-reduce:opacity-100 motion-reduce:animate-none">
        <p className="inline-flex items-center rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs font-medium tracking-wide text-[--muted] shadow-[var(--shadow-soft)]">
          Dayframe v1 • Local-first MVP
        </p>
        <div className="space-y-3">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight text-[--text-primary] sm:text-4xl lg:text-5xl">
            Plan your day with calm clarity.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[--text-secondary] sm:text-base">
            Dayframe transforms overwhelming goals into prioritized tasks, focused execution, and
            clear next actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <p className="rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs text-[--text-secondary]">
            {isHydrated ? "Synced from localStorage" : "Loading local workspace..."}
          </p>
          <p className="rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs text-[--text-secondary]">
            {stats.total} total tasks
          </p>
          <p className="rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs text-[--text-secondary]">
            Tracked today: {formatDuration(stats.trackedTodaySeconds)}
          </p>
        </div>

        <div className="space-y-2">
          <div className="inline-flex w-full rounded-2xl border border-[--card-border] bg-white/70 p-1 sm:w-auto">
            {viewConfig.map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveView(view.id)}
                className={cn(
                  "flex-1 rounded-xl px-3 py-2 text-xs font-medium transition sm:flex-none",
                  activeView === view.id
                    ? "bg-slate-900 text-white"
                    : "text-[--text-secondary] hover:bg-white",
                )}
              >
                {view.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[--text-secondary]">
            {viewConfig.find((view) => view.id === activeView)?.description}
          </p>
        </div>
      </header>

      {activeView === "workspace" ? (
        <main className="mt-10 grid gap-5 md:grid-cols-2">
          <SectionCard
            title="Add Task"
            eyebrow="Capture"
            description="Create tasks with category, priority, and deadline in one clean flow."
            className="[--card-delay:90ms]"
          >
            <AddTaskForm onAddTask={onAddTask} />
          </SectionCard>

          <SectionCard
            title="Task List"
            eyebrow="Organize"
            description="Daily, weekly, and monthly tabs with full control for each task."
            className="[--card-delay:150ms]"
          >
            <TaskList
              tasks={tasks}
              onToggleComplete={onToggleTaskCompletion}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
              activeTimerTaskId={activeTimerTaskId}
              focusTaskIdsToday={focusTaskIdsToday}
              getTaskTodaySeconds={getTaskTodaySeconds}
              getTaskTotalSeconds={getTaskTotalSeconds}
              onStartTimer={onStartTaskTimer}
              onPauseTimer={onPauseTaskTimer}
            />
          </SectionCard>
        </main>
      ) : null}

      {activeView === "focus" ? (
        <main className="mt-10 grid gap-5 md:grid-cols-2">
          <SectionCard
            title="Today Focus"
            eyebrow="Execute"
            description="Shows tasks started today. Control timer, edit, finish, and monitor progress."
            className="md:col-span-2 [--card-delay:90ms]"
          >
            <TodayPlan
              focusTasksToday={focusTasksToday}
              focusProgress={focusProgress}
              focusSummary={focusSummary}
              activeTimerTaskId={activeTimerTaskId}
              onStartTimer={onStartTaskTimer}
              onPauseTimer={onPauseTaskTimer}
              onToggleComplete={onToggleTaskCompletion}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
              getTaskTodaySeconds={getTaskTodaySeconds}
              getTaskTotalSeconds={getTaskTotalSeconds}
            />
          </SectionCard>

          <SectionCard
            title="Daily History"
            eyebrow="Calendar"
            description="Visual chart by day and by task: tracked time and completion status."
            className="md:col-span-2 [--card-delay:150ms]"
          >
            <TimeHistoryCalendar history={dailyHistory} />
          </SectionCard>
        </main>
      ) : null}

      {activeView === "assist" ? (
        <main className="mt-10 grid gap-5">
          <SectionCard
            title="AI Assist"
            eyebrow="Plan"
            description="Generate practical suggestions, edit them, and add directly into your workflow."
            className="[--card-delay:90ms]"
          >
            <AISuggestionsPanel tasks={tasks} onAddTask={onAddTask} />
          </SectionCard>
        </main>
      ) : null}

      <footer className="mt-8 border-t border-[--card-border] pt-4 text-xs text-[--text-secondary]">
        Dayframe keeps your MVP local-first and focused: capture, execute, review.
      </footer>
    </div>
  );
}
