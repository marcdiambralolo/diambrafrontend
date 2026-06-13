import { MESSAGE_DURATION } from "@/lib/learning/constantes";
import { useState, useRef, useCallback, useEffect } from "react";
import { ValidationMessage } from "@/lib/learning/interface";

export const useMessage = () => {
    const [message, setMessage] = useState<ValidationMessage | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showMessage = useCallback((text: string, type: 'success' | 'error') => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setMessage({ text, type });
        timeoutRef.current = setTimeout(() => setMessage(null), MESSAGE_DURATION);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return { message, showMessage };
};