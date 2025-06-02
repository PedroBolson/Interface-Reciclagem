import React, { useState, useEffect } from 'react';
import {
    X,
    Gift,
    ShoppingBag,
    Coffee,
    Utensils,
    Car,
    Shirt,
    Smartphone,
    Heart,
    Star,
    Check,
    AlertCircle,
    Loader2,
    Sparkles,
    Presentation,
    Popcorn,
    Wallet,
    History,
    Timer,
    Clock,
    Calendar,
    Copy,
    Filter
} from 'lucide-react';
import { useRewards } from '../hooks/useRewards';
import { useToastContext } from './ui/ToastProvider';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

interface RewardsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBalance: number;
    darkMode?: boolean;
}

interface Reward {
    id: string;
    name: string;
    description: string;
    points: number;
    category: 'alimentacao' | 'transporte' | 'moda' | 'tecnologia' | 'doacao';
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    popular?: boolean;
    limited?: boolean;
    discount?: string;
    cooldownHours?: number;
    maxUsesPerWeek?: number;
}

interface RedeemedReward {
    id: string;
    rewardId: string;
    rewardName: string;
    rewardCategory: string;
    points: number;
    redeemedAt: Date;
    canRedeemAgain: boolean;
    nextAvailableAt?: Date;
    timeRemaining?: string;
    rewardCode?: string; // Código único fixo da recompensa
}

const rewards: Reward[] = [
    // Alimentação
    {
        id: 'voucher-10',
        name: 'Voucher R$ 10',
        description: 'Vale-compra para alimentação em parceiros',
        points: 250,
        category: 'alimentacao',
        icon: <Utensils className="w-6 h-6" />,
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500',
        popular: true,
        cooldownHours: 24, // 1 dia
        maxUsesPerWeek: 3
    },
    {
        id: 'cafe-gratis',
        name: 'Café Grátis',
        description: 'Um café especial em cafeterias parceiras',
        points: 150,
        category: 'alimentacao',
        icon: <Coffee className="w-6 h-6" />,
        color: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-500',
        cooldownHours: 8, // 8 horas
        maxUsesPerWeek: 7
    },
    {
        id: 'voucher-25',
        name: 'Voucher R$ 25',
        description: 'Vale-compra para restaurantes parceiros',
        points: 475,
        category: 'alimentacao',
        icon: <Utensils className="w-6 h-6" />,
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-600',
        cooldownHours: 24, // 1 dias
        maxUsesPerWeek: 2
    },
    {
        id: 'voucher-50',
        name: 'Voucher R$ 50',
        description: 'Vale-compra para supermercados parceiros',
        points: 1000,
        category: 'alimentacao',
        icon: <Utensils className="w-6 h-6" />,
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-600',
        cooldownHours: 72, // 1 semana
        maxUsesPerWeek: 1
    },

    // Transporte
    {
        id: 'credito-uber',
        name: 'Crédito Uber R$ 15',
        description: 'Crédito para viagens de Uber',
        points: 295,
        category: 'transporte',
        icon: <Car className="w-6 h-6" />,
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-500',
        popular: true,
        cooldownHours: 17, // 1 dia
        maxUsesPerWeek: 3
    },
    {
        id: 'cartao-transporte',
        name: 'Cartão de Transporte',
        description: 'Créditos para transporte público',
        points: 600,
        category: 'transporte',
        icon: <Car className="w-6 h-6" />,
        color: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-500',
        cooldownHours: 48, // 3 dias
        maxUsesPerWeek: 2
    },

    // Moda Sustentável
    {
        id: 'desconto-20-moda',
        name: '20% OFF Moda Sustentável',
        description: 'Desconto em roupas de marcas sustentáveis',
        points: 700,
        category: 'moda',
        icon: <Shirt className="w-6 h-6" />,
        color: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-500',
        discount: '20%',
        cooldownHours: 50, // 2 dias
        maxUsesPerWeek: 1
    },
    {
        id: 'ecobag',
        name: 'Ecobag Premium',
        description: 'Bolsa reutilizável de material reciclado',
        points: 99,
        category: 'moda',
        icon: <ShoppingBag className="w-6 h-6" />,
        color: 'from-teal-500 to-green-600',
        bgColor: 'bg-teal-500',
        cooldownHours: 24, // 1 dia
        maxUsesPerWeek: 5
    },

    // Tecnologia
    {
        id: 'carregador-solar',
        name: 'Carregador Solar',
        description: 'Carregador portátil movido a energia solar',
        points: 900,
        category: 'tecnologia',
        icon: <Smartphone className="w-6 h-6" />,
        color: 'from-yellow-500 to-orange-600',
        bgColor: 'bg-yellow-500',
        limited: true,
        cooldownHours: 60, // 3 dias
        maxUsesPerWeek: 1
    },
    {
        id: 'curso-online',
        name: 'Curso Online',
        description: 'Acesso a um curso online de sustentabilidade',
        points: 1500,
        category: 'tecnologia',
        icon: <Presentation className="w-6 h-6" />,
        color: 'from-yellow-500 to-orange-600',
        bgColor: 'bg-yellow-500',
        limited: true,
        cooldownHours: 37, // 1 dia
        maxUsesPerWeek: 1
    },
    {
        id: 'credito-google',
        name: 'Crédito Google Play R$ 20',
        description: 'Créditos para apps e jogos',
        points: 700,
        category: 'tecnologia',
        icon: <Smartphone className="w-6 h-6" />,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-600',
        cooldownHours: 55, // 1 semana
        maxUsesPerWeek: 1
    },

    // Doação
    {
        id: 'plantio-arvores',
        name: 'Plantio de 5 Árvores',
        description: 'Contribua para o reflorestamento',
        points: 400,
        category: 'doacao',
        icon: <Heart className="w-6 h-6" />,
        color: 'from-green-600 to-emerald-700',
        bgColor: 'bg-green-600',
        popular: true,
        cooldownHours: 0.5,
        maxUsesPerWeek: 1
    },
    {
        id: 'doacao-ong',
        name: 'Doação para ONG',
        description: 'R$ 10 para ONGs ambientais',
        points: 250,
        category: 'doacao',
        icon: <Heart className="w-6 h-6" />,
        color: 'from-red-500 to-pink-600',
        bgColor: 'bg-red-500',
        cooldownHours: 0.5,
        maxUsesPerWeek: 2
    },
    {
        id: 'ingresso-cinema',
        name: 'Ingresso de Cinema',
        description: 'Um ingresso para o cinema',
        points: 999,
        category: 'tecnologia',
        icon: <Popcorn className="w-6 h-6" />,
        color: 'from-red-500 to-pink-600',
        bgColor: 'bg-red-500',
        cooldownHours: 48, // 2 dias
        maxUsesPerWeek: 2
    }
];

const categories = [
    { id: 'all', name: 'Todas', icon: <Star className="w-4 h-4" /> },
    { id: 'alimentacao', name: 'Alimentação', icon: <Utensils className="w-4 h-4" /> },
    { id: 'transporte', name: 'Transporte', icon: <Car className="w-4 h-4" /> },
    { id: 'moda', name: 'Moda', icon: <Shirt className="w-4 h-4" /> },
    { id: 'tecnologia', name: 'Tecnologia', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'doacao', name: 'Doação', icon: <Heart className="w-4 h-4" /> }
];

const RewardsModal: React.FC<RewardsModalProps> = ({
    isOpen,
    onClose,
    currentBalance,
}) => {
    const [activeTab, setActiveTab] = useState<'available' | 'redeemed'>('available');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showOnlyAffordable, setShowOnlyAffordable] = useState<boolean>(false);
    const [processingReward, setProcessingReward] = useState<string | null>(null);
    const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
    const [loadingRedeemed, setLoadingRedeemed] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const { spendPoints, isProcessing } = useRewards();
    const { showSuccess, showError } = useToastContext();
    const { user } = useAuth();

    // Carregar recompensas já resgatadas - modificar para carregar SEMPRE que abrir o modal
    useEffect(() => {
        if (!user || !isOpen) return;

        setLoadingRedeemed(true);

        const rewardsQuery = query(
            collection(db, 'transactions'),
            where('uid', '==', user.uid),
            where('type', '==', 'reward'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(rewardsQuery, (snapshot) => {
            const redeemed = snapshot.docs.map(doc => {
                const data = doc.data();
                const redeemedAt = data.timestamp?.toDate() || new Date();

                // Tentar encontrar a configuração da recompensa
                let rewardConfig = rewards.find(r => r.id === data.rewardId);

                // Se não encontrar pelo ID, tentar pelo nome
                if (!rewardConfig && data.rewardName) {
                    rewardConfig = rewards.find(r =>
                        r.name.toLowerCase().includes(data.rewardName.toLowerCase()) ||
                        data.rewardName.toLowerCase().includes(r.name.toLowerCase())
                    );
                }

                // Fallback para categoria baseada no nome da recompensa
                let category = data.rewardCategory;
                if (!category && data.rewardName) {
                    const name = data.rewardName.toLowerCase();
                    if (name.includes('ecobag') || name.includes('bag') || name.includes('moda')) {
                        category = 'moda';
                    } else if (name.includes('voucher') || name.includes('café') || name.includes('coffee') || name.includes('alimenta')) {
                        category = 'alimentacao';
                    } else if (name.includes('uber') || name.includes('transporte') || name.includes('cartão')) {
                        category = 'transporte';
                    } else if (name.includes('google') || name.includes('curso') || name.includes('carregador') || name.includes('cinema')) {
                        category = 'tecnologia';
                    } else if (name.includes('árvore') || name.includes('ong') || name.includes('doação')) {
                        category = 'doacao';
                    }
                }

                let canRedeemAgain = true;
                let nextAvailableAt: Date | undefined;
                let timeRemaining: string | undefined;

                if (rewardConfig?.cooldownHours) {
                    const cooldownMs = rewardConfig.cooldownHours * 60 * 60 * 1000;
                    nextAvailableAt = new Date(redeemedAt.getTime() + cooldownMs);
                    canRedeemAgain = nextAvailableAt <= new Date();

                    if (!canRedeemAgain) {
                        timeRemaining = formatTimeRemaining(nextAvailableAt);
                    }
                }

                const reward = {
                    id: doc.id,
                    rewardId: data.rewardId || 'unknown',
                    rewardName: data.rewardName || data.description || 'Recompensa Unknown',
                    rewardCategory: category || 'geral',
                    points: Math.abs(data.points || 0),
                    redeemedAt,
                    canRedeemAgain,
                    nextAvailableAt,
                    timeRemaining,
                    rewardCode: data.rewardCode // Código único fixo da transação
                } as RedeemedReward;

                return reward;
            });

            setRedeemedRewards(redeemed);
            setLoadingRedeemed(false);
        });

        return () => unsubscribe();
    }, [user, isOpen]); // Remover activeTab da dependência

    const formatTimeRemaining = (date: Date): string => {
        const now = new Date();
        const diff = date.getTime() - now.getTime();

        if (diff <= 0) return 'Disponível agora';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h restantes`;
        } else {
            return `${hours}h restantes`;
        }
    };

    // Filtrar recompensas disponíveis por categoria e saldo
    const filteredAvailableRewards = rewards.filter(reward => {
        const categoryMatch = selectedCategory === 'all' || reward.category === selectedCategory;
        const affordableMatch = !showOnlyAffordable || currentBalance >= reward.points;
        return categoryMatch && affordableMatch;
    });

    // Filtrar recompensas resgatadas por categoria com lógica melhorada
    const filteredRedeemedRewards = redeemedRewards.filter(reward => {
        if (selectedCategory === 'all') return true;

        // Verificar se a categoria bate
        if (reward.rewardCategory === selectedCategory) return true;

        // Verificar pelo nome da recompensa como fallback
        const name = reward.rewardName.toLowerCase();
        switch (selectedCategory) {
            case 'moda':
                return name.includes('ecobag') || name.includes('bag') || name.includes('moda');
            case 'alimentacao':
                return name.includes('voucher') || name.includes('café') || name.includes('coffee') || name.includes('alimenta');
            case 'transporte':
                return name.includes('uber') || name.includes('transporte') || name.includes('cartão');
            case 'tecnologia':
                return name.includes('google') || name.includes('curso') || name.includes('carregador') || name.includes('cinema');
            case 'doacao':
                return name.includes('árvore') || name.includes('ong') || name.includes('doação');
            default:
                return false;
        }
    });

    // Função SIMPLIFICADA para verificar cooldown (apenas para renderização)
    const canRedeemReward = (rewardId: string, cooldownHours?: number): { canRedeem: boolean; timeRemaining?: string; nextAvailable?: Date } => {
        if (!cooldownHours) return { canRedeem: true };

        const rewardRedemptions = redeemedRewards
            .filter(r => r.rewardId === rewardId)
            .sort((a, b) => b.redeemedAt.getTime() - a.redeemedAt.getTime());

        if (rewardRedemptions.length === 0) return { canRedeem: true };

        const lastRedemption = rewardRedemptions[0];
        const cooldownMs = cooldownHours * 60 * 60 * 1000;
        const nextAvailable = new Date(lastRedemption.redeemedAt.getTime() + cooldownMs);
        const now = new Date();
        const canRedeem = nextAvailable <= now;

        return {
            canRedeem,
            timeRemaining: canRedeem ? undefined : formatTimeRemaining(nextAvailable),
            nextAvailable: canRedeem ? undefined : nextAvailable
        };
    };

    // Função para copiar código para área de transferência
    const copyRewardCode = async (code: string, rewardName: string) => {
        try {
            await navigator.clipboard.writeText(code);
            showSuccess(`Código da recompensa "${rewardName}" copiado para a área de transferência!`);
        } catch (err) {
            console.error('Erro ao copiar código:', err);
            showError('Erro ao copiar código. Tente selecionar e copiar manualmente.');
        }
    };

    const handleRedeemReward = async (reward: Reward) => {
        console.log(`🎯 Resgatando: ${reward.name} (${reward.id})`);

        setProcessingReward(reward.id);

        try {
            const result = await spendPoints({
                points: reward.points,
                rewardName: reward.name,
                rewardCategory: reward.category,
                rewardId: reward.id
            }) as { success: boolean; error?: string };

            if (result.success) {
                showSuccess(
                    `🎉 Parabéns! Você resgatou: ${reward.name}!\n\n⏰ Seu código ficará disponível após o período de carência.`,
                    8000
                );
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                showError(`Erro ao resgatar recompensa: ${result.error}`);
            }
        } catch (error: any) {
            showError(`Erro: ${error.message}`);
        } finally {
            setProcessingReward(null);
        }
    };

    // Estatísticas para o resumo
    const affordableRewards = rewards.filter(reward => currentBalance >= reward.points);
    const categoryRewards = selectedCategory === 'all' ? rewards : rewards.filter(r => r.category === selectedCategory);
    const affordableCategoryRewards = categoryRewards.filter(reward => currentBalance >= reward.points);

    // Helper functions
    function getRewardIcon(rewardId: string, rewardCategory: string, rewardName: string): React.ReactNode {
        // First try to find by exact ID match
        const rewardConfig = rewards.find(r => r.id === rewardId);
        if (rewardConfig) {
            return rewardConfig.icon;
        }

        // Try to match by name similarity
        const nameMatch = rewards.find(r =>
            r.name.toLowerCase().includes(rewardName.toLowerCase()) ||
            rewardName.toLowerCase().includes(r.name.toLowerCase())
        );
        if (nameMatch) {
            return nameMatch.icon;
        }

        // Fallback based on category
        switch (rewardCategory) {
            case 'alimentacao':
                if (rewardName.toLowerCase().includes('café') || rewardName.toLowerCase().includes('coffee')) {
                    return <Coffee className="w-6 h-6" />;
                }
                return <Utensils className="w-6 h-6" />;

            case 'transporte':
                if (rewardName.toLowerCase().includes('uber')) {
                    return <Car className="w-6 h-6" />;
                }
                return <Car className="w-6 h-6" />;

            case 'moda':
                if (rewardName.toLowerCase().includes('bag') || rewardName.toLowerCase().includes('ecobag')) {
                    return <ShoppingBag className="w-6 h-6" />;
                }
                return <Shirt className="w-6 h-6" />;

            case 'tecnologia':
                if (rewardName.toLowerCase().includes('curso')) {
                    return <Presentation className="w-6 h-6" />;
                } else if (rewardName.toLowerCase().includes('cinema')) {
                    return <Popcorn className="w-6 h-6" />;
                } else if (rewardName.toLowerCase().includes('carregador')) {
                    return <Smartphone className="w-6 h-6" />;
                } else if (rewardName.toLowerCase().includes('google')) {
                    return <Smartphone className="w-6 h-6" />;
                }
                return <Smartphone className="w-6 h-6" />;

            case 'doacao':
                return <Heart className="w-6 h-6" />;

            default:
                return <Gift className="w-6 h-6" />;
        }
    }

    function getRewardColor(rewardId: string, rewardName: string): string {
        // First try to find by exact ID match
        const rewardConfig = rewards.find(r => r.id === rewardId);
        if (rewardConfig) {
            return rewardConfig.color;
        }

        // Try to match by name similarity
        const nameMatch = rewards.find(r =>
            r.name.toLowerCase().includes(rewardName.toLowerCase()) ||
            rewardName.toLowerCase().includes(r.name.toLowerCase())
        );
        if (nameMatch) {
            return nameMatch.color;
        }

        // Fallback colors based on reward name patterns
        const name = rewardName.toLowerCase();
        if (name.includes('voucher') || name.includes('café') || name.includes('coffee')) {
            return 'from-green-500 to-emerald-600';
        } else if (name.includes('uber') || name.includes('transporte')) {
            return 'from-blue-500 to-cyan-600';
        } else if (name.includes('bag') || name.includes('moda')) {
            return 'from-teal-500 to-green-600';
        } else if (name.includes('google') || name.includes('curso') || name.includes('carregador') || name.includes('cinema')) {
            return 'from-yellow-500 to-orange-600';
        } else if (name.includes('árvore') || name.includes('ong') || name.includes('doação')) {
            return 'from-green-600 to-emerald-700';
        }

        return 'from-purple-500 to-pink-500'; // Default color
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                                {activeTab === 'available' ? 'Loja de Recompensas' : 'Minhas Recompensas'}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                Saldo: <span className="font-bold text-green-600 dark:text-green-400">
                                    {currentBalance.toLocaleString()} pts
                                </span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer flex-shrink-0"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-0">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`flex-1 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 ${activeTab === 'available'
                                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Recompensas Disponíveis</span>
                                <span className="sm:hidden">Disponíveis</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('redeemed')}
                            className={`flex-1 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 ${activeTab === 'redeemed'
                                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                <History className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Minhas Recompensas</span>
                                <span className="sm:hidden">Minhas</span>
                                {redeemedRewards.length > 0 && (
                                    <span className="bg-purple-500 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                                        {redeemedRewards.length}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col h-full max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)]">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filtros e Categorias</span>
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {selectedCategory === 'all' ? 'Todas' : categories.find(c => c.id === selectedCategory)?.name}
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                        {/* Sidebar - Categorias */}
                        <div className={`lg:w-64 border-r border-gray-200 dark:border-gray-700 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                            <div className="p-3 sm:p-4 max-h-full overflow-y-auto">
                                <h3 className="font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white text-sm sm:text-base">Categorias</h3>
                                <div className="space-y-1 sm:space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => {
                                                setSelectedCategory(category.id);
                                                setShowMobileFilters(false); // Fechar filtros no mobile após seleção
                                            }}
                                            className={`w-full cursor-pointer flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${selectedCategory === category.id
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {category.icon}
                                            <span>{category.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Filtro de Saldo Disponível - apenas na aba disponível */}
                                {activeTab === 'available' && (
                                    <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                        <button
                                            onClick={() => setShowOnlyAffordable(!showOnlyAffordable)}
                                            className={`w-full cursor-pointer flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${showOnlyAffordable
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <Wallet className="w-4 h-4" />
                                            <span className="text-sm">Posso comprar</span>
                                            {showOnlyAffordable && <Check className="w-4 h-4 ml-auto" />}
                                        </button>
                                    </div>
                                )}

                                {/* Resumo da categoria */}
                                <div className="mt-4 sm:mt-6 p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                                    {activeTab === 'available' ? (
                                        <>
                                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                {filteredAvailableRewards.length} recompensa{filteredAvailableRewards.length !== 1 ? 's' : ''} {showOnlyAffordable ? 'disponível' : 'encontrada'}{filteredAvailableRewards.length !== 1 ? (showOnlyAffordable ? 'is' : 's') : ''}
                                            </div>
                                            {filteredAvailableRewards.length > 0 && (
                                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    A partir de {Math.min(...filteredAvailableRewards.map(r => r.points)).toLocaleString()} pontos
                                                </div>
                                            )}
                                            {!showOnlyAffordable && (
                                                <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                                                    {affordableCategoryRewards.length} você pode comprar
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                {filteredRedeemedRewards.length} recompensa{filteredRedeemedRewards.length !== 1 ? 's' : ''} resgatada{filteredRedeemedRewards.length !== 1 ? 's' : ''}
                                            </div>
                                            {filteredRedeemedRewards.length > 0 && (
                                                <>
                                                    <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                                                        {filteredRedeemedRewards.filter(r => r.canRedeemAgain).length} disponível{filteredRedeemedRewards.filter(r => r.canRedeemAgain).length !== 1 ? 'is' : ''} novamente
                                                    </div>
                                                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                                        {filteredRedeemedRewards.filter(r => !r.canRedeemAgain).length} em pausa
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Estatísticas gerais */}
                                {activeTab === 'available' && (
                                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            💰 Resumo do Saldo
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            Você pode comprar <span className="font-bold text-green-600 dark:text-green-400">{affordableRewards.length}</span> de {rewards.length} recompensas
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Conteúdo principal */}
                        <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
                            {activeTab === 'available' ? (
                                // Grid de recompensas disponíveis
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                                    {filteredAvailableRewards.map((reward) => {
                                        const canAfford = currentBalance >= reward.points;
                                        const isProcessingThis = processingReward === reward.id;

                                        // VERIFICAÇÃO ÚNICA: Saldo + Cooldown
                                        const cooldownStatus = canRedeemReward(reward.id, reward.cooldownHours);
                                        const canRedeemNow = canAfford && cooldownStatus.canRedeem;

                                        return (
                                            <div
                                                key={reward.id}
                                                className={`relative rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 ${canRedeemNow
                                                    ? 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800'
                                                    : !cooldownStatus.canRedeem
                                                        ? 'border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 opacity-80'
                                                        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-60'
                                                    }`}
                                            >
                                                {/* Badges */}
                                                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col space-y-1">
                                                    {!cooldownStatus.canRedeem && (
                                                        <div className="bg-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                                                            <Timer className="w-2 h-2 sm:w-3 sm:h-3" />
                                                            <span className="hidden sm:inline">Em pausa</span>
                                                            <span className="sm:hidden">Pausa</span>
                                                        </div>
                                                    )}

                                                    {reward.popular && cooldownStatus.canRedeem && (
                                                        <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                                                            <Star className="w-2 h-2 sm:w-3 sm:h-3" />
                                                            <span className="hidden sm:inline">Popular</span>
                                                            <span className="sm:hidden">Pop</span>
                                                        </div>
                                                    )}
                                                    {reward.limited && cooldownStatus.canRedeem && (
                                                        <div className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                                                            <span className="hidden sm:inline">Limitado</span>
                                                            <span className="sm:hidden">Lim</span>
                                                        </div>
                                                    )}
                                                    {reward.discount && cooldownStatus.canRedeem && (
                                                        <div className="bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                                                            {reward.discount} OFF
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Ícone */}
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${reward.color} text-white flex items-center justify-center mb-3 sm:mb-4 ${!cooldownStatus.canRedeem ? 'opacity-60' : ''}`}>
                                                    {reward.icon}
                                                </div>

                                                {/* Conteúdo */}
                                                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900 dark:text-white pr-16 sm:pr-20">
                                                    {reward.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                                                    {reward.description}
                                                </p>

                                                {/* Aviso de cooldown ativo */}
                                                {!cooldownStatus.canRedeem && cooldownStatus.timeRemaining && (
                                                    <div className="mb-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                                                        <div className="flex items-center space-x-2 text-xs text-orange-600 dark:text-orange-400">
                                                            <Timer className="w-3 h-3" />
                                                            <span>Disponível em: {cooldownStatus.timeRemaining}</span>
                                                        </div>
                                                        {cooldownStatus.nextAvailable && (
                                                            <div className="mt-2">
                                                                <div className="w-full bg-orange-200 dark:bg-orange-700 rounded-full h-1">
                                                                    <div
                                                                        className="bg-gradient-to-r from-orange-500 to-red-500 h-1 rounded-full transition-all duration-500"
                                                                        style={{
                                                                            width: `${Math.min(((new Date().getTime() - (redeemedRewards.find(r => r.rewardId === reward.id)?.redeemedAt.getTime() || 0)) /
                                                                                (cooldownStatus.nextAvailable.getTime() - (redeemedRewards.find(r => r.rewardId === reward.id)?.redeemedAt.getTime() || 0))) * 100, 100)}%`
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Info de intervalo (quando pode resgatar) */}
                                                {reward.cooldownHours && cooldownStatus.canRedeem && (
                                                    <div className="mb-2 sm:mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                        <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                                                            <Timer className="w-3 h-3" />
                                                            <span>Intervalo: {reward.cooldownHours < 24 ? `${reward.cooldownHours}h` : `${Math.floor(reward.cooldownHours / 24)}d`}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Preço e botão */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0">
                                                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                                                        <span className="font-bold text-base sm:text-lg text-purple-600 dark:text-purple-400 truncate">
                                                            {reward.points.toLocaleString()}
                                                        </span>
                                                        <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">pts</span>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRedeemReward(reward)}
                                                        disabled={!canRedeemNow || isProcessingThis || isProcessing}
                                                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-1 text-xs sm:text-sm flex-shrink-0 ${canRedeemNow && !isProcessingThis && !isProcessing
                                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105 cursor-pointer'
                                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                                                            }`}
                                                    >
                                                        {isProcessingThis ? (
                                                            <>
                                                                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                                                <span className="hidden sm:inline">Processando...</span>
                                                                <span className="sm:hidden">...</span>
                                                            </>
                                                        ) : !cooldownStatus.canRedeem ? (
                                                            <>
                                                                <Timer className="w-3 h-3" />
                                                                <span className="hidden sm:inline">Em Pausa</span>
                                                                <span className="sm:hidden">Pausa</span>
                                                            </>
                                                        ) : canAfford ? (
                                                            <>
                                                                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                <span className="hidden sm:inline">Resgatar</span>
                                                                <span className="sm:hidden">OK</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <AlertCircle className="w-3 h-3" />
                                                                <span className="hidden sm:inline">Sem saldo</span>
                                                                <span className="sm:hidden">Saldo</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Indicador de progresso para pontos insuficientes */}
                                                {!canAfford && cooldownStatus.canRedeem && (
                                                    <div className="mt-3">
                                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                            <span>Faltam {(reward.points - currentBalance).toLocaleString()} pts</span>
                                                            <span>{Math.round((currentBalance / reward.points) * 100)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                                            <div
                                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-500"
                                                                style={{ width: `${Math.min((currentBalance / reward.points) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                // Lista de recompensas resgatadas
                                <div className="space-y-4">
                                    {loadingRedeemed ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="flex items-center space-x-3">
                                                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                                <span className="text-gray-600 dark:text-gray-400">Carregando suas recompensas...</span>
                                            </div>
                                        </div>
                                    ) : filteredRedeemedRewards.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                                <History className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                Nenhuma recompensa resgatada
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-500 mb-6">
                                                Você ainda não resgatou nenhuma recompensa nesta categoria.
                                            </p>
                                            <button
                                                onClick={() => setActiveTab('available')}
                                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
                                            >
                                                Ver Recompensas Disponíveis
                                            </button>
                                        </div>
                                    ) : (
                                        filteredRedeemedRewards.map((reward) => (
                                            <div
                                                key={reward.id}
                                                className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 ${reward.canRedeemAgain
                                                    ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                                                    : 'border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20'
                                                    }`}
                                            >
                                                <div className="flex flex-col sm:flex-row items-start sm:justify-between space-y-3 sm:space-y-0">
                                                    <div className="flex items-start space-x-3 sm:space-x-4 w-full sm:w-auto">
                                                        {/* Ícone */}
                                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${getRewardColor(reward.rewardId, reward.rewardName)} text-white flex items-center justify-center flex-shrink-0`}>
                                                            {getRewardIcon(reward.rewardId, reward.rewardCategory, reward.rewardName)}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-900 dark:text-white">
                                                                {reward.rewardName}
                                                            </h3>
                                                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                                <div className="flex items-center space-x-1">
                                                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    <span>{reward.redeemedAt.toLocaleDateString('pt-BR')}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    <span>{reward.redeemedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                                <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                                                                    {reward.rewardCategory}
                                                                </div>
                                                            </div>                                        {/* Status e Código Condicional */}
                                                            {reward.canRedeemAgain ? (
                                                                // CÓDIGO DISPONÍVEL - Cooldown terminou
                                                                <>
                                                                    <div className="inline-flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-3">
                                                                        <Check className="w-3 h-3" />
                                                                        <span>Código disponível!</span>
                                                                    </div>

                                                                    {/* Código de resgate */}
                                                                    {reward.rewardCode ? (
                                                                        <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-3">
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                                💳 Seu código de resgate:
                                                                            </div>
                                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                                                                <div className="font-mono text-base sm:text-lg font-bold text-green-600 dark:text-green-400 break-all">
                                                                                    {reward.rewardCode}
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => copyRewardCode(reward.rewardCode!, reward.rewardName)}
                                                                                    className="p-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors cursor-pointer self-start"
                                                                                    title="Copiar código"
                                                                                >
                                                                                    <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                                                </button>
                                                                            </div>
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                                                🏪 Apresente este código nos estabelecimentos parceiros
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-3">
                                                                            <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">
                                                                                ⚠️ Código não encontrado
                                                                            </div>
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                                Esta recompensa foi resgatada antes da implementação dos códigos únicos
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                // EM COOLDOWN - Código ainda não disponível
                                                                <>
                                                                    <div className="inline-flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-3">
                                                                        <Timer className="w-3 h-3" />
                                                                        <span className="hidden sm:inline">Código disponível em: {reward.timeRemaining}</span>
                                                                        <span className="sm:hidden">Em: {reward.timeRemaining}</span>
                                                                    </div>

                                                                    {/* Aviso de código pendente */}
                                                                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3 mb-3">
                                                                        <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                                                                            ⏰ Seu código será liberado em breve
                                                                        </div>
                                                                        <div className="font-mono text-sm text-gray-400 dark:text-gray-500 mb-2">
                                                                            ● ● ● ● ● ● ● ● ● ● ● ●
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                            🔒 Aguarde o período de carência para usar sua recompensa
                                                                        </div>
                                                                    </div>

                                                                    {/* Progress bar para o cooldown */}
                                                                    {reward.nextAvailableAt && (
                                                                        <div className="mb-3">
                                                                            <div className="flex flex-col sm:flex-row sm:justify-between text-xs mb-1 text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                                                                                <span className="hidden sm:inline">Progresso até liberação do código</span>
                                                                                <span className="sm:hidden">Progresso liberação</span>
                                                                                <span>
                                                                                    {Math.round(((new Date().getTime() - reward.redeemedAt.getTime()) /
                                                                                        (reward.nextAvailableAt.getTime() - reward.redeemedAt.getTime())) * 100)}%
                                                                                </span>
                                                                            </div>
                                                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                                <div
                                                                                    className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all duration-500"
                                                                                    style={{
                                                                                        width: `${Math.min(((new Date().getTime() - reward.redeemedAt.getTime()) /
                                                                                            (reward.nextAvailableAt.getTime() - reward.redeemedAt.getTime())) * 100, 100)}%`
                                                                                    }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row sm:flex-col items-center sm:items-end sm:text-right justify-between sm:justify-start w-full sm:w-auto">
                                                        <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                                                            -{reward.points} pts
                                                        </div>

                                                        {/* Botão para resgatar novamente - só quando código estiver disponível */}
                                                        {reward.canRedeemAgain && (
                                                            <button
                                                                onClick={() => {
                                                                    let rewardConfig = rewards.find(r => r.id === reward.rewardId);

                                                                    if (!rewardConfig) {
                                                                        rewardConfig = rewards.find(r =>
                                                                            r.name.toLowerCase().includes(reward.rewardName.toLowerCase()) ||
                                                                            reward.rewardName.toLowerCase().includes(r.name.toLowerCase())
                                                                        );
                                                                    }

                                                                    if (rewardConfig) {
                                                                        handleRedeemReward(rewardConfig);
                                                                    } else {
                                                                        showError('Configuração da recompensa não encontrada');
                                                                    }
                                                                }}
                                                                disabled={currentBalance < reward.points}
                                                                className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${currentBalance >= reward.points
                                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                                    }`}
                                                            >
                                                                <span className="hidden sm:inline">{currentBalance >= reward.points ? '🎁 Resgatar Novamente' : '💰 Saldo Insuficiente'}</span>
                                                                <span className="sm:hidden">{currentBalance >= reward.points ? '🎁 Resgatar' : '💰 Sem saldo'}</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Mensagem quando não há recompensas na aba disponível */}
                            {activeTab === 'available' && filteredAvailableRewards.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                        {showOnlyAffordable ? <Wallet className="w-8 h-8 text-gray-400" /> : <Gift className="w-8 h-8 text-gray-400" />}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                        {showOnlyAffordable
                                            ? 'Nenhuma recompensa disponível'
                                            : 'Nenhuma recompensa encontrada'
                                        }
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-500">
                                        {showOnlyAffordable
                                            ? 'Continue reciclando para acumular mais pontos!'
                                            : 'Tente selecionar uma categoria diferente'
                                        }
                                    </p>
                                    {showOnlyAffordable && (
                                        <button
                                            onClick={() => setShowOnlyAffordable(false)}
                                            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
                                        >
                                            Ver todas as recompensas
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer com dicas - Responsivo */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="hidden sm:inline">Resgate instantâneo</span>
                            <span className="sm:hidden">Instantâneo</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="hidden sm:inline">Código após carência</span>
                            <span className="sm:hidden">Carência</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="hidden sm:inline">Válido por 30 dias</span>
                            <span className="sm:hidden">30 dias</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardsModal;