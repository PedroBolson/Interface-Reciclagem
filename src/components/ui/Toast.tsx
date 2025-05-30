import React, { useEffect, useState } from 'react';
import { CheckCircle, X, Info, AlertTriangle, XCircle } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose: () => void;
    darkMode?: boolean;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    duration = 4000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Mostrar toast após um pequeno delay para animação
        const showTimer = setTimeout(() => setIsVisible(true), 100);

        // Auto-hide após a duração especificada
        const hideTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300); // Tempo da animação de saída
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-6 h-6" />;
            case 'error':
                return <XCircle className="w-6 h-6" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6" />;
            case 'info':
                return <Info className="w-6 h-6" />;
            default:
                return <CheckCircle className="w-6 h-6" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-500',
                    border: 'border-green-400',
                    text: 'text-white',
                    icon: 'text-white'
                };
            case 'error':
                return {
                    bg: 'bg-red-500',
                    border: 'border-red-400',
                    text: 'text-white',
                    icon: 'text-white'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-500',
                    border: 'border-yellow-400',
                    text: 'text-white',
                    icon: 'text-white'
                };
            case 'info':
                return {
                    bg: 'bg-blue-500',
                    border: 'border-blue-400',
                    text: 'text-white',
                    icon: 'text-white'
                };
            default:
                return {
                    bg: 'bg-green-500',
                    border: 'border-green-400',
                    text: 'text-white',
                    icon: 'text-white'
                };
        }
    };

    const colors = getColors();

    if (!isVisible && !isExiting) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            {/* Overlay escuro */}
            <div
                className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'
                    }`}
            />

            {/* Toast Container */}
            <div
                className={`relative pointer-events-auto max-w-md w-full transform transition-all duration-300 ${isExiting
                        ? 'scale-95 opacity-0 translate-y-2'
                        : 'scale-100 opacity-100 translate-y-0'
                    }`}
            >
                {/* Toast Card */}
                <div className={`
                    ${colors.bg} ${colors.border} ${colors.text}
                    border-2 rounded-2xl p-6 shadow-2xl
                    backdrop-blur-sm
                    animate-in slide-in-from-top-2 zoom-in-95 duration-300
                `}>
                    <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 ${colors.icon}`}>
                            {getIcon()}
                        </div>

                        {/* Message */}
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-medium leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 w-full bg-white/20 rounded-full h-1 overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all ease-linear"
                            style={{
                                width: '100%',
                                animation: `shrinkProgress ${duration}ms linear forwards`,
                                '--duration': `${duration}ms`
                            } as React.CSSProperties & { '--duration': string }}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shrinkProgress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Toast;