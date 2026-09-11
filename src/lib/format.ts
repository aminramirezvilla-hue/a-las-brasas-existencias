import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Unit } from "./types";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const mxnDec = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(n: number, decimals = false) {
  return (decimals ? mxnDec : mxn).format(Number.isFinite(n) ? n : 0);
}

export function qty(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "0";
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(digits).replace(/\.?0+$/, "");
}

export function qtyUnit(n: number, unit: Unit, unitLabel?: string) {
  return `${qty(n)} ${unitLabel ?? unit}`;
}

export function pct(n: number) {
  if (!Number.isFinite(n)) return "0%";
  return `${Math.round(n)}%`;
}

export function dayKey(d = new Date()) {
  return format(d, "yyyy-MM-dd");
}

export function prettyDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, "d MMM yyyy · HH:mm", { locale: es });
}

export function prettyDay(iso: string) {
  const d = iso.length <= 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, "EEEE d 'de' MMMM", { locale: es });
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}
