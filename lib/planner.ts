import type { Task, TaskPriority } from "@/types/task";

export type PlannedTask = {
  task: Task;
  score: number;
  reason: string;
};

const PRIORITY_SCORE: Record<TaskPriority, number> = {
  high: 100,
  medium: 60,
  low: 30,
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getDeadlineScore(deadline?: string): number {
  if (!deadline) {
    return 0;
  }

  const now = new Date();
  const todayDate = new Date(now.toISOString().slice(0, 10));
  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return 0;
  }

  const diffInDays = Math.floor((deadlineDate.getTime() - todayDate.getTime()) / ONE_DAY_MS);

  if (diffInDays < 0) {
    return 120;
  }
  if (diffInDays === 0) {
    return 90;
  }
  if (diffInDays === 1) {
    return 60;
  }
  if (diffInDays <= 3) {
    return 30;
  }
  return 10;
}

function getReason(task: Task): string {
  if (!task.deadline) {
    return `${task.priority} priority`;
  }

  const today = new Date().toISOString().slice(0, 10);
  if (task.deadline < today) {
    return "overdue deadline";
  }
  if (task.deadline === today) {
    return "due today";
  }
  return `${task.priority} priority + deadline set`;
}

export function buildTodayPlan(tasks: Task[], limit = 4): PlannedTask[] {
  return tasks
    .filter((task) => !task.completed)
    .map((task) => {
      const score = PRIORITY_SCORE[task.priority] + getDeadlineScore(task.deadline);
      return {
        task,
        score,
        reason: getReason(task),
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.task.createdAt.localeCompare(b.task.createdAt);
    })
    .slice(0, limit);
}
