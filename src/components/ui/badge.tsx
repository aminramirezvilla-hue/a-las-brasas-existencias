import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "ok" | "warn" | "crit" | "ember";
}) {
  const tones = {
    muted: "bg-raised text-muted",
    ok: "bg-ok/12 text-ok",
    warn: "bg-warn/12 text-warn",
    crit: "bg-crit/15 text-crit",
    ember: "bg-ember/15 text-ember",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
