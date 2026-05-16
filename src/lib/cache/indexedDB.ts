type CacheEntry = Record<string, unknown> & {
  userId?: IDBValidKey;
  id?: IDBValidKey;
};

export async function saveToCache(store: string, data: CacheEntry) {
  if (typeof window === 'undefined') return;
  const db = await openDB();
  const tx = db.transaction(store, 'readwrite');
  tx.objectStore(store).put(data, data.userId || data.id);
  await tx.done;
}

export async function getFromCache(store: string, key: string) {
  if (typeof window === 'undefined') return null;
  const db = await openDB();
  return db.transaction(store).objectStore(store).get(key);
}

async function openDB() {
  // Utilise idb-keyval ou idb (npm install idb)
  const { openDB } = await import('idb');
  return openDB('diambra-cache', 1, {
    upgrade(db) {
       if (!db.objectStoreNames.contains('consultations')) db.createObjectStore('consultations');
     },
  });
}

export async function clearIndexedDbCache() {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('diambra-cache');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}