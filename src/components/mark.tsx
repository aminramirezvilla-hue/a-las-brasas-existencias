import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={asset("logo-brasas.jpg")}
      alt="A las Brasas"
      width={96}
      height={96}
      decoding="async"
      className={cn("rounded-md bg-black object-contain", className)}
    />
  );
}
