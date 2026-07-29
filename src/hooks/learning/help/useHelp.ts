'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useHelp() {
    const router = useRouter();

    const handleCloseHelp = useCallback(() => {
        router.back();
    }, [router]);

    return { handleCloseHelp };
}