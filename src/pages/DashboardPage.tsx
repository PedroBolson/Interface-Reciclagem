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
import ProfileModal from '../components/ProfileModal'
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

interface ProfileAvatarProps {
    userData: UserData | null
    user: any
    size?: string
    textSize?: string
    className?: string
    showLoadingSpinner?: boolean
}

const ProfileAvatar = ({
    userData,
    user,
    size = 'w-25 h-25',
    textSize = 'text-2xl',
    className = '',
    showLoadingSpinner = true
}: ProfileAvatarProps) => {
    const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')

    const handleImageError = () => {
        setImageState('error')
    }

    const handleImageLoad = () => {
        setImageState('loaded')
    }

    const getInitials = () => {
        const firstName = userData?.firstName?.trim()
        const email = user?.email?.trim()

        if (firstName && firstName.length > 0) {
            return firstName.charAt(0).toUpperCase()
        }
        if (email && email.length > 0) {
            return email.charAt(0).toUpperCase()
        }
        return '?'
    }

    // Reset state quando a URL muda
    useEffect(() => {
        if (userData?.profileImageUrl) {
            setImageState('loading')
        } else {
            setImageState('error')
        }
    }, [userData?.profileImageUrl])

    const hasValidImage = userData?.profileImageUrl && imageState !== 'error'
    const isLoading = imageState === 'loading' && userData?.profileImageUrl

    return (
        <div className={`${size} rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white ${textSize} font-bold overflow-hidden border-2 border-white/20 shadow-lg relative group ${className}`}>
            {/* Imagem de perfil */}
            {hasValidImage && (
                <div className="w-full h-full relative">
                    <img
                        src={userData.profileImageUrl}
                        alt={`Foto de ${userData.firstName || 'usuário'}`}
                        className={`w-full h-full transition-all duration-300 ${imageState === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                            }`}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center center',
                        }}
                        draggable={false}
                    />

                    {/* Overlay sutil para melhor contraste */}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-200"></div>
                </div>
            )}

            {/* Loading spinner */}
            {isLoading && showLoadingSpinner && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500/90 to-blue-500/90 backdrop-blur-sm">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Fallback - Iniciais */}
            {!hasValidImage && !isLoading && (
                <span className="flex items-center justify-center w-full h-full select-none transition-all duration-200 group-hover:scale-110">
                    {getInitials()}
                </span>
            )}

            {/* Indicador de hover para fotos */}
            {hasValidImage && imageState === 'loaded' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
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
    const [showProfileModal, setShowProfileModal] = useState(false)
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
                            <ProfileAvatar
                                userData={userData}
                                user={user}
                                size="w-16 h-16"
                                textSize="text-2xl"
                            />
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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
                        <div
                            key={index}
                            className={`backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 dark:border-gray-700/50 shadow-xl ${
                                // No mobile e tablets (até 1023px), mostrar apenas os dois primeiros cards
                                index > 1 ? 'hidden lg:block' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${stat.color} text-white flex items-center justify-center`}>
                                    <div className="w-6 h-6 lg:w-8 lg:h-8">
                                        {stat.icon}
                                    </div>
                                </div>
                                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
                            </div>
                            <div className="text-xl lg:text-2xl font-bold mb-1">
                                {stat.value} {stat.suffix}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                                {stat.title}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Ações no Mobile/Tablet - Logo após as estatísticas */}
                <div className="lg:hidden mb-8 space-y-6">
                    {/* Ações Principais Mobile/Tablet */}
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

                    {/* Ações Rápidas Mobile/Tablet */}
                    <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center justify-center space-x-2">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <span>Ações Rápidas</span>
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowMapModal(true)}
                                className="cursor-pointer flex flex-col items-center space-y-2 px-4 py-3 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            >
                                <MapPin className="w-6 h-6 text-blue-500" />
                                <div className="text-center">
                                    <div className="font-medium text-sm">Pontos de Coleta</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        6 locais
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="cursor-pointer flex flex-col items-center space-y-2 px-4 py-3 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            >
                                <Settings className="w-6 h-6 text-gray-500" />
                                <div className="text-center">
                                    <div className="font-medium text-sm">Configurações</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        Perfil
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conteúdo principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Atividades Recentes */}
                    <div className="lg:col-span-2">
                        <div className="backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 dark:border-gray-700/50 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" />
                                    <span>
                                        {showTransactionHistory ? 'Histórico Completo' : 'Atividades Recentes'}
                                    </span>
                                </h2>
                                <button
                                    onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                                    className="px-3 lg:px-4 cursor-pointer py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-xs lg:text-sm"
                                >
                                    {showTransactionHistory ? 'Recentes' : 'Ver Histórico'}
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

                    {/* Sidebar - Apenas no Desktop (1024px+) */}
                    <div className="hidden lg:block space-y-6">
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

                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="w-full cursor-pointer flex items-center justify-center space-x-3 px-4 py-3 rounded-4xl hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                >
                                    <Settings className="w-5 h-5 text-gray-500" />
                                    <div className="text-center">
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
                            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-800 dark:text-white">
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
                                    topMaterials.map((material, index) => {
                                        const formatNumber = (num: number) => {
                                            return num % 1 === 0 ? num.toString() : num.toFixed(2)
                                        }

                                        return (
                                            <div
                                                key={index}
                                                className="group p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-white/30 dark:hover:border-gray-600/50 hover:bg-gradient-to-r hover:from-white/80 hover:to-white/60 dark:hover:from-gray-700/60 dark:hover:to-gray-600/40"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-110 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                                                index === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                                                                    'bg-gradient-to-br from-gray-400 to-gray-600'
                                                            }`}>
                                                            {index + 1}
                                                        </span>
                                                        <div className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                                                            {material.material}
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-green-600 dark:text-green-400 text-sm group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                                                        {formatNumber(material.totalPoints)} pts
                                                    </span>
                                                </div>
                                                <div className="text-xs mt-2 ml-10 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                                    {formatNumber(material.totalWeight)}kg • {material.count} vez{material.count !== 1 ? 'es' : ''}
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                                        <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                                            <Trophy className="w-10 h-10 mx-auto mb-3 opacity-40 text-gray-400 dark:text-gray-500" />
                                            <p className="font-medium text-gray-600 dark:text-gray-400">
                                                Comece a reciclar para ver seus materiais favoritos!
                                            </p>
                                            <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">
                                                Seus top 5 materiais aparecerão aqui
                                            </p>
                                        </div>
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

            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                userData={userData}
                darkMode={darkMode}
            />

            <footer className="relative mt-16">
                {/* Background decorativo */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/50 to-emerald-50/50 dark:from-gray-900/50 dark:via-slate-900/50 dark:to-emerald-900/50"></div>

                {/* Conteúdo do footer */}
                <div className="relative border-t border-gray-200/60 dark:border-gray-700/60 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            {/* Texto centralizado */}
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span>© 2025 EcoRecicla.</span>
                                </div>

                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Projeto DEMO - Interface Humano Computador
                                </div>
                                <svg
                                    className="w-18 h-18 opacity-70 hover:opacity-100 transition-opacity duration-300 text-gray-600 dark:text-gray-400"
                                    viewBox="0 0 2048 955"
                                    fill="currentColor"
                                >
                                    <path transform="translate(432)" d="m0 0h32l5 6 8 7 6 10 5 17 12 74 12 80 2 8h10l64-8 51-4 64-3h70l36 2 27 3 15 4 13 7 6 5 7 11 4 10v15l-6 12-12 13-11 9-18 11-24 14-56 34-24 15-25 16-20 13-14 9-15 10-11 7-21 14-23 16-29 19-4 3 2 10 14 54 19 66 12 40 16 49 12 35 17 46 11 33 4 19v19l-3 12-8 15-11 12-9 6-12 4-11 2-14-1-14-5-16-10-15-13-14-12-31-29-24-22-16-15-39-36-12-11-13-12-8-7-10-9-24-22-8-7-15-14-8-7-11-10-9-6-6 4-25 20-17 12-18 14-11 8-16 12-17 13-11 8-17 13-15 11-18 14-14 10-20 15-14 10-18 13-13 8-13 6-9 2h-11l-13-4-8-6-7-7-9-13v-38l11-30 11-28 15-36 11-25 26-56 38-76 13-23 6-11-1-5-17-14-13-11-11-9-14-12-22-18-14-12-8-8-7-10-3-8v-7l3-9 9-9 17-9 29-12 27-10 42-15 36-12 47-15 18-6 6-4 11-17 10-17 15-24 16-25 10-15 14-22 8-11 7-11 17-25 16-24 9-13 14-19 11-16 9-10 8-7zm-32 100-9 7-7 8-10 13-12 17-13 19-22 33-11 17-23 34-1 2 8-1 27-7 60-14 36-7 2-1v-8l-12-75-6-31-3-6zm284 144-70 2-54 3-37 3-2 1 5 26 8 38 10 50 3 12 1 2 5-1 24-15 13-9 27-18 43-29 36-24 19-13 10-9 2-4v-7l-3-6-9-2zm-254 18-35 5-53 9-49 9-23 5-3 2-6 12-7 11-10 18-14 25-16 29-12 22-15 28-9 16 1 4 15 13 14 12 13 11 14 11 9 8 11 9 14 12 14 11 10 8 5-2 50-34 12-8 25-17 12-8 43-29 19-12 9-6 1-7-19-85-15-77-3-5zm-206 38-65 18-49 15-32 11-16 7-5 4v2h2l2 4 9 10 9 8 16 12 16 13 13 10 16 13 9 7h3l9-15 9-16 14-25 10-17 26-44 8-17zm-67 192-12 27-17 36-18 38-17 36-16 36-7 18v6l4 6 4 4 10-1 12-6 19-13 11-8 16-11 14-10 18-13 14-10 19-14 15-11 17-12 14-10v-4l-10-9-11-9-14-13-8-7-14-12-11-9-26-22-4-3zm331 21-18 12-14 10-17 12-19 13-12 9-17 12-14 10-13 9-8 5 1 3 11 9 13 12 11 9 15 13 12 11 11 9 8 8 8 7 10 9 11 9 10 9 11 9 14 13 8 7 14 12 13 11 11 8 8 1 4-4 1-6-5-19-17-56-16-53-19-67-13-51-2-5z" fill="#375C93"></path>
                                    <path transform="translate(1536,219)" d="m0 0h48l28 4 23 5 9 3 2 3 1 19v35l-6-1-18-7-24-7-12-2-12-1h-22l-21 3-16 5-17 9-13 12-8 9-6 10-6 15-4 18-1 7v23l3 19 6 18 8 14 8 10 8 7 11 7 13 6 17 4 8 1h29l18-3 8-4 1-2 1-86 1-1 60 1v121l-5 5-28 10-26 6-27 4-14 1h-24l-20-2-25-6-18-7-17-9-12-9-12-11-9-10-9-14-8-16-6-15-4-16-2-17v-25l4-15 5-12 8-12 9-10 12-9 15-8 19-6z" fill="#375C93"></path>
                                    <path transform="translate(1258,218)" d="m0 0 27 1 22 4 19 5 9 4 3 3 1 53-5-1-20-8-17-5-24-4h-17l-10 3-8 6-6 9-1 4v8l4 10 6 8 8 6 27 15 22 11 16 10 11 8 10 9 8 10 8 16 4 13 1 6v22l-4 16-8 16-11 13-9 8-14 9-19 7-25 5-10 1h-23l-22-3-21-6-18-7-14-8-2-4 15-29 4-11 2-3 5 1 15 8 16 6 13 3 8 1h25l11-3 9-5 6-5 4-6 2-10-4-13-5-8-7-7-11-7-27-14-22-12-15-10-10-8-8-8-9-14-5-12-3-12v-21l4-15 5-12 8-12 9-10 12-9 15-8 19-6z" fill="#375C93"></path>
                                    <path transform="translate(957,221)" d="m0 0h166l3 1-2 9-11 38-3 4h-87l-5-1v18l-1 51h91l2 2v47l-1 1h-92v122l-1 1-36 1h-22l-2-3v-290z" fill="#375C93"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default DashboardPage