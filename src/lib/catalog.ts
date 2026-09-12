import type {
  Category,
  ChecklistItem,
  ChecklistSectionId,
  Ingredient,
  MenuSection,
  Recipe,
  RecipeKind,
  RecipeLine,
  StockStatus,
  Unit,
} from "./types";

export const WHATSAPP = "527471557796";
export const WHATSAPP_DISPLAY = "747 155 7796";
export const ADDRESS_LINE = "Calle Eduardo Mendoza SN, Col. Viguri";
export const CITY_LINE = "Chilpancingo, Guerrero";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "cortes", label: "Cortes" },
  { id: "pollo", label: "Pollo" },
  { id: "embutidos", label: "Embutidos" },
  { id: "snacks", label: "Papas y snacks" },
  { id: "lacteos", label: "Lácteos" },
  { id: "despensa", label: "Despensa" },
  { id: "salsas", label: "Salsas y sazón" },
  { id: "bebidas", label: "Bebidas" },
  { id: "empaque", label: "Empaque" },
  { id: "limpieza", label: "Limpieza" },
];

export const UNIT_LABEL: Record<Unit, string> = {
  kg: "kilo",
  g: "gr",
  pza: "pieza",
  lt: "lt",
  ml: "ml",
  caja: "caja",
  bolsa: "bolsa",
  paquete: "paquete",
  lata: "lata",
  bote: "bote",
  rollo: "rollo",
  orden: "orden",
  rebanada: "rebanada",
};

export const STATUS_LABEL: Record<StockStatus, string> = {
  "": "Pendiente",
  hay: "Hay",
  bajo: "Bajo",
  falta: "Falta",
};

export const KIND_LABEL: Record<RecipeKind, string> = {
  entrada: "Entrada",
  snack: "Snack",
  hamburguesa: "Hamburguesa",
  hotdog: "Hot dog",
  pollo: "Alitas / pollo",
  costilla: "Costillas",
  corte: "Corte",
  taco: "Tacos",
  combo: "Paquete",
  bebida: "Bebida",
  postre: "Postre",
};

export const MOVEMENT_LABEL: Record<string, string> = {
  entrada: "Recepción",
  consumo: "Consumo receta",
  merma: "Merma",
  ajuste: "Ajuste",
  conteo: "Conteo físico",
};

export const MERMA_REASONS = [
  "Recorte y limpieza del corte",
  "Quemado o sobrecocción en parrilla",
  "Caducidad / pérdida de cadena de frío",
  "Devolución de comanda",
  "Degustación / cortesía",
  "Alita o boneless roto al empanizar",
  "Merma no identificada",
];

export const SABORES = [
  "BBQ",
  "Tamarindo",
  "Mango",
  "Aciditas",
  "Mango habanero",
  "Tamarindo habanero",
  "BBQ habanero",
  "Búfalo",
  "Chipotle",
  "Habanero",
  "Sriracha",
];

export const FUGAS = [
  {
    id: "f1",
    title: "No se revisó al abrir",
    text: "Encender la parrilla sin marcar Hay / Bajo / Falta es igual que firmar la bitácora en gabinete: el dato ya no sirve.",
  },
  {
    id: "f2",
    title: "Faltante sin avisar a piso",
    text: "Si back rib, pan o papas están en Falta y meseros siguen ofertándolos, se cae el menú a mitad de servicio.",
  },
  {
    id: "f3",
    title: "Bajo que se ignora",
    text: "Marcar Bajo y no pedir es posponer el quiebre. El semáforo existe para comprar hoy, no mañana.",
  },
  {
    id: "f4",
    title: "Conteo a ojo al día siguiente",
    text: "Revisar existencias “de memoria” al cierre pierde valor frente a gerencia. El acta se llena en el turno.",
  },
  {
    id: "f5",
    title: "Insumo crítico sin dueño",
    text: "Cortes, pollo y panes son responsabilidad del encargado de parrilla, no “de almacén”.",
  },
  {
    id: "f6",
    title: "Limpieza y empaque olvidados",
    text: "Quedarse sin contenedores, servilletas o cloro también para el servicio. Se marca el listado completo, no solo la carne.",
  },
];

export const START_FIELDS = [
  { key: "s", letter: "S", name: "Situación", help: "Qué ocurrió, con el insumo y la cantidad." },
  { key: "t", letter: "T", name: "Tiempo", help: "Fecha, hora y turno. Nunca “en la semana”." },
  { key: "a", letter: "A", name: "Actores", help: "Quién detectó, quién autorizó, proveedor si aplica." },
  { key: "r", letter: "R", name: "Respuesta", help: "Qué se hizo: receta sustituida, pedido extra, baja del menú." },
  { key: "x", letter: "X", name: "Trazabilidad", help: "Folio de kardex, lote, foto de báscula, acta de conteo." },
] as const;

export const CHECKLISTS: Record<ChecklistSectionId, { title: string; brief: string; items: ChecklistItem[] }> = {
  apertura: {
    title: "Apertura de cocina",
    brief: "Antes de encender la parrilla. Sin esto el turno no está blindado.",
    items: [
      { id: "a1", text: "Cámara y refrigeradores en rango (0–4 °C carnes, ≤ −18 °C congelados).", fund: "NOM-251-SSA1 · cadena de frío", crit: true },
      { id: "a2", text: "Cortes (back rib, arrachera, alitas, carne hamburguesa) marcados Hay — no en Falta.", fund: "Semáforo de existencias", crit: true },
      { id: "a3", text: "Papas francesa, papas para rellenar y pan de hamburguesa / hot dog suficientes.", fund: "Insumo crítico de estación", crit: true },
      { id: "a4", text: "Salsas de alitas y costillas (BBQ, búfalo, habanero, mango, tamarindo) etiquetadas y con FIFO.", fund: "NOM-251-SSA1 · identificación", crit: true },
      { id: "a5", text: "Listado de insumos revisado: cada rubro con Hay, Bajo o Falta.", fund: "Control CATU adaptado", crit: true },
      { id: "a6", text: "Parrilla, freidora y utensilios higienizados.", fund: "NOM-251-SSA1 · higiene", crit: false },
      { id: "a7", text: "Faltantes del cierre anterior pedidos o sustituidos.", fund: "Continuidad de existencias", crit: true },
      { id: "a8", text: "Pedido a proveedor confirmado (kilos y piezas, no “lo de siempre”).", fund: "Recepción programada", crit: false },
    ],
  },
  servicio: {
    title: "Operación de servicio",
    brief: "Durante el fuego. Un Falta que no se comunica es un plato que se vende en falso.",
    items: [
      { id: "s1", text: "Los Falta de este turno ya se avisaron a piso y no se ofertan.", fund: "Quiebre de menú", crit: true },
      { id: "s2", text: "Si un corte se acaba, se marca Falta en el momento — no al cierre.", fund: "Existencia en tiempo real", crit: true },
      { id: "s3", text: "Se respeta FIFO: primero el lote más antiguo.", fund: "NOM-251-SSA1", crit: true },
      { id: "s4", text: "Merma en caliente capturada (no al cierre “de memoria”).", fund: "Fuga crítica 3", crit: true },
      { id: "s5", text: "Semáforo visible: cortes o panes en rojo comunicados a piso.", fund: "Quiebre de menú", crit: false },
      { id: "s6", text: "Sabores de alitas y costillas disponibles; los 86 no se venden.", fund: "Ingeniería de menú", crit: false },
      { id: "s7", text: "Cortes americanos (rib eye, New York, T-bone, porterhouse) verificados.", fund: "Control de mermas VIP", crit: true },
      { id: "s8", text: "Bebidas y empaque también se marcan: no solo la carne.", fund: "Listado completo", crit: false },
      { id: "s9", text: "Cerveza y malteadas vs. comandas sin desfases evidentes.", fund: "Control de barra", crit: false },
      { id: "s10", text: "Incidentes del servicio documentados con S.T.A.R.T.", fund: "Metodología CATU adaptada", crit: false },
    ],
  },
  cierre: {
    title: "Cierre de turno",
    brief: "Sin acta de existencias el día queda abierto.",
    items: [
      { id: "c1", text: "Listado completo marcado: Hay / Bajo / Falta en todos los rubros.", fund: "Acta de existencias", crit: true },
      { id: "c2", text: "Faltantes del servicio justificados y pedidos.", fund: "Pedido del día siguiente", crit: true },
      { id: "c3", text: "Cantidades de cortes y pollo actualizadas si se contó.", fund: "Conteo físico", crit: true },
      { id: "c4", text: "Cámaras a temperatura; bitácora de frío del cierre.", fund: "NOM-251-SSA1", crit: true },
      { id: "c5", text: "Pedido de reposición enviado (kilos y piezas).", fund: "Cobertura del día siguiente", crit: false },
      { id: "c6", text: "Acta de existencias exportada o impresa.", fund: "Expediente del turno", crit: true },
      { id: "c7", text: "Entrega de turno al siguiente encargado con semáforo en claro.", fund: "Continuidad operativa", crit: false },
    ],
  },
};

export const TURNO_LABEL = {
  matutino: "Matutino",
  vespertino: "Vespertino",
  nocturno: "Nocturno",
} as const;

function i(
  id: string,
  sku: string,
  name: string,
  category: Category,
  unit: Unit,
  stock: number,
  min: number,
  max: number,
  cost: number,
  dailyUse: number,
  perishable: boolean,
  yieldPct = 1,
  unitLabel?: string,
): Ingredient {
  const status: StockStatus = stock <= 0 ? "falta" : stock < min ? "bajo" : "hay";
  return {
    id,
    sku,
    name,
    category,
    unit,
    unitLabel: unitLabel ?? UNIT_LABEL[unit],
    stock: Math.round(stock * 100) / 100,
    min,
    max,
    cost,
    dailyUse,
    yieldPct,
    perishable,
    status,
  };
}

function L(ingredientId: string, qty: number): RecipeLine {
  return { ingredientId, qty };
}

function rec(
  id: string,
  name: string,
  kind: RecipeKind,
  price: number,
  lines: RecipeLine[],
  extra: { desc?: string; comboPrice?: number } = {},
): Recipe {
  return { id, name, kind, portions: 1, price, lines, ...extra };
}

export const SEED_INGREDIENTS: Ingredient[] = [
  i("arr", "ARR-001", "Arrachera", "cortes", "kg", 9.2, 5, 16, 280, 5, true, 0.85, "kilo"),
  i("cos", "COS-001", "Costillas Back Rib", "cortes", "kg", 14.5, 8, 22, 210, 8, true, 0.82, "kilo"),
  i("rib", "RIB-001", "RibEye", "cortes", "pza", 10, 6, 18, 175, 4, true, 0.9, "pieza de 300 gr"),
  i("nyk", "NY-001", "New York", "cortes", "pza", 8, 5, 16, 170, 3, true, 0.9, "pieza de 300 gr"),
  i("por", "POR-001", "Porterhouse", "cortes", "pza", 6, 3, 12, 190, 2, true, 0.9, "pieza de 300 gr"),
  i("tbo", "TBO-001", "T-bone", "cortes", "pza", 6, 3, 12, 185, 2, true, 0.9, "pieza de 300 gr"),
  i("pic", "PIC-001", "Picaña", "cortes", "kg", 5.4, 3, 10, 260, 2.5, true, 0.88, "kilo"),
  i("chi", "CHI-001", "Chistorra", "cortes", "pza", 10, 4, 16, 85, 3, true, 1, "pieza de 500 gr"),
  i("tue", "TUE-001", "Tuétanos", "cortes", "pza", 16, 8, 24, 35, 6, true, 1, "pieza"),
  i("ham", "HAM-001", "Carne para hamburguesas", "cortes", "pza", 42, 24, 80, 28, 25, true, 1, "pieza"),
  i("sir", "SIR-001", "Sirloin para tacos", "cortes", "kg", 4.2, 2, 8, 240, 1.5, true, 0.85, "kilo"),

  i("pec", "PEC-001", "Pechuga de pollo", "pollo", "pza", 0, 8, 24, 55, 8, true, 0.9, "pieza"),
  i("ali", "ALI-001", "Alitas", "pollo", "orden", 12, 8, 24, 72, 10, true, 1, "orden de 6 piezas"),
  i("bon", "BON-001", "Boneless", "pollo", "bolsa", 7, 4, 14, 95, 3, true, 1, "paquete-bolsa"),

  i("sal", "SAL-001", "Salchicha para hot dog sencilla", "embutidos", "pza", 40, 20, 80, 8, 15, true, 1, "pieza"),
  i("saa", "SAA-001", "Salchicha asadera", "embutidos", "pza", 18, 8, 36, 18, 6, true, 1, "pieza"),
  i("toc", "TOC-001", "Tocino", "embutidos", "paquete", 6, 3, 12, 75, 2, true, 1, "paquete 500 gr"),

  i("pfr", "PFR-001", "Papas a la francesa", "snacks", "bolsa", 3, 4, 14, 85, 3, false, 1, "paquete-bolsa 2.2 kg"),
  i("pga", "PGA-001", "Papas gajo", "snacks", "bolsa", 5, 3, 10, 90, 2, false, 1, "bolsa"),
  i("aro", "ARO-001", "Aros de cebolla", "snacks", "bolsa", 7, 4, 14, 95, 2.5, false, 1, "bola 900 gr"),
  i("ded", "DED-001", "Dedos de queso", "snacks", "caja", 4, 2, 8, 140, 1.5, false, 1, "caja 900 gr"),
  i("gua", "GUA-001", "Guacamole", "snacks", "paquete", 3, 5, 18, 55, 4, true, 1, "paquete 400 gr"),
  i("pre", "PRE-001", "Papas para rellenar", "snacks", "pza", 8, 12, 40, 12, 10, true, 1, "pieza"),
  i("elo", "ELO-001", "Elotes", "snacks", "pza", 16, 8, 30, 10, 5, true, 1, "pieza"),

  i("qam", "QAM-001", "Queso americano", "lacteos", "rebanada", 80, 40, 160, 2.5, 40, true, 1, "rebanadas"),
  i("qch", "QCH-001", "Queso Chihuahua", "lacteos", "bolsa", 3.2, 2, 8, 280, 1.2, true, 1, "bolsa 2.27 kg"),
  i("qpa", "QPA-001", "Queso parmesano", "lacteos", "bote", 2, 1, 4, 180, 0.15, true, 1, "bote 2 kg"),

  i("mac", "MAC-001", "Macarrones", "despensa", "orden", 12, 6, 24, 28, 8, false, 1, "orden"),
  i("cha", "CHA-001", "Champiñones", "despensa", "lata", 10, 5, 18, 32, 2, false, 1, "lata 500 gr"),
  i("pin", "PIN-001", "Piña rebanadas", "despensa", "lata", 6, 3, 12, 28, 1, false, 1, "lata 480 gr"),
  i("fri", "FRI-001", "Frijoles charros", "despensa", "bolsa", 28, 15, 50, 18, 12, false, 1, "bolsa 150 gr"),
  i("panh", "PAN-001", "Pan para hamburguesas", "despensa", "pza", 16, 24, 80, 4, 25, true, 1, "pieza"),
  i("phd", "PHD-001", "Pan para hot dog", "despensa", "pza", 36, 20, 60, 3.5, 12, true, 1, "pieza"),
  i("ace", "ACE-001", "Aceite vegetal comestible", "despensa", "bote", 8, 4, 16, 42, 2, false, 1, "bote 800 ml"),
  i("lim", "LIM-001", "Limones", "despensa", "pza", 70, 40, 150, 1.5, 40, true, 1, "pieza"),
  i("jit", "JIT-001", "Jitomates", "despensa", "pza", 36, 20, 80, 3, 15, true, 1, "pieza"),
  i("ceb", "CEB-001", "Cebollas", "despensa", "pza", 28, 15, 50, 8, 10, true, 1, "pieza"),
  i("lec", "LEC-001", "Lechuga", "despensa", "pza", 0, 6, 20, 18, 5, true, 1, "pieza"),
  i("pla", "PLA-001", "Plátanos macho", "despensa", "pza", 10, 4, 18, 8, 3, true, 1, "pieza"),

  i("bbq", "BBQ-001", "Salsa BBQ", "salsas", "bote", 3, 1, 5, 220, 0.8, false, 1, "bote 4 kg"),
  i("hab", "HAB-001", "Salsa habanero", "salsas", "bote", 2, 1, 4, 180, 0.3, false, 1, "bote 4 lts"),
  i("hot", "HOT-001", "Salsa Hot", "salsas", "bote", 2, 1, 4, 160, 0.25, false, 1, "bote 4 kg"),
  i("cat", "CAT-001", "Salsa catsup", "salsas", "bote", 3, 1, 5, 95, 0.4, false, 1, "bote 3.7 kg"),
  i("buf", "BUF-001", "Salsa búfalo", "salsas", "bote", 4, 2, 8, 85, 0.5, false, 1, "bote 990 gr"),
  i("ran", "RAN-001", "Aderezo ranch", "salsas", "bote", 2, 1, 4, 140, 0.2, false, 1, "bote 3.7 lts"),
  i("mos", "MOS-001", "Mostaza", "salsas", "bote", 2, 1, 4, 90, 0.15, false, 1, "bote 3.7 kg"),
  i("sri", "SRI-001", "Salsa sriracha", "salsas", "bote", 3, 1, 6, 65, 0.1, false, 1, "bote 500 ml"),
  i("sbu", "SBU-001", "Salsa búfalo mesa", "salsas", "bote", 6, 3, 12, 28, 0.2, false, 1, "bote 150 gr"),
  i("sha", "SHA-001", "Salsa habanero mesa", "salsas", "bote", 6, 3, 12, 32, 0.15, false, 1, "bote 150 ml"),
  i("sva", "SVA-001", "Salsa Valentina mesa", "salsas", "bote", 8, 4, 14, 22, 0.3, false, 1, "bote 350 ml"),
  i("scm", "SCM-001", "Salsa catsup mesa", "salsas", "bote", 8, 4, 14, 18, 0.25, false, 1, "bote 396 gr"),
  i("hug", "HUG-001", "Hugo sazonador", "salsas", "bote", 3, 1, 5, 85, 0.08, false, 1, "bote 1 lt"),
  i("abl", "ABL-001", "Condimento ablandador", "salsas", "bote", 2, 1, 4, 95, 0.1, false, 1, "bote 1.175 kg"),
  i("sln", "SLN-001", "Sal natural", "salsas", "bote", 5, 2, 8, 18, 0.2, false, 1, "bote 1 kg"),
  i("pim", "PIM-001", "Pimienta negra molida", "salsas", "bote", 3, 1, 5, 72, 0.05, false, 1, "bote 460 gr"),
  i("saz", "SAZ-001", "Sazón completa polvos verdes", "salsas", "bote", 3, 1, 6, 45, 0.08, false, 1, "bote 300 gr"),
  i("smg", "SMG-001", "Saborizante mango", "salsas", "bote", 2, 1, 4, 55, 0.1, false, 1, "bote 750 ml"),
  i("sta", "STA-001", "Saborizante tamarindo", "salsas", "bote", 2, 1, 4, 55, 0.1, false, 1, "bote 750 ml"),
  i("vai", "VAI-001", "Vainilla en polvo", "salsas", "bolsa", 2, 1, 4, 48, 0.04, false, 1, "bolsa 300 gr"),
  i("cho", "CHO-001", "Chocolate en polvo", "salsas", "bolsa", 2, 1, 4, 52, 0.05, false, 1, "bolsa 300 gr"),
  i("fre", "FRE-001", "Fresa en polvo", "salsas", "bolsa", 2, 1, 4, 52, 0.04, false, 1, "bolsa 300 gr"),
  i("cna", "CNA-001", "Concentrado de naranja", "salsas", "lt", 6, 3, 12, 45, 1.2, false, 1, "litro"),

  i("agn", "AGN-001", "Agua natural", "bebidas", "pza", 48, 24, 80, 8, 20, false, 1, "botella 600 ml"),
  i("agm", "AGM-001", "Agua mineral", "bebidas", "pza", 24, 12, 40, 12, 8, false, 1, "botella 600 ml"),
  i("ref", "REF-001", "Refresco en lata", "bebidas", "pza", 56, 30, 100, 14, 25, false, 1, "pieza"),
  i("boi", "BOI-001", "Jugo Boing", "bebidas", "pza", 24, 12, 40, 16, 8, false, 1, "pieza"),
  i("cul", "CUL-001", "Cerveza Ultra", "bebidas", "pza", 24, 12, 48, 18, 8, false, 1, "pieza"),
  i("hei", "HEI-001", "Cerveza Heineken", "bebidas", "pza", 28, 12, 48, 22, 10, false, 1, "pieza"),
  i("cor", "COR-001", "Cerveza Corona", "bebidas", "pza", 36, 18, 60, 18, 15, false, 1, "pieza"),
  i("vic", "VIC-001", "Cerveza Victoria", "bebidas", "pza", 24, 12, 48, 16, 8, false, 1, "pieza"),
  i("ind", "IND-001", "Cerveza Indio", "bebidas", "pza", 24, 12, 48, 16, 8, false, 1, "pieza"),
  i("boh", "BOH-001", "Cerveza Bohemia", "bebidas", "pza", 16, 8, 36, 20, 5, false, 1, "pieza"),

  i("alu", "ALU-001", "Papel aluminio", "empaque", "rollo", 8, 3, 14, 45, 1, false, 1, "rollo"),
  i("cgr", "CGR-001", "Contenedores grandes", "empaque", "pza", 80, 40, 150, 4, 25, false, 1, "pieza"),
  i("chb", "CHB-001", "Contenedor hamburguesa", "empaque", "pza", 48, 30, 120, 2.5, 20, false, 1, "pieza"),
  i("chd", "CHD-001", "Contenedor hot dogs", "empaque", "pza", 40, 20, 80, 2, 10, false, 1, "pieza"),
  i("v1l", "V1L-001", "Vaso unicel 1 lt", "empaque", "pza", 50, 24, 80, 1.8, 15, false, 1, "pieza"),
  i("v05", "V05-001", "Vaso unicel 1/2 lt", "empaque", "pza", 80, 40, 120, 1.2, 25, false, 1, "pieza"),
  i("vsa", "VSA-001", "Vasos salseros para llevar", "empaque", "pza", 100, 50, 200, 0.8, 30, false, 1, "pieza"),
  i("ser", "SER-001", "Servilletas", "empaque", "paquete", 8, 4, 14, 35, 2, false, 1, "paquete 369 piezas"),
  i("toa", "TOA-001", "Toallas papel limpieza", "empaque", "paquete", 6, 3, 10, 42, 1.5, false, 1, "paquete 110 piezas"),
  i("psa", "PSA-001", "Papel sanitario", "empaque", "rollo", 12, 6, 24, 28, 2, false, 1, "rollo grande"),

  i("jlm", "JLM-001", "Jabón lavamanos", "limpieza", "bote", 6, 3, 12, 28, 0.5, false, 1, "bote 250 ml"),
  i("jlt", "JLT-001", "Jabón lavatrastes", "limpieza", "ml", 4000, 2000, 8000, 0.04, 400, false, 1, "ml"),
  i("pis", "PIS-001", "Limpiador de pisos", "limpieza", "ml", 3500, 1500, 8000, 0.03, 400, false, 1, "ml"),
  i("clo", "CLO-001", "Cloro", "limpieza", "ml", 4000, 2000, 10000, 0.02, 500, false, 1, "ml"),
  i("mmb", "MMB-001", "Mr. Músculo baños", "limpieza", "lt", 3, 1, 6, 48, 0.2, false, 1, "lt"),
  i("mmc", "MMC-001", "Mr. Músculo cocina", "limpieza", "lt", 3, 1, 6, 48, 0.2, false, 1, "lt"),
];

const fry = L("pfr", 0.08);
const wedge = L("pga", 0.12);
const rings = L("aro", 0.18);
const beans = L("fri", 1);
const salsa = L("sva", 0.04);
const drink = L("ref", 1);
const bun = L("panh", 1);
const patty = L("ham", 1);
const cheese = L("qam", 1);
const lettuce = L("lec", 0.08);
const tomato = L("jit", 0.2);
const onion = L("ceb", 0.08);
const bbqL = L("bbq", 0.04);
const chih = L("qch", 0.03);
const gauc = L("gua", 0.25);
const potato = L("pre", 1);
const bacon = L("toc", 0.08);
const boxH = L("chb", 1);

export const SEED_RECIPES: Recipe[] = [
  rec("r-sopa", "Sopa azteca", "entrada", 120, [L("jit", 1.2), L("qch", 0.04), L("ceb", 0.15), L("lim", 1)], { desc: "Tiras de tortillas fritas en salsa de jitomate picoso" }),
  rec("r-mac", "Macarrones", "entrada", 100, [L("mac", 1), L("qch", 0.05)], { desc: "Códitos en mantequilla con queso" }),
  rec("r-esp", "Espagueti al burro", "entrada", 100, [L("mac", 1), L("qpa", 0.03)], { desc: "Baldo en mantequilla con queso parmesano" }),
  rec("r-qf", "Queso fundido", "entrada", 100, [L("qch", 0.18)]),
  rec("r-qf-cha", "Queso fundido con champiñones", "entrada", 110, [L("qch", 0.18), L("cha", 0.4)]),
  rec("r-qf-chi", "Queso fundido con chistorra", "entrada", 120, [L("qch", 0.18), L("chi", 0.2)]),
  rec("r-tue", "Tuétanos (orden de 2)", "entrada", 180, [L("tue", 2), L("lim", 1), L("ceb", 0.05)]),
  rec("r-pr-q", "Papa rellena gratinada con queso", "entrada", 100, [potato, chih, L("qam", 1)]),
  rec("r-pr-chi", "Papa rellena de chistorra", "entrada", 120, [potato, L("chi", 0.15), chih]),
  rec("r-pr-arr", "Papa rellena de arrachera", "entrada", 150, [potato, L("arr", 0.08), chih]),
  rec("r-pr-cha", "Papa rellena de champiñón", "entrada", 120, [potato, L("cha", 0.35), chih]),

  rec("r-pfr", "Papas a la francesa", "snack", 60, [fry]),
  rec("r-pga", "Papas gajo", "snack", 80, [wedge]),
  rec("r-aro", "Aros de cebolla", "snack", 120, [rings]),
  rec("r-ded", "Dedos de queso", "snack", 140, [L("ded", 0.22)]),
  rec("r-gua", "Guacamole", "snack", 90, [L("gua", 1), L("lim", 1)]),
  rec("r-fri", "Frijoles charros", "snack", 60, [beans]),
  rec("r-elo", "Elote", "snack", 80, [L("elo", 1), L("qpa", 0.02), L("lim", 1)]),
  rec("r-ajo", "Pan con ajo gratinado", "snack", 100, [L("panh", 1), chih, L("saz", 0.01)]),
  rec("r-nac", "Nachos Brasas", "snack", 190, [chih, L("gua", 0.5), L("jit", 0.4), L("ceb", 0.1)]),

  rec("r-hb-sen", "Hamburguesa sencilla", "hamburguesa", 90, [bun, patty, cheese, lettuce, tomato, onion, L("cat", 0.02), boxH], { comboPrice: 160 }),
  rec("r-hb-haw", "Hamburguesa hawaiana", "hamburguesa", 100, [bun, patty, cheese, L("pin", 0.2), onion, boxH], { comboPrice: 180 }),
  rec("r-hb-toc", "Hamburguesa con tocino", "hamburguesa", 110, [bun, patty, cheese, bacon, lettuce, tomato, boxH], { comboPrice: 190 }),
  rec("r-hb-cha", "Hamburguesa con champiñones", "hamburguesa", 100, [bun, patty, cheese, L("cha", 0.25), lettuce, boxH], { comboPrice: 180 }),
  rec("r-hb-dob", "Hamburguesa doble carne", "hamburguesa", 150, [bun, L("ham", 2), L("qam", 2), lettuce, onion, boxH], { comboPrice: 230 }),
  rec("r-hb-rib", "Hamburguesa back rib", "hamburguesa", 170, [bun, L("cos", 0.12), chih, bbqL, lettuce, boxH], { desc: "Carne de costilla en salsa BBQ y queso Chihuahua", comboPrice: 250 }),
  rec("r-hb-ceb", "Hamburguesa con cebollas acarameladas", "hamburguesa", 140, [bun, patty, cheese, L("ceb", 0.25), lettuce, boxH], { comboPrice: 230 }),
  rec("r-hb-bra", "Hamburguesa Brasas", "hamburguesa", 180, [bun, patty, bacon, rings, cheese, chih, boxH], { desc: "Carne, aros de cebolla, tocino, cheddar y Chihuahua", comboPrice: 260 }),
  rec("r-hb-arr", "Hamburguesa arrachera", "hamburguesa", 200, [bun, L("arr", 0.12), chih, lettuce, onion, tomato, boxH], { desc: "Arrachera con queso Chihuahua", comboPrice: 280 }),
  rec("r-hb-gua", "Hamburguesa con guacamole", "hamburguesa", 180, [bun, patty, bacon, gauc, cheese, lettuce, boxH], { comboPrice: 250 }),
  rec("r-hb-tex", "Hamburguesa texana", "hamburguesa", 200, [bun, L("ham", 2), cheese, chih, L("hab", 0.02), onion, boxH], { desc: "Doble carne bañada en salsa picosa, chiles toreados, cheddar y Chihuahua", comboPrice: 280 }),
  rec("r-hb-pol", "Hamburguesa de pechuga de pollo", "hamburguesa", 100, [bun, L("pec", 1), cheese, lettuce, tomato, L("ran", 0.02), boxH], { comboPrice: 180 }),

  rec("r-hd-sen", "Hot dog sencillo", "hotdog", 50, [L("phd", 1), L("sal", 1), L("cat", 0.02), L("mos", 0.01), L("chd", 1)], { comboPrice: 130 }),
  rec("r-hd-haw", "Hot dog hawaiano", "hotdog", 70, [L("phd", 1), L("sal", 1), L("pin", 0.15), L("chd", 1)], { comboPrice: 140 }),
  rec("r-hd-que", "Hot dog relleno de queso con tocino", "hotdog", 80, [L("phd", 1), L("sal", 1), cheese, bacon, L("chd", 1)], { comboPrice: 150 }),
  rec("r-hd-rib", "Hot dog back rib", "hotdog", 90, [L("phd", 1), L("sal", 1), L("cos", 0.06), bbqL, L("chd", 1)], { comboPrice: 160 }),
  rec("r-hd-per", "Hot dog perrón", "hotdog", 100, [L("phd", 1), L("saa", 1), cheese, bacon, gauc, L("chd", 1)], { desc: "Salchicha asadera, rellena de queso, envuelto en tocino con guacamole", comboPrice: 170 }),

  rec("r-al-6", "Alitas 6 piezas", "pollo", 120, [L("ali", 1), bbqL, L("buf", 0.03)]),
  rec("r-al-12", "Alitas 12 piezas", "pollo", 240, [L("ali", 2), bbqL, L("buf", 0.05)]),
  rec("r-al-kg", "Alitas 1 kilo", "pollo", 300, [L("ali", 3), L("bbq", 0.08), L("buf", 0.06)]),
  rec("r-bo-6", "Boneless 6 piezas", "pollo", 130, [L("bon", 0.22), bbqL]),
  rec("r-bo-12", "Boneless 12 piezas", "pollo", 260, [L("bon", 0.42), L("bbq", 0.06)]),
  rec("r-bo-kg", "Boneless 1 kilo", "pollo", 340, [L("bon", 0.7), L("bbq", 0.08)]),
  rec("r-pec-bra", "Pechuga Brasas", "pollo", 230, [L("pec", 1), bbqL, potato, chih, beans], { desc: "Asada bañada en BBQ, papa rellena y frijoles charros" }),

  rec("r-cos-ind", "Orden individual de costillas", "costilla", 300, [L("cos", 0.25), L("mac", 1), fry, bbqL], { desc: "250 g, macarrones y papas" }),
  rec("r-cos-12", "1/2 kg de costillas", "costilla", 380, [L("cos", 0.5), fry, bbqL], { desc: "Con papas a la francesa" }),
  rec("r-cos-1", "1 kg de costillas", "costilla", 550, [L("cos", 1), L("pfr", 0.12), L("bbq", 0.08)], { desc: "Con papas a la francesa" }),
  rec("r-pq-cos", "Paquete costillas", "combo", 1300, [L("cos", 2), L("pre", 2), chih, L("lec", 0.3), L("jit", 1), L("ceb", 0.2)], { desc: "2 kg de costillas, 2 papas rellenas sencillas y ensalada" }),
  rec("r-pq-chu", "Paquete chupes los dedos", "combo", 800, [L("cos", 1), L("pre", 2), chih, L("lec", 0.3), L("jit", 1)], { desc: "1 kg de costillas, 2 papas rellenas sencillas y ensalada" }),
  rec("r-pq-com", "Paquete compartas", "combo", 790, [L("cos", 1), L("ali", 1), fry, rings], { desc: "1 kg de costillas, 6 alas, papas a la francesa y aros de cebolla" }),
  rec("r-pq-enf", "Paquete enfiestes", "combo", 810, [L("cos", 0.5), L("ali", 2), rings, wedge], { desc: "1/2 kg de costillas, 12 alitas, aros de cebolla y papas gajo" }),

  rec("r-rib", "Rib eye 340 g", "corte", 600, [L("rib", 1), potato, beans, salsa], { desc: "Peso en crudo. Papa rellena, frijoles charros y salsa" }),
  rec("r-ny", "New York 340 g", "corte", 600, [L("nyk", 1), potato, beans, salsa]),
  rec("r-tb", "T-bone 360 g", "corte", 600, [L("tbo", 1), potato, beans, salsa]),
  rec("r-ph", "Porterhouse 360 g", "corte", 600, [L("por", 1), potato, beans, salsa]),
  rec("r-chi", "Chistorra 500 g", "corte", 350, [L("chi", 1), potato, beans, salsa]),
  rec("r-arr-250", "Arrachera 250 g", "corte", 390, [L("arr", 0.25), beans, salsa], { desc: "Peso en crudo. Frijoles charros y salsa" }),
  rec("r-arr-12", "1/2 kg de arrachera", "corte", 500, [L("arr", 0.5), beans, salsa]),
  rec("r-arr-1", "1 kg de arrachera", "corte", 750, [L("arr", 1), beans, salsa]),
  rec("r-pic-12", "Picaña 1/2 kg", "corte", 700, [L("pic", 0.5), beans, salsa]),
  rec("r-pic-1", "Picaña 1 kg", "corte", 1350, [L("pic", 1), beans, salsa]),

  rec("r-par-sup", "Súper parrillada", "combo", 1550, [L("arr", 1), L("cos", 1), L("chi", 1), fry, beans, salsa], { desc: "1 kg arrachera, 1 kg costillas back rib, 1/2 kg chistorra. Incluye papas, frijoles y salsa" }),
  rec("r-par-med", "Parrillada de medias", "combo", 1300, [L("arr", 0.5), L("cos", 0.5), L("chi", 1), fry, beans, salsa], { desc: "1/2 kg arrachera, 1/2 kg costillas, 1/2 kg chistorra" }),
  rec("r-par", "Parrillada", "combo", 1000, [L("arr", 1), L("chi", 1), fry, beans, salsa], { desc: "1 kg arrachera, 1/2 kg chistorra, frijoles charros y salsa" }),

  rec("r-cb-bra", "Combo Brasas", "combo", 590, [L("ali", 2), L("panh", 2), L("ham", 2), L("qam", 2), fry, L("ref", 2), L("chb", 2)], { desc: "12 alitas, 2 hamburguesas sencillas, papas a la francesa y 2 refrescos" }),
  rec("r-cb-cow", "Combo Cow Boy", "combo", 680, [L("cos", 0.25), L("panh", 2), L("ham", 2), bacon, L("qam", 2), wedge, L("ref", 2), L("chb", 2)], { desc: "Orden de costillas back rib, 2 hamburguesas especiales, papas gajo y 2 refrescos" }),
  rec("r-cb-div-a", "Combo Diviertas · alitas", "combo", 600, [L("ali", 3), L("hei", 6)], { desc: "1 kg de alitas y 6 cervezas" }),
  rec("r-cb-div-c", "Combo Diviertas · costillas", "combo", 820, [L("cos", 1), L("hei", 6)], { desc: "1 kg de costillas back rib y 6 cervezas" }),
  rec("r-cb-tex", "Combo Texas", "combo", 600, [L("cos", 0.25), L("ali", 1), L("ded", 0.22), fry], { desc: "Orden de costillas, 6 alitas, dedos de queso y papas a la francesa" }),

  rec("r-ta-sir", "Tacos de sirlon", "taco", 160, [L("sir", 0.14), gauc, chih, beans, salsa], { desc: "Dos tortillas de maíz o harina, guacamole, queso, frijoles y salsa" }),
  rec("r-ta-arr", "Tacos de arrachera", "taco", 200, [L("arr", 0.14), gauc, chih, beans, salsa]),
  rec("r-ta-cos", "Tacos de costilla back rib", "taco", 180, [L("cos", 0.14), gauc, chih, beans, salsa]),

  rec("r-ag-n", "Agua natural 600 ml", "bebida", 35, [L("agn", 1)]),
  rec("r-ag-m", "Agua mineral", "bebida", 50, [L("agm", 1)]),
  rec("r-ref", "Refresco en lata", "bebida", 55, [drink]),
  rec("r-jar", "Jarra de naranjada o limonada", "bebida", 180, [L("cna", 0.4), L("lim", 4), L("v1l", 1)]),
  rec("r-vas", "Vaso de naranjada o limonada", "bebida", 55, [L("cna", 0.12), L("lim", 1), L("v05", 1)]),
  rec("r-boi", "Jugo Boing", "bebida", 45, [L("boi", 1)]),
  rec("r-mal", "Malteada", "bebida", 60, [L("cho", 0.04), L("v05", 1)], { desc: "Chocolate, fresa, vainilla u Oreo" }),
  rec("r-cer", "Cerveza", "bebida", 60, [L("cor", 1)]),
  rec("r-boh", "Cerveza Bohemia", "bebida", 65, [L("boh", 1)]),
  rec("r-mic", "Vaso de michelada", "bebida", 15, [L("sva", 0.03), L("lim", 1), L("v05", 1)]),
  rec("r-pla", "Plátanos fritos con lechera", "postre", 80, [L("pla", 1)]),
];

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "entradas",
    title: "Sopas, queso y papas",
    items: [
      { name: "Sopa azteca", desc: "Tiras de tortillas fritas en salsa de jitomate picoso", price: 120, recipeId: "r-sopa" },
      { name: "Macarrones", desc: "Códitos en mantequilla con queso", price: 100, recipeId: "r-mac" },
      { name: "Espagueti al burro", desc: "Baldo en mantequilla con queso parmesano", price: 100, recipeId: "r-esp" },
      { name: "Queso fundido", price: 100, recipeId: "r-qf" },
      { name: "Queso fundido con champiñones", price: 110, recipeId: "r-qf-cha" },
      { name: "Queso fundido con chistorra", price: 120, recipeId: "r-qf-chi" },
      { name: "Tuétanos", desc: "Orden de 2 piezas", price: 180, recipeId: "r-tue" },
      { name: "Papa rellena gratinada con queso", price: 100, recipeId: "r-pr-q" },
      { name: "Papa rellena de chistorra", price: 120, recipeId: "r-pr-chi" },
      { name: "Papa rellena de arrachera", price: 150, recipeId: "r-pr-arr" },
      { name: "Papa rellena de champiñón", price: 120, recipeId: "r-pr-cha" },
    ],
  },
  {
    id: "snacks",
    title: "Snacks",
    items: [
      { name: "Papas a la francesa", price: 60, recipeId: "r-pfr" },
      { name: "Papas gajo", price: 80, recipeId: "r-pga" },
      { name: "Aros de cebolla", price: 120, recipeId: "r-aro" },
      { name: "Dedos de queso", price: 140, recipeId: "r-ded" },
      { name: "Guacamole", price: 90, recipeId: "r-gua" },
      { name: "Frijoles charros", price: 60, recipeId: "r-fri" },
      { name: "Elote", price: 80, recipeId: "r-elo" },
      { name: "Pan con ajo gratinado", price: 100, recipeId: "r-ajo" },
      { name: "Nachos Brasas", price: 190, recipeId: "r-nac" },
    ],
  },
  {
    id: "hamburguesas",
    title: "Hamburguesas",
    note: "Todos los combos incluyen hamburguesa, papas y refresco o malteada.",
    items: [
      { name: "Sencilla", price: 90, comboPrice: 160, recipeId: "r-hb-sen" },
      { name: "Hawaiana", price: 100, comboPrice: 180, recipeId: "r-hb-haw" },
      { name: "Con tocino", price: 110, comboPrice: 190, recipeId: "r-hb-toc" },
      { name: "Con champiñones", price: 100, comboPrice: 180, recipeId: "r-hb-cha" },
      { name: "Doble carne", price: 150, comboPrice: 230, recipeId: "r-hb-dob" },
      { name: "Back rib", desc: "Carne de costilla en salsa BBQ y queso Chihuahua", price: 170, comboPrice: 250, recipeId: "r-hb-rib" },
      { name: "Cebollas acarameladas", price: 140, comboPrice: 230, recipeId: "r-hb-ceb" },
      { name: "Brasas", desc: "Carne, aros de cebolla, tocino, cheddar y Chihuahua", price: 180, comboPrice: 260, recipeId: "r-hb-bra" },
      { name: "Arrachera", desc: "Arrachera con queso Chihuahua", price: 200, comboPrice: 280, recipeId: "r-hb-arr" },
      { name: "Con guacamole", price: 180, comboPrice: 250, recipeId: "r-hb-gua" },
      { name: "Texana", desc: "Doble carne bañada en salsa picosa, chiles toreados, cheddar y Chihuahua", price: 200, comboPrice: 280, recipeId: "r-hb-tex" },
      { name: "Pechuga de pollo", price: 100, comboPrice: 180, recipeId: "r-hb-pol" },
    ],
  },
  {
    id: "hotdogs",
    title: "Hot dog",
    note: "Todos los combos incluyen papas a la francesa y refresco o malteada.",
    items: [
      { name: "Sencillo", price: 50, comboPrice: 130, recipeId: "r-hd-sen" },
      { name: "Hawaiano", price: 70, comboPrice: 140, recipeId: "r-hd-haw" },
      { name: "Relleno de queso con tocino", price: 80, comboPrice: 150, recipeId: "r-hd-que" },
      { name: "Back rib", price: 90, comboPrice: 160, recipeId: "r-hd-rib" },
      { name: "Perrón", desc: "Salchicha asadera, rellena de queso, envuelto en tocino con guacamole", price: 100, comboPrice: 170, recipeId: "r-hd-per" },
    ],
  },
  {
    id: "alitas",
    title: "Alitas y boneless",
    kicker: "Deliciosas crujientes",
    note: "Elige sabor: BBQ, tamarindo, mango, aciditas, mango habanero, tamarindo habanero, BBQ habanero, búfalo, chipotle, habanero o sriracha.",
    items: [
      { name: "Alitas 6 piezas", price: 120, recipeId: "r-al-6" },
      { name: "Alitas 12 piezas", price: 240, recipeId: "r-al-12" },
      { name: "Alitas 1 kilo", price: 300, recipeId: "r-al-kg" },
      { name: "Boneless 6 piezas", price: 130, recipeId: "r-bo-6" },
      { name: "Boneless 12 piezas", price: 260, recipeId: "r-bo-12" },
      { name: "Boneless 1 kilo", price: 340, recipeId: "r-bo-kg" },
      { name: "Pechuga Brasas", desc: "Asada bañada en BBQ, papa rellena y frijoles charros", price: 230, recipeId: "r-pec-bra" },
    ],
  },
  {
    id: "costillas",
    title: "Costillas back rib",
    note: "Mismos sabores que las alitas.",
    items: [
      { name: "Orden individual", desc: "250 g, macarrones y papas", price: 300, recipeId: "r-cos-ind" },
      { name: "1/2 kg de costillas", desc: "Con papas a la francesa", price: 380, recipeId: "r-cos-12" },
      { name: "1 kg de costillas", desc: "Con papas a la francesa", price: 550, recipeId: "r-cos-1" },
      { name: "Paquete costillas", desc: "2 kg de costillas, 2 papas rellenas sencillas y ensalada", price: 1300, recipeId: "r-pq-cos" },
      { name: "Paquete chupes los dedos", desc: "1 kg de costillas, 2 papas rellenas sencillas y ensalada", price: 800, recipeId: "r-pq-chu" },
      { name: "Paquete compartas", desc: "1 kg de costillas, 6 alas, papas a la francesa y aros", price: 790, recipeId: "r-pq-com" },
      { name: "Paquete enfiestes", desc: "1/2 kg de costillas, 12 alitas, aros y papas gajo", price: 810, recipeId: "r-pq-enf" },
    ],
  },
  {
    id: "cortes",
    title: "Cortes americanos",
    note: "El peso es en crudo. Se acompañan con papa rellena, frijoles charros y salsa.",
    items: [
      { name: "Rib eye 340 g", price: 600, recipeId: "r-rib" },
      { name: "New York 340 g", price: 600, recipeId: "r-ny" },
      { name: "T-bone 360 g", price: 600, recipeId: "r-tb" },
      { name: "Porterhouse 360 g", price: 600, recipeId: "r-ph" },
      { name: "Chistorra 500 g", price: 350, recipeId: "r-chi" },
    ],
  },
  {
    id: "arrachera",
    title: "Arrachera y picaña",
    note: "El peso es en crudo. Se acompaña con frijoles charros y salsa.",
    items: [
      { name: "Arrachera 250 g", price: 390, recipeId: "r-arr-250" },
      { name: "1/2 kg de arrachera", price: 500, recipeId: "r-arr-12" },
      { name: "1 kg de arrachera", price: 750, recipeId: "r-arr-1" },
      { name: "Picaña 1/2 kg", price: 700, recipeId: "r-pic-12" },
      { name: "Picaña 1 kg", price: 1350, recipeId: "r-pic-1" },
    ],
  },
  {
    id: "parrilladas",
    title: "Parrilladas",
    note: "Todas incluyen papas a la francesa, frijoles charros y salsa.",
    items: [
      { name: "Súper parrillada", desc: "1 kg arrachera · 1 kg costillas back rib · 1/2 kg chistorra", price: 1550, recipeId: "r-par-sup" },
      { name: "Parrillada de medias", desc: "1/2 kg arrachera · 1/2 kg costillas · 1/2 kg chistorra", price: 1300, recipeId: "r-par-med" },
      { name: "Parrillada", desc: "1 kg arrachera · 1/2 kg chistorra · frijoles y salsa", price: 1000, recipeId: "r-par" },
    ],
  },
  {
    id: "paquetes",
    title: "Paquetes de todo",
    items: [
      { name: "Combo Brasas", desc: "12 alitas, 2 hamburguesas sencillas, papas a la francesa y 2 refrescos", price: 590, recipeId: "r-cb-bra" },
      { name: "Combo Cow Boy", desc: "Orden de costillas, 2 hamburguesas especiales, papas gajo y 2 refrescos", price: 680, recipeId: "r-cb-cow" },
      { name: "Combo Diviertas · alitas", desc: "1 kg de alitas y 6 cervezas", price: 600, recipeId: "r-cb-div-a" },
      { name: "Combo Diviertas · costillas", desc: "1 kg de costillas back rib y 6 cervezas", price: 820, recipeId: "r-cb-div-c" },
      { name: "Combo Texas", desc: "Orden de costillas, 6 alitas, dedos de queso y papas a la francesa", price: 600, recipeId: "r-cb-tex" },
    ],
  },
  {
    id: "tacos",
    title: "Tacos",
    note: "Los tacos son dos tortillas de maíz o harina con guacamole untado, queso gratinado, frijoles charros y salsa.",
    items: [
      { name: "Sirlon", price: 160, recipeId: "r-ta-sir" },
      { name: "Arrachera", price: 200, recipeId: "r-ta-arr" },
      { name: "Costilla back rib", price: 180, recipeId: "r-ta-cos" },
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    items: [
      { name: "Agua natural (botella 600 ml)", price: 35, recipeId: "r-ag-n" },
      { name: "Agua mineral (botella 250 ml)", price: 50, recipeId: "r-ag-m" },
      { name: "Refresco en lata (355 ml)", price: 55, recipeId: "r-ref" },
      { name: "Jarra de naranjada o limonada", price: 180, recipeId: "r-jar" },
      { name: "Vaso de naranjada o limonada", price: 55, recipeId: "r-vas" },
      { name: "Jugo Boing", price: 45, recipeId: "r-boi" },
      { name: "Malteadas", desc: "Chocolate, fresa, vainilla u Oreo", price: 60, recipeId: "r-mal" },
      { name: "Cerveza", price: 60, recipeId: "r-cer" },
      { name: "Cerveza Bohemia", price: 65, recipeId: "r-boh" },
      { name: "Vaso de michelada", price: 15, recipeId: "r-mic" },
      { name: "Vaso de michelada cubana", price: 25 },
      { name: "Vaso de michelato", price: 35 },
      { name: "Vaso de michelada mango / tamarindo", price: 35 },
      { name: "Caribe Cooler", price: 60 },
      { name: "Copa de vino", price: 90 },
      { name: "Copa de clericot", price: 100 },
      { name: "Jarra de clericot", price: 350 },
      { name: "Jarra de sangría", price: 320 },
      { name: "Botella de vino Riunite", price: 300 },
      { name: "Botella de vino Concha y Toro", price: 320 },
    ],
  },
  {
    id: "postres",
    title: "Postres",
    items: [
      { name: "Plátanos fritos con lechera", price: 80, recipeId: "r-pla" },
      { name: "Pay de queso con zarzamora", price: 90 },
    ],
  },
];
