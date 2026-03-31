import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-[--card-border] bg-white px-3 py-2 text-sm text-[--text-primary] shadow-[var(--shadow-soft)] outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100",
        className,
      )}
      {...props}
    />
  );
}
