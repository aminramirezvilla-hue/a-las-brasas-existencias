import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md bg-raised px-3 text-base text-fg shadow-[var(--shadow-border)] placeholder:text-subtle outline-none focus-visible:ring-2 focus-visible:ring-ember/70",
        className,
      )}
      {...props}
    />
  );
}

export function NativeSelect({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-md bg-raised px-3 text-base text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ember/70",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md bg-raised px-3 py-2.5 text-base text-fg shadow-[var(--shadow-border)] placeholder:text-subtle outline-none focus-visible:ring-2 focus-visible:ring-ember/70",
        className,
      )}
      {...props}
    />
  );
}
