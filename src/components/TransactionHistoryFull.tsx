import { useState, useEffect } from 'react'
import { getUserTransactions, type Transaction } from '../services/firestoreService'
import { Recycle, Gift, Plus, Clock, TrendingUp, Filter } from 'lucide-react'

interface TransactionHistoryFullProps {
    uid: string
    darkMode: boolean
}

// Helper function para converter Timestamp do Firestore para Date
const formatFirestoreDate = (firestoreDate: any): string => {
    if (!firestoreDate) return 'Data não disponível'

    // Se já é uma Date
    if (firestoreDate instanceof Date) {
        return firestoreDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Se é um Timestamp do Firestore (tem propriedade seconds)
    if (firestoreDate.seconds) {
        return new Date(firestoreDate.seconds * 1000).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Se tem método toDate() (Firestore Timestamp)
    if (firestoreDate.toDate && typeof firestoreDate.toDate === 'function') {
        return firestoreDate.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Se é uma string ISO ou timestamp em milissegundos
    if (typeof firestoreDate === 'string' || typeof firestoreDate === 'number') {
        return new Date(firestoreDate).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return 'Data não disponível'
}

const TransactionHistoryFull = ({ uid }: TransactionHistoryFullProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'recycling' | 'bonus' | 'reward'>('all')
    const [refreshing, setRefreshing] = useState(false)

    const loadTransactions = async (showRefreshLoader = false) => {
        if (showRefreshLoader) {
            setRefreshing(true)
        } else {
            setLoading(true)
        }

        try {
            // Buscar mais transações (100 para histórico completo)
            const data = await getUserTransactions(uid, 100)
            setTransactions(data)
        } catch (error) {
            console.error('Erro ao carregar transações:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        if (uid) {
            loadTransactions()
        }
    }, [uid])

    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(t => t.type === filter)

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'recycling':
                return <Recycle className="w-5 h-5" />
            case 'bonus':
                return <Plus className="w-5 h-5" />
            case 'reward':
                return <Gift className="w-5 h-5" />
            default:
                return <Clock className="w-5 h-5" />
        }
    }

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'recycling':
                return 'from-green-500 to-blue-500'
            case 'bonus':
                return 'from-yellow-500 to-orange-500'
            case 'reward':
                return 'from-purple-500 to-pink-500'
            default:
                return 'from-gray-500 to-gray-600'
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'recycling':
                return 'Reciclagem'
            case 'bonus':
                return 'Bônus'
            case 'reward':
                return 'Resgate'
            default:
                return 'Transação'
        }
    }

    // Estatísticas do histórico
    const stats = {
        total: transactions.length,
        recycling: transactions.filter(t => t.type === 'recycling').length,
        bonus: transactions.filter(t => t.type === 'bonus').length,
        reward: transactions.filter(t => t.type === 'reward').length,
        totalPoints: transactions.reduce((sum, t) => sum + Math.abs(t.points), 0)
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border dark:border-gray-700/60 rounded-4xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 dark:text-blue-700">
                        {stats.total}
                    </div>
                    <div className="text-sm">
                        Total
                    </div>
                </div>
                <div className="border dark:border-gray-700/60 rounded-4xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.recycling}
                    </div>
                    <div className="text-sm">
                        Reciclagem
                    </div>
                </div>
                <div className="border dark:border-gray-700/60 rounded-4xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.bonus}
                    </div>
                    <div className="text-sm">
                        Bônus
                    </div>
                </div>
                <div className="border dark:border-gray-700/60 rounded-4xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-700">
                        {stats.reward}
                    </div>
                    <div className="text-sm ">
                        Resgates
                    </div>
                </div>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg  text-sm"
                    >
                        <option value="all">Todas ({stats.total})</option>
                        <option value="recycling">Reciclagem ({stats.recycling})</option>
                        <option value="bonus">Bônus ({stats.bonus})</option>
                        <option value="reward">Resgates ({stats.reward})</option>
                    </select>
                </div>

                <button
                    onClick={() => loadTransactions(true)}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                >
                    <TrendingUp className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
                </button>
            </div>

            {/* Lista de transações */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 ">
                        {filter === 'all'
                            ? 'Nenhuma transação encontrada.'
                            : `Nenhuma transação do tipo "${getTypeLabel(filter)}" encontrada.`
                        }
                    </div>
                ) : (
                    filteredTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center space-x-4 p-4 rounded-4xl border border-white/20 dark:border-gray-700/60">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTransactionColor(transaction.type)} text-white flex items-center justify-center flex-shrink-0`}>
                                {getTransactionIcon(transaction.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="font-semibold">
                                    {getTypeLabel(transaction.type)}
                                </div>
                                <div className="text-sm truncate">
                                    {transaction.description}
                                </div>
                                <div className="text-xs mt-1">
                                    {formatFirestoreDate(transaction.timestamp)}
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <div className={`font-bold ${transaction.points > 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                                </div>
                                {transaction.material && (
                                    <div className="text-xs">
                                        {transaction.weight}{transaction.weightUnit} de {transaction.material}
                                    </div>
                                )}
                                {transaction.location && (
                                    <div className="text-xs">
                                        📍 {transaction.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {filteredTransactions.length > 0 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Mostrando {filteredTransactions.length} de {stats.total} transações
                </div>
            )}
        </div>
    )
}

export default TransactionHistoryFull