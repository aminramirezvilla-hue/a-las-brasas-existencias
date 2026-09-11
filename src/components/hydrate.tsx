import { useEffect, type ReactNode } from "react";
import { useInventory } from "@/lib/store";

export function HydrateGate({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useInventory.persist.rehydrate();
  }, []);
  return children;
}
