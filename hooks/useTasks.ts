"use client";

import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

import { createSeedTasks, loadTasks, saveTasks } from "@/lib/storage";
import type { Task, TaskCadence, TaskPriority } from "@/types/task";

type AddTaskInput = {
  title: string;
  notes?: string;
  cadence: TaskCadence;
  priority: TaskPriority;
  deadline?: string;
};

type UpdateTaskInput = Partial<AddTaskInput>;

type ActiveTimer = {
  taskId: string;
  startedAtMs: number;
};

export type DailyTaskRecord = {
  taskId: string;
  title: string;
  seconds: number;
  completed: boolean;
};

export type DailyHistory = {
  date: string;
  totalSeconds: number;
  completedTasks: number;
  records: DailyTaskRecord[];
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
    trackedTodaySeconds: number;
  };
  setTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (input: AddTaskInput) => void;
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, input: UpdateTaskInput) => void;
  activeTimerTaskId: string | null;
  startTaskTimer: (taskId: string) => void;
  pauseTaskTimer: () => void;
  getTaskTodaySeconds: (taskId: string) => number;
  getTaskTotalSeconds: (taskId: string) => number;
  dailyHistory: DailyHistory[];
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const dateKeyFromMs = (timestampMs: number) =>
  new Date(timestampMs).toISOString().slice(0, 10);

const isDueToday = (deadline?: string) => {
  if (!deadline) {
    return false;
  }

  const today = dateKeyFromMs(Date.now());
  return deadline === today;
};

const addSecondsToTask = (task: Task, date: string, seconds: number): Task => {
  if (seconds <= 0) {
    return task;
  }

  const roundedSeconds = Math.max(1, Math.floor(seconds));
  const existingIndex = task.timeEntries.findIndex((entry) => entry.date === date);

  if (existingIndex === -1) {
    return {
      ...task,
      timeEntries: [...task.timeEntries, { date, seconds: roundedSeconds }],
    };
  }

  return {
    ...task,
    timeEntries: task.timeEntries.map((entry, index) =>
      index === existingIndex ? { ...entry, seconds: entry.seconds + roundedSeconds } : entry,
    ),
  };
};

const normalizeTask = (task: Task): Task => ({
  ...task,
  cadence: task.cadence ?? "daily",
  timeEntries: Array.isArray(task.timeEntries) ? task.timeEntries : [],
});

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [nowMs, setNowMs] = useState<number>(0);

  useEffect(() => {
    const persisted = loadTasks();
    const initialTasks = (persisted && persisted.length > 0 ? persisted : createSeedTasks()).map(
      normalizeTask,
    );

    // Hydration-safe initialization after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(initialTasks);
    setIsHydrated(true);
    setNowMs(Date.now());
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    saveTasks(tasks);
  }, [tasks, isHydrated]);

  useEffect(() => {
    if (!activeTimer) {
      return;
    }

    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeTimer]);

  const addTask = useCallback((input: AddTaskInput) => {
    const createId = () => {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      return `task-${Date.now()}`;
    };

    const now = Date.now();
    const fallbackToday = dateKeyFromMs(now);
    const hasDeadline = Boolean(input.deadline);

    const newTask: Task = {
      id: createId(),
      title: input.title,
      notes: input.notes,
      cadence: hasDeadline ? input.cadence : "daily",
      priority: input.priority,
      deadline: hasDeadline ? input.deadline : fallbackToday,
      completed: false,
      completedAt: undefined,
      timeEntries: [],
      createdAt: new Date(now).toISOString(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }, []);

  const pauseTaskTimer = useCallback(() => {
    if (!activeTimer) {
      return;
    }

    const stopMs = Date.now();
    const elapsedSeconds = Math.floor((stopMs - activeTimer.startedAtMs) / 1000);
    const date = dateKeyFromMs(stopMs);

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === activeTimer.taskId ? addSecondsToTask(task, date, elapsedSeconds) : task,
      ),
    );
    setActiveTimer(null);
    setNowMs(stopMs);
  }, [activeTimer]);

  const startTaskTimer = useCallback(
    (taskId: string) => {
      const now = Date.now();
      const task = tasks.find((item) => item.id === taskId);
      if (!task || task.completed) {
        return;
      }

      setTasks((prevTasks) => {
        if (!activeTimer || activeTimer.taskId === taskId) {
          return prevTasks;
        }

        const elapsedSeconds = Math.floor((now - activeTimer.startedAtMs) / 1000);
        const date = dateKeyFromMs(now);

        return prevTasks.map((item) =>
          item.id === activeTimer.taskId ? addSecondsToTask(item, date, elapsedSeconds) : item,
        );
      });

      if (activeTimer?.taskId === taskId) {
        return;
      }

      setActiveTimer({ taskId, startedAtMs: now });
      setNowMs(now);
    },
    [activeTimer, tasks],
  );

  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      const now = Date.now();
      const date = dateKeyFromMs(now);

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          let nextTask = task;
          if (activeTimer?.taskId === taskId) {
            const elapsedSeconds = Math.floor((now - activeTimer.startedAtMs) / 1000);
            nextTask = addSecondsToTask(nextTask, date, elapsedSeconds);
          }

          const nextCompleted = !nextTask.completed;
          return {
            ...nextTask,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date(now).toISOString() : undefined,
          };
        }),
      );

      if (activeTimer?.taskId === taskId) {
        setActiveTimer(null);
        setNowMs(now);
      }
    },
    [activeTimer],
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      if (activeTimer?.taskId === taskId) {
        setActiveTimer(null);
      }
    },
    [activeTimer],
  );

  const updateTask = useCallback((taskId: string, input: UpdateTaskInput) => {
    const fallbackToday = dateKeyFromMs(Date.now());

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const nextTitle = input.title?.trim() ? input.title.trim() : task.title;
        const nextNotes =
          input.notes === undefined ? task.notes : input.notes.trim() ? input.notes.trim() : undefined;

        const nextDeadline =
          input.deadline !== undefined ? input.deadline || fallbackToday : task.deadline;
        const nextCadence =
          input.deadline !== undefined && !input.deadline
            ? "daily"
            : input.cadence ?? task.cadence ?? "daily";

        return {
          ...task,
          title: nextTitle,
          notes: nextNotes,
          cadence: nextCadence,
          priority: input.priority ?? task.priority,
          deadline: nextDeadline,
        };
      }),
    );
  }, []);

  const todayKey = dateKeyFromMs(nowMs);

  const taskTodaySecondsMap = useMemo(() => {
    const map = new Map<string, number>();

    for (const task of tasks) {
      const todaySeconds = task.timeEntries
        .filter((entry) => entry.date === todayKey)
        .reduce((sum, entry) => sum + entry.seconds, 0);

      map.set(task.id, todaySeconds);
    }

    if (activeTimer) {
      const liveSeconds = Math.floor((nowMs - activeTimer.startedAtMs) / 1000);
      if (liveSeconds > 0) {
        map.set(activeTimer.taskId, (map.get(activeTimer.taskId) ?? 0) + liveSeconds);
      }
    }

    return map;
  }, [tasks, todayKey, activeTimer, nowMs]);

  const getTaskTodaySeconds = useCallback(
    (taskId: string) => taskTodaySecondsMap.get(taskId) ?? 0,
    [taskTodaySecondsMap],
  );

  const getTaskTotalSeconds = useCallback(
    (taskId: string) =>
      tasks
        .find((task) => task.id === taskId)
        ?.timeEntries.reduce((sum, entry) => sum + entry.seconds, 0) ?? 0,
    [tasks],
  );

  const dailyHistory = useMemo<DailyHistory[]>(() => {
    const allKnownDates = tasks.flatMap((task) => [
      task.createdAt.slice(0, 10),
      ...(task.completedAt ? [task.completedAt.slice(0, 10)] : []),
      ...task.timeEntries.map((entry) => entry.date),
    ]);

    if (allKnownDates.length === 0) {
      return [];
    }

    const startDate = allKnownDates.slice().sort()[0];
    const startMs = new Date(`${startDate}T00:00:00`).getTime();
    const todayMs = new Date(`${todayKey}T00:00:00`).getTime();

    const daysCount = Math.floor((todayMs - startMs) / ONE_DAY_MS) + 1;

    return Array.from({ length: daysCount }).map((_, index) => {
      const current = new Date(todayMs - index * ONE_DAY_MS);
      const date = current.toISOString().slice(0, 10);

      const records = tasks
        .map((task) => {
          const seconds = task.timeEntries
            .filter((entry) => entry.date === date)
            .reduce((sum, entry) => sum + entry.seconds, 0);
          const completed = Boolean(task.completedAt?.startsWith(date));

          if (!completed && seconds <= 0) {
            return null;
          }

          return {
            taskId: task.id,
            title: task.title,
            seconds,
            completed,
          };
        })
        .filter((record): record is DailyTaskRecord => Boolean(record))
        .sort((a, b) => b.seconds - a.seconds);

      return {
        date,
        totalSeconds: records.reduce((sum, record) => sum + record.seconds, 0),
        completedTasks: records.filter((record) => record.completed).length,
        records,
      };
    });
  }, [tasks, todayKey]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.length - completed;
    const highPriority = tasks.filter(
      (task) => !task.completed && task.priority === "high",
    ).length;
    const dueToday = tasks.filter(
      (task) => !task.completed && isDueToday(task.deadline),
    ).length;
    const trackedTodaySeconds = Array.from(taskTodaySecondsMap.values()).reduce(
      (sum, seconds) => sum + seconds,
      0,
    );

    return {
      total: tasks.length,
      completed,
      pending,
      highPriority,
      dueToday,
      trackedTodaySeconds,
    };
  }, [tasks, taskTodaySecondsMap]);

  return {
    tasks,
    isHydrated,
    stats,
    setTasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
    activeTimerTaskId: activeTimer?.taskId ?? null,
    startTaskTimer,
    pauseTaskTimer,
    getTaskTodaySeconds,
    getTaskTotalSeconds,
    dailyHistory,
  };
}
