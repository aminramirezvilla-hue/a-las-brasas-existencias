import { cn } from "@/lib/cn";
import type { SemaforoLevel } from "@/lib/types";

const stroke: Record<SemaforoLevel, string> = {
  ok: "text-ok",
  warn: "text-warn",
  crit: "text-crit",
  empty: "text-crit",
};

export function ProgressRing({
  pct,
  level,
  label,
  sub,
}: {
  pct: number;
  level: SemaforoLevel;
  label: string;
  sub?: string;
}) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = (clamped / 100) * c;

  return (
    <div className="relative grid size-36 place-items-center">
      <svg viewBox="0 0 100 100" className="size-full">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          className="text-border"
          stroke="currentColor"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          className={cn("ring-progress", stroke[level])}
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-2xl tabular leading-none text-fg">{Math.round(clamped)}</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">{label}</div>
          {sub ? <div className="text-[10px] text-subtle">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}
