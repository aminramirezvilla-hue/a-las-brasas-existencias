import { cn } from "@/lib/cn";
import type { StockStatus } from "@/lib/types";

const OPTIONS: {
  id: Exclude<StockStatus, "">;
  label: string;
  on: string;
  off: string;
}[] = [
  {
    id: "hay",
    label: "Hay",
    on: "bg-ok text-ok-fg shadow-none",
    off: "bg-ok/15 text-ok",
  },
  {
    id: "bajo",
    label: "Bajo",
    on: "bg-warn text-warn-fg shadow-none",
    off: "bg-warn/15 text-warn",
  },
  {
    id: "falta",
    label: "Falta",
    on: "bg-crit text-crit-fg shadow-none",
    off: "bg-crit/15 text-crit",
  },
];

export function StatusToggle({
  value,
  onChange,
}: {
  value: StockStatus;
  onChange: (next: StockStatus) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {OPTIONS.map((opt) => {
        const on = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex min-h-14 items-center justify-center rounded-lg text-base font-semibold uppercase tracking-wide transition-colors duration-150",
              on ? opt.on : opt.off,
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
