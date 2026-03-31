export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  notes?: string;
  priority: TaskPriority;
  deadline?: string;
  completed: boolean;
  createdAt: string;
};
