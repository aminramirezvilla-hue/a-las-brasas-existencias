import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { HydrateGate } from "@/components/hydrate";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "A las Brasas";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#171411" },
      {
        name: "description",
        content:
          "Control de existencias y faltantes de A las Brasas. Chilpancingo, Guerrero. PWA local-first.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&family=Oswald:wght@600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <HydrateGate>
            <Outlet />
          </HydrateGate>
        </AuthProvider>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            className: "bg-card text-fg border-border",
          }}
        />
        <Scripts />
      </body>
    </html>
  ),
});
