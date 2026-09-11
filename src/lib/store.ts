import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ADDRESS_LINE, CHECKLISTS, CITY_LINE, SEED_INGREDIENTS, SEED_RECIPES } from "./catalog";
import { dayKey, uid } from "./format";
import type {
  Category,
  CheckValue,
  ChecklistRun,
  Ingredient,
  InventoryState,
  Movement,
  MovementType,
  Restaurant,
  StartNote,
  StockStatus,
  Turno,
} from "./types";

const emptyStart = (): StartNote => ({ s: "", t: "", a: "", r: "", x: "" });

export function emptyChecks(): Record<string, CheckValue> {
  const checks: Record<string, CheckValue> = {};
  for (const section of Object.values(CHECKLISTS)) {
    for (const item of section.items) checks[item.id] = "";
  }
  return checks;
}

export function runKey(date: string, turno: Turno) {
  return `${date}:${turno}`;
}

export function getRun(checklists: Record<string, ChecklistRun>, turno: Turno): ChecklistRun {
  const key = runKey(dayKey(), turno);
  return (
    checklists[key] ?? {
      date: dayKey(),
      turno,
      checks: emptyChecks(),
      start: emptyStart(),
      updatedAt: "",
    }
  );
}

function cloneIngredients(): Ingredient[] {
  return SEED_INGREDIENTS.map((i) => ({ ...i }));
}

function deriveStatus(stock: number, min: number): StockStatus {
  if (stock <= 0) return "falta";
  if (stock < min) return "bajo";
  return "hay";
}

function seedMovements(ingredients: Ingredient[]): Movement[] {
  const now = Date.now();
  const actor = "Cocina · turno anterior";
  const rows: Omit<Movement, "balance">[] = [
    { id: uid("m"), at: new Date(now - 36e5 * 9).toISOString(), type: "entrada", ingredientId: "cos", qty: 10, reason: "Recepción Carnes del Sur", ref: "REM-441", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 8.5).toISOString(), type: "entrada", ingredientId: "arr", qty: 8, reason: "Recepción Carnes del Sur", ref: "REM-441", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 8).toISOString(), type: "entrada", ingredientId: "ali", qty: 16, reason: "Recepción avícola", ref: "REM-442", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 6).toISOString(), type: "consumo", ingredientId: "cos", qty: 2.5, reason: "Comanda receta", ref: "1 kg de costillas × 2 · BBQ", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 5).toISOString(), type: "consumo", ingredientId: "ham", qty: 8, reason: "Comanda receta", ref: "Hamburguesa sencilla × 8", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 4.5).toISOString(), type: "consumo", ingredientId: "ali", qty: 4, reason: "Comanda receta", ref: "Alitas 12 piezas × 2 · búfalo", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 4).toISOString(), type: "merma", ingredientId: "cos", qty: 0.35, reason: "Recorte y limpieza del corte", ref: "MER-08", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 2.5).toISOString(), type: "entrada", ingredientId: "hei", qty: 24, reason: "Recepción de barra", ref: "REM-118", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 2).toISOString(), type: "merma", ingredientId: "gua", qty: 1, reason: "Caducidad / pérdida de cadena de frío", ref: "MER-09", actor },
    { id: uid("m"), at: new Date(now - 36e5 * 1.2).toISOString(), type: "consumo", ingredientId: "pfr", qty: 1, reason: "Comanda receta", ref: "Papas a la francesa × 12", actor },
  ];
  const stockMap = Object.fromEntries(ingredients.map((i) => [i.id, i.stock]));
  const chronological = [...rows].sort((a, b) => a.at.localeCompare(b.at));
  return chronological.map((m) => ({
    ...m,
    balance: stockMap[m.ingredientId] ?? 0,
  }));
}

function initialState(): InventoryState {
  const ingredients = cloneIngredients();
  return {
    restaurant: {
      name: "A las Brasas",
      sucursal: CITY_LINE,
      address: ADDRESS_LINE,
      phone: "747 155 7796",
      encargado: "Encargado de parrilla",
      turno: "vespertino",
    },
    ingredients,
    recipes: SEED_RECIPES.map((r) => ({ ...r, lines: r.lines.map((l) => ({ ...l })) })),
    movements: seedMovements(ingredients),
    checklists: {},
    incidents: [],
    setupDone: false,
  };
}

type Actions = {
  setRestaurant: (patch: Partial<Restaurant>) => void;
  markSetup: () => void;
  restoreDemo: () => void;
  setStatus: (ingredientId: string, status: StockStatus) => void;
  setQty: (ingredientId: string, qty: number) => void;
  markCategory: (category: Category | "all", status: StockStatus) => void;
  applyMovement: (input: {
    type: MovementType;
    ingredientId: string;
    qty: number;
    reason: string;
    ref: string;
    actor: string;
    setTo?: number;
  }) => { ok: boolean; message: string };
  sellRecipe: (
    recipeId: string,
    portions: number,
    actor: string,
    note?: string,
  ) => { ok: boolean; message: string };
  applyCount: (counts: Record<string, number>, actor: string) => { ok: boolean; message: string };
  setCheck: (itemId: string, value: CheckValue) => void;
  setStart: (patch: Partial<StartNote>) => void;
  addIncident: (title: string, start: StartNote) => void;
};

function applyQty(ing: Ingredient, type: MovementType, qty: number, setTo?: number) {
  if (type === "conteo" || type === "ajuste") {
    const next = setTo ?? qty;
    return { next, delta: next - ing.stock };
  }
  if (type === "entrada") return { next: ing.stock + qty, delta: qty };
  return { next: ing.stock - qty, delta: -qty };
}

function withStatus(ing: Ingredient, stock: number, status?: StockStatus): Ingredient {
  const next = Math.round(Math.max(0, stock) * 100) / 100;
  return { ...ing, stock: next, status: status ?? deriveStatus(next, ing.min) };
}

export const useInventory = create<InventoryState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState(),

      setRestaurant: (patch) =>
        set((s) => ({ restaurant: { ...s.restaurant, ...patch } })),

      markSetup: () => set({ setupDone: true }),

      restoreDemo: () => set({ ...initialState() }),

      setStatus: (ingredientId, status) => {
        set((s) => ({
          ingredients: s.ingredients.map((ing) => {
            if (ing.id !== ingredientId) return ing;
            let stock = ing.stock;
            if (status === "falta") stock = 0;
            else if (status === "hay" && stock <= 0) stock = Math.max(ing.min, 1);
            else if (status === "bajo" && stock <= 0) {
              stock = Math.max(1, Math.round(ing.min * 0.5 * 10) / 10);
            }
            return withStatus(ing, stock, status);
          }),
        }));
      },

      setQty: (ingredientId, qty) => {
        const next = Math.max(0, qty);
        set((s) => ({
          ingredients: s.ingredients.map((ing) =>
            ing.id === ingredientId ? withStatus(ing, next) : ing,
          ),
        }));
      },

      markCategory: (category, status) => {
        set((s) => ({
          ingredients: s.ingredients.map((ing) => {
            if (category !== "all" && ing.category !== category) return ing;
            let stock = ing.stock;
            if (status === "falta") stock = 0;
            else if (status === "hay" && stock <= 0) stock = Math.max(ing.min, 1);
            else if (status === "bajo" && stock <= 0) {
              stock = Math.max(1, Math.round(ing.min * 0.5 * 10) / 10);
            }
            return withStatus(ing, stock, status);
          }),
        }));
      },

      applyMovement: ({ type, ingredientId, qty, reason, ref, actor, setTo }) => {
        if (!qty && type !== "conteo" && type !== "ajuste") {
          return { ok: false, message: "Indica una cantidad." };
        }
        const state = get();
        const idx = state.ingredients.findIndex((i) => i.id === ingredientId);
        if (idx < 0) return { ok: false, message: "Insumo no encontrado." };
        const ing = state.ingredients[idx];
        const { next, delta } = applyQty(ing, type, qty, type === "ajuste" ? qty : setTo);
        if (next < 0) {
          return {
            ok: false,
            message: `Stock insuficiente de ${ing.name}. Hay ${ing.stock} ${ing.unitLabel}.`,
          };
        }
        const movement: Movement = {
          id: uid("m"),
          at: new Date().toISOString(),
          type,
          ingredientId,
          qty: Math.abs(type === "conteo" || type === "ajuste" ? delta : qty),
          reason,
          ref: ref || (type === "entrada" ? "REM" : "MOV"),
          actor,
          balance: next,
        };
        const ingredients = state.ingredients.slice();
        ingredients[idx] = withStatus(ing, next);
        set({
          ingredients,
          movements: [movement, ...state.movements],
        });
        return { ok: true, message: `Movimiento registrado · ${ing.name}` };
      },

      sellRecipe: (recipeId, portions, actor, note) => {
        const state = get();
        const recipe = state.recipes.find((r) => r.id === recipeId);
        if (!recipe) return { ok: false, message: "Receta no encontrada." };
        const n = Math.max(1, Math.floor(portions));
        for (const line of recipe.lines) {
          const ing = state.ingredients.find((i) => i.id === line.ingredientId);
          const need = line.qty * n;
          if (!ing || ing.stock < need) {
            return {
              ok: false,
              message: `No alcanza ${ing?.name ?? line.ingredientId} (faltan ${need.toFixed(2)} ${ing?.unitLabel ?? ""}).`,
            };
          }
        }
        const ingredients = state.ingredients.slice();
        const movements: Movement[] = [];
        const at = new Date().toISOString();
        const flavor = note ? ` · ${note}` : "";
        for (const line of recipe.lines) {
          const idx = ingredients.findIndex((i) => i.id === line.ingredientId);
          const ing = ingredients[idx];
          const need = line.qty * n;
          const next = ing.stock - need;
          ingredients[idx] = withStatus(ing, next);
          movements.push({
            id: uid("m"),
            at,
            type: "consumo",
            ingredientId: ing.id,
            qty: need,
            reason: "Comanda receta",
            ref: `${recipe.name} × ${n}${flavor}`,
            actor,
            balance: next,
          });
        }
        set({
          ingredients,
          movements: [...movements, ...state.movements],
        });
        return { ok: true, message: `Descontado ${recipe.name} × ${n}${flavor}` };
      },

      applyCount: (counts, actor) => {
        const state = get();
        const at = new Date().toISOString();
        const ingredients = state.ingredients.map((i) => ({ ...i }));
        const movements: Movement[] = [];
        let changes = 0;
        for (const ing of ingredients) {
          if (!(ing.id in counts)) continue;
          const counted = counts[ing.id];
          if (!Number.isFinite(counted)) continue;
          if (Math.abs(counted - ing.stock) < 0.0001) continue;
          const next = Math.max(0, counted);
          movements.push({
            id: uid("m"),
            at,
            type: "conteo",
            ingredientId: ing.id,
            qty: Math.abs(next - ing.stock),
            reason: next >= ing.stock ? "Sobrante vs. sistema" : "Faltante vs. sistema",
            ref: `ACTA-${dayKey()}`,
            actor,
            balance: next,
          });
          Object.assign(ing, withStatus(ing, next));
          changes += 1;
        }
        if (!changes) return { ok: false, message: "No hay diferencias que aplicar." };
        set({
          ingredients,
          movements: [...movements, ...state.movements],
        });
        return { ok: true, message: `Acta aplicada · ${changes} insumos ajustados` };
      },

      setCheck: (itemId, value) => {
        const s = get();
        const key = runKey(dayKey(), s.restaurant.turno);
        const current = getRun(s.checklists, s.restaurant.turno);
        set({
          checklists: {
            ...s.checklists,
            [key]: {
              ...current,
              checks: { ...current.checks, [itemId]: value },
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      setStart: (patch) => {
        const s = get();
        const key = runKey(dayKey(), s.restaurant.turno);
        const current = getRun(s.checklists, s.restaurant.turno);
        set({
          checklists: {
            ...s.checklists,
            [key]: {
              ...current,
              start: { ...current.start, ...patch },
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      addIncident: (title, start) => {
        const s = get();
        set({
          incidents: [
            {
              id: uid("i"),
              at: new Date().toISOString(),
              title,
              start,
            },
            ...s.incidents,
          ],
        });
      },
    }),
    {
      name: "brasas-existencias-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        restaurant: s.restaurant,
        ingredients: s.ingredients,
        movements: s.movements,
        checklists: s.checklists,
        incidents: s.incidents,
        setupDone: s.setupDone,
      }),
    },
  ),
);
