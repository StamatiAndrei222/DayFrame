"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { TaskPriority } from "@/types/task";

type AddTaskInput = {
  title: string;
  notes?: string;
  priority: TaskPriority;
  deadline?: string;
};

type AddTaskFormProps = {
  onAddTask: (input: AddTaskInput) => void;
};

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [deadline, setDeadline] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setTitleError("Task title is required.");
      return;
    }

    onAddTask({
      title: normalizedTitle,
      notes: notes.trim() ? notes.trim() : undefined,
      priority,
      deadline: deadline || undefined,
    });

    setTitle("");
    setNotes("");
    setPriority("medium");
    setDeadline("");
    setTitleError(null);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-[--muted]" htmlFor="task-title">
          Task
        </label>
        <Input
          id="task-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (titleError) {
              setTitleError(null);
            }
          }}
          placeholder="e.g. Update portfolio README"
          aria-invalid={Boolean(titleError)}
        />
        {titleError ? <p className="text-xs text-rose-600">{titleError}</p> : null}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-[--muted]" htmlFor="task-notes">
          Notes (optional)
        </label>
        <Input
          id="task-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Small context to remember later"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-[--muted]" htmlFor="task-priority">
            Priority
          </label>
          <Select
            id="task-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-[--muted]" htmlFor="task-deadline">
            Deadline
          </label>
          <Input
            id="task-deadline"
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </div>
      </div>

      <Button className="w-full sm:w-auto" type="submit">
        Add Task
      </Button>
    </form>
  );
}
