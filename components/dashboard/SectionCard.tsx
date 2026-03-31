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
        "rounded-3xl border border-[--card-border] bg-[--card] p-6 shadow-[var(--shadow-card)] backdrop-blur-sm",
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
