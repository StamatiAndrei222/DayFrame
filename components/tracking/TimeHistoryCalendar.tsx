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
              {day.records.map((record) => (
                <li
                  key={`${day.date}-${record.taskId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[--card-border] bg-white/80 px-2 py-1.5"
                >
                  <p className="truncate text-xs text-[--text-primary]">
                    {record.title}
                    {record.completed ? " · done" : ""}
                  </p>
                  <p className="shrink-0 text-xs font-medium text-[--text-secondary]">
                    {formatDuration(record.seconds)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}
