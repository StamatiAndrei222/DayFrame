"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useTasks } from "@/hooks/useTasks";

export default function Home() {
  const {
    tasks,
    stats,
    isHydrated,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
    activeTimerTaskId,
    startTaskTimer,
    pauseTaskTimer,
    getTaskTodaySeconds,
    getTaskTotalSeconds,
    dailyHistory,
    focusTask,
    focusTaskTodaySeconds,
    focusProgress,
  } = useTasks();

  return (
    <AppShell
      tasks={tasks}
      stats={stats}
      isHydrated={isHydrated}
      onAddTask={addTask}
      onToggleTaskCompletion={toggleTaskCompletion}
      onDeleteTask={deleteTask}
      onUpdateTask={updateTask}
      activeTimerTaskId={activeTimerTaskId}
      onStartTaskTimer={startTaskTimer}
      onPauseTaskTimer={pauseTaskTimer}
      getTaskTodaySeconds={getTaskTodaySeconds}
      getTaskTotalSeconds={getTaskTotalSeconds}
      dailyHistory={dailyHistory}
      focusTask={focusTask}
      focusTaskTodaySeconds={focusTaskTodaySeconds}
      focusProgress={focusProgress}
    />
  );
}
