"use client";

import { useMemo, useState } from "react";

import { TaskItem } from "@/components/tasks/TaskItem";
import { cn } from "@/lib/utils";
import type { Task, TaskCadence, TaskPriority } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (
    taskId: string,
    input: {
      title?: string;
      notes?: string;
      cadence?: TaskCadence;
      priority?: TaskPriority;
      deadline?: string;
    },
  ) => void;
  activeTimerTaskId: string | null;
  focusTaskIdsToday: string[];
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
  focusTaskIdsToday,
  getTaskTodaySeconds,
  getTaskTotalSeconds,
  onStartTimer,
  onPauseTimer,
}: TaskListProps) {
  const tabs: { label: string; cadence: TaskCadence }[] = [
    { label: "Daily Tasks", cadence: "daily" },
    { label: "Weekly Tasks", cadence: "weekly" },
    { label: "Monthly Tasks", cadence: "monthly" },
  ];
  const [activeTab, setActiveTab] = useState<TaskCadence>("daily");

  const tabTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const inActiveTab = (task.cadence ?? "daily") === activeTab;
        if (!inActiveTab) {
          return false;
        }

        if (activeTab === "daily") {
          return !focusTaskIdsToday.includes(task.id);
        }

        return true;
      }),
    [tasks, activeTab, focusTaskIdsToday],
  );

  const activeLabel = tabs.find((tab) => tab.cadence === activeTab)?.label ?? "Tasks";

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
    <div className="space-y-3">
      <div className="inline-flex w-full rounded-xl border border-[--card-border] bg-white/60 p-1 sm:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab.cadence}
            type="button"
            onClick={() => setActiveTab(tab.cadence)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition sm:flex-none",
              activeTab === tab.cadence
                ? "bg-slate-900 text-white"
                : "text-[--text-secondary] hover:bg-white",
            )}
          >
            {tab.cadence}
          </button>
        ))}
      </div>

      {tabTasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[--card-border] bg-white/60 px-3 py-2 text-xs text-[--text-secondary]">
          No tasks in {activeLabel.toLowerCase()} yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {tabTasks.map((task) => (
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
      )}
    </div>
  );
}
