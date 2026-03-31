"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  generateSuggestedTasks,
  generateSuggestionCards,
  type SuggestedTaskDraft,
} from "@/lib/ai/mockSuggestions";
import type { Task, TaskCadence, TaskPriority } from "@/types/task";

type AISuggestionsPanelProps = {
  tasks: Task[];
  onAddTask: (input: {
    title: string;
    notes?: string;
    cadence: TaskCadence;
    priority: TaskPriority;
    deadline?: string;
  }) => void;
};

type UiSuggestionDraft = SuggestedTaskDraft & { id: string };

const DEFAULT_PROMPT =
  "I need to make my CV, clean my GitHub, work on my portfolio project, and apply for jobs.";

export function AISuggestionsPanel({ tasks, onAddTask }: AISuggestionsPanelProps) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [submittedPrompt, setSubmittedPrompt] = useState(DEFAULT_PROMPT);
  const [addedDraftIds, setAddedDraftIds] = useState<string[]>([]);
  const [editableDrafts, setEditableDrafts] = useState<UiSuggestionDraft[]>(
    generateSuggestedTasks(DEFAULT_PROMPT).map((draft, index) => ({
      ...draft,
      id: `ai-draft-${index}`,
    })),
  );

  const cards = useMemo(
    () => generateSuggestionCards(submittedPrompt, tasks),
    [submittedPrompt, tasks],
  );
  const normalizedExistingTitles = useMemo(
    () =>
      new Set(
        tasks.map((task) =>
          task.title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " "),
        ),
      ),
    [tasks],
  );

  const handleGenerate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPrompt = prompt.trim() || DEFAULT_PROMPT;
    setSubmittedPrompt(nextPrompt);
    const nextDrafts = generateSuggestedTasks(nextPrompt).map((draft, index) => ({
      ...draft,
      id: `ai-draft-${index}`,
    }));
    setEditableDrafts(nextDrafts);
    setAddedDraftIds([]);
  };

  const normalizeTitle = (title: string) =>
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  const updateDraft = <K extends keyof SuggestedTaskDraft>(
    draftId: string,
    key: K,
    value: SuggestedTaskDraft[K],
  ) => {
    setEditableDrafts((prev) =>
      prev.map((draft) => (draft.id === draftId ? { ...draft, [key]: value } : draft)),
    );
  };

  const addOneTask = (draft: UiSuggestionDraft) => {
    const normalized = normalizeTitle(draft.title);
    if (!normalized || normalizedExistingTitles.has(normalized)) {
      return;
    }

    onAddTask({
      title: draft.title.trim(),
      notes: draft.notes,
      cadence: draft.cadence,
      priority: draft.priority,
      deadline: draft.deadline,
    });
    setAddedDraftIds((prev) => [...prev, draft.id]);
  };

  const addAllTasks = () => {
    const newAdded: string[] = [];

    editableDrafts.forEach((draft) => {
      const normalized = normalizeTitle(draft.title);
      if (!normalized || normalizedExistingTitles.has(normalized)) {
        return;
      }

      onAddTask({
        title: draft.title.trim(),
        notes: draft.notes,
        cadence: draft.cadence,
        priority: draft.priority,
        deadline: draft.deadline,
      });
      newAdded.push(draft.id);
    });

    setAddedDraftIds(newAdded);
  };

  return (
    <div className="space-y-3">
      <form className="space-y-2" onSubmit={handleGenerate}>
        <label className="text-xs font-medium uppercase tracking-wide text-[--muted]" htmlFor="ai-prompt">
          Describe your messy goals
        </label>
        <Input
          id="ai-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Type a rough list of goals..."
        />
        <Button className="w-full sm:w-auto" type="submit">
          Generate Suggestions
        </Button>
      </form>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[--text-primary]">Suggested tasks to add</h3>
          {editableDrafts.length > 0 ? (
            <Button
              className="bg-slate-100 text-slate-800 hover:bg-slate-200"
              type="button"
              onClick={addAllTasks}
            >
              Add All
            </Button>
          ) : null}
        </div>
        {editableDrafts.length === 0 ? (
          <p className="text-xs text-[--text-secondary]">Write a goal and generate suggestions first.</p>
        ) : (
          <ul className="space-y-2">
            {editableDrafts.map((draft) => {
              const normalized = normalizeTitle(draft.title);
              const alreadyExists = normalizedExistingTitles.has(normalized);
              const isAdded = addedDraftIds.includes(draft.id);
              return (
                <li
                  key={draft.id}
                  className="space-y-2 rounded-xl border border-[--card-border] bg-white/70 px-3 py-2"
                >
                  <Input
                    value={draft.title}
                    onChange={(event) => updateDraft(draft.id, "title", event.target.value)}
                    placeholder="Suggested task title"
                  />
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Select
                      value={draft.cadence}
                      onChange={(event) =>
                        updateDraft(draft.id, "cadence", event.target.value as TaskCadence)
                      }
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                    <Select
                      value={draft.priority}
                      onChange={(event) =>
                        updateDraft(draft.id, "priority", event.target.value as TaskPriority)
                      }
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                    <Input
                      type="date"
                      value={draft.deadline ?? ""}
                      onChange={(event) => updateDraft(draft.id, "deadline", event.target.value || undefined)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-[--text-secondary]">
                      {alreadyExists
                        ? "Already exists in your task list."
                        : "Ready to add in your workflow."}
                    </p>
                    <Button
                      className="bg-slate-900"
                      type="button"
                      disabled={isAdded || alreadyExists || !draft.title.trim()}
                      onClick={() => addOneTask(draft)}
                    >
                      {alreadyExists ? "Exists" : isAdded ? "Added" : "Add"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-[--card-border] bg-white/70 px-3 py-3"
          >
            <h3 className="text-sm font-semibold text-[--text-primary]">{card.title}</h3>
            <p className="mt-1 text-xs leading-5 text-[--text-secondary]">{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
