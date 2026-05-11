'use client';
import { useAuthStore } from '@/lib/store/auth.store';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { clearIndexedDbCache } from './indexedDB';
import { clearPersistedQueryCache, queryClient } from './queryClient';

const PRESERVED_LOCAL_STORAGE_KEYS = new Set(['monetoile-theme']);

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

    if (key.startsWith('monetoile') && !PRESERVED_LOCAL_STORAGE_KEYS.has(key)) {
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
  useMonEtoileStore.getState().clearConsultationChoices();
  useMonEtoileStore.getState().clearGrades();
  useMonEtoileStore.getState().setCurrentGrade(null);
  useMonEtoileStore.getState().clearBlogArticles();

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