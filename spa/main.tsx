import { StrictMode, Suspense, lazy, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { HydrateGate } from "@/components/hydrate";
import { AppErrorComponent } from "@/lib/error-component";
import { Toaster } from "sonner";
import { InventarioPage } from "@/routes/inventario";
import "@/styles.css";

const ProposalPage = lazy(() => import("@/routes/index").then((m) => ({ default: m.Proposal })));
const CartaPage = lazy(() => import("@/routes/carta").then((m) => ({ default: m.CartaPage })));
const ChecklistPage = lazy(() => import("@/routes/checklist").then((m) => ({ default: m.ChecklistPage })));
const ConteoPage = lazy(() => import("@/routes/conteo").then((m) => ({ default: m.ConteoPage })));
const ExpedientePage = lazy(() => import("@/routes/expediente").then((m) => ({ default: m.ExpedientePage })));
const KardexPage = lazy(() => import("@/routes/kardex").then((m) => ({ default: m.KardexPage })));
const PanelPage = lazy(() => import("@/routes/panel").then((m) => ({ default: m.PanelPage })));
const RecetasPage = lazy(() => import("@/routes/recetas").then((m) => ({ default: m.RecetasPage })));
const SetupPage = lazy(() => import("@/routes/setup").then((m) => ({ default: m.SetupPage })));

function Boot() {
  return (
    <p className="bg-bg p-8 text-[11px] uppercase tracking-[0.22em] text-muted">
      A las Brasas · existencias
    </p>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<Boot />}>
      <HydrateGate>
        <Outlet />
      </HydrateGate>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{ className: "bg-card text-fg border-border" }}
      />
    </Suspense>
  ),
});

function page(path: string, component: ComponentType) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path,
    component,
  });
}

const routeTree = rootRoute.addChildren([
  page("/", InventarioPage),
  page("/inventario", InventarioPage),
  page("/propuesta", ProposalPage),
  page("/carta", CartaPage),
  page("/checklist", ChecklistPage),
  page("/conteo", ConteoPage),
  page("/expediente", ExpedientePage),
  page("/kardex", KardexPage),
  page("/panel", PanelPage),
  page("/recetas", RecetasPage),
  page("/setup", SetupPage),
]);

const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultErrorComponent: AppErrorComponent,
  defaultPreload: "intent",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const url = `${import.meta.env.BASE_URL}sw.js`;
    void navigator.serviceWorker.register(url, { scope: import.meta.env.BASE_URL });
  });
}
