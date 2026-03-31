"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useTasks } from "@/hooks/useTasks";

export default function Home() {
  const { tasks, stats, isHydrated, addTask } = useTasks();

  return <AppShell tasks={tasks} stats={stats} isHydrated={isHydrated} onAddTask={addTask} />;
}
