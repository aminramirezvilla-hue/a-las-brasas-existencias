import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  Scale,
  ScrollText,
  Settings2,
  ShoppingBasket,
  UtensilsCrossed,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BrandMark } from "./mark";
import { cn } from "@/lib/cn";
import { useInventory } from "@/lib/store";
import { TURNO_LABEL } from "@/lib/catalog";

type AppPath =
  | "/"
  | "/carta"
  | "/panel"
  | "/inventario"
  | "/recetas"
  | "/kardex"
  | "/checklist"
  | "/conteo"
  | "/expediente"
  | "/setup";

const NAV: { to: AppPath; label: string; icon: LucideIcon }[] = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard },
  { to: "/inventario", label: "Inventario", icon: ShoppingBasket },
  { to: "/conteo", label: "Conteo", icon: Scale },
  { to: "/checklist", label: "Check", icon: ClipboardCheck },
  { to: "/expediente", label: "Acta", icon: BookOpen },
];

const MORE: { to: AppPath; label: string; icon: LucideIcon }[] = [
  { to: "/carta", label: "Carta", icon: UtensilsCrossed },
  { to: "/kardex", label: "Kardex", icon: ScrollText },
  { to: "/recetas", label: "Recetas", icon: UtensilsCrossed },
  { to: "/setup", label: "Sucursal", icon: Settings2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const restaurant = useInventory((s) => s.restaurant);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark className="size-9" />
            <div className="leading-tight">
              <div className="font-display text-[15px] uppercase tracking-wide text-bone">
                A las Brasas
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-subtle">Existencias</div>
            </div>
          </Link>
          <div className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} {...item} active={pathname === item.to} />
            ))}
            {MORE.map((item) => (
              <NavLink key={item.to} {...item} active={pathname === item.to} />
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            {!online ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-warn/12 px-2 py-1 text-[10px] text-warn">
                <WifiOff className="size-3" /> Offline
              </span>
            ) : (
              <span className="hidden rounded-full bg-ok/12 px-2 py-1 text-[10px] text-ok sm:inline">
                Local-first
              </span>
            )}
            <span className="hidden text-[11px] text-muted xl:inline">
              {restaurant.sucursal} · {TURNO_LABEL[restaurant.turno]}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:pb-12">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px]",
                  active ? "text-ember" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function NavLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: AppPath;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors duration-150",
        active ? "bg-raised text-fg" : "text-muted hover:text-fg",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </Link>
  );
}
