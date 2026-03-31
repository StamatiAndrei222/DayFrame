"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { generateSuggestionCards } from "@/lib/ai/mockSuggestions";
import type { Task } from "@/types/task";

type AISuggestionsPanelProps = {
  tasks: Task[];
};

const DEFAULT_PROMPT =
  "I need to make my CV, clean my GitHub, work on my portfolio project, and apply for jobs.";

export function AISuggestionsPanel({ tasks }: AISuggestionsPanelProps) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [submittedPrompt, setSubmittedPrompt] = useState(DEFAULT_PROMPT);

  const cards = useMemo(
    () => generateSuggestionCards(submittedPrompt, tasks),
    [submittedPrompt, tasks],
  );

  const handleGenerate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedPrompt(prompt.trim() || DEFAULT_PROMPT);
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
