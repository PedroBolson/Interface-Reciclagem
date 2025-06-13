import { useState, useEffect } from 'react'
import { X, Trophy, Medal, Award, Crown, TrendingUp, Sparkles, Users, Recycle, Leaf } from 'lucide-react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'

interface CityRankingModalProps {
    isOpen: boolean
    onClose: () => void
    darkMode: boolean
    userCity?: string
}

interface CityStats {
    city: string
    totalPoints: number
    totalUsers: number
    averagePerUser: number
    totalRecycled: number
    co2Saved: number
    totalWeight: number
}

const CityRankingModal = ({ isOpen, onClose, darkMode, userCity }: CityRankingModalProps) => {
    const [cityRanking, setCityRanking] = useState<CityStats[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadCityRanking()
        }
    }, [isOpen])

    const loadCityRanking = async () => {
        setLoading(true)
        try {
            console.log('🔍 Carregando ranking de cidades a partir da Cloud Function...')

            // Chamar a Cloud Function getCityRanking
            const getCityRankingFunction = httpsCallable(functions, 'getCityRanking')
            const result = await getCityRankingFunction()

            // Extrair o resultado
            const data = result.data as {
                success: boolean,
                ranking: CityStats[],
                totalCities: number,
                updatedAt: string
            }

            if (!data.success || !data.ranking) {
                console.error('❌ Cloud Function não retornou dados válidos:', data)
                throw new Error('Falha ao carregar ranking de cidades')
            }

            console.log(`🏆 Ranking carregado com sucesso: ${data.totalCities} cidades encontradas`)
            console.log('🏆 Ranking final:', data.ranking)

            // Definir o ranking recebido da Cloud Function
            const ranking = data.ranking

            setCityRanking(ranking)
            setCityRanking(ranking)

        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    const getRankIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Crown className="w-7 h-7 text-yellow-100 drop-shadow-lg" />
            case 2:
                return <Medal className="w-7 h-7 text-white drop-shadow-lg" />
            case 3:
                return <Award className="w-7 h-7 text-orange-100 drop-shadow-lg" />
            default:
                return <Trophy className="w-5 h-5 text-gray-500" />
        }
    }

    const getRankColor = (position: number) => {
        switch (position) {
            case 1:
                return 'from-yellow-400 to-yellow-600'
            case 2:
                return 'from-gray-300 to-gray-500'
            case 3:
                return 'from-amber-500 to-amber-700'
            default:
                return 'from-gray-400 to-gray-600'
        }
    }

    const getRankBgColor = (position: number) => {
        switch (position) {
            case 1:
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
            case 2:
                return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
            case 3:
                return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
            default:
                return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <button
                        onClick={onClose}
                        className="absolute cursor-pointer top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Ranking de Cidades 2025</h2>
                            <p className="text-white/80">Competição anual de reciclagem</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Evento Anual */}
                    <div className={`mb-6 p-4 rounded-xl border-2 border-dashed ${darkMode ? 'border-yellow-400/50 bg-yellow-400/10' : 'border-yellow-500/50 bg-yellow-50'
                        }`}>
                        <div className="flex items-center space-x-2 mb-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <h3 className="font-bold text-yellow-600 dark:text-yellow-400">
                                🏆 Evento Anual EcoRecicla 2025
                            </h3>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            A cidade campeã será celebrada com um evento especial e receberá investimentos em
                            infraestrutura de reciclagem, além de prêmios para todos os participantes da cidade!
                        </p>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="text-center py-12">
                            {/* Animação de troféus competindo */}
                            <div className="flex justify-center items-center space-x-4 mb-6">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center animate-bounce" style={{ animationDelay: '0s' }}>
                                        <Crown className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.2s' }}>
                                        <Medal className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.4s' }}>
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>

                            {/* Barra de progresso temática */}
                            <div className="max-w-xs mx-auto mb-4">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                🏆 Calculando posições das cidades...
                            </p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Analisando dados de reciclagem em tempo real
                            </p>
                        </div>
                    ) : (
                        /* Ranking */
                        <div className="space-y-3">
                            {cityRanking.length === 0 ? (
                                <div className="text-center py-12">
                                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
                                    <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Nenhuma cidade com atividade de reciclagem ainda
                                    </p>
                                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Seja o primeiro a reciclar em sua cidade!
                                    </p>
                                </div>
                            ) : (
                                cityRanking.map((city, index) => (
                                    <div
                                        key={city.city}
                                        className={`relative overflow-hidden rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getRankBgColor(index + 1)
                                            } ${city.city === userCity
                                                ? 'ring-2 ring-blue-500 ring-opacity-50'
                                                : ''
                                            }`}
                                    >
                                        {/* Background gradient for top 3 */}
                                        {index < 3 && (
                                            <div className={`absolute inset-0 bg-gradient-to-r ${getRankColor(index + 1)} opacity-5`} />
                                        )}

                                        <div className="relative flex items-center space-x-4">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(index + 1)} text-white flex items-center justify-center font-bold shadow-lg`}>
                                                    {index < 3 ? getRankIcon(index + 1) : index + 1}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                            {city.city}
                                                        </h3>
                                                        {city.city === userCity && (
                                                            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                                                Sua cidade
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                        <div className="flex items-center space-x-1">
                                                            <Trophy className="w-3 h-3 text-green-500" />
                                                            <div>
                                                                <span className={`block font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                                    {city.totalPoints.toLocaleString()}
                                                                </span>
                                                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    pontos
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-1">
                                                            <Users className="w-3 h-3 text-blue-500" />
                                                            <div>
                                                                <span className={`block font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                                    {city.totalUsers}
                                                                </span>
                                                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    usuários
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-1">
                                                            <Recycle className="w-3 h-3 text-purple-500" />
                                                            <div>
                                                                <span className={`block font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                                                    {city.totalRecycled}
                                                                </span>
                                                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    reciclagens
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-1">
                                                            <Leaf className="w-3 h-3 text-emerald-500" />
                                                            <div>
                                                                <span className={`block font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                                    {city.co2Saved.toFixed(1)}kg
                                                                </span>
                                                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    CO₂ economizado
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Média por usuário
                                                </div>
                                                <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                    {city.averagePerUser.toFixed(0)} pts
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Dados atualizados em tempo real • Evento 2025 em andamento
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CityRankingModal