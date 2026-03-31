"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types/task";

type TaskItemProps = {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (
    taskId: string,
    input: {
      title?: string;
      notes?: string;
      priority?: TaskPriority;
      deadline?: string;
    },
  ) => void;
};

const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-700",
};

export function TaskItem({ task, onToggleComplete, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [deadline, setDeadline] = useState(task.deadline ?? "");
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSave = () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setTitleError("Task title is required.");
      return;
    }

    onUpdate(task.id, {
      title: normalizedTitle,
      notes,
      priority,
      deadline,
    });
    setTitleError(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setNotes(task.notes ?? "");
    setPriority(task.priority);
    setDeadline(task.deadline ?? "");
    setTitleError(null);
    setIsEditing(false);
  };

  return (
    <li className="space-y-3 rounded-2xl border border-[--card-border] bg-white/70 p-4">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) {
                setTitleError(null);
              }
            }}
            aria-invalid={Boolean(titleError)}
          />
          {titleError ? <p className="text-xs text-rose-600">{titleError}</p> : null}
          <Input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional notes"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <Input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-slate-900" onClick={handleSave}>
              Save
            </Button>
            <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p
                className={cn(
                  "text-sm font-medium text-[--text-primary]",
                  task.completed && "text-[--text-secondary] line-through",
                )}
              >
                {task.title}
              </p>
              {task.notes ? (
                <p className="text-xs leading-5 text-[--text-secondary]">{task.notes}</p>
              ) : null}
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
                priorityStyles[task.priority],
              )}
            >
              {task.priority}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[--text-secondary]">
            <span>
              Deadline:{" "}
              <span className="font-medium text-[--text-primary]">
                {task.deadline ? task.deadline : "Not set"}
              </span>
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>
              Status:{" "}
              <span className="font-medium text-[--text-primary]">
                {task.completed ? "Completed" : "Pending"}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-slate-100 text-slate-800 hover:bg-slate-200"
              onClick={() => onToggleComplete(task.id)}
              aria-label={task.completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as done`}
            >
              {task.completed ? "Mark Pending" : "Mark Done"}
            </Button>
            <Button
              className="bg-slate-100 text-slate-800 hover:bg-slate-200"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${task.title}`}
            >
              Edit
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-500"
              onClick={() => onDelete(task.id)}
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </li>
  );
}
