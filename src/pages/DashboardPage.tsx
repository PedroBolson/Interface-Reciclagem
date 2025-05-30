import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUserBalance } from '../hooks/useUserBalance'
import { useRecycling } from '../hooks/useRecycling'
import { useToastContext } from '../components/ui/ToastProvider'
import type { UserData } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import {
    LogOut,
    MapPin,
    Gift,
    Recycle,
    Star,
    Trophy,
    Leaf,
    Settings,
    Bell,
    Calendar,
    TrendingUp,
    Plus,
    Hand,
    Crown,
    Medal,
    Shield,
    Zap,
    Gem
} from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'
import Logo from '../components/ui/Logo'
import TransactionHistoryFull from '../components/TransactionHistoryFull'
import RecyclingModal from '../components/RecyclingModal'
import WelcomeGiftButton from '../components/WelcomeGiftButton'
import RewardsModal from '../components/RewardsModal'
import MapModal from '../components/MapModal'
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface DashboardPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

// Helper function para converter Timestamp do Firestore para Date
const formatFirestoreDate = (firestoreDate: any): string => {
    if (!firestoreDate) return 'Data não disponível'

    // Se já é uma Date
    if (firestoreDate instanceof Date) {
        return firestoreDate.toLocaleDateString('pt-BR')
    }

    // Se é um Timestamp do Firestore (tem propriedade seconds)
    if (firestoreDate.seconds) {
        return new Date(firestoreDate.seconds * 1000).toLocaleDateString('pt-BR')
    }

    // Se é uma string ISO ou timestamp em milissegundos
    if (typeof firestoreDate === 'string' || typeof firestoreDate === 'number') {
        return new Date(firestoreDate).toLocaleDateString('pt-BR')
    }

    // Se tem método toDate() (Firestore Timestamp)
    if (firestoreDate.toDate && typeof firestoreDate.toDate === 'function') {
        return firestoreDate.toDate().toLocaleDateString('pt-BR')
    }

    return 'Data não disponível'
}

// Função para determinar nível e ícone
const getUserLevel = (totalEarned: number) => {
    if (totalEarned >= 5000) {
        return {
            name: 'Diamante',
            icon: <Gem className="w-5 h-5" />,
            color: 'from-cyan-400 to-blue-600',
            textColor: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-500/20 dark:bg-cyan-900/30',
            nextLevel: null,
            progress: 100
        }
    } else if (totalEarned >= 2500) {
        return {
            name: 'Ouro',
            icon: <Crown className="w-5 h-5" />,
            color: 'from-yellow-400 to-orange-500',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-500/20 dark:bg-yellow-900/30',
            nextLevel: 'Diamante',
            nextLevelPoints: 5000,
            progress: ((totalEarned - 2500) / (5000 - 2500)) * 100
        }
    } else if (totalEarned >= 1000) {
        return {
            name: 'Prata',
            icon: <Medal className="w-5 h-5" />,
            color: 'from-gray-400 to-gray-600',
            textColor: 'text-gray-600 dark:text-gray-400',
            bgColor: 'bg-gray-500/20 dark:bg-gray-900/30',
            nextLevel: 'Ouro',
            nextLevelPoints: 2500,
            progress: ((totalEarned - 1000) / (2500 - 1000)) * 100
        }
    } else if (totalEarned >= 500) {
        return {
            name: 'Bronze',
            icon: <Shield className="w-5 h-5" />,
            color: 'from-amber-600 to-orange-800',
            textColor: 'text-amber-700 dark:text-amber-400',
            bgColor: 'bg-amber-500/20 dark:bg-amber-900/30',
            nextLevel: 'Prata',
            nextLevelPoints: 1000,
            progress: ((totalEarned - 500) / (1000 - 500)) * 100
        }
    } else {
        return {
            name: 'Iniciante',
            icon: <Zap className="w-5 h-5" />,
            color: 'from-green-400 to-emerald-600',
            textColor: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-500/20 dark:bg-green-900/30',
            nextLevel: 'Bronze',
            nextLevelPoints: 500,
            progress: (totalEarned / 500) * 100
        }
    }
}

// Componente Level Badge
interface LevelBadgeProps {
    totalEarned: number
    size?: 'sm' | 'md' | 'lg'
    showProgress?: boolean
}

const LevelBadge = ({ totalEarned, size = 'md', showProgress = false }: LevelBadgeProps) => {
    const level = getUserLevel(totalEarned)

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    }

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    }

    return (
        <div className="space-y-2">
            <div className={`inline-flex items-center space-x-2 rounded-full ${sizeClasses[size]}`}>
                <div className={`${iconSizes[size]} rounded-full bg-gradient-to-br ${level.color} text-white flex items-center justify-center`}>
                    {level.icon}
                </div>
                <span className={`font-bold ${level.textColor}`}>
                    {level.name}
                </span>
            </div>

            {showProgress && level.nextLevel && (
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Próximo: {level.nextLevel}</span>
                        <span>{totalEarned}/{level.nextLevelPoints}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full bg-gradient-to-r ${level.color} transition-all duration-500`}
                            style={{ width: `${Math.min(level.progress, 100)}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    )
}

const DashboardPage = ({ darkMode, toggleDarkMode }: DashboardPageProps) => {
    const { user, signOut, getUserData } = useAuth()
    const { balance, loading: balanceLoading } = useUserBalance()

    // Estados para transações (separar recentes das completas)
    const [recentTransactions, setRecentTransactions] = useState<any[]>([])
    const [allTransactions, setAllTransactions] = useState<any[]>([])
    const [transactionsLoading, setTransactionsLoading] = useState(false)
    const [allTransactionsLoading, setAllTransactionsLoading] = useState(false)

    const { } = useRecycling()
    const { showSuccess } = useToastContext()

    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showTransactionHistory, setShowTransactionHistory] = useState(false)
    const [showRecyclingModal, setShowRecyclingModal] = useState(false)
    const [showRewardsModal, setShowRewardsModal] = useState(false)
    const [showMapModal, setShowMapModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                const data = await getUserData(user.uid)
                setUserData(data)
            }
            setLoading(false)
        }

        loadUserData()
    }, [user, getUserData])

    const handleSignOut = async () => {
        const result = await signOut()
        if (result.success) {
            navigate('/')
        }
    }

    // Callback para quando reciclagem é bem-sucedida
    const handleRecyclingSuccess = (points: number) => {
        showSuccess(
            `🌱 Parabéns! Você ganhou ${points.toFixed(2)} pontos com sua reciclagem!`,
            7000
        );
    }

    // useEffect para carregar transações RECENTES
    useEffect(() => {
        if (!user) return

        setTransactionsLoading(true)

        const recentTransactionsQuery = query(
            collection(db, 'transactions'),
            where('uid', '==', user.uid),
            orderBy('timestamp', 'desc'),
            limit(10)
        )

        const unsubscribe = onSnapshot(recentTransactionsQuery, (snapshot) => {
            const transactionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Array<{
                id: string;
                type: string;
                points: number;
                timestamp: any;
                description?: string;
                material?: string;
                weight?: number;
                weightUnit?: string;
                rewardName?: string;
                uid: string;
            }>

            setRecentTransactions(transactionsData)
            setTransactionsLoading(false)
        }, (error) => {
            console.error('❌ Erro ao carregar transações recentes:', error)
            setTransactionsLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    // useEffect para carregar TODAS as transações
    useEffect(() => {
        if (!user) return

        setAllTransactionsLoading(true)

        const allTransactionsQuery = query(
            collection(db, 'transactions'),
            where('uid', '==', user.uid),
            orderBy('timestamp', 'desc')
        )

        const unsubscribe = onSnapshot(allTransactionsQuery, (snapshot) => {
            const transactionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Array<{
                id: string;
                type: string;
                points: number;
                timestamp: any;
                description?: string;
                material?: string;
                weight?: number;
                weightUnit?: string;
                rewardName?: string;
                uid: string;
            }>

            setAllTransactions(transactionsData)
            setAllTransactionsLoading(false)
        }, (error) => {
            console.error('❌ Erro ao carregar todas as transações:', error)
            setAllTransactionsLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    // Calcular estatísticas usando TODAS as transações
    const userStats = {
        totalPoints: balance.currentBalance || 0,
        totalEarned: balance.totalEarned || 0,
        totalSpent: balance.totalSpent || 0,
        materialsRecycled: allTransactions.filter(t => t.type === 'recycling').length,
        co2Saved: allTransactions.filter(t => t.type === 'recycling').reduce((sum, t) => {
            const weight = t.weight || 1
            const weightInKg = t.weightUnit === 'g' ? weight / 1000 : weight
            return sum + (weightInKg * 1.75)
        }, 0)
    }

    const userLevel = getUserLevel(userStats.totalEarned)

    // Estatísticas por material baseadas em TODAS as transações
    const materialStats: Record<string, { count: number; totalWeight: number; totalPoints: number }> = allTransactions
        .filter(t => t.type === 'recycling')
        .reduce((acc, t) => {
            const material = t.material || 'Outros'
            if (!acc[material]) {
                acc[material] = { count: 0, totalWeight: 0, totalPoints: 0 }
            }
            acc[material].count += 1
            acc[material].totalWeight += t.weightUnit === 'g' ? (t.weight || 0) / 1000 : (t.weight || 0)
            acc[material].totalPoints += t.points
            return acc
        }, {} as Record<string, { count: number; totalWeight: number; totalPoints: number }>)

    const topMaterials = Object.entries(materialStats)
        .map(([material, stats]) => ({ material, ...stats }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 5)

    // Modificar a condição de loading para não bloquear tudo
    if (loading || balanceLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-900">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg">Carregando seus dados...</span>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-900'
            : 'bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50'
            }`}>

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Logo size="sm" />
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                    Dashboard
                                </h1>
                            </div>
                            <LevelBadge totalEarned={userStats.totalEarned} size="sm" />
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 cursor-pointer rounded-lg hover:bg-white/10 transition-colors duration-200">
                                <Bell className="w-5 h-5" />
                            </button>
                            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                            <button
                                onClick={handleSignOut}
                                className="flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg hover:scale-105 transition-colors duration-200 text-red-600 dark:text-red-400"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Boas-vindas */}
                <div className="mb-8">
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/50 shadow-xl bg-gradient-to-r from-green-500/10 to-blue-500/10">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                {userData?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold flex items-center">
                                    Olá, {userData?.firstName || 'Usuário'}!
                                    <Hand className="w-8 h-8 ml-2 animate-wave" />
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Bem-vindo de volta ao EcoRecicla
                                </p>
                            </div>
                        </div>

                        {userData && (
                            <div className="grid grid-cols-1 text-center md:grid-cols-2 gap-6 mt-6 p-6 rounded-xl">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Informações da Conta
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Nome:</strong> {userData.firstName} {userData.lastName}</p>
                                        <p><strong>Email:</strong> {userData.email}</p>
                                        <p><strong>Endereço:</strong> {userData.address}, {userData.addressNumber}</p>
                                        <p><strong>Cidade:</strong> {userData.city}, {userData.state}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Status da Conta
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${userLevel.bgColor}`}>
                                                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${userLevel.color} text-white flex items-center justify-center`}>
                                                    {userLevel.icon}
                                                </div>
                                                <span className="font-bold">
                                                    Nível {userLevel.name}
                                                </span>
                                            </div>
                                        </div>

                                        {userLevel.nextLevel && (
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span>Progresso para {userLevel.nextLevel}</span>
                                                    <span>{userStats.totalEarned}/{userLevel.nextLevelPoints} pts</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full bg-gradient-to-r ${userLevel.color} transition-all duration-500`}
                                                        style={{ width: `${Math.min(userLevel.progress, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <p><strong>Membro desde:</strong> {formatFirestoreDate(userData.createdAt)}</p>
                                            <p><strong>Saldo atual:</strong> {userStats.totalPoints.toLocaleString()} pontos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estatísticas principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: 'Saldo Atual',
                            value: userStats.totalPoints.toLocaleString(),
                            icon: <Star className="w-8 h-8" />,
                            color: 'from-yellow-500 to-orange-600',
                            suffix: 'pts'
                        },
                        {
                            title: 'Total Ganho',
                            value: userStats.totalEarned.toLocaleString(),
                            icon: <TrendingUp className="w-8 h-8" />,
                            color: 'from-green-500 to-emerald-600',
                            suffix: 'pts'
                        },
                        {
                            title: 'Materiais Reciclados',
                            value: userStats.materialsRecycled,
                            icon: <Recycle className="w-8 h-8" />,
                            color: 'from-blue-500 to-cyan-600',
                            suffix: 'itens'
                        },
                        {
                            title: 'CO₂ Economizado',
                            value: userStats.co2Saved.toFixed(1),
                            icon: <Leaf className="w-8 h-8" />,
                            color: 'from-purple-500 to-pink-600',
                            suffix: 'kg'
                        }
                    ].map((stat, index) => (
                        <div key={index} className="backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} text-white flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="text-2xl font-bold mb-1">
                                {stat.value} {stat.suffix}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.title}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Conteúdo principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Atividades Recentes */}
                    <div className="lg:col-span-2">
                        <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center space-x-2">
                                    <Calendar className="w-6 h-6 text-green-500" />
                                    <span>
                                        {showTransactionHistory ? 'Histórico Completo' : 'Atividades Recentes'}
                                    </span>
                                </h2>
                                <button
                                    onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                                    className="px-4 cursor-pointer py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
                                >
                                    {showTransactionHistory ? 'Mostrar Recentes' : 'Ver Histórico Completo'}
                                </button>
                            </div>

                            {showTransactionHistory ? (
                                <TransactionHistoryFull uid={user?.uid || ''} darkMode={darkMode} />
                            ) : (
                                <div className="space-y-4">
                                    {transactionsLoading ? (
                                        <div className="animate-pulse space-y-3">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                            ))}
                                        </div>
                                    ) : recentTransactions.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            <Recycle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p>Nenhuma atividade ainda.</p>
                                            <p className="text-sm">Comece a reciclar para ganhar pontos!</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                Mostrando as 5 atividades mais recentes
                                            </div>
                                            {recentTransactions.slice(0, 5).map((transaction) => (
                                                <div key={transaction.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/70 dark:hover:bg-gray-600/50 transition-colors">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${transaction.type === 'recycling'
                                                        ? 'bg-gradient-to-br from-green-500 to-blue-500'
                                                        : transaction.type === 'bonus'
                                                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                                                            : transaction.type === 'reward'
                                                                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                                                : 'bg-gradient-to-br from-gray-500 to-gray-600'
                                                        }`}>
                                                        {transaction.type === 'recycling' ? (
                                                            <Recycle className="w-5 h-5" />
                                                        ) : transaction.type === 'bonus' ? (
                                                            <Plus className="w-5 h-5" />
                                                        ) : transaction.type === 'reward' ? (
                                                            <Gift className="w-5 h-5" />
                                                        ) : (
                                                            <Star className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold">
                                                            {transaction.description || `${transaction.type} - ${transaction.points} pontos`}
                                                        </div>
                                                        <div className="text-sm flex items-center flex-wrap gap-2">
                                                            <span>{formatFirestoreDate(transaction.timestamp)}</span>
                                                            {transaction.type === 'recycling' && transaction.material && (
                                                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-xs">
                                                                    {transaction.material}
                                                                </span>
                                                            )}
                                                            {transaction.type === 'reward' && transaction.rewardName && (
                                                                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-xs">
                                                                    {transaction.rewardName}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`font-bold ${transaction.points > 0
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                            }`}>
                                                            {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                                                        </div>
                                                        {transaction.type === 'recycling' && transaction.weight && (
                                                            <div className="text-xs">
                                                                {transaction.weight}{transaction.weightUnit || 'kg'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Ações Principais */}
                        <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center justify-center space-x-2">
                                <Plus className="w-5 h-5 text-green-500" />
                                <span>Ações Principais</span>
                            </h3>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowRecyclingModal(true)}
                                    className="w-full cursor-pointer flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                                >
                                    <Recycle className="w-5 h-5" />
                                    <span className="font-semibold">Nova Reciclagem</span>
                                </button>

                                <WelcomeGiftButton />

                                <button
                                    onClick={() => setShowRewardsModal(true)}
                                    className="w-full cursor-pointer flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                                >
                                    <Gift className="w-5 h-5" />
                                    <span className="font-semibold">Loja de Recompensas</span>
                                </button>
                            </div>
                        </div>

                        {/* Ações Rápidas */}
                        <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center justify-center space-x-2">
                                <Zap className="w-5 h-5 text-blue-500" />
                                <span>Ações Rápidas</span>
                            </h3>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowMapModal(true)}
                                    className="w-full cursor-pointer flex items-center justify-center space-x-3 px-4 py-3 rounded-4xl hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                >
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    <div className="text-left">
                                        <div className="font-medium">Pontos de Coleta</div>
                                        <div className="text-xs">
                                            6 locais em {userData?.city || 'sua cidade'}
                                        </div>
                                    </div>
                                </button>

                                <button className="w-full cursor-pointer flex items-center justify-center space-x-3 px-4 py-3 rounded-4xl hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                    <Settings className="w-5 h-5 text-gray-500" />
                                    <div className="text-left">
                                        <div className="font-medium">Configurações</div>
                                        <div className="text-xs">
                                            Perfil e preferências
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Top Materiais */}
                        <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <span>Top Materiais</span>
                            </h3>

                            <div className="space-y-3">
                                {allTransactionsLoading ? (
                                    <div className="text-center py-4">
                                        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Carregando estatísticas...
                                        </span>
                                    </div>
                                ) : topMaterials.length > 0 ? (
                                    topMaterials.map((material, index) => (
                                        <div key={index} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-sm">{material.material}</div>
                                                <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                                                    {material.totalPoints} pts
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {material.totalWeight.toFixed(1)}kg • {material.count} vez{material.count !== 1 ? 'es' : ''}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>Comece a reciclar para ver seus materiais favoritos!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modais */}
            <RecyclingModal
                isOpen={showRecyclingModal}
                onClose={() => setShowRecyclingModal(false)}
                onSuccess={handleRecyclingSuccess}
            />

            <RewardsModal
                isOpen={showRewardsModal}
                onClose={() => setShowRewardsModal(false)}
                currentBalance={balance.currentBalance || 0}
                darkMode={darkMode}
            />

            <MapModal
                isOpen={showMapModal}
                onClose={() => setShowMapModal(false)}
                userData={userData}
                darkMode={darkMode}
            />
        </div>
    )
}

export default DashboardPage