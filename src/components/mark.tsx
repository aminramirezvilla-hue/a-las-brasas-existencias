import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={asset("logo-brasas.jpg")}
      alt="A las Brasas"
      className={cn("rounded-md bg-black object-contain", className)}
    />
  );
}
