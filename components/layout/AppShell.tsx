import { SectionCard } from "@/components/dashboard/SectionCard";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { TaskList } from "@/components/tasks/TaskList";
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
  stats: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
    dueToday: number;
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
}: AppShellProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
      <header className="max-w-3xl space-y-5">
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
        </div>
      </header>

      <main className="mt-10 grid gap-5 md:grid-cols-2">
        <SectionCard
          title="Add Task"
          eyebrow="Capture"
          description="Task capture flow lands in Phase 3 with title, priority, notes, and deadline inputs."
        >
          <AddTaskForm onAddTask={onAddTask} />
        </SectionCard>

        <SectionCard
          title="Task List"
          eyebrow="Organize"
          description="Manage your tasks with quick status updates, editing controls, and clean visual hierarchy."
        >
          <TaskList
            tasks={tasks}
            onToggleComplete={onToggleTaskCompletion}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        </SectionCard>

        <SectionCard
          title="Today Plan"
          eyebrow="Focus"
          description="Rule-based planning arrives in Phase 5. Current stats already track today-critical workload."
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="rounded-2xl border border-[--card-border] bg-white/70 px-3 py-2 text-[--text-secondary]">
              Pending: <span className="font-semibold text-[--text-primary]">{stats.pending}</span>
            </p>
            <p className="rounded-2xl border border-[--card-border] bg-white/70 px-3 py-2 text-[--text-secondary]">
              Due today: <span className="font-semibold text-[--text-primary]">{stats.dueToday}</span>
            </p>
            <p className="rounded-2xl border border-[--card-border] bg-white/70 px-3 py-2 text-[--text-secondary]">
              High priority: <span className="font-semibold text-[--text-primary]">{stats.highPriority}</span>
            </p>
            <p className="rounded-2xl border border-[--card-border] bg-white/70 px-3 py-2 text-[--text-secondary]">
              Completed: <span className="font-semibold text-[--text-primary]">{stats.completed}</span>
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="AI Suggestions"
          eyebrow="Assist"
          description="Mock AI behaviors in Phase 6 will convert vague goals into clear, prioritized action steps."
        >
          <p className="text-sm text-[--text-secondary]">
            Planned prompts: break into steps, prioritize tasks, suggest first action, rewrite vague goals.
          </p>
        </SectionCard>
      </main>
    </div>
  );
}
