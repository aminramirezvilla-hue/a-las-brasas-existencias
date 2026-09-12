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
    ok: "bg-ok text-ok-fg",
    warn: "bg-warn text-warn-fg",
    crit: "bg-crit text-crit-fg",
    ember: "bg-ember text-ember-fg",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
