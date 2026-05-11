"use client";
import { ErrorBoundary, LoadingFallback } from '@/components/layout/ErrorBoundary';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { registerServiceWorker } from '@/lib/cache/serviceWorker.utils';
import { CLIENT_NAVIGATION_EVENT, type ClientNavigationDetail } from '@/lib/navigation/clientNavigation';
import { useRouter } from 'next/navigation';
import { startTransition, Suspense, useEffect, useState } from 'react';

export function ClientNavigationEvents() {
  const router = useRouter();

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<ClientNavigationDetail>;
      const href = customEvent.detail?.href;

      if (!href) { return; }

      startTransition(() => {
        if (customEvent.detail?.replace) {
          router.replace(href);
        } else {
          router.push(href);
        }

        if (customEvent.detail?.refresh) {
          router.refresh();
        }
      });
    };

    window.addEventListener(CLIENT_NAVIGATION_EVENT, handleNavigate as EventListener);

    return () => window.removeEventListener(CLIENT_NAVIGATION_EVENT, handleNavigate as EventListener);
  }, [router]);

  return null;
}

export function ServiceWorkerInitializer() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    registerServiceWorker();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isOnline ? 'E' : 'Hors ligne'}</span>
        </div>
      </div>
    );
  }

  return null;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {

  return (
    <div>
      <ErrorBoundary>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <ClientNavigationEvents />
            {children}
          </Suspense>

          <ServiceWorkerInitializer />
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}