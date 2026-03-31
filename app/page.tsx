"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useTasks } from "@/hooks/useTasks";

export default function Home() {
  const { tasks, stats, isHydrated, addTask, toggleTaskCompletion, deleteTask, updateTask } =
    useTasks();

  return (
    <AppShell
      tasks={tasks}
      stats={stats}
      isHydrated={isHydrated}
      onAddTask={addTask}
      onToggleTaskCompletion={toggleTaskCompletion}
      onDeleteTask={deleteTask}
      onUpdateTask={updateTask}
    />
  );
}
