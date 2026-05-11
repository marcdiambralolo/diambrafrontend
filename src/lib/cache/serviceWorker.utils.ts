/**
 * Utilitaires pour gérer le Service Worker et le cache
 */

const SW_PATH = '/service-worker.js';
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 heure

/**
 * Enregistre le Service Worker avec gestion des mises à jour
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(SW_PATH, { scope: '/' });

    // Vérifier les mises à jour périodiquement
    setInterval(() => registration.update().catch(() => {}), UPDATE_INTERVAL);

    // Gérer les nouvelles versions
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Nouvelle version prête — recharger automatiquement sans alerte
          newWorker.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Désenregistre le Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;
    return await registration.unregister();
  } catch {
    return false;
  }
}

/**
 * Vide tout le cache via message au Service Worker
 */
export async function clearServiceWorkerCache(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration?.active) return;

  return new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => reject(new Error('Cache clear timeout')), 5000);

    channel.port1.onmessage = (event) => {
      clearTimeout(timeout);
      if (event.data?.success) {
        resolve();
        return;
      }

      reject(new Error('Cache clear failed'));
    };

    registration.active!.postMessage({ type: 'CLEAR_CACHE' }, [channel.port2]);
  });
}

/**
 * Obtient la taille approximative du cache (en octets)
 * Utilise l'API StorageManager quand disponible (beaucoup plus rapide)
 */
export async function getCacheSize(): Promise<number> {
  if (typeof navigator === 'undefined') return 0;

  // Méthode rapide via StorageManager
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage ?? 0;
    } catch { /* fallback */ }
  }

  // Fallback : compter les entrées (sans lire les blobs)
  if (!('caches' in window)) return 0;
  try {
    const names = await caches.keys();
    let total = 0;
    for (const name of names) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      total += keys.length;
    }
    return total; // Retourne le nombre d'entrées, pas la taille exacte
  } catch {
    return 0;
  }
}

/**
 * Formate des octets en format lisible
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 octets';
  const k = 1024;
  const sizes = ['octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Vérifie si le navigateur est en ligne
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}