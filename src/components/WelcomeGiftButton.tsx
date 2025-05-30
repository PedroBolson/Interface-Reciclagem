import React from 'react';
import { Gift, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useWelcomeGift } from '../hooks/useWelcomeGift';
import { useToastContext } from './ui/ToastProvider';

const WelcomeGiftButton: React.FC = () => {
    const { eligibility, loading, claiming, claimGift } = useWelcomeGift();
    const { showSuccess, showError } = useToastContext();

    const handleClaimGift = async () => {
        const result = await claimGift() as { success: boolean; message?: string; error?: string };

        if (result.success) {
            showSuccess(
                `🎁 ${result.message}`,
                8000 // 8 segundos para presente especial
            );
        } else {
            showError(`Erro ao resgatar presente: ${result.error}`);
        }
    };

    // Não mostrar se ainda está carregando
    if (loading) {
        return (
            <div className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        );
    }

    // Não mostrar se não elegível (exceto se expirou - mostrar mensagem)
    if (!eligibility?.eligible && eligibility?.reason !== 'expired') {
        return null; // Botão some do layout
    }

    // Se expirou, mostrar mensagem informativa
    if (eligibility?.reason === 'expired') {
        return (
            <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 text-sm">
                        <div className="text-gray-600 dark:text-gray-400">
                            Presente de boas-vindas expirado
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                            Válido apenas nos primeiros 7 dias
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Se já foi resgatado, mostrar status
    if (eligibility?.reason === 'already_claimed') {
        return (
            <div className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div className="flex-1 text-sm">
                        <div className="text-green-700 dark:text-green-300 font-medium">
                            Presente já resgatado! 🎉
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                            Obrigado por se juntar ao EcoRecicla
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Botão do presente disponível
    return (
        <div className="w-full relative">
            {/* Container com padding extra para acomodar o badge */}
            <button
                onClick={handleClaimGift}
                disabled={claiming}
                className="w-full group cursor-pointer relative overflow-hidden px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ marginTop: '8px', marginRight: '8px' }}
            >
                {/* Efeito de brilho animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="relative flex items-center space-x-3">
                    <div className="relative">
                        <Gift className="w-5 h-5" />
                        {/* Sparkles animados */}
                        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-pulse text-yellow-300" />
                    </div>

                    <div className="flex-1 text-left">
                        <div className="font-semibold">
                            {claiming ? 'Abrindo presente...' : '🎁 Presente de Boas-vindas!'}
                        </div>
                        <div className="text-xs opacity-90">
                            +{eligibility?.giftValue || 50} pontos grátis • {eligibility?.daysLeft} dia{eligibility?.daysLeft !== 1 ? 's' : ''} restante{eligibility?.daysLeft !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {claiming && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                </div>
            </button>

            {/* Badge "NOVO" posicionado relativamente ao container */}
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold z-10">
                {/* Usar animação mais sutil que não sai do container */}
                <span className="inline-block animate-pulse">
                    NOVO
                </span>
            </div>
        </div>
    );
};

export default WelcomeGiftButton;