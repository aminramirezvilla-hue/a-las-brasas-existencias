import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/shell";
import { ProgressRing } from "@/components/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHECKLISTS, FUGAS, START_FIELDS } from "@/lib/catalog";
import { controlScore, scoreLevel } from "@/lib/semaforo";
import { getRun, useInventory } from "@/lib/store";
import type { CheckValue, ChecklistSectionId, StartNote } from "@/lib/types";

export const Route = createFileRoute("/checklist")({ component: ChecklistPage });

const SECTIONS: ChecklistSectionId[] = ["apertura", "servicio", "cierre"];

export function ChecklistPage() {
  const ingredients = useInventory((s) => s.ingredients);
  const checklists = useInventory((s) => s.checklists);
  const turno = useInventory((s) => s.restaurant.turno);
  const setCheck = useInventory((s) => s.setCheck);
  const setStart = useInventory((s) => s.setStart);
  const addIncident = useInventory((s) => s.addIncident);
  const run = getRun(checklists, turno);
  const score = controlScore(ingredients, run.checks);
  const [tab, setTab] = useState<ChecklistSectionId>("apertura");
  const section = CHECKLISTS[tab];
  const done = section.items.filter((i) => run.checks[i.id] && run.checks[i.id] !== "").length;

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Checklist de turno</p>
          <h1 className="mt-1 font-display text-3xl text-bone">Bitácora de cocina</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Tres bloques como en CATU: apertura, operación y cierre. Cada ítem tiene fundamento.
            Conforme / no conforme / no aplica.
          </p>
        </div>
        <ProgressRing pct={score.answeredPct} level={scoreLevel(score.answeredPct)} label="lleno" />
      </div>

      <div className="mt-6 flex gap-1 rounded-lg bg-card p-1 shadow-[var(--shadow-border)]">
        {SECTIONS.map((id) => {
          const s = CHECKLISTS[id];
          const n = s.items.filter((i) => run.checks[i.id] && run.checks[i.id] !== "").length;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`min-h-11 flex-1 rounded-md px-2 py-2 text-xs font-medium ${
                tab === id ? "bg-raised text-fg" : "text-muted"
              }`}
            >
              {s.title.split(" ")[0]}
              <span className="ml-1 text-subtle">
                {n}/{s.items.length}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted">{section.brief}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-subtle">
        {done}/{section.items.length} verificados
      </p>

      <ol className="mt-4 space-y-2">
        {section.items.map((item, idx) => (
          <li key={item.id} className="rounded-lg bg-card p-3 shadow-[var(--shadow-border)] sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <span className="font-display text-lg text-ember/70">{String(idx + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-fg">
                  {item.text}{" "}
                  {item.crit ? (
                    <Badge tone="crit" className="ml-1 align-middle">
                      crítico
                    </Badge>
                  ) : null}
                </p>
                <p className="mt-1 text-[11px] text-subtle">{item.fund}</p>
              </div>
              <NativeSelect
                className="sm:w-44"
                value={run.checks[item.id] ?? ""}
                onChange={(e) => setCheck(item.id, e.target.value as CheckValue)}
              >
                <option value="">Sin marcar</option>
                <option value="conforme">Conforme</option>
                <option value="no-conforme">No conforme</option>
                <option value="no-aplica">No aplica</option>
              </NativeSelect>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 font-display text-xl text-bone">S.T.A.R.T. del turno</h2>
      <p className="mt-1 text-sm text-muted">
        Misma narrativa que en reportes CATU. Úsala para un quiebre, una merma grave o un lote
        sospechoso.
      </p>
      <div className="mt-4 grid gap-3">
        {START_FIELDS.map((f) => (
          <div key={f.key}>
            <Label>
              {f.letter} · {f.name}
            </Label>
            <Textarea
              placeholder={f.help}
              value={run.start[f.key]}
              onChange={(e) => setStart({ [f.key]: e.target.value })}
            />
          </div>
        ))}
        <Button
          variant="secondary"
          onClick={() => {
            const filled = Object.values(run.start).filter(Boolean).length;
            if (filled < 3) {
              toast.error("Completa al menos Situación, Tiempo y Respuesta.");
              return;
            }
            addIncident("Incidente de turno", { ...run.start } as StartNote);
            toast.success("Incidente asentado en el expediente.");
          }}
        >
          Asentar incidente
        </Button>
      </div>

      <h2 className="mt-10 font-display text-xl text-bone">Seis fugas críticas</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {FUGAS.map((f) => (
          <Card key={f.id} className="p-4">
            <p className="text-sm font-medium text-fg">{f.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{f.text}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
