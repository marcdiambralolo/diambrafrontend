'use client';
import { useAuthStore } from '@/lib/store/auth.store';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { clearPersistedQueryCache, queryClient } from './queryClient';
import { clearIndexedDbCache } from './indexedDB';

const PRESERVED_LOCAL_STORAGE_KEYS = new Set(['diambra-theme']);

function clearMonetoileStorage(storage: Storage | undefined) {
  if (!storage) {
    return;
  }

  const keysToRemove: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key) {
      continue;
    }

    if (key.startsWith('diambra') && !PRESERVED_LOCAL_STORAGE_KEYS.has(key)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key));
}

export async function clearClientApplicationState() {
  if (typeof window === 'undefined') {
    return;
  }

  queryClient.clear();
  clearPersistedQueryCache();

  useAuthStore.getState().logout();

  try {
    useMonEtoileStore.persist.clearStorage();
  } catch {
    // noop
  }

  clearMonetoileStorage(window.localStorage);
  clearMonetoileStorage(window.sessionStorage);

  try {
    await clearIndexedDbCache();
  } catch {
    // noop
  }
}