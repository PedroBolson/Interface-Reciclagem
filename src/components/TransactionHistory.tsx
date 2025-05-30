import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import {
    Recycle,
    Gift,
    Settings,
    Calendar,
    MapPin,
    Award
} from 'lucide-react'

interface TransactionHistoryProps {
    uid: string
    darkMode?: boolean
}

const TransactionHistory = ({ uid }: TransactionHistoryProps) => {
    const [filter, setFilter] = useState<'all' | 'recycling' | 'reward'>('all')
    const [materialFilter, setMaterialFilter] = useState('')

    const { transactions, loading, hasMore, loadMore } = useTransactions({
        uid,
        transactionType: filter === 'all' ? undefined : filter,
        material: materialFilter || undefined
    })

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'recycling':
                return <Recycle className="w-5 h-5 text-green-500" />
            case 'reward':
                return <Gift className="w-5 h-5 text-purple-500" />
            default:
                return <Settings className="w-5 h-5 text-blue-500" />
        }
    }

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'recycling':
                return 'text-green-600 dark:text-green-400'
            case 'reward':
                return 'text-red-600 dark:text-red-400'
            default:
                return 'text-blue-600 dark:text-blue-400'
        }
    }

    if (loading && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                    <option value="all">Todas as transações</option>
                    <option value="recycling">Reciclagem</option>
                    <option value="reward">Recompensas</option>
                </select>

                <input
                    type="text"
                    placeholder="Filtrar por material..."
                    value={materialFilter}
                    onChange={(e) => setMaterialFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
            </div>

            {/* Lista de transações */}
            <div className="space-y-4">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {getTransactionIcon(transaction.type)}
                            </div>

                            <div className="flex-1">
                                <div className="font-medium">
                                    {transaction.type === 'recycling' && (
                                        <>
                                            {(transaction as any).material} - {(transaction as any).weight}{(transaction as any).weightUnit}
                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2 mt-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{(transaction as any).location}</span>
                                            </div>
                                        </>
                                    )}
                                    {transaction.type === 'reward' && (
                                        <>
                                            {(transaction as any).rewardName}
                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2 mt-1">
                                                <Award className="w-4 h-4" />
                                                <span>{(transaction as any).rewardCategory}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`text-right ${getTransactionColor(transaction.type)}`}>
                            <div className="font-bold">
                                {transaction.type === 'recycling' ? '+' : '-'}{transaction.points} pts
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botão carregar mais */}
            {hasMore && (
                <div className="text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                        {loading ? 'Carregando...' : 'Carregar mais'}
                    </button>
                </div>
            )}

            {transactions.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhuma transação encontrada
                </div>
            )}
        </div>
    )
}

export default TransactionHistory