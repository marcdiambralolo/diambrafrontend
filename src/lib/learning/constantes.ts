export const APP_NAME = "DIAMBRA LEARNING";
export const APP_DESCRIPTION = "DIAMBRA LEARNING";
export const CURRENT_YEAR = new Date().getFullYear();

export const TIME_UNITS = [
  { key: 'days', label: 'j', max: 86400000 },
  { key: 'hours', label: 'h', max: 3600000 },
  { key: 'minutes', label: 'm', max: 60000 },
  { key: 'seconds', label: 's', max: 1000 }
] as const;

export const COLORS = {
  subscribers: "from-purple-600 to-indigo-600"
} as const;

export const NO_DATA_PLACEHOLDER = 'N/A';

export const MATCH_TYPES: Record<number, string> = {
    0: 'Chiffre',
    1: 'Couleur',
    2: 'Image',
    3: 'Lettre',
} as const;

export const MESSAGE_DURATION = 3000;

export const STATUS_CONFIG = {
  online: { text: 'EN LIGNE', color: 'green' },
  offline: { text: 'HORS LIGNE', color: 'red' }
} as const;

export const TIME_UNIT_LABELS: Record<string, string> = {
  days: 'j',
  hours: 'h',
  minutes: 'm',
  seconds: 's'
};

export const COUNTDOWN_UPDATE_INTERVAL = 1000;

export const INITIAL_VISIBLE_COUNT = 5;
export const LOAD_MORE_INCREMENT = 5;

export const SKELETON_CLASSES = {
  choix: "h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse",
  game: "h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse",
  bandeau: "h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse",
  feuille: "h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse",
} as const;

export const ITEMS_PER_PAGE = 10;
 