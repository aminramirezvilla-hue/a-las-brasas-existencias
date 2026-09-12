import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Search } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { CategoryChips } from "@/components/category-chips";
import { AppShell } from "@/components/shell";
import { StatusToggle } from "@/components/status-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CATEGORIES, STATUS_LABEL, WHATSAPP } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { qty } from "@/lib/format";
import { existenceStats } from "@/lib/semaforo";
import { useInventory } from "@/lib/store";
import type { Category, Ingredient, StockStatus } from "@/lib/types";

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
    () => ingredients.filter((i) => i.status === "falta"),
    [ingredients],
  );

  const pedidoHref = useMemo(() => {
    if (faltantes.length === 0) return "";
    const lines = faltantes.map((i) => `• ${i.name} (${i.unitLabel})`).join("\n");
    const text = `Pedido A las Brasas — Falta:\n${lines}`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  }, [faltantes]);

  return (
    <AppShell>
      <p className="text-xs font-semibold uppercase tracking-widest text-ember">Inventario</p>
      <h1 className="mt-1 font-display text-3xl text-bone">Existencias</h1>
      <p className="mt-1 text-base text-muted">Un toque: Hay, Bajo o Falta. La cantidad es opcional.</p>

      <div className="mt-5 grid grid-cols-4 gap-2">
        <StatChip
          label="Hay"
          value={stats.hay}
          tone="ok"
          active={filter === "hay"}
          onClick={() => setFilter(filter === "hay" ? "all" : "hay")}
        />
        <StatChip
          label="Bajo"
          value={stats.bajo}
          tone="warn"
          active={filter === "bajo"}
          onClick={() => setFilter(filter === "bajo" ? "all" : "bajo")}
        />
        <StatChip
          label="Falta"
          value={stats.falta}
          tone="crit"
          active={filter === "falta"}
          onClick={() => setFilter(filter === "falta" ? "all" : "falta")}
        />
        <StatChip
          label="Total"
          value={stats.total}
          tone="muted"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-subtle" />
        <Input
          className="h-14 pl-11 text-base"
          placeholder="Buscar arrachera, alitas, pan…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-3">
        <CategoryChips value={cat} onChange={setCat} />
      </div>

      {faltantes.length > 0 && filter !== "hay" ? (
        <Card className="mt-4 bg-crit p-4 text-crit-fg shadow-none">
          <p className="text-xs font-semibold uppercase tracking-widest">Pedir ahora</p>
          <ul className="mt-2 space-y-1 text-base">
            {faltantes.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-2">
                <span className="font-semibold">{i.name}</span>
                <span className="text-sm opacity-80">{i.unitLabel}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-4 h-14 w-full bg-bone text-ink hover:opacity-95">
            <a href={pedidoHref} target="_blank" rel="noreferrer">
              Pedir por WhatsApp
            </a>
          </Button>
        </Card>
      ) : null}

      <div className="mt-6 space-y-8">
        {grouped.length === 0 ? (
          <p className="text-base text-muted">Ningún insumo coincide con el filtro.</p>
        ) : (
          grouped.map((group) => (
            <section key={group.id}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="font-display text-2xl text-bone">{group.label}</h2>
                <Button
                  variant="secondary"
                  className="h-12 px-4 text-sm"
                  onClick={() => markCategory(group.id, "hay")}
                >
                  Todo Hay
                </Button>
              </div>
              <div className="space-y-3">
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
  const step = ing.unit === "kg" || ing.unit === "lt" ? 0.1 : 1;

  return (
    <Card className="p-4 [content-visibility:auto] [contain-intrinsic-size:auto_11rem]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-fg">{ing.name}</p>
          <p className="text-sm text-subtle">
            {ing.unitLabel}
            {ing.min > 0 ? ` · mín ${qty(ing.min)}` : ""}
          </p>
        </div>
        <Badge
          tone={
            ing.status === "hay"
              ? "ok"
              : ing.status === "bajo"
                ? "warn"
                : ing.status === "falta"
                  ? "crit"
                  : "muted"
          }
        >
          {STATUS_LABEL[ing.status]}
        </Badge>
      </div>
      <div className="mt-3">
        <StatusToggle value={ing.status} onChange={(s) => setStatus(ing.id, s)} />
      </div>
      <div className="mt-3 grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-2">
        <button
          type="button"
          aria-label="Quitar"
          className="flex size-14 items-center justify-center rounded-lg bg-raised text-fg shadow-[var(--shadow-border)]"
          onClick={() => setQty(ing.id, Math.max(0, roundQty(ing.stock - step)))}
        >
          <Minus className="size-6" />
        </button>
        <Input
          id={`qty-${ing.id}`}
          type="number"
          min="0"
          step={step}
          inputMode="decimal"
          className="h-14 text-center text-lg tabular"
          value={qty(ing.stock)}
          onChange={(e) => setQty(ing.id, Number(e.target.value))}
        />
        <button
          type="button"
          aria-label="Agregar"
          className="flex size-14 items-center justify-center rounded-lg bg-raised text-fg shadow-[var(--shadow-border)]"
          onClick={() => setQty(ing.id, roundQty(ing.stock + step))}
        >
          <Plus className="size-6" />
        </button>
      </div>
      <p className="mt-1 text-center text-sm text-subtle">{ing.unitLabel}</p>
    </Card>
  );
});

function roundQty(n: number) {
  return Math.round(n * 100) / 100;
}

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
        "min-h-20 rounded-xl px-1 py-3 text-center transition-colors duration-150",
        tone === "ok" && (active ? "bg-ok text-ok-fg" : "bg-ok/15 text-ok"),
        tone === "warn" && (active ? "bg-warn text-warn-fg" : "bg-warn/15 text-warn"),
        tone === "crit" && (active ? "bg-crit text-crit-fg" : "bg-crit/15 text-crit"),
        tone === "muted" &&
          (active ? "bg-raised text-bone" : "bg-card text-bone shadow-[var(--shadow-border)]"),
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 font-display text-3xl tabular leading-none">{value}</p>
    </button>
  );
}
