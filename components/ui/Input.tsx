import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[--card-border] bg-white px-3 py-2 text-sm text-[--text-primary] shadow-[var(--shadow-soft)] outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100",
        className,
      )}
      {...props}
    />
  );
}
