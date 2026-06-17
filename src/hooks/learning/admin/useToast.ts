import { useCallback, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    let toastId = 0;

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++toastId;
        const newToast: ToastItem = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return { toasts, showToast, removeToast };
}