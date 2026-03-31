"use client";

import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";

import { createSeedTasks, loadTasks, saveTasks } from "@/lib/storage";
import type { Task } from "@/types/task";

type UseTasksResult = {
  tasks: Task[];
  isHydrated: boolean;
  stats: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
    dueToday: number;
  };
  setTasks: Dispatch<SetStateAction<Task[]>>;
};

const isDueToday = (deadline?: string) => {
  if (!deadline) {
    return false;
  }

  const today = new Date().toISOString().slice(0, 10);
  return deadline === today;
};

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const persisted = loadTasks();
    if (persisted && persisted.length > 0) {
      return persisted;
    }

    return createSeedTasks();
  });
  const isHydrated = true;

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveTasks(tasks);
  }, [tasks, isHydrated]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.length - completed;
    const highPriority = tasks.filter(
      (task) => !task.completed && task.priority === "high",
    ).length;
    const dueToday = tasks.filter(
      (task) => !task.completed && isDueToday(task.deadline),
    ).length;

    return {
      total: tasks.length,
      completed,
      pending,
      highPriority,
      dueToday,
    };
  }, [tasks]);

  return {
    tasks,
    isHydrated,
    stats,
    setTasks,
  };
}
