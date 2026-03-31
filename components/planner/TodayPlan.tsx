import { TaskItem } from "@/components/tasks/TaskItem";
import type { FocusProgress, FocusSummary } from "@/hooks/useTasks";
import { formatDuration } from "@/lib/time";
import type { Task, TaskCadence, TaskPriority } from "@/types/task";

type TodayPlanProps = {
  focusTasksToday: Task[];
  focusProgress: FocusProgress;
  focusSummary: FocusSummary;
  activeTimerTaskId: string | null;
  onStartTimer: (taskId: string) => void;
  onPauseTimer: () => void;
  onToggleComplete: (taskId: string) => void;
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
  getTaskTodaySeconds: (taskId: string) => number;
  getTaskTotalSeconds: (taskId: string) => number;
};

export function TodayPlan({
  focusTasksToday,
  focusProgress,
  focusSummary,
  activeTimerTaskId,
  onStartTimer,
  onPauseTimer,
  onToggleComplete,
  onDeleteTask,
  onUpdateTask,
  getTaskTodaySeconds,
  getTaskTotalSeconds,
}: TodayPlanProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2 rounded-2xl border border-[--card-border] bg-white/70 px-3 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[--text-secondary]">
          <p>
            Progress: {focusProgress.completedToday}/{focusProgress.startedToday || 0} completed
          </p>
          <p>
            Focus time today:{" "}
            <span className="font-semibold text-[--text-primary]">
              {formatDuration(focusSummary.totalTrackedSeconds)}
            </span>
          </p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-slate-900 transition-all duration-500"
            style={{ width: `${focusProgress.percent}%` }}
          />
        </div>
        <p className="text-[11px] text-[--text-secondary]">
          Active now:{" "}
          <span className="font-medium text-[--text-primary]">{focusSummary.activeCount}</span>
        </p>
      </div>

      {focusTasksToday.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[--card-border] bg-white/60 px-4 py-6 text-center">
          <p className="text-sm font-medium text-[--text-primary]">No focus tasks yet</p>
          <p className="mt-1 text-xs text-[--text-secondary]">
            Start a daily task to move it automatically into Focus.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {focusTasksToday.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
              isTimerRunning={activeTimerTaskId === task.id}
              trackedTodaySeconds={getTaskTodaySeconds(task.id)}
              trackedTotalSeconds={getTaskTotalSeconds(task.id)}
              onStartTimer={onStartTimer}
              onPauseTimer={onPauseTimer}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
