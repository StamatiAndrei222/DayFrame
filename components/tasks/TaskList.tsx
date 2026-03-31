import { TaskItem } from "@/components/tasks/TaskItem";
import type { Task, TaskPriority } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (
    taskId: string,
    input: {
      title?: string;
      notes?: string;
      priority?: TaskPriority;
      deadline?: string;
    },
  ) => void;
  activeTimerTaskId: string | null;
  getTaskTodaySeconds: (taskId: string) => number;
  getTaskTotalSeconds: (taskId: string) => number;
  onStartTimer: (taskId: string) => void;
  onPauseTimer: () => void;
};

export function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onUpdate,
  activeTimerTaskId,
  getTaskTodaySeconds,
  getTaskTotalSeconds,
  onStartTimer,
  onPauseTimer,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[--card-border] bg-white/60 px-4 py-6 text-center">
        <p className="text-sm font-medium text-[--text-primary]">No tasks yet</p>
        <p className="mt-1 text-xs text-[--text-secondary]">
          Add your first task and Dayframe will start shaping your day.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isTimerRunning={activeTimerTaskId === task.id}
          trackedTodaySeconds={getTaskTodaySeconds(task.id)}
          trackedTotalSeconds={getTaskTotalSeconds(task.id)}
          onStartTimer={onStartTimer}
          onPauseTimer={onPauseTimer}
        />
      ))}
    </ul>
  );
}
