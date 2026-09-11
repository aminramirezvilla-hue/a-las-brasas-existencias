import { Badge } from "./ui/badge";
import { levelLabel } from "@/lib/semaforo";
import type { SemaforoLevel } from "@/lib/types";

const tone: Record<SemaforoLevel, "ok" | "warn" | "crit" | "muted"> = {
  ok: "ok",
  warn: "warn",
  crit: "crit",
  empty: "crit",
};

export function SemaforoChip({ level, label }: { level: SemaforoLevel; label?: string }) {
  return <Badge tone={tone[level]}>{label ?? levelLabel(level)}</Badge>;
}
