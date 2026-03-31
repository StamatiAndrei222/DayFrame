import { Button } from "@/components/ui/Button";
import { formatDuration } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { FocusProgress } from "@/hooks/useTasks";
import type { Task, TaskPriority } from "@/types/task";

type TodayPlanProps = {
  focusTask: Task | null;
  focusTaskTodaySeconds: number;
  focusProgress: FocusProgress;
  onPauseTask: () => void;
  onCompleteTask: (taskId: string) => void;
};

const priorityBadgeStyles: Record<TaskPriority, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-700",
};

export function TodayPlan({
  focusTask,
  focusTaskTodaySeconds,
  focusProgress,
  onPauseTask,
  onCompleteTask,
}: TodayPlanProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1 rounded-2xl border border-[--card-border] bg-white/70 px-3 py-3">
        <div className="flex items-center justify-between text-xs text-[--text-secondary]">
          <p>Today progress</p>
          <p>
            {focusProgress.completedToday}/{focusProgress.startedToday || 0} completed
          </p>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-slate-900 transition-all duration-500"
            style={{ width: `${focusProgress.percent}%` }}
          />
        </div>
      </div>

      {!focusTask ? (
        <div className="rounded-2xl border border-dashed border-[--card-border] bg-white/60 px-4 py-6 text-center">
          <p className="text-sm font-medium text-[--text-primary]">No active focus task</p>
          <p className="mt-1 text-xs text-[--text-secondary]">
            Start a task from Task List to bring it here while you work.
          </p>
        </div>
      ) : (
        <article className="space-y-2 rounded-2xl border border-[--card-border] bg-white/80 px-3 py-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-[--text-primary]">{focusTask.title}</p>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
                priorityBadgeStyles[focusTask.priority],
              )}
            >
              {focusTask.priority}
            </span>
          </div>
          <p className="text-xs text-[--text-secondary]">
            Running now · {formatDuration(focusTaskTodaySeconds)} tracked today
          </p>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-sky-600 hover:bg-sky-500" onClick={onPauseTask} type="button">
              Pause
            </Button>
            <Button
              className="bg-slate-900"
              onClick={() => onCompleteTask(focusTask.id)}
              type="button"
            >
              Mark Done
            </Button>
          </div>
        </article>
      )}
    </div>
  );
}
