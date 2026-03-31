import type { DailyHistory } from "@/hooks/useTasks";
import { formatDayLabel, formatDuration } from "@/lib/time";

type TimeHistoryCalendarProps = {
  history: DailyHistory[];
};

export function TimeHistoryCalendar({ history }: TimeHistoryCalendarProps) {
  return (
    <div className="space-y-3">
      {history.map((day) => (
        <article key={day.date} className="rounded-2xl border border-[--card-border] bg-white/70 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[--text-primary]">{formatDayLabel(day.date)}</p>
            <p className="text-xs text-[--text-secondary]">
              {day.completedTasks} completed · {formatDuration(day.totalSeconds)}
            </p>
          </div>

          {day.records.length === 0 ? (
            <p className="mt-2 text-xs text-[--text-secondary]">No tracked activity.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {day.records.map((record) => {
                const widthPercent =
                  day.totalSeconds > 0 ? Math.max(6, Math.round((record.seconds / day.totalSeconds) * 100)) : 0;

                return (
                  <li
                    key={`${day.date}-${record.taskId}`}
                    className="space-y-1 rounded-xl border border-[--card-border] bg-white/80 px-2 py-1.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-xs text-[--text-primary]">
                        {record.title}
                        {record.completed ? " · done" : ""}
                      </p>
                      <p className="shrink-0 text-xs font-medium text-[--text-secondary]">
                        {formatDuration(record.seconds)}
                      </p>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200">
                      <div
                        className="h-1.5 rounded-full bg-slate-900 transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}
