import { cn } from "@/lib/cn";
import type { StockStatus } from "@/lib/types";

const OPTIONS: { id: Exclude<StockStatus, "">; label: string }[] = [
  { id: "hay", label: "Hay" },
  { id: "bajo", label: "Bajo" },
  { id: "falta", label: "Falta" },
];

export function StatusToggle({
  value,
  onChange,
}: {
  value: StockStatus;
  onChange: (next: StockStatus) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-raised p-1">
      {OPTIONS.map((opt) => {
        const on = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "h-11 rounded-md text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
              on && opt.id === "hay" && "bg-ok text-bg",
              on && opt.id === "bajo" && "bg-warn text-bg",
              on && opt.id === "falta" && "bg-crit text-ember-fg",
              !on && "text-muted hover:text-fg",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
