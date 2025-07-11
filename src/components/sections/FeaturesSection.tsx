import { Target, Smartphone, Gift, Globe, MapPin, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Feature {
    icon: React.ReactNode
    title: string
    description: string
    color: string
}

const FeaturesSection = () => {
    const navigate = useNavigate()

    const features: Feature[] = [
        {
            icon: <Target className="w-8 h-8" />,
            title: 'Pontuação Transparente',
            description: 'Cada kg reciclado = pontos. Sistema totalmente transparente com extrato detalhado.',
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: 'Scanner QR/NFC',
            description: 'Registro automático nos pontos de coleta. Rápido, seguro e sem filas.',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            icon: <Gift className="w-8 h-8" />,
            title: 'Recompensas Reais',
            description: 'Troque pontos por vouchers do iFood, créditos em mercados parceiros e muito mais.',
            color: 'from-purple-500 to-pink-600'
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: 'Impacto Social',
            description: 'Participe de competições por bairro e veja o impacto ambiental em tempo real.',
            color: 'from-amber-500 to-orange-600'
        },
        {
            icon: <MapPin className="w-8 h-8" />,
            title: 'Pontos Próximos',
            description: 'Geolocalização inteligente para encontrar o ponto de coleta mais próximo.',
            color: 'from-teal-500 to-cyan-600'
        },
        {
            icon: <Bell className="w-8 h-8" />,
            title: 'Lembretes Inteligentes',
            description: 'Agendamento de coletas porta-a-porta com cooperativas locais.',
            color: 'from-indigo-500 to-purple-600'
        }
    ]

    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Desktop Layout - Completo */}
                <div className="hidden lg:block">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Como Funciona
                        </h2>
                        <p className="text-xl max-w-3xl mx-auto leading-relaxed">
                            Um ecossistema completo para transformar reciclagem em recompensas reais
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 text-center md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative backdrop-blur-sm rounded-xl p-6 border border-green-200/60 dark:border-green-700/60 hover:border-green-300/80 dark:hover:border-green-600/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10"
                            >
                                {/* Background gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500`}></div>

                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover effect line */}
                                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-xl`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile/Tablet Layout - Apenas Processo Simples */}
                <div className="lg:hidden">
                    {/* Header Mobile - Apenas Processo Simples */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Processo Simples
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Em apenas 3 passos você já está reciclando e ganhando recompensas
                        </p>
                    </div>

                    {/* Process Steps - Mobile */}
                    <div className="space-y-8 relative">
                        {[
                            {
                                step: "01",
                                title: "Escaneie",
                                description: "Use o QR Code no ponto de coleta",
                                icon: <Smartphone className="w-6 h-6" />,
                                color: "from-green-500 to-emerald-600"
                            },
                            {
                                step: "02",
                                title: "Recicle",
                                description: "Deposite seus materiais recicláveis",
                                icon: <Target className="w-6 h-6" />,
                                color: "from-blue-500 to-cyan-600"
                            },
                            {
                                step: "03",
                                title: "Ganhe",
                                description: "Acumule pontos e troque por recompensas",
                                icon: <Gift className="w-6 h-6" />,
                                color: "from-purple-500 to-pink-600"
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 group">
                                {/* Step Number & Icon Container */}
                                <div className="flex-shrink-0 relative">
                                    {/* Step Number */}
                                    <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${item.color} text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        {item.step}
                                    </div>

                                    {/* Icon - Positioned over the number */}
                                    <div className={`absolute -bottom-2 -right-2 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Connection Line (for mobile vertical layout) */}
                                {index < 2 && (
                                    <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-green-400 to-blue-400 opacity-30"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Process Flow - Desktop Only */}
                <div className="hidden lg:block mt-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Processo Simples
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Em apenas 3 passos você já está reciclando e ganhando recompensas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
                        {[
                            {
                                step: "01",
                                title: "Escaneie",
                                description: "Use o QR Code no ponto de coleta",
                                icon: <Smartphone className="w-6 h-6" />,
                                color: "from-green-500 to-emerald-600"
                            },
                            {
                                step: "02",
                                title: "Recicle",
                                description: "Deposite seus materiais recicláveis",
                                icon: <Target className="w-6 h-6" />,
                                color: "from-blue-500 to-cyan-600"
                            },
                            {
                                step: "03",
                                title: "Ganhe",
                                description: "Acumule pontos e troque por recompensas",
                                icon: <Gift className="w-6 h-6" />,
                                color: "from-purple-500 to-pink-600"
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center group relative">
                                {/* Step Number */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${item.color} text-white text-xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.step}
                                </div>

                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <h4 className="text-lg font-bold mb-2 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                    {item.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {item.description}
                                </p>

                                {/* Connection Arrow (hidden on mobile) */}
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 transform translate-x-4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12 lg:mt-16">
                    <button
                        onClick={() => navigate('/register')}
                        className="inline-flex cursor-pointer items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    >
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-semibold text-sm sm:text-base">Comece a reciclar hoje</span>
                        <Gift className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection