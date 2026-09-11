import type { CheckValue, Ingredient, SemaforoLevel, StockStatus } from "./types";
import { CHECKLISTS } from "./catalog";

export function coverageDays(ing: Ingredient) {
  if (!ing.dailyUse) return Infinity;
  return ing.stock / ing.dailyUse;
}

export function stockLevel(ing: Ingredient): SemaforoLevel {
  if (ing.status === "falta" || ing.stock <= 0) return "empty";
  if (ing.status === "bajo") return "warn";
  if (ing.status === "hay") return "ok";
  if (ing.stock < ing.min) return "crit";
  if (ing.stock < ing.min * 1.2 || coverageDays(ing) < 1.5) return "warn";
  return "ok";
}

export function statusLevel(status: StockStatus): SemaforoLevel {
  if (status === "hay") return "ok";
  if (status === "bajo") return "warn";
  if (status === "falta") return "empty";
  return "crit";
}

export function existenceStats(ingredients: Ingredient[]) {
  const hay = ingredients.filter((i) => i.status === "hay").length;
  const bajo = ingredients.filter((i) => i.status === "bajo").length;
  const falta = ingredients.filter((i) => i.status === "falta").length;
  const pending = ingredients.filter((i) => !i.status).length;
  return { hay, bajo, falta, pending, total: ingredients.length };
}

export function levelLabel(level: SemaforoLevel) {
  switch (level) {
    case "ok":
      return "Hay";
    case "warn":
      return "Bajo";
    case "crit":
      return "Crítico";
    case "empty":
      return "Falta";
  }
}

export function scoreLevelLabel(level: SemaforoLevel) {
  switch (level) {
    case "ok":
      return "Óptimo";
    case "warn":
      return "En riesgo";
    case "crit":
      return "Crítico";
    case "empty":
      return "Quiebre";
  }
}

export function levelClass(level: SemaforoLevel) {
  switch (level) {
    case "ok":
      return "text-ok bg-ok/12";
    case "warn":
      return "text-warn bg-warn/12";
    case "crit":
      return "text-crit bg-crit/12";
    case "empty":
      return "text-fg bg-crit/25";
  }
}

export function controlScore(ingredients: Ingredient[], checks: Record<string, CheckValue>) {
  const items = Object.values(CHECKLISTS).flatMap((s) => s.items);
  const answered = items.filter((i) => checks[i.id] && checks[i.id] !== "").length;
  const conforme = items.filter((i) => checks[i.id] === "conforme" || checks[i.id] === "no-aplica").length;
  const checkPct = items.length ? (conforme / items.length) * 100 : 0;

  const stats = existenceStats(ingredients);
  const healthy = stats.hay + stats.bajo * 0.45;
  const stockPct = stats.total ? (healthy / stats.total) * 100 : 100;

  const answeredWeight = items.length ? answered / items.length : 0;
  const pct = Math.round(stockPct * 0.7 + checkPct * 0.3);
  return {
    pct,
    checkPct: Math.round(checkPct),
    stockPct: Math.round(stockPct),
    answeredPct: Math.round(answeredWeight * 100),
    level: scoreLevel(pct),
    stats,
  };
}

export function scoreLevel(pct: number): SemaforoLevel {
  if (pct >= 80) return "ok";
  if (pct >= 60) return "warn";
  if (pct >= 40) return "crit";
  return "empty";
}

export function recipeCost(
  lines: { ingredientId: string; qty: number }[],
  ingredients: Ingredient[],
) {
  return lines.reduce((sum, line) => {
    const ing = ingredients.find((i) => i.id === line.ingredientId);
    if (!ing) return sum;
    return sum + line.qty * ing.cost;
  }, 0);
}
