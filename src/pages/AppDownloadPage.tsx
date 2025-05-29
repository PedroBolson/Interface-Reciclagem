import { ArrowLeft, Smartphone, Monitor, Zap, Clock, Star, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import ThemeToggle from '../components/ui/ThemeToggle'

interface AppDownloadPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

const AppDownloadPage = ({ darkMode, toggleDarkMode }: AppDownloadPageProps) => {
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
                        {/* Botão Voltar */}
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
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white mb-6 animate-bounce">
                            <Download className="w-10 h-10" />
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            App em Desenvolvimento
                        </h1>

                        <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
                            Estamos trabalhando para trazer a melhor experiência mobile para você!
                            Nosso foco atual é criar tanto uma interface web excepcional quanto um app
                            que você realmente merece.
                        </p>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 text-center md:grid-cols-2 gap-8 mb-16">
                        <div className="group relative backdrop-blur-sm rounded-xl p-8 border border-green-200/60 dark:border-green-700/60 hover:border-green-300/80 dark:hover:border-green-600/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500"></div>

                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Monitor className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                Interface Web
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                Nossa interface web está sendo desenvolvida para funcionar perfeitamente
                                tanto no desktop quanto no mobile, oferecendo toda funcionalidade que você precisa.
                            </p>

                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    Em desenvolvimento ativo
                                </span>
                            </div>
                        </div>

                        <div className="group relative backdrop-blur-sm rounded-xl p-8 border border-blue-200/60 dark:border-blue-700/60 hover:border-blue-300/80 dark:hover:border-blue-600/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500"></div>

                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Smartphone className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                App Nativo
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                O app nativo para iOS e Android está sendo planejado com todo carinho
                                para oferecer a experiência mobile mais fluida e intuitiva possível.
                            </p>

                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                    Em planejamento
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-green-200/60 dark:border-green-700/60 mb-16">
                        <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Nossa Roadmap
                        </h3>

                        <div className="space-y-6">
                            {[
                                {
                                    title: "Interface Web Responsiva",
                                    description: "Experiência completa no navegador",
                                    status: "progress",
                                    icon: <Monitor className="w-5 h-5" />
                                },
                                {
                                    title: "PWA (Progressive Web App)",
                                    description: "App-like experience na web",
                                    status: "planned",
                                    icon: <Zap className="w-5 h-5" />
                                },
                                {
                                    title: "App iOS & Android",
                                    description: "Apps nativos para máxima performance",
                                    status: "future",
                                    icon: <Smartphone className="w-5 h-5" />
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 rounded-4xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${item.status === 'progress' ? 'bg-green-500' :
                                        item.status === 'planned' ? 'bg-amber-500' :
                                            'bg-gray-400'
                                        } text-white`}>
                                        {item.icon}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'progress' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        item.status === 'planned' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        {item.status === 'progress' ? 'Em andamento' :
                                            item.status === 'planned' ? 'Planejado' :
                                                'Futuro'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <Star className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <Link to="/login" className="font-semibold">Use a versão web enquanto isso!</Link>
                            <Clock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        </div>

                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Cadastre-se agora e seja notificado quando o app estiver disponível
                            <br />
                            OBS: Este é um projeto DEMO, para a disciplina Interface Humano Computador FSG
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AppDownloadPage