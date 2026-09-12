import { WHATSAPP } from "./catalog";
import type { InventoryState } from "./types";

export const TURNO_KIND = "brasas-turno";

export type TurnoSnapshot = Pick<
  InventoryState,
  "restaurant" | "ingredients" | "movements" | "checklists" | "incidents" | "setupDone"
>;

export type TurnoFile = {
  kind: typeof TURNO_KIND;
  version: 1;
  exportedAt: string;
  sucursal: string;
  encargado: string;
  turno: string;
  payload: TurnoSnapshot;
};

export function buildTurnoFile(state: TurnoSnapshot): TurnoFile {
  return {
    kind: TURNO_KIND,
    version: 1,
    exportedAt: new Date().toISOString(),
    sucursal: state.restaurant.sucursal,
    encargado: state.restaurant.encargado,
    turno: state.restaurant.turno,
    payload: {
      restaurant: state.restaurant,
      ingredients: state.ingredients,
      movements: state.movements,
      checklists: state.checklists,
      incidents: state.incidents,
      setupDone: state.setupDone,
    },
  };
}

export function parseTurnoFile(raw: string): TurnoFile | null {
  try {
    const data = JSON.parse(raw) as TurnoFile;
    if (data?.kind !== TURNO_KIND || data.version !== 1) return null;
    if (!data.payload?.ingredients || !Array.isArray(data.payload.ingredients)) return null;
    if (!data.payload.restaurant) return null;
    return data;
  } catch {
    return null;
  }
}

function fileName(state: TurnoSnapshot) {
  const day = new Date().toISOString().slice(0, 10);
  return `turno-brasas-${day}.json`;
}

export async function shareTurnoFile(state: TurnoSnapshot): Promise<"shared" | "downloaded"> {
  const payload = JSON.stringify(buildTurnoFile(state), null, 2);
  const name = fileName(state);
  const blob = new Blob([payload], { type: "application/json" });
  const file = new File([blob], name, { type: "application/json" });
  const text = `Turno A las Brasas · ${state.restaurant.encargado}\nAbre Acta → Cargar turno y elige este archivo.`;

  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  try {
    if (nav.share && (!nav.canShare || nav.canShare({ files: [file], text }))) {
      await nav.share({ files: [file], title: "Turno A las Brasas", text });
      return "shared";
    }
  } catch (err) {
    if ((err as DOMException)?.name === "AbortError") return "shared";
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text + "\n\nEl archivo se descargó en este teléfono. Adjúntalo en el chat.")}`;
  window.open(wa, "_blank", "noopener,noreferrer");
  return "downloaded";
}
