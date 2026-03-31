import { AISuggestionsPanel } from "@/components/ai/AISuggestionsPanel";
import { SectionCard } from "@/components/dashboard/SectionCard";
import type { DailyHistory } from "@/hooks/useTasks";
import { TodayPlan } from "@/components/planner/TodayPlan";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TimeHistoryCalendar } from "@/components/tracking/TimeHistoryCalendar";
import { formatDuration } from "@/lib/time";
import type { Task } from "@/types/task";
import type { TaskPriority } from "@/types/task";

type AppShellProps = {
  tasks: Task[];
  isHydrated: boolean;
  onAddTask: (input: {
    title: string;
    notes?: string;
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
      priority?: TaskPriority;
      deadline?: string;
    },
  ) => void;
  activeTimerTaskId: string | null;
  onStartTaskTimer: (taskId: string) => void;
  onPauseTaskTimer: () => void;
  getTaskTodaySeconds: (taskId: string) => number;
  getTaskTotalSeconds: (taskId: string) => number;
  dailyHistory: DailyHistory[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
    dueToday: number;
    trackedTodaySeconds: number;
  };
};

export function AppShell({
  tasks,
  isHydrated,
  stats,
  onAddTask,
  onToggleTaskCompletion,
  onDeleteTask,
  onUpdateTask,
  activeTimerTaskId,
  onStartTaskTimer,
  onPauseTaskTimer,
  getTaskTodaySeconds,
  getTaskTotalSeconds,
  dailyHistory,
}: AppShellProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
      <header className="max-w-3xl space-y-5 opacity-0 animate-[fade-up_520ms_var(--ease-standard)_forwards] motion-reduce:opacity-100 motion-reduce:animate-none">
        <p className="inline-flex items-center rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs font-medium tracking-wide text-[--muted] shadow-[var(--shadow-soft)]">
          Dayframe v1 • Local-first MVP
        </p>
        <div className="space-y-3">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight text-[--text-primary] sm:text-4xl lg:text-5xl">
            Plan your day with calm clarity.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[--text-secondary] sm:text-base">
            Dayframe transforms overwhelming goals into prioritized tasks, a focused daily plan,
            and clear suggestions for what to do next.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <p className="rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs text-[--text-secondary]">
            {isHydrated ? "Synced from localStorage" : "Loading local workspace..."}
          </p>
          <p className="rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs text-[--text-secondary]">
            {stats.total} tasks total
          </p>
          <p className="rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs text-[--text-secondary]">
            Tracked today: {formatDuration(stats.trackedTodaySeconds)}
          </p>
        </div>
      </header>

      <main className="mt-10 grid gap-5 md:grid-cols-2">
        <SectionCard
          title="Add Task"
          eyebrow="Capture"
          description="Capture tasks with title, optional notes, priority level, and deadline in one clean flow."
          className="[--card-delay:90ms]"
        >
          <AddTaskForm onAddTask={onAddTask} />
        </SectionCard>

        <SectionCard
          title="Task List"
          eyebrow="Organize"
          description="Manage your tasks with quick status updates, editing controls, and clean visual hierarchy."
          className="[--card-delay:150ms]"
        >
          <TaskList
            tasks={tasks}
            onToggleComplete={onToggleTaskCompletion}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
            activeTimerTaskId={activeTimerTaskId}
            getTaskTodaySeconds={getTaskTodaySeconds}
            getTaskTotalSeconds={getTaskTotalSeconds}
            onStartTimer={onStartTaskTimer}
            onPauseTimer={onPauseTaskTimer}
          />
        </SectionCard>

        <SectionCard
          title="Today Plan"
          eyebrow="Focus"
          description="Rule-based planning ranks pending tasks by priority and deadline so you can start immediately."
          className="[--card-delay:210ms]"
        >
          <TodayPlan tasks={tasks} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <p className="rounded-2xl border border-[--card-border] bg-white/70 px-3 py-2 text-[--text-secondary]">
              Pending: <span className="font-semibold text-[--text-primary]">{stats.pending}</span>
            </p>
            <p className="rounded-2xl border border-[--card-border] bg-white/70 px-3 py-2 text-[--text-secondary]">
              Due today: <span className="font-semibold text-[--text-primary]">{stats.dueToday}</span>
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="AI Suggestions"
          eyebrow="Assist"
          description="Mock AI transforms rough goals into clearer actions, execution order, and focused next steps."
          className="[--card-delay:270ms]"
        >
          <AISuggestionsPanel tasks={tasks} />
        </SectionCard>

        <SectionCard
          title="Daily History"
          eyebrow="Calendar"
          description="Review the last 7 days: completed tasks and time tracked on each item."
          className="md:col-span-2 [--card-delay:330ms]"
        >
          <TimeHistoryCalendar history={dailyHistory} />
        </SectionCard>
      </main>

      <footer className="mt-8 border-t border-[--card-border] pt-4 text-xs text-[--text-secondary]">
        Dayframe is local-first for MVP reliability. AI suggestions are deterministic mock logic for portfolio demo.
      </footer>
    </div>
  );
}
