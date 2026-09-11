import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, Flame, Scale, ShoppingBasket } from "lucide-react";
import { AppShell } from "@/components/shell";
import { ProgressRing } from "@/components/progress-ring";
import { SemaforoChip } from "@/components/semaforo-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { STATUS_LABEL, TURNO_LABEL } from "@/lib/catalog";
import { qty } from "@/lib/format";
import { controlScore, existenceStats, scoreLevelLabel } from "@/lib/semaforo";
import { getRun, useInventory } from "@/lib/store";

export const Route = createFileRoute("/panel")({ component: PanelPage });

function PanelPage() {
  const restaurant = useInventory((s) => s.restaurant);
  const ingredients = useInventory((s) => s.ingredients);
  const checklists = useInventory((s) => s.checklists);
  const run = getRun(checklists, restaurant.turno);
  const score = controlScore(ingredients, run.checks);
  const stats = existenceStats(ingredients);
  const alerts = ingredients.filter((i) => i.status === "falta" || i.status === "bajo");

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Panel de control</p>
          <h1 className="mt-1 font-display text-3xl tracking-[-0.02em] text-bone">
            {restaurant.name}
          </h1>
          <p className="text-sm text-muted">
            {restaurant.sucursal} · {TURNO_LABEL[restaurant.turno]} · {restaurant.encargado}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/inventario">Revisar existencias</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[auto_1fr]">
        <Card className="flex items-center gap-5 p-5">
          <ProgressRing pct={score.pct} level={score.level} label="control" sub="turno" />
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <SemaforoChip level={score.level} label={scoreLevelLabel(score.level)} />
              <span className="text-muted">nivel del turno</span>
            </div>
            <p className="text-muted">
              Hay {stats.hay} · Bajo {stats.bajo} · Falta {stats.falta}
            </p>
            <p className="text-xs text-subtle">
              Misma escala CATU: óptimo ≥ 80, en riesgo ≥ 60, crítico ≥ 40.
            </p>
          </div>
        </Card>
        <div className="grid gap-3 sm:grid-cols-3">
          <Kpi label="Hay existencia" value={String(stats.hay)} hint={`de ${stats.total} insumos`} />
          <Kpi label="Bajo mínimo" value={String(stats.bajo)} hint="pedir hoy" />
          <Kpi label="Faltantes" value={String(stats.falta)} hint="no se venden" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Quick to="/inventario" icon={ShoppingBasket} title="Marcar existencias" text="Hay, Bajo o Falta por insumo." />
        <Quick to="/conteo" icon={Scale} title="Conteo físico" text="Cantidad opcional por rubro." />
        <Quick to="/checklist" icon={ClipboardCheck} title="Checklist de turno" text="Apertura, servicio y cierre." />
        <Quick to="/expediente" icon={Flame} title="Acta del turno" text="Exportar faltantes e inventario." />
      </div>

      <h2 className="mt-8 font-display text-xl text-bone">Atención ahora</h2>
      {alerts.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Todos los insumos están en Hay. Listo para servicio.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {alerts.map((ing) => (
            <Card key={ing.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-sm text-fg">{ing.name}</p>
                <p className="text-[11px] text-subtle">
                  {qty(ing.stock)} {ing.unitLabel}
                  {ing.min > 0 ? ` · mín ${qty(ing.min)}` : ""}
                </p>
              </div>
              <Badge tone={ing.status === "falta" ? "crit" : "warn"}>
                {STATUS_LABEL[ing.status]}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</p>
      <p className="mt-2 font-display text-2xl tabular text-bone">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Card>
  );
}

function Quick({
  to,
  icon: Icon,
  title,
  text,
}: {
  to: "/inventario" | "/conteo" | "/checklist" | "/expediente";
  icon: typeof Flame;
  title: string;
  text: string;
}) {
  return (
    <Link to={to} className="block">
      <Card className="flex h-full items-start gap-3 p-4 transition-transform duration-150 hover:-translate-y-0.5">
        <span className="grid size-10 place-items-center rounded-md bg-raised text-ember">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-fg">{title}</p>
            <ArrowRight className="size-3.5 text-subtle" />
          </div>
          <p className="mt-0.5 text-xs text-muted">{text}</p>
        </div>
      </Card>
    </Link>
  );
}
