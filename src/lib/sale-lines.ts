import type { Ingredient, Recipe, RecipeLine } from "./types";

const BREAD = new Set(["panh", "phd"]);

const SKIP = new Set([
  "lec","jit","ceb","pin","gua","fri","sva","cat","mos","ran","hab",
  "bbq","buf","saz","lim","qam","qch","qpa","toc","cha","chb","chd",
  "v1l","v05","pfr","pga","aro","pre","mac",
]);

const PROTEIN_CAT = new Set(["cortes", "pollo", "embutidos"]);

export function saleLines(recipe: Recipe, ingredients: Ingredient[]): RecipeLine[] {
  const byId = new Map(ingredients.map((i) => [i.id, i]));
  const wantsBread =
    recipe.kind === "hamburguesa" ||
    recipe.kind === "hotdog" ||
    recipe.kind === "combo" ||
    recipe.id === "r-ajo";

  const picked = recipe.lines.filter((line) => {
    if (BREAD.has(line.ingredientId)) return wantsBread;
    const ing = byId.get(line.ingredientId);
    if (!ing) return false;
    if (ing.category === "salsas" || ing.category === "empaque" || ing.category === "limpieza") {
      return false;
    }
    if (PROTEIN_CAT.has(ing.category)) return true;
    if (SKIP.has(line.ingredientId)) return false;
    if (ing.category === "bebidas") return recipe.kind === "bebida";
    if (ing.category === "lacteos") return recipe.kind === "entrada" || recipe.kind === "snack";
    if (ing.category === "despensa" || ing.category === "snacks") {
      return recipe.kind === "entrada" || recipe.kind === "snack" || recipe.kind === "postre" || recipe.kind === "bebida";
    }
    return false;
  });

  if (picked.length) return picked;
  const first = recipe.lines[0];
  return first ? [first] : [];
}

export type Shortfall = {
  ingredientId: string;
  name: string;
  have: number;
  need: number;
  unitLabel: string;
};

export function saleShortfalls(
  recipe: Recipe,
  ingredients: Ingredient[],
  portions: number,
): Shortfall[] {
  const n = Math.max(1, Math.floor(portions));
  const short: Shortfall[] = [];
  for (const line of saleLines(recipe, ingredients)) {
    const ing = ingredients.find((i) => i.id === line.ingredientId);
    const need = line.qty * n;
    if (!ing || ing.stock + 1e-9 < need) {
      short.push({
        ingredientId: line.ingredientId,
        name: ing?.name ?? line.ingredientId,
        have: ing?.stock ?? 0,
        need,
        unitLabel: ing?.unitLabel ?? "",
      });
    }
  }
  return short;
}
