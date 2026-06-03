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