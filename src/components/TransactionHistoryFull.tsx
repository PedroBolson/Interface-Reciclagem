import { useState, useEffect } from 'react'
import { getUserTransactions, type Transaction } from '../services/firestoreService'
import { Recycle, Gift, Plus, Clock, TrendingUp, Filter, MapPin, Package, X } from 'lucide-react'

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
    const [locationFilter, setLocationFilter] = useState<string>('all')
    const [materialFilter, setMaterialFilter] = useState<string>('all')
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

    // Obter lista única de localizações e materiais
    const uniqueLocations = Array.from(new Set(
        transactions
            .filter(t => t.location && t.location.trim() !== '')
            .map(t => t.location!)
    )).sort()

    const uniqueMaterials = Array.from(new Set(
        transactions
            .filter(t => t.material && t.material.trim() !== '')
            .map(t => t.material!)
    )).sort()

    // Aplicar todos os filtros
    const filteredTransactions = transactions.filter(transaction => {
        // Filtro por tipo
        if (filter !== 'all' && transaction.type !== filter) {
            return false
        }

        // Filtro por localização
        if (locationFilter !== 'all' && transaction.location !== locationFilter) {
            return false
        }

        // Filtro por material
        if (materialFilter !== 'all' && transaction.material !== materialFilter) {
            return false
        }

        return true
    })

    // Função para limpar todos os filtros
    const clearFilters = () => {
        setFilter('all')
        setLocationFilter('all')
        setMaterialFilter('all')
    }

    // Verificar se há filtros ativos
    const hasActiveFilters = filter !== 'all' || locationFilter !== 'all' || materialFilter !== 'all'

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

    // Estatísticas atualizadas com filtros
    const stats = {
        total: filteredTransactions.length,
        recycling: filteredTransactions.filter(t => t.type === 'recycling').length,
        bonus: filteredTransactions.filter(t => t.type === 'bonus').length,
        reward: filteredTransactions.filter(t => t.type === 'reward').length,
        totalPoints: filteredTransactions.reduce((sum, t) => sum + Math.abs(t.points), 0)
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
        <div className="space-y-6 overflow-x-hidden">
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                <div className="group cursor-pointer border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-300/60 dark:hover:border-blue-600/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {stats.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                        {hasActiveFilters ? 'Filtradas' : 'Total'}
                    </div>
                </div>
                <div className="group cursor-pointer border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-green-300/60 dark:hover:border-green-600/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                        {stats.recycling}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                        Reciclagem
                    </div>
                </div>
                <div className="group cursor-pointer border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-yellow-300/60 dark:hover:border-yellow-600/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors duration-300">
                        {stats.bonus}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                        Bônus
                    </div>
                </div>
                <div className="group cursor-pointer border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-purple-300/60 dark:hover:border-purple-600/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                        {stats.reward}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                        Resgates
                    </div>
                </div>
            </div>

            {/* Controles de Filtro */}
            <div className="space-y-4 px-2">
                {/* Primeira linha de filtros */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                        >
                            <option value="all">Todos os tipos ({transactions.length})</option>
                            <option value="recycling">Reciclagem ({transactions.filter(t => t.type === 'recycling').length})</option>
                            <option value="bonus">Bônus ({transactions.filter(t => t.type === 'bonus').length})</option>
                            <option value="reward">Resgates ({transactions.filter(t => t.type === 'reward').length})</option>
                        </select>
                    </div>

                    <button
                        onClick={() => loadTransactions(true)}
                        disabled={refreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                        <TrendingUp className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
                    </button>
                </div>

                {/* Segunda linha de filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Filtro por localização */}
                    <div className="flex items-center space-x-2 flex-1">
                        <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                            disabled={uniqueLocations.length === 0}
                        >
                            <option value="all">
                                {uniqueLocations.length === 0 ? 'Nenhuma localização' : `Todas as localizações (${uniqueLocations.length})`}
                            </option>
                            {uniqueLocations.map(location => (
                                <option key={location} value={location}>
                                    {location} ({transactions.filter(t => t.location === location).length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por material */}
                    <div className="flex items-center space-x-2 flex-1">
                        <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <select
                            value={materialFilter}
                            onChange={(e) => setMaterialFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                            disabled={uniqueMaterials.length === 0}
                        >
                            <option value="all">
                                {uniqueMaterials.length === 0 ? 'Nenhum material' : `Todos os materiais (${uniqueMaterials.length})`}
                            </option>
                            {uniqueMaterials.map(material => (
                                <option key={material} value={material}>
                                    {material} ({transactions.filter(t => t.material === material).length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botão para limpar filtros */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg whitespace-nowrap"
                        >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Limpar filtros</span>
                        </button>
                    )}
                </div>

                {/* Indicador de filtros ativos */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Filtros ativos:</span>
                        {filter !== 'all' && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                Tipo: {getTypeLabel(filter)}
                            </span>
                        )}
                        {locationFilter !== 'all' && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                Local: {locationFilter}
                            </span>
                        )}
                        {materialFilter !== 'all' && (
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                                Material: {materialFilter}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Lista de transações */}
            <div className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden px-2">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <div className="p-6 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                            <Clock className="w-12 h-12 mx-auto mb-3 opacity-40 text-gray-400 dark:text-gray-500" />
                            <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {hasActiveFilters
                                    ? 'Nenhuma transação encontrada com os filtros aplicados'
                                    : 'Nenhuma transação encontrada'
                                }
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {hasActiveFilters
                                    ? 'Tente ajustar os filtros ou limpe-os para ver todas as transações'
                                    : 'Suas transações aparecerão aqui conforme você usar o app'
                                }
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-3 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    filteredTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="group flex items-center space-x-4 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-gray-300/60 dark:hover:border-gray-600/60 hover:bg-white/80 dark:hover:bg-gray-800/80 cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTransactionColor(transaction.type)} text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105 shadow-lg`}>
                                {getTransactionIcon(transaction.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300">
                                    {getTypeLabel(transaction.type)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                    {transaction.description}
                                </div>
                                <div className="text-xs mt-1 text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                                    {formatFirestoreDate(transaction.timestamp)}
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <div className={`font-bold transition-colors duration-300 ${transaction.points > 0
                                    ? 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300'
                                    : 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300'
                                    }`}>
                                    {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                                </div>
                                {transaction.material && (
                                    <div className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                        {transaction.weight}{transaction.weightUnit} de {transaction.material}
                                    </div>
                                )}
                                {transaction.location && (
                                    <div className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
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
                    Mostrando {filteredTransactions.length} de {transactions.length} transações
                    {hasActiveFilters && ' (filtradas)'}
                </div>
            )}
        </div>
    )
}

export default TransactionHistoryFull