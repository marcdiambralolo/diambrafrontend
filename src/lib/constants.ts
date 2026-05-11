export const CATEGORIES_OFFRANDES = [
  { value: 'animal', label: 'Animaux', emoji: '🐓', color: 'from-red-500 to-orange-500' },
  { value: 'vegetal', label: 'Végétaux', emoji: '🌾', color: 'from-green-500 to-emerald-500' },
  { value: 'beverage', label: 'Boissons', emoji: '🍷', color: 'from-[#2E5AA6] to-[#4F83D1]' },
];

export const SYMBOL_MAP: Record<string, string> = {
  soleil: "☉",
  lune: "☾",
  mercure: "☿",
  vénus: "♀",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturne: "♄",
  uranus: "♅",
  neptune: "♆",
  pluton: "♇",
  "noeud nord": "☊",
  "nœud nord": "☊",
  "noeud sud": "☋",
  "nœud sud": "☋",
  lilith: "⚸",
  "lune noire": "⚸",
  "part de fortune": "⊗",
  fortune: "⊗",
  vertex: "Vx",
  ascendant: "ASC",
  descendant: "DSC",
  "milieu du ciel": "MC",
  "fond du ciel": "IC",
  chiron: "⚷",
  ceres: "⚳",
  pallas: "⚴",
  junon: "⚵",
  juno: "⚵",
  vesta: "⚶",
};


export const normalizeKey = (s: string) =>
  s
    .trim().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const SYMBOL_ENTRIES_SORTED = Object.entries(SYMBOL_MAP)
  .map(([k, sym]) => [normalizeKey(k), sym] as const)
  .sort((a, b) => b[0].length - a[0].length);


export const CATEGORY_CONFIG = {
  animal: {
    label: "Animal",
    icon: "🐾",
    gradient: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    darkBg: "dark:bg-amber-900/20"
  },
  vegetal: {
    label: "Végétal",
    icon: "🌿",
    gradient: "from-green-500 to-emerald-500",
    lightBg: "bg-green-50",
    darkBg: "dark:bg-green-900/20"
  },
  beverage: {
    label: "Boisson",
    icon: "🥤",
    gradient: "from-blue-500 to-cyan-500",
    lightBg: "bg-blue-50",
    darkBg: "dark:bg-blue-900/20"
  }
};
