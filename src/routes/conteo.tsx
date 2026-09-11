import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/shell";
import { SemaforoChip } from "@/components/semaforo-chip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, NativeSelect } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/catalog";
import { qty } from "@/lib/format";
import { stockLevel } from "@/lib/semaforo";
import { useInventory } from "@/lib/store";
import type { Category } from "@/lib/types";

export const Route = createFileRoute("/conteo")({ component: ConteoPage });

function ConteoPage() {
  const ingredients = useInventory((s) => s.ingredients);
  const applyCount = useInventory((s) => s.applyCount);
  const encargado = useInventory((s) => s.restaurant.encargado);
  const [cat, setCat] = useState<Category | "all">("cortes");
  const [counts, setCounts] = useState<Record<string, string>>({});

  const rows = useMemo(
    () => ingredients.filter((i) => (cat === "all" ? true : i.category === cat)),
    [ingredients, cat],
  );

  const diffs = rows
    .map((ing) => {
      const raw = counts[ing.id];
      if (raw === undefined || raw === "") return null;
      const n = Number(raw);
      if (!Number.isFinite(n)) return null;
      const delta = n - ing.stock;
      return { ing, n, delta };
    })
    .filter(Boolean);

  return (
    <AppShell>
      <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Conteo físico</p>
      <h1 className="mt-1 font-display text-3xl text-bone">Cantidad en cámara</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Opcional. Si solo necesitas saber si hay o falta, usa Inventario. Aquí se cuenta lo que hay
        en cámara cuando sí se quiere un número.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <NativeSelect
          className="sm:w-56"
          value={cat}
          onChange={(e) => setCat(e.target.value as Category | "all")}
        >
          <option value="all">Todas</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </NativeSelect>
        <p className="text-xs text-muted">Empieza por cortes y pollo.</p>
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((ing) => {
          const raw = counts[ing.id] ?? "";
          const n = raw === "" ? null : Number(raw);
          const delta = n === null || !Number.isFinite(n) ? null : n - ing.stock;
          return (
            <Card key={ing.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-fg">{ing.name}</p>
                  <p className="text-[11px] text-subtle">
                    Sistema: {qty(ing.stock)} {ing.unitLabel}
                  </p>
                </div>
                <SemaforoChip level={stockLevel(ing)} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  className="h-11 max-w-36 tabular"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={raw}
                  placeholder={qty(ing.stock)}
                  onChange={(e) => setCounts((c) => ({ ...c, [ing.id]: e.target.value }))}
                />
                <span className="text-xs text-muted">{ing.unitLabel}</span>
                {delta !== null ? (
                  <span className={delta < 0 ? "text-crit" : delta > 0 ? "text-ok" : "text-muted"}>
                    {delta > 0 ? "+" : ""}
                    {qty(delta)}
                  </span>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          onClick={() => {
            const payload: Record<string, number> = {};
            for (const [id, v] of Object.entries(counts)) {
              const n = Number(v);
              if (v !== "" && Number.isFinite(n)) payload[id] = n;
            }
            const res = applyCount(payload, encargado);
            if (res.ok) {
              toast.success(res.message);
              setCounts({});
            } else toast.error(res.message);
          }}
        >
          Aplicar conteo
        </Button>
        <span className="text-xs text-muted">
          {diffs.length} lecturas · {diffs.filter((d) => d && d.delta !== 0).length} con diferencia
        </span>
      </div>
    </AppShell>
  );
}
