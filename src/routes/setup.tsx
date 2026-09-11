import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, NativeSelect } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TURNO_LABEL } from "@/lib/catalog";
import { useInventory } from "@/lib/store";
import type { Turno } from "@/lib/types";

export const Route = createFileRoute("/setup")({ component: SetupPage });

function SetupPage() {
  const restaurant = useInventory((s) => s.restaurant);
  const setRestaurant = useInventory((s) => s.setRestaurant);
  const markSetup = useInventory((s) => s.markSetup);
  const restoreDemo = useInventory((s) => s.restoreDemo);

  return (
    <AppShell>
      <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Sucursal</p>
      <h1 className="mt-1 font-display text-3xl text-bone">Ficha del establecimiento</h1>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Identifica la sucursal y el turno antes de operar. Los datos viven en este dispositivo.
      </p>

      <Card className="mt-6 max-w-lg p-5">
        <div className="grid gap-3">
          <div>
            <Label>Nombre</Label>
            <Input
              value={restaurant.name}
              onChange={(e) => setRestaurant({ name: e.target.value })}
            />
          </div>
          <div>
            <Label>Ciudad / plaza</Label>
            <Input
              value={restaurant.sucursal}
              onChange={(e) => setRestaurant({ sucursal: e.target.value })}
            />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input
              value={restaurant.address}
              onChange={(e) => setRestaurant({ address: e.target.value })}
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input
              value={restaurant.phone}
              onChange={(e) => setRestaurant({ phone: e.target.value })}
            />
          </div>
          <div>
            <Label>Encargado de turno</Label>
            <Input
              value={restaurant.encargado}
              onChange={(e) => setRestaurant({ encargado: e.target.value })}
            />
          </div>
          <div>
            <Label>Turno activo</Label>
            <NativeSelect
              value={restaurant.turno}
              onChange={(e) => setRestaurant({ turno: e.target.value as Turno })}
            >
              {(Object.keys(TURNO_LABEL) as Turno[]).map((t) => (
                <option key={t} value={t}>
                  {TURNO_LABEL[t]}
                </option>
              ))}
            </NativeSelect>
          </div>
          <Button
            onClick={() => {
              markSetup();
              toast.success("Ficha de A las Brasas guardada en este dispositivo.");
            }}
          >
            Guardar ficha
          </Button>
        </div>
      </Card>

      <Card className="mt-4 max-w-lg p-5">
        <h2 className="font-display text-lg text-bone">Datos de demostración</h2>
        <p className="mt-1 text-sm text-muted">
          Restaura A las Brasas (Col. Viguri) con el listado de insumos y existencias de ejemplo.
          Solo afecta este dispositivo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => restoreDemo()}>
            Restaurar demo
          </Button>
          <Link to="/">
            <Button variant="ghost">Volver a la propuesta</Button>
          </Link>
        </div>
      </Card>
    </AppShell>
  );
}
