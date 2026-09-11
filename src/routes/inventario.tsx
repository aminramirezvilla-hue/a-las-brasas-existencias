import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { AppShell } from "@/components/shell";
import { StatusToggle } from "@/components/status-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, NativeSelect } from "@/components/ui/input";
import { CATEGORIES, STATUS_LABEL } from "@/lib/catalog";
import { qty } from "@/lib/format";
import { existenceStats } from "@/lib/semaforo";
import { useInventory } from "@/lib/store";
import type { Category, Ingredient, StockStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/inventario")({ component: InventarioPage });

type Filter = "all" | StockStatus;

export function InventarioPage() {
  const ingredients = useInventory((s) => s.ingredients);
  const markCategory = useInventory((s) => s.markCategory);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [filter, setFilter] = useState<Filter>("all");

  const stats = existenceStats(ingredients);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ingredients.filter((i) => {
      if (cat !== "all" && i.category !== cat) return false;
      if (filter !== "all" && i.status !== filter) return false;
      if (!query) return true;
      return `${i.name} ${i.sku} ${i.unitLabel}`.toLowerCase().includes(query);
    });
  }, [ingredients, q, cat, filter]);

  const grouped = useMemo(() => {
    const map = new Map<Category, Ingredient[]>();
    for (const ing of rows) {
      const list = map.get(ing.category) ?? [];
      list.push(ing);
      map.set(ing.category, list);
    }
    return CATEGORIES.filter((c) => map.has(c.id)).map((c) => ({
      ...c,
      items: map.get(c.id) ?? [],
    }));
  }, [rows]);

  const faltantes = useMemo(
    () => (stats.falta > 0 && filter === "all" && !q ? ingredients.filter((i) => i.status === "falta") : []),
    [ingredients, stats.falta, filter, q],
  );

  return (
    <AppShell>
      <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Inventario</p>
      <h1 className="mt-1 font-display text-3xl text-bone">Existencias y faltantes</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Listado de A las Brasas. Toca <strong className="text-fg">Hay</strong>,{" "}
        <strong className="text-fg">Bajo</strong> o <strong className="text-fg">Falta</strong> en
        cada insumo — igual que conforme / no conforme en bitácora CATU. La cantidad es opcional.
      </p>

      <div className="mt-5 grid grid-cols-4 gap-2">
        <StatChip label="Hay" value={stats.hay} tone="ok" active={filter === "hay"} onClick={() => setFilter(filter === "hay" ? "all" : "hay")} />
        <StatChip label="Bajo" value={stats.bajo} tone="warn" active={filter === "bajo"} onClick={() => setFilter(filter === "bajo" ? "all" : "bajo")} />
        <StatChip label="Falta" value={stats.falta} tone="crit" active={filter === "falta"} onClick={() => setFilter(filter === "falta" ? "all" : "falta")} />
        <StatChip label="Total" value={stats.total} tone="muted" active={filter === "all"} onClick={() => setFilter("all")} />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            className="pl-9"
            placeholder="Buscar arrachera, alitas, pan, cerveza…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <NativeSelect
          className="sm:w-48"
          value={cat}
          onChange={(e) => setCat(e.target.value as Category | "all")}
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {faltantes.length > 0 ? (
        <Card className="mt-4 border-0 bg-crit/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-crit">Pedir ahora</p>
          <ul className="mt-2 space-y-1 text-sm">
            {faltantes.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-2">
                <span className="text-fg">{i.name}</span>
                <span className="text-[11px] text-muted">{i.unitLabel}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="mt-6 space-y-8">
        {grouped.length === 0 ? (
          <p className="text-sm text-muted">Ningún insumo coincide con el filtro.</p>
        ) : (
          grouped.map((group) => (
            <section key={group.id}>
              <div className="mb-2 flex items-end justify-between gap-2">
                <h2 className="font-display text-xl text-bone">{group.label}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[11px] uppercase tracking-wide"
                  onClick={() => markCategory(group.id, "hay")}
                >
                  Marcar todo Hay
                </Button>
              </div>
              <div className="space-y-2">
                {group.items.map((ing) => (
                  <IngredientRow key={ing.id} ing={ing} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </AppShell>
  );
}

const IngredientRow = memo(function IngredientRow({ ing }: { ing: Ingredient }) {
  const setStatus = useInventory((s) => s.setStatus);
  const setQty = useInventory((s) => s.setQty);
  return (
    <Card className="p-3 [content-visibility:auto] [contain-intrinsic-size:auto_9.5rem] sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-fg">{ing.name}</p>
          <p className="text-[11px] text-subtle">
            {ing.unitLabel}
            {ing.min > 0 ? ` · mín ${qty(ing.min)}` : ""}
          </p>
        </div>
        <Badge
          tone={ing.status === "hay" ? "ok" : ing.status === "bajo" ? "warn" : ing.status === "falta" ? "crit" : "muted"}
        >
          {STATUS_LABEL[ing.status]}
        </Badge>
      </div>
      <div className="mt-3">
        <StatusToggle value={ing.status} onChange={(s) => setStatus(ing.id, s)} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <label className="text-[11px] uppercase tracking-wide text-subtle" htmlFor={`qty-${ing.id}`}>
          Cantidad
        </label>
        <Input
          id={`qty-${ing.id}`}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          className="h-11 max-w-32 tabular"
          value={qty(ing.stock)}
          onChange={(e) => setQty(ing.id, Number(e.target.value))}
        />
        <span className="text-xs text-muted">{ing.unitLabel}</span>
      </div>
    </Card>
  );
});

function StatChip({
  label,
  value,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "crit" | "muted";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-2 py-3 text-center shadow-[var(--shadow-border)]",
        active ? "bg-raised" : "bg-card",
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-2xl tabular",
          tone === "ok" && "text-ok",
          tone === "warn" && "text-warn",
          tone === "crit" && "text-crit",
          tone === "muted" && "text-bone",
        )}
      >
        {value}
      </p>
    </button>
  );
}
