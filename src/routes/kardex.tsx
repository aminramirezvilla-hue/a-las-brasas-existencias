import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Input, NativeSelect } from "@/components/ui/input";
import { MOVEMENT_LABEL } from "@/lib/catalog";
import { prettyDate, qty } from "@/lib/format";
import { useInventory } from "@/lib/store";
import type { MovementType } from "@/lib/types";

export const Route = createFileRoute("/kardex")({ component: KardexPage });

const TONES: Record<MovementType, "ok" | "warn" | "crit" | "ember" | "muted"> = {
  entrada: "ok",
  consumo: "ember",
  merma: "crit",
  ajuste: "warn",
  conteo: "muted",
};

function KardexPage() {
  const movements = useInventory((s) => s.movements);
  const ingredients = useInventory((s) => s.ingredients);
  const [type, setType] = useState<MovementType | "all">("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    return movements.filter((m) => {
      if (type !== "all" && m.type !== type) return false;
      if (!q) return true;
      const ing = ingredients.find((i) => i.id === m.ingredientId);
      const hay = `${ing?.name ?? ""} ${m.ref} ${m.reason}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [movements, type, q, ingredients]);

  return (
    <AppShell>
      <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Kardex</p>
      <h1 className="mt-1 font-display text-3xl text-bone">Bitácora de movimientos</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Folio continuo. No se borra: cada recepción, consumo, merma o conteo deja saldo. Es la
        bitácora del almacén.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Buscar insumo, folio, motivo…" value={q} onChange={(e) => setQ(e.target.value)} />
        <NativeSelect
          className="sm:w-48"
          value={type}
          onChange={(e) => setType(e.target.value as MovementType | "all")}
        >
          <option value="all">Todos</option>
          {Object.entries(MOVEMENT_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </NativeSelect>
      </div>

      <ol className="mt-5 space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted">Sin movimientos con ese filtro.</p>
        ) : (
          rows.map((m) => {
            const ing = ingredients.find((i) => i.id === m.ingredientId);
            return (
              <li
                key={m.id}
                className="rounded-lg bg-card px-4 py-3 shadow-[var(--shadow-border)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge tone={TONES[m.type]}>{MOVEMENT_LABEL[m.type]}</Badge>
                    <span className="text-sm text-fg">{ing?.name ?? m.ingredientId}</span>
                  </div>
                  <span className="text-[11px] text-subtle">{prettyDate(m.at)}</span>
                </div>
                <p className="mt-1.5 text-sm text-muted">
                  <span className="tabular text-fg">
                    {m.type === "entrada" ? "+" : "−"}
                    {qty(m.qty)} {ing?.unit}
                  </span>
                  {" · "}
                  {m.reason}
                  {m.ref ? ` · ${m.ref}` : ""}
                </p>
                <p className="mt-0.5 text-[11px] text-subtle">
                  Saldo {qty(m.balance)} {ing?.unit} · {m.actor}
                </p>
              </li>
            );
          })
        )}
      </ol>
    </AppShell>
  );
}
