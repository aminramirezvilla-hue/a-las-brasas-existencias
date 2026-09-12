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
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BrandMark } from "./mark";
import { cn } from "@/lib/cn";
import { TURNO_LABEL } from "@/lib/catalog";
import { useInventory } from "@/lib/store";

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
  { to: "/carta", label: "Carta / menú", icon: UtensilsCrossed },
  { to: "/recetas", label: "Recetas", icon: UtensilsCrossed },
  { to: "/kardex", label: "Kardex", icon: ScrollText },
  { to: "/setup", label: "Sucursal", icon: Settings2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const restaurant = useInventory((s) => s.restaurant);
  const [online, setOnline] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);

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

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <BrandMark className="size-10" />
            <div className="leading-tight">
              <div className="font-display text-base uppercase tracking-wide text-bone">
                A las Brasas
              </div>
              <div className="text-xs uppercase tracking-widest text-subtle">Existencias</div>
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
              <span className="inline-flex items-center gap-1 rounded-full bg-warn/20 px-2.5 py-1.5 text-xs font-semibold text-warn">
                <WifiOff className="size-4" /> Offline
              </span>
            ) : null}
            <span className="hidden text-sm text-muted xl:inline">
              {restaurant.sucursal} · {TURNO_LABEL[restaurant.turno]}
            </span>
            <button
              type="button"
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-raised px-4 text-sm font-semibold uppercase tracking-wide text-fg shadow-[var(--shadow-border)] lg:hidden"
              onClick={() => setMoreOpen(true)}
            >
              Más
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-5 md:pb-12">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5 gap-1 px-1.5 pt-1.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold",
                  active ? "bg-ember text-ember-fg" : "text-muted",
                )}
              >
                <Icon className="size-6" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/70"
            aria-label="Cerrar"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-surface px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 shadow-[var(--shadow-border)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm uppercase tracking-widest text-muted">
                Más secciones
              </p>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-full bg-raised text-fg"
                onClick={() => setMoreOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MORE.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex min-h-16 items-center gap-3 rounded-xl bg-card px-4 text-base font-semibold text-fg shadow-[var(--shadow-border)]"
                  >
                    <Icon className="size-5 text-ember" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
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
        "inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors duration-150",
        active ? "bg-ember text-ember-fg" : "text-muted hover:text-fg",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
