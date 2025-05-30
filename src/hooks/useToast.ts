import { useState, useCallback } from 'react';

interface ToastData {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', duration: number = 4000) => {
        const id = Date.now().toString();
        const newToast: ToastData = {
            id,
            message,
            type,
            duration
        };

        setToasts(prev => [...prev, newToast]);
        return id;
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message: string, duration?: number) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message: string, duration?: number) => {
        return showToast(message, 'error', duration);
    }, [showToast]);

    const showWarning = useCallback((message: string, duration?: number) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    const showInfo = useCallback((message: string, duration?: number) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        showToast,
        hideToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearAllToasts
    };
};