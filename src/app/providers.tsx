'use client';
import { PERSISTED_QUERY_CACHE_KEY, queryClient } from '@/lib/cache/queryClient';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from "next-themes";
import { memo, ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import ClientProviders from "../components/layout/ClientProviders/ClientProviders";

const QUERY_PERSIST_CONFIG = {
    maxAge: 1000 * 60 * 60 * 24, // 24 heures
    throttleTime: 1000,
    excludedQueryKeys: ['auth'] as string[],
};

const ClientProvidersLazy = ClientProviders;

function ReactQueryProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const persister = useMemo(() => {
        if (!isHydrated || typeof window === 'undefined') return null;

        return createSyncStoragePersister({
            storage: window.localStorage,
            key: PERSISTED_QUERY_CACHE_KEY,
            throttleTime: QUERY_PERSIST_CONFIG.throttleTime,
        });
    }, [isHydrated]);

    if (!persister) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: QUERY_PERSIST_CONFIG.maxAge,
                dehydrateOptions: {
                    shouldDehydrateQuery: (query) =>
                        query.state.status === 'success' && !QUERY_PERSIST_CONFIG.excludedQueryKeys.includes(query.queryKey[0] as string),
                },
            }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}

const RootSkipLink = memo(function RootSkipLink() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
        focus:py-3 focus:px-6 focus:bg-gradient-to-r focus:from-[#2E5AA6] focus:to-[#4F83D1]
        focus:text-white focus:rounded-2xl focus:shadow-2xl focus:font-bold focus:text-sm
        focus:outline-none focus:ring-4 focus:ring-[#9BC2FF] dark:focus:ring-[#162A56]"
        >
            Aller au contenu principal
        </a>
    );
});

RootSkipLink.displayName = 'RootSkipLink';

const RootPortals = memo(function RootPortals() {
    return (
        <>
            <div id="modal-root" aria-live="polite" />
            <div id="toast-root" aria-live="assertive" aria-atomic="true" />
        </>
    );
});

RootPortals.displayName = 'RootPortals';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            storageKey="monetoile-theme"
        >
            <ReactQueryProvider>
                <ClientProvidersLazy>
                    <Suspense fallback={<div className="min-h-screen" />}>
                        {children}
                    </Suspense>
                </ClientProvidersLazy>
            </ReactQueryProvider>
        </ThemeProvider>
    );
}

export { RootSkipLink, RootPortals };