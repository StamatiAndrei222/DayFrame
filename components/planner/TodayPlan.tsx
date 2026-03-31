import { buildTodayPlan } from "@/lib/planner";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types/task";

type TodayPlanProps = {
  tasks: Task[];
};

const priorityBadgeStyles: Record<TaskPriority, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-700",
};

export function TodayPlan({ tasks }: TodayPlanProps) {
  const plan = buildTodayPlan(tasks);

  if (plan.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[--card-border] bg-white/60 px-4 py-6 text-center">
        <p className="text-sm font-medium text-[--text-primary]">No pending tasks</p>
        <p className="mt-1 text-xs text-[--text-secondary]">
          Add tasks and Dayframe will generate your focus order automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {plan.map((item, index) => (
        <div
          key={item.task.id}
          className="flex items-start gap-3 rounded-2xl border border-[--card-border] bg-white/70 px-3 py-3"
        >
          <p className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {index + 1}
          </p>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-medium text-[--text-primary]">{item.task.title}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={cn(
                  "rounded-full px-2 py-1 font-semibold uppercase tracking-wide",
                  priorityBadgeStyles[item.task.priority],
                )}
              >
                {item.task.priority}
              </span>
              <span className="text-[--text-secondary]">{item.reason}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
