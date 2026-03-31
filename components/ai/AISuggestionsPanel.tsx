"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { generateSuggestionCards, generateSuggestedTasks } from "@/lib/ai/mockSuggestions";
import type { AISuggestionsResponse, SuggestedTaskDraft, SuggestionCard } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
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
type AssistMode = "quick" | "builder";

const DEFAULT_PROMPT =
  "I need to make my CV, clean my GitHub, work on my portfolio project, and apply for jobs.";

const TEMPLATES = [
  "Job hunt sprint: CV updates, 5 applications, interview prep.",
  "Portfolio sprint: polish one project and publish updates.",
  "Balance day: study 2h, coding practice, and outreach.",
];

function toUiDrafts(drafts: SuggestedTaskDraft[]): UiSuggestionDraft[] {
  return drafts.map((draft, index) => ({
    ...draft,
    id: `ai-draft-${index}`,
  }));
}

export function AISuggestionsPanel({ tasks, onAddTask }: AISuggestionsPanelProps) {
  const [mode, setMode] = useState<AssistMode>("quick");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [submittedPrompt, setSubmittedPrompt] = useState(DEFAULT_PROMPT);
  const [addedDraftIds, setAddedDraftIds] = useState<string[]>([]);
  const [editableDrafts, setEditableDrafts] = useState<UiSuggestionDraft[]>(
    toUiDrafts(generateSuggestedTasks(DEFAULT_PROMPT)),
  );
  const [cards, setCards] = useState<SuggestionCard[]>(generateSuggestionCards(DEFAULT_PROMPT, tasks));
  const [source, setSource] = useState<"openai" | "mock">("mock");
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState(false);

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

  const normalizeTitle = (title: string) =>
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  const draftsWithFlags = useMemo(
    () =>
      editableDrafts.map((draft) => {
        const normalized = normalizeTitle(draft.title);
        const exists = normalizedExistingTitles.has(normalized);
        return {
          draft,
          exists,
        };
      }),
    [editableDrafts, normalizedExistingTitles],
  );

  const newDrafts = draftsWithFlags.filter((item) => !item.exists);
  const existingDrafts = draftsWithFlags.filter((item) => item.exists);

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextPrompt = prompt.trim() || DEFAULT_PROMPT;
    setSubmittedPrompt(nextPrompt);
    setAddedDraftIds([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: nextPrompt, tasks }),
      });

      const payload = (await response.json()) as AISuggestionsResponse;

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      setCards(payload.cards);
      setEditableDrafts(toUiDrafts(payload.suggestedTasks));
      setSource(payload.source);
      setNotice(payload.notice ?? null);
    } catch {
      setCards(generateSuggestionCards(nextPrompt, tasks));
      setEditableDrafts(toUiDrafts(generateSuggestedTasks(nextPrompt)));
      setSource("mock");
      setNotice("Could not reach OpenAI. Showing local suggestions.");
    } finally {
      setIsLoading(false);
    }
  };

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

    newDrafts.forEach(({ draft }) => {
      if (!draft.title.trim()) {
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
    <div className="space-y-4">
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
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => setPrompt(template)}
              className="rounded-full border border-[--card-border] bg-white px-2.5 py-1 text-[11px] text-[--text-secondary] hover:bg-slate-50"
            >
              Use template
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="w-full sm:w-auto" type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Plan"}
          </Button>
          <p
            className={cn(
              "rounded-full border px-2 py-1 text-[11px]",
              source === "openai"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700",
            )}
          >
            {source === "openai" ? "OpenAI" : "Mock fallback"}
          </p>
        </div>
        {notice ? <p className="text-xs text-[--text-secondary]">{notice}</p> : null}
      </form>

      <div className="inline-flex w-full rounded-xl border border-[--card-border] bg-white/60 p-1 sm:w-auto">
        <button
          type="button"
          onClick={() => setMode("quick")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition",
            mode === "quick" ? "bg-slate-900 text-white" : "text-[--text-secondary] hover:bg-white",
          )}
        >
          Quick Plan
        </button>
        <button
          type="button"
          onClick={() => setMode("builder")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition",
            mode === "builder" ? "bg-slate-900 text-white" : "text-[--text-secondary] hover:bg-white",
          )}
        >
          Task Builder
        </button>
      </div>

      {mode === "quick" ? (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[--text-primary]">Top next actions</h3>
            <button
              type="button"
              onClick={() => setExpandedCards((prev) => !prev)}
              className="text-xs text-[--text-secondary] underline-offset-2 hover:underline"
            >
              {expandedCards ? "Hide details" : "Show details"}
            </button>
          </div>
          {cards.slice(0, 3).map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-[--card-border] bg-white/70 px-3 py-3"
            >
              <h4 className="text-sm font-semibold text-[--text-primary]">{card.title}</h4>
              <p className="mt-1 text-xs leading-5 text-[--text-secondary]">
                {expandedCards ? card.body : `${card.body.slice(0, 140)}${card.body.length > 140 ? "..." : ""}`}
              </p>
            </article>
          ))}
          <Button className="bg-slate-100 text-slate-800 hover:bg-slate-200" type="button" onClick={() => setMode("builder")}>
            Continue in Task Builder
          </Button>
        </section>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[--text-primary]">New suggestions</h3>
            <Button
              className="bg-slate-100 text-slate-800 hover:bg-slate-200"
              type="button"
              onClick={addAllTasks}
              disabled={newDrafts.length === 0}
            >
              Add All New
            </Button>
          </div>

          {newDrafts.length === 0 ? (
            <p className="text-xs text-[--text-secondary]">No new tasks to add from this suggestion batch.</p>
          ) : (
            <ul className="space-y-2">
              {newDrafts.map(({ draft }) => {
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
                    <details className="rounded-lg border border-[--card-border] bg-white/70 px-2 py-1.5">
                      <summary className="cursor-pointer text-xs text-[--text-secondary]">Advanced options</summary>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
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
                          onChange={(event) =>
                            updateDraft(draft.id, "deadline", event.target.value || undefined)
                          }
                        />
                      </div>
                    </details>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-[--text-secondary]">Ready to add in your workflow.</p>
                      <Button
                        className="bg-slate-900"
                        type="button"
                        disabled={isAdded || !draft.title.trim()}
                        onClick={() => addOneTask(draft)}
                      >
                        {isAdded ? "Added" : "Add"}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {existingDrafts.length > 0 ? (
            <div className="rounded-xl border border-[--card-border] bg-slate-50/80 px-3 py-2">
              <p className="text-xs font-medium text-[--text-primary]">Already in your task list</p>
              <ul className="mt-1 space-y-1">
                {existingDrafts.map(({ draft }) => (
                  <li key={draft.id} className="text-xs text-[--text-secondary]">
                    {draft.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      <p className="text-[11px] text-[--text-secondary]">
        Prompt used: <span className="font-medium text-[--text-primary]">{submittedPrompt}</span>
      </p>
    </div>
  );
}
