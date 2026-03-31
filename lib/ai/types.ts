import type { TaskCadence, TaskPriority } from "@/types/task";

export type SuggestionCard = {
  title: string;
  body: string;
};

export type SuggestedTaskDraft = {
  title: string;
  notes: string;
  cadence: TaskCadence;
  priority: TaskPriority;
  deadline?: string;
};

export type AISuggestionsResponse = {
  cards: SuggestionCard[];
  suggestedTasks: SuggestedTaskDraft[];
  source: "openai" | "mock";
  notice?: string;
};
