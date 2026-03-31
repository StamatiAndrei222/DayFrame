import type { Task } from "@/types/task";
import type { TaskCadence, TaskPriority } from "@/types/task";
import type { SuggestionCard, SuggestedTaskDraft } from "@/lib/ai/types";

const SPLIT_PATTERN = /[,.;]+|\band\b/gi;

function toPhraseList(input: string): string[] {
  return input
    .split(SPLIT_PATTERN)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function sentenceCase(text: string): string {
  if (!text) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function rewriteGoal(input: string): string {
  const items = toPhraseList(input);
  if (items.length === 0) {
    return "Define one concrete outcome and one deadline for today.";
  }

  const first = sentenceCase(items[0]);
  const rest = items.slice(1).map((item) => sentenceCase(item));

  return [
    `${first} with a measurable result and clear deadline.`,
    ...rest.map((item, index) => `${index + 2}. ${item} as a separate deliverable.`),
  ].join(" ");
}

export function breakIntoSteps(input: string): string[] {
  const items = toPhraseList(input);
  if (items.length === 0) {
    return [
      "Clarify outcome in one sentence.",
      "Define first 30-minute action.",
      "Set completion time and start.",
    ];
  }

  return items.map((item) => {
    const phrase = sentenceCase(item);
    return `${phrase}: define scope, do first draft, then finalize.`;
  });
}

export function suggestFirstAction(tasks: Task[]): string {
  const candidate = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        const weight = { high: 3, medium: 2, low: 1 };
        return weight[b.priority] - weight[a.priority];
      }
      if (a.deadline && b.deadline) {
        return a.deadline.localeCompare(b.deadline);
      }
      if (a.deadline) {
        return -1;
      }
      if (b.deadline) {
        return 1;
      }
      return a.createdAt.localeCompare(b.createdAt);
    })[0];

  if (!candidate) {
    return "Capture one high-impact task and start with a 20-minute focused session.";
  }

  return `Start with "${candidate.title}" and complete the smallest meaningful step in the next 25 minutes.`;
}

export function prioritizeTasks(tasks: Task[]): string[] {
  const top = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const weight = { high: 3, medium: 2, low: 1 };
      if (a.priority !== b.priority) {
        return weight[b.priority] - weight[a.priority];
      }
      if (a.deadline && b.deadline) {
        return a.deadline.localeCompare(b.deadline);
      }
      if (a.deadline) {
        return -1;
      }
      if (b.deadline) {
        return 1;
      }
      return a.createdAt.localeCompare(b.createdAt);
    })
    .slice(0, 3);

  if (top.length === 0) {
    return ["No pending tasks to prioritize yet."];
  }

  return top.map((task, index) => `${index + 1}. ${task.title}`);
}

export function generateSuggestionCards(input: string, tasks: Task[]): SuggestionCard[] {
  return [
    {
      title: "Rewrite Goal",
      body: rewriteGoal(input),
    },
    {
      title: "Break Into Steps",
      body: breakIntoSteps(input).join(" "),
    },
    {
      title: "What To Do First",
      body: suggestFirstAction(tasks),
    },
    {
      title: "Priority Order",
      body: prioritizeTasks(tasks).join(" "),
    },
  ];
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

function inferPriority(text: string): TaskPriority {
  const lower = text.toLowerCase();
  if (/(urgent|asap|today|deadline|apply|interview|job)/.test(lower)) {
    return "high";
  }
  if (/(clean|update|refactor|organize)/.test(lower)) {
    return "medium";
  }
  return "low";
}

function inferCadence(text: string): TaskCadence {
  const lower = text.toLowerCase();
  if (/(month|monthly|portfolio|roadmap)/.test(lower)) {
    return "monthly";
  }
  if (/(week|weekly|github|cleanup|plan)/.test(lower)) {
    return "weekly";
  }
  return "daily";
}

function inferDeadline(cadence: TaskCadence, priority: TaskPriority): string {
  const today = getTodayDate();
  if (priority === "high") {
    return today;
  }
  if (cadence === "daily") {
    return today;
  }
  if (cadence === "weekly") {
    return addDays(today, 6);
  }
  return addDays(today, 29);
}

export function generateSuggestedTasks(input: string): SuggestedTaskDraft[] {
  const phrases = toPhraseList(input);
  if (phrases.length === 0) {
    return [];
  }

  return phrases.map((phrase) => {
    const cleanTitle = sentenceCase(phrase);
    const cadence = inferCadence(cleanTitle);
    const priority = inferPriority(cleanTitle);

    return {
      title: cleanTitle,
      notes: "Generated from Assist AI prompt.",
      cadence,
      priority,
      deadline: inferDeadline(cadence, priority),
    };
  });
}
