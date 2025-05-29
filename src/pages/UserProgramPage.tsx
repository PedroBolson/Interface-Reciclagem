import { ArrowLeft, Gift, Star, Recycle, Target, Trophy, Zap, Leaf, Smartphone, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import ThemeToggle from '../components/ui/ThemeToggle'

interface UserProgramPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

const UserProgramPage = ({ darkMode, toggleDarkMode }: UserProgramPageProps) => {
    // Scroll para o topo ao montar o componente
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-900'
            : 'bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50'
            }`}>
            {/* Header Simples */}
            <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/#contact"
                            className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300" />
                            <span className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                                Voltar
                            </span>
                        </Link>

                        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </div>
                </div>
            </header>

            <main className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-6 animate-pulse">
                            <Target className="w-10 h-10" />
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Programa de Recompensas
                        </h1>

                        <p className="text-xl max-w-4xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
                            Descubra como transformar sua reciclagem em benefícios reais.
                            Cada material reciclado gera pontos que podem ser trocados por vouchers,
                            descontos e experiências incríveis!
                        </p>
                    </div>

                    {/* Como Funciona */}
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-green-200/60 dark:border-green-700/60 mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Como Funciona
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                {
                                    step: "1",
                                    title: "Cadastre-se",
                                    description: "Crie sua conta gratuita",
                                    icon: <Smartphone className="w-6 h-6" />,
                                    color: "from-green-500 to-emerald-600"
                                },
                                {
                                    step: "2",
                                    title: "Recicle",
                                    description: "Deposite materiais em pontos parceiros",
                                    icon: <Recycle className="w-6 h-6" />,
                                    color: "from-blue-500 to-cyan-600"
                                },
                                {
                                    step: "3",
                                    title: "Ganhe Pontos",
                                    description: "Acumule pontos automaticamente",
                                    icon: <Star className="w-6 h-6" />,
                                    color: "from-purple-500 to-pink-600"
                                },
                                {
                                    step: "4",
                                    title: "Troque",
                                    description: "Resgate recompensas incríveis",
                                    icon: <Gift className="w-6 h-6" />,
                                    color: "from-amber-500 to-orange-600"
                                }
                            ].map((item, index) => (
                                <div key={index} className="text-center group">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${item.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 relative`}>
                                        {item.icon}
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-white shadow-lg">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sistema de Pontos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <div className="backdrop-blur-sm rounded-2xl p-8 border border-green-200/60 dark:border-green-700/60">
                            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                                Sistema de Pontuação
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { material: "Plástico", points: "10", unit: "kg", color: "bg-blue-500" },
                                    { material: "Papel", points: "8", unit: "kg", color: "bg-amber-500" },
                                    { material: "Vidro", points: "15", unit: "kg", color: "bg-cyan-500" },
                                    { material: "Metal", points: "20", unit: "kg", color: "bg-gray-500" },
                                    { material: "Eletrônicos", points: "50", unit: "unid", color: "bg-purple-500" },
                                    { material: "Óleo", points: "30", unit: "L", color: "bg-yellow-600" }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-white/20 dark:border-gray-700/50">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                                            <span className="font-medium">{item.material}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-green-600 dark:text-green-400">{item.points} pts</span>
                                            <span className="text-sm text-gray-500 ml-1">por {item.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="backdrop-blur-sm rounded-2xl p-8 border border-blue-200/60 dark:border-blue-700/60">
                            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Algumas Recompensas Disponíveis
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { reward: "Voucher iFood R$ 10", points: "250", partner: "iFood", color: "bg-red-500" },
                                    { reward: "Desconto 20% Extra", points: "349", partner: "Extra", color: "bg-blue-600" },
                                    { reward: "Voucher Uber R$ 15", points: "295", partner: "Uber", color: "bg-black" },
                                    { reward: "Cashback R$ 25", points: "500", partner: "Nubank", color: "bg-purple-600" },
                                    { reward: "Ingresso Cinema", points: "999", partner: "Cinemark", color: "bg-yellow-600" },
                                    { reward: "Curso Sustentabilidade", points: "1500", partner: "EcoRecicla", color: "bg-green-600" }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-4xl border border-white/20 dark:border-gray-700/50 group hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                                            <div>
                                                <span className="font-medium block">{item.reward}</span>
                                                <span className="text-xs text-gray-500">{item.partner}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-blue-600 dark:text-blue-400">{item.points} pts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Benefícios Extras */}
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-purple-200/60 dark:border-purple-700/60 mb-16">
                        <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                            Benefícios Exclusivos
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Multiplicador de Pontos",
                                    description: "Ganhe 2x pontos aos finais de semana",
                                    icon: <Zap className="w-8 h-8" />,
                                    color: "from-yellow-500 to-orange-600"
                                },
                                {
                                    title: "Ranking Mensal",
                                    description: "Compete com outros usuários e ganhe prêmios especiais",
                                    icon: <Trophy className="w-8 h-8" />,
                                    color: "from-purple-500 to-pink-600"
                                },
                                {
                                    title: "Impacto Ambiental",
                                    description: "Veja o impacto real da sua contribuição",
                                    icon: <Leaf className="w-8 h-8" />,
                                    color: "from-green-500 to-emerald-600"
                                }
                            ].map((benefit, index) => (
                                <div key={index} className="text-center group">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${benefit.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        {benefit.icon}
                                    </div>
                                    <h4 className="text-lg font-bold mb-2">{benefit.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        >
                            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-semibold">Começar a Reciclar Agora</span>
                            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        </Link>

                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Cadastro gratuito • Ganhe pontos imediatamente • Sem taxas
                            <br />
                            OBS: Este é um projeto DEMO, para a disciplina Interface Humano Computador FSG
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default UserProgramPage