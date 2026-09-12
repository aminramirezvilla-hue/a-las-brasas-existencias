import { CATEGORIES } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { Category } from "@/lib/types";

export function CategoryChips({
  value,
  onChange,
}: {
  value: Category | "all";
  onChange: (next: Category | "all") => void;
}) {
  const chips: { id: Category | "all"; label: string }[] = [
    { id: "all", label: "Todas" },
    ...CATEGORIES,
  ];

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {chips.map((c) => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={cn(
              "shrink-0 rounded-full px-4 font-semibold transition-colors duration-150",
              "min-h-12 text-sm",
              active ? "bg-ember text-ember-fg" : "bg-raised text-fg shadow-[var(--shadow-border)]",
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
