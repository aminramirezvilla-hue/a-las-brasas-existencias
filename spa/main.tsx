import { StrictMode } from "react";
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
import { Route as IndexRoute } from "@/routes/index";
import { Route as CartaRoute } from "@/routes/carta";
import { Route as ChecklistRoute } from "@/routes/checklist";
import { Route as ConteoRoute } from "@/routes/conteo";
import { Route as ExpedienteRoute } from "@/routes/expediente";
import { Route as InventarioRoute } from "@/routes/inventario";
import { Route as KardexRoute } from "@/routes/kardex";
import { Route as PanelRoute } from "@/routes/panel";
import { Route as RecetasRoute } from "@/routes/recetas";
import { Route as SetupRoute } from "@/routes/setup";
import "@/styles.css";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <HydrateGate>
        <Outlet />
      </HydrateGate>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{ className: "bg-card text-fg border-border" }}
      />
    </>
  ),
});

function page(path: string, component: unknown) {
  if (!component) throw new Error(`Falta componente para ${path}`);
  return createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: component as typeof rootRoute.options.component,
  });
}

const inventario = InventarioRoute.options.component;

const routeTree = rootRoute.addChildren([
  page("/", inventario),
  page("/inventario", inventario),
  page("/propuesta", IndexRoute.options.component),
  page("/carta", CartaRoute.options.component),
  page("/checklist", ChecklistRoute.options.component),
  page("/conteo", ConteoRoute.options.component),
  page("/expediente", ExpedienteRoute.options.component),
  page("/kardex", KardexRoute.options.component),
  page("/panel", PanelRoute.options.component),
  page("/recetas", RecetasRoute.options.component),
  page("/setup", SetupRoute.options.component),
]);

const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultErrorComponent: AppErrorComponent,
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
