import React, { createContext, useContext } from 'react';
import { useToast } from '../../hooks/useToast';
import Toast from './Toast';

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => string;
    showSuccess: (message: string, duration?: number) => string;
    showError: (message: string, duration?: number) => string;
    showWarning: (message: string, duration?: number) => string;
    showInfo: (message: string, duration?: number) => string;
    hideToast: (id: string) => void;
    clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: React.ReactNode;
    darkMode?: boolean;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, darkMode = false }) => {
    const toastManager = useToast();

    return (
        <ToastContext.Provider value={toastManager}>
            {children}

            {/* Renderizar todos os toasts */}
            {toastManager.toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    darkMode={darkMode}
                    onClose={() => toastManager.hideToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
};