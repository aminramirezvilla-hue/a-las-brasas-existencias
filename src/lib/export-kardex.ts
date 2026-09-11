import { CHECKLISTS, FUGAS, MOVEMENT_LABEL, STATUS_LABEL, TURNO_LABEL } from "./catalog";
import { money, prettyDate, qty } from "./format";
import { controlScore, existenceStats, scoreLevelLabel } from "./semaforo";
import type { InventoryState } from "./types";

export function buildExpediente(state: InventoryState) {
  const day = new Date().toISOString().slice(0, 10);
  const run = state.checklists[`${day}:${state.restaurant.turno}`];
  const checks = run?.checks ?? {};
  const score = controlScore(state.ingredients, checks);
  const stats = existenceStats(state.ingredients);
  const falta = state.ingredients.filter((i) => i.status === "falta");
  const bajo = state.ingredients.filter((i) => i.status === "bajo");

  const lines: string[] = [];
  lines.push(`A LAS BRASAS · ACTA DE EXISTENCIAS Y FALTANTES`);
  lines.push(`${state.restaurant.name} · ${state.restaurant.sucursal}`);
  lines.push(`${state.restaurant.address} · WhatsApp ${state.restaurant.phone}`);
  lines.push(`Encargado: ${state.restaurant.encargado} · Turno ${TURNO_LABEL[state.restaurant.turno]}`);
  lines.push(`Emitido: ${prettyDate(new Date().toISOString())}`);
  lines.push("");
  lines.push(`NIVEL DE CONTROL: ${score.pct}% · ${scoreLevelLabel(score.level)}`);
  lines.push(`Hay ${stats.hay} · Bajo ${stats.bajo} · Falta ${stats.falta} · Total ${stats.total}`);
  lines.push(`Checklist de turno: ${score.checkPct}%`);
  lines.push("");
  lines.push("— FALTANTES (pedir ahora) —");
  if (!falta.length) lines.push("(ninguno)");
  for (const ing of falta) {
    lines.push(`[FALTA] ${ing.name} · ${ing.unitLabel} · mín ${qty(ing.min)}`);
  }
  lines.push("");
  lines.push("— BAJO MÍNIMO (pedir hoy) —");
  if (!bajo.length) lines.push("(ninguno)");
  for (const ing of bajo) {
    lines.push(`[BAJO] ${ing.name}: ${qty(ing.stock)} ${ing.unitLabel} / mín ${qty(ing.min)}`);
  }
  lines.push("");
  lines.push("— LISTADO COMPLETO —");
  for (const ing of state.ingredients) {
    lines.push(
      `[${STATUS_LABEL[ing.status]}] ${ing.name}: ${qty(ing.stock)} ${ing.unitLabel}`,
    );
  }
  lines.push("");
  lines.push("— CHECKLIST DE TURNO —");
  for (const section of Object.values(CHECKLISTS)) {
    lines.push(`# ${section.title}`);
    for (const item of section.items) {
      const v = checks[item.id] || "sin marcar";
      lines.push(`  [${v}] ${item.text} (${item.fund})`);
    }
  }
  if (run?.start && Object.values(run.start).some(Boolean)) {
    lines.push("");
    lines.push("— S.T.A.R.T. DEL TURNO —");
    lines.push(`S  ${run.start.s}`);
    lines.push(`T  ${run.start.t}`);
    lines.push(`A  ${run.start.a}`);
    lines.push(`R  ${run.start.r}`);
    lines.push(`X  ${run.start.x}`);
  }
  if (state.movements.length) {
    lines.push("");
    lines.push("— MOVIMIENTOS (últimos 40) —");
    for (const m of state.movements.slice(0, 40)) {
      const ing = state.ingredients.find((i) => i.id === m.ingredientId);
      lines.push(
        `${prettyDate(m.at)} · ${MOVEMENT_LABEL[m.type]} · ${ing?.name ?? m.ingredientId} · ${m.qty} ${ing?.unitLabel ?? ""} · ${m.reason} · ${m.ref}`,
      );
    }
  }
  lines.push("");
  lines.push("— SEIS FUGAS CRÍTICAS (control preventivo) —");
  for (const f of FUGAS) {
    lines.push(`${f.title}: ${f.text}`);
  }
  lines.push("");
  lines.push("Arquitectura: mismo patrón que CATU Checklist Bitácora de Obra (estado único, PWA local-first, semáforo, S.T.A.R.T., expediente exportable).");
  lines.push("Este documento es control operativo de existencias de A las Brasas. No sustituye el kardex contable ni la bitácora sanitaria NOM-251.");
  return lines.join("\n");
}

export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
