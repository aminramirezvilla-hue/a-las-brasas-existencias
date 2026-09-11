import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, NativeSelect } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KIND_LABEL, SABORES } from "@/lib/catalog";
import { money, pct, qtyUnit } from "@/lib/format";
import { recipeCost } from "@/lib/semaforo";
import { useInventory } from "@/lib/store";
import type { RecipeKind } from "@/lib/types";

export const Route = createFileRoute("/recetas")({ component: RecetasPage });

const KINDS: { id: RecipeKind | "all"; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "costilla", label: "Costillas" },
  { id: "corte", label: "Cortes" },
  { id: "pollo", label: "Alitas" },
  { id: "hamburguesa", label: "Hamburguesas" },
  { id: "hotdog", label: "Hot dog" },
  { id: "combo", label: "Paquetes" },
  { id: "taco", label: "Tacos" },
  { id: "entrada", label: "Entradas" },
  { id: "snack", label: "Snacks" },
  { id: "bebida", label: "Bebidas" },
  { id: "postre", label: "Postres" },
];

function RecetasPage() {
  const recipes = useInventory((s) => s.recipes);
  const ingredients = useInventory((s) => s.ingredients);
  const sellRecipe = useInventory((s) => s.sellRecipe);
  const encargado = useInventory((s) => s.restaurant.encargado);
  const [openId, setOpenId] = useState<string | null>(null);
  const [n, setN] = useState("1");
  const [kind, setKind] = useState<RecipeKind | "all">("all");
  const [q, setQ] = useState("");
  const [sabor, setSabor] = useState(SABORES[0]);
  const selected = recipes.find((r) => r.id === openId);
  const needsFlavor = selected?.kind === "pollo" || selected?.kind === "costilla";

  const rows = useMemo(() => {
    return recipes.filter((r) => {
      if (kind !== "all" && r.kind !== kind) return false;
      if (!q) return true;
      return `${r.name} ${r.desc ?? ""}`.toLowerCase().includes(q.toLowerCase());
    });
  }, [recipes, kind, q]);

  return (
    <AppShell>
      <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Recetas</p>
      <h1 className="mt-1 font-display text-3xl text-bone">Explosión de materiales</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Recetas de apoyo del menú de A las Brasas. No son el control diario: el turno se opera con
        Hay / Bajo / Falta. Aquí se puede descontar un platillo si se quiere.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Buscar costilla, alita, combo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <NativeSelect
          className="sm:w-52"
          value={kind}
          onChange={(e) => setKind(e.target.value as RecipeKind | "all")}
        >
          {KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKind(k.id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] uppercase tracking-wide ${
              kind === k.id ? "bg-ember text-ember-fg" : "bg-raised text-muted"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => {
          const cost = recipeCost(r.lines, ingredients);
          const margin = r.price ? (r.price - cost) / r.price : 0;
          const blocked = r.lines.some((line) => {
            const ing = ingredients.find((i) => i.id === line.ingredientId);
            return !ing || ing.stock < line.qty;
          });
          return (
            <button
              key={r.id}
              type="button"
              className="text-left"
              onClick={() => {
                setOpenId(r.id);
                setN("1");
                setSabor(SABORES[0]);
              }}
            >
              <Card className="h-full p-4 transition-transform duration-150 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-xl text-bone">{r.name}</h2>
                  <Badge tone={blocked ? "crit" : "muted"}>{KIND_LABEL[r.kind]}</Badge>
                </div>
                {r.desc ? <p className="mt-1 text-xs leading-relaxed text-muted">{r.desc}</p> : null}
                <p className="mt-3 font-display text-2xl tabular text-fg">{money(r.price)}</p>
                <p className="mt-1 text-xs text-muted">
                  Costo {money(cost, true)} · margen {pct(margin * 100)}
                  {blocked ? " · falta insumo" : ""}
                </p>
                <p className="mt-3 text-[11px] text-subtle">
                  {r.lines.length} {r.lines.length === 1 ? "insumo" : "insumos"} en receta
                </p>
              </Card>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-40 grid place-items-end bg-bg/70 p-4 md:place-items-center">
          <Card className="w-full max-w-md rounded-2xl p-5">
            <h2 className="font-display text-2xl text-bone">{selected.name}</h2>
            <p className="text-sm text-muted">
              Precio {money(selected.price)} · costo{" "}
              {money(recipeCost(selected.lines, ingredients), true)}
            </p>
            <ul className="mt-4 max-h-48 space-y-1.5 overflow-y-auto text-sm">
              {selected.lines.map((line, idx) => {
                const ing = ingredients.find((i) => i.id === line.ingredientId);
                const need = line.qty * Math.max(1, Number(n) || 1);
                const short = !ing || ing.stock < need;
                return (
                  <li key={`${line.ingredientId}-${idx}`} className="flex justify-between gap-3">
                    <span className={short ? "text-crit" : "text-fg"}>{ing?.name ?? line.ingredientId}</span>
                    <span className="tabular text-muted">
                      {ing ? qtyUnit(need, ing.unit, ing.unitLabel) : need}{" "}
                      <span className="text-subtle">/ {ing ? qtyUnit(ing.stock, ing.unit, ing.unitLabel) : "—"}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 grid gap-3">
              <div>
                <Label>Porciones a descontar</Label>
                <Input type="number" min="1" value={n} onChange={(e) => setN(e.target.value)} />
              </div>
              {needsFlavor ? (
                <div>
                  <Label>Sabor</Label>
                  <NativeSelect value={sabor} onChange={(e) => setSabor(e.target.value)}>
                    {SABORES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </NativeSelect>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  const res = sellRecipe(
                    selected.id,
                    Number(n) || 1,
                    encargado,
                    needsFlavor ? sabor : undefined,
                  );
                  if (res.ok) {
                    toast.success(res.message);
                    setOpenId(null);
                  } else toast.error(res.message);
                }}
              >
                Descontar del kardex
              </Button>
              <Button variant="outline" onClick={() => setOpenId(null)}>
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}
