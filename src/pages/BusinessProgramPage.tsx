import { ArrowLeft, Building, Handshake, TrendingUp, Users, Globe, Award, Target, BarChart3, Heart, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from '../components/ui/ThemeToggle'

interface BusinessProgramPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

// Hook para intersection observer
const useIntersectionObserver = (threshold = 0.3) => {
    const [isVisible, setIsVisible] = useState(false)
    const [ref, setRef] = useState<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!ref) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold, rootMargin: '50px' }
        )

        observer.observe(ref)

        return () => {
            if (ref) observer.unobserve(ref)
        }
    }, [ref, threshold])

    return { ref: setRef, isVisible }
}

// Hook para animação de count-up
const useCountUp = (end: number, duration = 2000, isVisible = false) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isVisible) return

        let startTime: number
        let animationFrame: number

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            // Easing function para suavizar a animação
            const easeOutCubic = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(end * easeOutCubic))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
        }
    }, [end, duration, isVisible])

    return count
}

const BusinessProgramPage = ({ darkMode, toggleDarkMode }: BusinessProgramPageProps) => {
    // Intersection observer para as estatísticas
    const { ref: statsRef, isVisible } = useIntersectionObserver(0.3)

    // Values para count-up (usando valores inteiros reais)
    const pontosCount = useCountUp(250, 2000, isVisible)
    const usuariosCount = useCountUp(50000, 2500, isVisible)
    const materialCount = useCountUp(2000000, 3000, isVisible) // 2M kg
    const trafegoCount = useCountUp(15, 1500, isVisible)

    // Scroll para o topo ao montar o componente
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-900'
            : 'bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50'
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
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white mb-6 animate-pulse">
                            <Building className="w-10 h-10" />
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-emerald-600 dark:from-blue-400 dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Programa Empresarial
                        </h1>

                        <p className="text-xl max-w-4xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
                            Conecte sua empresa com consumidores conscientes e sustentáveis.
                            Torne-se um ponto de coleta e fortaleça sua marca através da responsabilidade socioambiental.
                        </p>
                    </div>

                    {/* Benefícios Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                title: "Visibilidade da Marca",
                                description: "Apareça no mapa para milhares de usuários que buscam pontos de coleta próximos",
                                icon: <Globe className="w-8 h-8" />,
                                color: "from-blue-500 to-cyan-600",
                                stats: "50K+ usuários ativos"
                            },
                            {
                                title: "Marketing Sustentável",
                                description: "Demonstre o compromisso ambiental da sua empresa de forma prática e visível",
                                icon: <TrendingUp className="w-8 h-8" />,
                                color: "from-green-500 to-emerald-600",
                                stats: "300% mais engajamento"
                            },
                            {
                                title: "Responsabilidade Social",
                                description: "Contribua ativamente para um futuro mais sustentável e gere impacto positivo",
                                icon: <Heart className="w-8 h-8" />,
                                color: "from-purple-500 to-pink-600",
                                stats: "2M kg reciclados"
                            }
                        ].map((benefit, index) => (
                            <div key={index} className="backdrop-blur-sm rounded-2xl p-8 border border-green-200/60 dark:border-green-700/60 group hover:scale-105 transition-transform duration-300">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${benefit.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">{benefit.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{benefit.description}</p>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${benefit.color} text-white text-sm font-semibold`}>
                                    {benefit.stats}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Como Participar */}
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-blue-200/60 dark:border-blue-700/60 mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-700 to-green-700 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                            Como se Tornar Parceiro
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                {
                                    step: "1",
                                    title: "Cadastro",
                                    description: "Preencha o formulário de parceria",
                                    icon: <Building className="w-6 h-6" />,
                                    color: "from-blue-500 to-cyan-600"
                                },
                                {
                                    step: "2",
                                    title: "Avaliação",
                                    description: "Nossa equipe avalia sua localização",
                                    icon: <Target className="w-6 h-6" />,
                                    color: "from-green-500 to-emerald-600"
                                },
                                {
                                    step: "3",
                                    title: "Configuração",
                                    description: "Instalamos equipamentos e treinamento",
                                    icon: <Users className="w-6 h-6" />,
                                    color: "from-purple-500 to-pink-600"
                                },
                                {
                                    step: "4",
                                    title: "Ativação",
                                    description: "Seu ponto entra no mapa oficial",
                                    icon: <Award className="w-6 h-6" />,
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
                                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tipos de Parceria */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <div className="backdrop-blur-sm rounded-2xl p-8 border border-green-200/60 dark:border-green-700/60">
                            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                Tipos de Estabelecimentos
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { type: "Supermercados", description: "Alto fluxo de pessoas", icon: "🛒" },
                                    { type: "Farmácias", description: "Presença nos bairros", icon: "⚕️" },
                                    { type: "Postos de Combustível", description: "Localização estratégica", icon: "⛽" },
                                    { type: "Escolas/Universidades", description: "Educação ambiental", icon: "🎓" },
                                    { type: "Empresas", description: "Responsabilidade corporativa", icon: "🏢" },
                                    { type: "Condomínios", description: "Comunidades residenciais", icon: "🏠" }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 rounded-4xl backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <h4 className="font-semibold">{item.type}</h4>
                                            <p className="text-sm">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="backdrop-blur-sm rounded-2xl p-8 border border-purple-200/60 dark:border-purple-700/60">
                            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                Recursos Exclusivos
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { feature: "Dashboard Analytics", description: "Relatórios de impacto ambiental", available: true },
                                    { feature: "Certificação Verde", description: "Selo oficial de sustentabilidade", available: true },
                                    { feature: "Marketing Co-branded", description: "Campanhas conjuntas", available: true },
                                    { feature: "Treinamento Equipe", description: "Capacitação para funcionários", available: true },
                                    { feature: "App Personalizado", description: "Seção exclusiva no app", available: false },
                                    { feature: "Consultoria ESG", description: "Assessoria em sustentabilidade", available: false }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-4xl backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                                        <div>
                                            <h4 className="font-semibold">{item.feature}</h4>
                                            <p className="text-sm">{item.description}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${item.available
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {item.available ? 'Incluído' : 'Em breve'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Estatísticas com CountUp */}
                    <div ref={statsRef} className="backdrop-blur-sm rounded-2xl p-8 border border-amber-200/60 dark:border-amber-700/60 mb-16">
                        <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                            Impacto da Rede de Parceiros
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                {
                                    value: pontosCount,
                                    suffix: "+",
                                    label: "Pontos de Coleta",
                                    color: "from-blue-500 to-cyan-600"
                                },
                                {
                                    value: usuariosCount,
                                    suffix: "+",
                                    label: "Usuários Ativos",
                                    color: "from-green-500 to-emerald-600",
                                    format: (num: number) => `${Math.floor(num / 1000)}K`
                                },
                                {
                                    value: materialCount,
                                    suffix: " kg",
                                    label: "Material Reciclado",
                                    color: "from-purple-500 to-pink-600",
                                    format: (num: number) => `${Math.floor(num / 1000000)}M`
                                },
                                {
                                    value: trafegoCount,
                                    suffix: "%",
                                    label: "Aumento de Tráfego",
                                    color: "from-amber-500 to-orange-600"
                                }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} text-white mb-4`}>
                                        <BarChart3 className="w-8 h-8" />
                                    </div>
                                    <div className="text-3xl font-bold mb-2">
                                        {stat.format ? stat.format(stat.value) : `${stat.value}${stat.suffix}`}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <Link
                            to="/partner"
                            className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <Handshake className="w-5 h-5 group-hover:animate-bounce transition-transform duration-300" />
                            <span className="font-semibold">Tornar-se Parceiro Agora</span>
                            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        </Link>

                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Cadastro gratuito • Suporte completo • Certificação oficial
                            <br />
                            OBS: Este é um projeto DEMO, para a disciplina Interface Humano Computador FSG
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default BusinessProgramPage