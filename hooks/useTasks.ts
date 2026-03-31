"use client";

import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

import { createSeedTasks, loadTasks, saveTasks } from "@/lib/storage";
import type { Task, TaskPriority } from "@/types/task";

type AddTaskInput = {
  title: string;
  notes?: string;
  priority: TaskPriority;
  deadline?: string;
};

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
  addTask: (input: AddTaskInput) => void;
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
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((input: AddTaskInput) => {
    const createId = () => {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      return `task-${Date.now()}`;
    };

    const newTask: Task = {
      id: createId(),
      title: input.title,
      notes: input.notes,
      priority: input.priority,
      deadline: input.deadline,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }, []);

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
    addTask,
  };
}
