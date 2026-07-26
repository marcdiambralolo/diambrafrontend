'use client';
import { memo, useEffect } from 'react';

const TOAST_DURATION = 3000;

interface MessageToastProps {
    message: { text: string; type: string } | null;
    onClose: () => void;
}

const MessageToast = memo(function MessageToast({ message, onClose }: MessageToastProps) {

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const isSuccess = message.type === 'success';

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium ${isSuccess
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
                }`}
        >
            <div className="flex items-center gap-2">
                <span>{isSuccess ? '✅' : '⚠️'}</span>
                {message.text}
            </div>
        </div>
    );
});

export default MessageToast;