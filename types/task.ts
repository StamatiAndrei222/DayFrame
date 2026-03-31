export type TaskPriority = "low" | "medium" | "high";

export type TaskTimeEntry = {
  date: string;
  seconds: number;
};

export type Task = {
  id: string;
  title: string;
  notes?: string;
  priority: TaskPriority;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
  timeEntries: TaskTimeEntry[];
  createdAt: string;
};
