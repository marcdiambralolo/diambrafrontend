import { toSafeDate } from "./configUtils";
import { MATCH_TYPES } from "./constantes";
import { DateLike } from "./interface";

export const dst = (date: Date): string => {
  return date.toISOString();
};

export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const caldure = (dateFin: string, dateDebut: string) => {
  const diff = new Date(dateFin).getTime() - new Date(dateDebut).getTime();
  return Math.floor(diff / 1000) + " sec";
};

export const generateLetterPairs2 = (): string[] => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet.split("").flatMap((a) => alphabet.split("").map((b) => a + b));
};

let cachedLetterPairs: string[] | null = null;

export const generateLetterPairs = (): string[] => {
  if (cachedLetterPairs) return cachedLetterPairs;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  cachedLetterPairs = alphabet
    .split("")
    .flatMap((a) => alphabet.split("").map((b) => a + b));

  return cachedLetterPairs;
};

export const getCaseTextContent = (
  tpsglobal: number,
  txt: string,
  txtIndex: number
): string => {
  switch (tpsglobal) {
    case 0:
      return txt;
    case 3:
      return generateLetterPairs()[txtIndex] || txt;
    default:
      return "";
  }
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "00/00/0000 à 00h:00mn:00s";

  const datePart = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return `${datePart} à ${timePart}`;
};

export const choix = (tpsglobale: number): string =>
  ({ 0: "Nombre", 1: "Couleur", 2: "Image", 3: "Lettre" }[tpsglobale] || "Global");

export const niveauOptions = Array.from({ length: 9 }, (_, i) => i + 2);

export const optionOptions = [
  { value: 0, label: 'Manuel' },
  { value: 1, label: 'Automatique' }
];

export const decouperImage = async (imageSrc: string, dimension: number): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const screenWidth = window.innerWidth;
      const squareSize = Math.min(screenWidth, img.width, img.height);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject("Impossible d'obtenir le contexte du canvas");
        return;
      }

      canvas.width = squareSize;
      canvas.height = squareSize;

      const scale = Math.max(squareSize / img.width, squareSize / img.height);
      const x = (squareSize - img.width * scale) / 2;
      const y = (squareSize - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      const pieceSize = squareSize / dimension;
      const imagePieces: string[][] = [];

      for (let row = 0; row < dimension; row++) {
        const rowPieces: string[] = [];
        for (let col = 0; col < dimension; col++) {
          const pieceCanvas = document.createElement("canvas");
          const pieceCtx = pieceCanvas.getContext("2d");

          if (!pieceCtx) {
            reject("Impossible d'obtenir le contexte du canvas");
            return;
          }

          pieceCanvas.width = pieceSize;
          pieceCanvas.height = pieceSize;

          pieceCtx.drawImage(
            canvas,
            col * pieceSize, row * pieceSize, pieceSize, pieceSize,
            0, 0, pieceSize, pieceSize
          );

          pieceCtx.strokeStyle = "#000";
          pieceCtx.lineWidth = 2;
          pieceCtx.strokeRect(0, 0, pieceSize, pieceSize);

          rowPieces.push(pieceCanvas.toDataURL("image/png"));
        }
        imagePieces.push(rowPieces);
      }

      resolve(imagePieces);
    };

    img.onerror = (err) => reject(err);
  });
};

export const decoupelimage = async (urlimage: string, niveau: number): Promise<string[]> => {
  try {
    const result = await decouperImage(urlimage, niveau);
    return result.flat();
  } catch {
    return []
  }
}

export const getChronoTime = (niveau: number): number =>
  [0, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000][niveau] || 0;


export const formatDuration = (seconds?: number): string => {
  if (!seconds) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export function formatDateFR(value: DateLike): string {
  const date = toSafeDate(value, new Date());
  if (!isValidDate(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}` + " à " + `${hour}:${minute}:${second}`;
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}


export const getMatchType = (tpsglobal?: number): string => {
    if (tpsglobal === undefined) return 'Inconnu';
    return MATCH_TYPES[tpsglobal] ?? 'Inconnu';
};

export const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInSeconds = Math.floor((end - start) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    return `${minutes}m ${seconds}s`;
};

export const calculateDurationInSeconds = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return Math.floor((end - start) / 1000);
};

export const formatCompetitionDate = (dateStr?: string): string => {
    if (!dateStr) return 'Non définie';
    try {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleString();
    } catch {
        return 'Date invalide';
    }
};
 