import { SectionCard } from "@/components/dashboard/SectionCard";

type AppShellProps = {
  children?: React.ReactNode;
};

const sections = [
  {
    title: "Add Task",
    eyebrow: "Capture",
    description:
      "Turn raw thoughts into trackable tasks with clean inputs for priority, deadlines, and context.",
  },
  {
    title: "Task List",
    eyebrow: "Organize",
    description:
      "See everything in one calm workspace designed for clarity, focus, and confident execution.",
  },
  {
    title: "Today Plan",
    eyebrow: "Focus",
    description:
      "Get a streamlined daily plan that reduces decision fatigue and keeps your momentum high.",
  },
  {
    title: "AI Suggestions",
    eyebrow: "Assist",
    description:
      "Receive practical guidance to prioritize, break down goals, and choose the best next action.",
  },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
      <header className="max-w-3xl space-y-5">
        <p className="inline-flex items-center rounded-full border border-[--card-border] bg-[--card] px-3 py-1 text-xs font-medium tracking-wide text-[--muted] shadow-[var(--shadow-soft)]">
          Dayframe v1
        </p>
        <div className="space-y-3">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight text-[--text-primary] sm:text-4xl lg:text-5xl">
            Plan your day with calm clarity.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[--text-secondary] sm:text-base">
            Dayframe transforms overwhelming goals into prioritized tasks, a focused daily plan,
            and clear suggestions for what to do next.
          </p>
        </div>
      </header>

      <main className="mt-10 grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <SectionCard key={section.title} {...section} />
        ))}
      </main>

      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
