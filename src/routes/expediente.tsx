import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CHECKLISTS, FUGAS, STATUS_LABEL, TURNO_LABEL } from "@/lib/catalog";
import { buildExpediente, downloadText } from "@/lib/export-kardex";
import { prettyDate, qty } from "@/lib/format";
import { controlScore, existenceStats, scoreLevelLabel } from "@/lib/semaforo";
import { getRun, useInventory } from "@/lib/store";

export const Route = createFileRoute("/expediente")({ component: ExpedientePage });

export function ExpedientePage() {
  const restaurant = useInventory((s) => s.restaurant);
  const ingredients = useInventory((s) => s.ingredients);
  const recipes = useInventory((s) => s.recipes);
  const movements = useInventory((s) => s.movements);
  const checklists = useInventory((s) => s.checklists);
  const incidents = useInventory((s) => s.incidents);
  const setupDone = useInventory((s) => s.setupDone);
  const run = getRun(checklists, restaurant.turno);
  const score = controlScore(ingredients, run.checks);
  const stats = existenceStats(ingredients);
  const slug = restaurant.name.toLowerCase().replace(/\s+/g, "_");
  const falta = ingredients.filter((i) => i.status === "falta");
  const bajo = ingredients.filter((i) => i.status === "bajo");

  return (
    <AppShell>
      <div className="no-print flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Expediente</p>
          <h1 className="mt-1 font-display text-3xl text-bone">Acta de existencias</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Resumen imprimible al estilo del export CATU: faltantes, bajos y listado del turno.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              downloadText(
                `existencias_brasas_${slug}.txt`,
                buildExpediente({
                  restaurant,
                  ingredients,
                  recipes,
                  movements,
                  checklists,
                  incidents,
                  setupDone,
                }),
              )
            }
          >
            <Download />
            Descargar
          </Button>
          <Button onClick={() => window.print()}>
            <Printer />
            Imprimir
          </Button>
        </div>
      </div>

      <Card className="mt-6 p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ember">A las Brasas</p>
        <h2 className="mt-2 font-display text-3xl text-bone">{restaurant.name}</h2>
        <p className="text-sm text-muted">
          {restaurant.address} · {restaurant.sucursal} · {TURNO_LABEL[restaurant.turno]} · {restaurant.encargado}
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <span>
            Control <strong className="tabular text-fg">{score.pct}%</strong> · {scoreLevelLabel(score.level)}
          </span>
          <span>
            Hay <strong className="tabular text-fg">{stats.hay}</strong>
          </span>
          <span>
            Bajo <strong className="tabular text-fg">{stats.bajo}</strong>
          </span>
          <span>
            Falta <strong className="tabular text-fg">{stats.falta}</strong>
          </span>
        </div>

        <h3 className="mt-8 font-display text-xl text-bone">Faltantes</h3>
        {falta.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Ningún insumo en Falta.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {falta.map((ing) => (
              <li key={ing.id} className="flex flex-wrap items-center gap-2">
                <Badge tone="crit">Falta</Badge>
                <span>
                  {ing.name} · {ing.unitLabel}
                </span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-8 font-display text-xl text-bone">Bajo mínimo</h3>
        {bajo.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Ningún insumo en Bajo.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {bajo.map((ing) => (
              <li key={ing.id} className="flex flex-wrap items-center gap-2">
                <Badge tone="warn">Bajo</Badge>
                <span>
                  {ing.name} · {qty(ing.stock)} {ing.unitLabel} / mín {qty(ing.min)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-8 font-display text-xl text-bone">Listado del turno</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {ingredients.map((ing) => (
            <li key={ing.id}>
              [{STATUS_LABEL[ing.status]}] {ing.name} · {qty(ing.stock)} {ing.unitLabel}
            </li>
          ))}
        </ul>

        <h3 className="mt-8 font-display text-xl text-bone">Checklist</h3>
        {Object.values(CHECKLISTS).map((section) => (
          <div key={section.title} className="mt-3">
            <p className="text-xs uppercase tracking-[0.16em] text-subtle">{section.title}</p>
            <ul className="mt-1 space-y-1 text-sm text-muted">
              {section.items.map((item) => (
                <li key={item.id}>
                  [{run.checks[item.id] || " "}] {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {movements.length > 0 ? (
          <>
            <h3 className="mt-8 font-display text-xl text-bone">Movimientos recientes</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {movements.slice(0, 12).map((m) => {
                const ing = ingredients.find((i) => i.id === m.ingredientId);
                return (
                  <li key={m.id}>
                    {prettyDate(m.at)} · {ing?.name} · {m.qty} {ing?.unitLabel} · {m.ref}
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}

        <h3 className="mt-8 font-display text-xl text-bone">Fugas a vigilar</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          {FUGAS.map((f) => (
            <li key={f.id}>
              <span className="text-fg">{f.title}.</span> {f.text}
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}
