import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  eyebrow: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
};

export function SectionCard({
  title,
  eyebrow,
  description,
  className,
  children,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-[--card-border] bg-[--card] p-6 shadow-[var(--shadow-card)] backdrop-blur-sm transition-transform duration-300 [transition-timing-function:var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-[0_8px_26px_rgba(15,23,42,0.12)] opacity-0 animate-[fade-up_560ms_var(--ease-standard)_forwards] [animation-delay:var(--card-delay,0ms)] motion-reduce:opacity-100 motion-reduce:animate-none",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[--muted]">
        {eyebrow}
      </p>
      <div className="mt-3 space-y-2">
        <h2 className="text-balance text-lg font-semibold tracking-tight text-[--text-primary]">
          {title}
        </h2>
        <p className="text-sm leading-6 text-[--text-secondary]">{description}</p>
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
