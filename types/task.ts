export type TaskPriority = "low" | "medium" | "high";
export type TaskCadence = "daily" | "weekly" | "monthly";

export type TaskTimeEntry = {
  date: string;
  seconds: number;
};

export type Task = {
  id: string;
  title: string;
  notes?: string;
  priority: TaskPriority;
  cadence: TaskCadence;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
  timeEntries: TaskTimeEntry[];
  createdAt: string;
};
