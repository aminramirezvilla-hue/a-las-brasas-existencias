export type Unit =
  | "kg"
  | "g"
  | "pza"
  | "lt"
  | "ml"
  | "caja"
  | "bolsa"
  | "paquete"
  | "lata"
  | "bote"
  | "rollo"
  | "orden"
  | "rebanada";

export type Category =
  | "cortes"
  | "pollo"
  | "embutidos"
  | "snacks"
  | "lacteos"
  | "despensa"
  | "salsas"
  | "bebidas"
  | "empaque"
  | "limpieza";

export type MovementType = "entrada" | "consumo" | "merma" | "ajuste" | "conteo";

export type CheckValue = "" | "conforme" | "no-conforme" | "no-aplica";

export type StockStatus = "" | "hay" | "bajo" | "falta";

export type Turno = "matutino" | "vespertino" | "nocturno";

export type SemaforoLevel = "ok" | "warn" | "crit" | "empty";

export type Ingredient = {
  id: string;
  sku: string;
  name: string;
  category: Category;
  unit: Unit;
  unitLabel: string;
  stock: number;
  min: number;
  max: number;
  cost: number;
  dailyUse: number;
  yieldPct: number;
  perishable: boolean;
  status: StockStatus;
};

export type RecipeLine = {
  ingredientId: string;
  qty: number;
};

export type RecipeKind =
  | "entrada"
  | "snack"
  | "hamburguesa"
  | "hotdog"
  | "pollo"
  | "costilla"
  | "corte"
  | "taco"
  | "combo"
  | "bebida"
  | "postre";

export type Recipe = {
  id: string;
  name: string;
  kind: RecipeKind;
  portions: number;
  price: number;
  comboPrice?: number;
  desc?: string;
  lines: RecipeLine[];
};

export type MenuItem = {
  name: string;
  desc?: string;
  price: number;
  comboPrice?: number;
  recipeId?: string;
};

export type MenuSection = {
  id: string;
  title: string;
  kicker?: string;
  note?: string;
  items: MenuItem[];
};

export type Movement = {
  id: string;
  at: string;
  type: MovementType;
  ingredientId: string;
  qty: number;
  reason: string;
  ref: string;
  actor: string;
  balance: number;
};

export type ChecklistItem = {
  id: string;
  text: string;
  fund: string;
  crit: boolean;
};

export type ChecklistSectionId = "apertura" | "servicio" | "cierre";

export type StartNote = {
  s: string;
  t: string;
  a: string;
  r: string;
  x: string;
};

export type ChecklistRun = {
  date: string;
  turno: Turno;
  checks: Record<string, CheckValue>;
  start: StartNote;
  updatedAt: string;
};

export type Incident = {
  id: string;
  at: string;
  title: string;
  start: StartNote;
};

export type Restaurant = {
  name: string;
  sucursal: string;
  address: string;
  phone: string;
  encargado: string;
  turno: Turno;
};

export type InventoryState = {
  restaurant: Restaurant;
  ingredients: Ingredient[];
  recipes: Recipe[];
  movements: Movement[];
  checklists: Record<string, ChecklistRun>;
  incidents: Incident[];
  setupDone: boolean;
};
