import { useNavigate } from 'react-router-dom'
import { Smartphone, Users, Zap, Leaf, Download, Handshake } from 'lucide-react'

const CTASection = () => {
    const navigate = useNavigate()

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-emerald-500/5 dark:from-green-400/10 dark:via-blue-400/10 dark:to-emerald-400/10"></div>

            <div className="max-w-7xl mx-auto relative">
                {/* Main CTA */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        Pronto para Começar?
                    </h2>
                    <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
                        Junte-se a milhares de pessoas que já estão fazendo a diferença para o planeta
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <button
                            onClick={() => navigate('/register')}
                            className="group relative px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        >
                            {/* Background glow */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>

                            {/* Content */}
                            <div className="relative flex items-center justify-center space-x-3">
                                <Download className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                                <span>Baixar App</span>
                                <Smartphone className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/partner')}
                            className="group relative px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm border border-green-200/60 dark:border-green-700/60 hover:border-green-300/80 dark:hover:border-green-600/80 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        >
                            {/* Background */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>

                            {/* Content */}
                            <div className="relative flex items-center justify-center space-x-3">
                                <Handshake className="w-6 h-6 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300" />
                                <span className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                                    Seja Parceiro
                                </span>
                                <Users className="w-6 h-6 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            title: "Para Você",
                            description: "Ganhe pontos reciclando e troque por recompensas reais",
                            benefits: ["Pontos por reciclagem", "Recompensas exclusivas", "Impacto ambiental"],
                            icon: <Smartphone className="w-6 h-6" />,
                            color: "from-green-500 to-emerald-600",
                            action: () => navigate('/register')
                        },
                        {
                            title: "Para Empresas",
                            description: "Conecte-se com consumidores conscientes e sustentáveis",
                            benefits: ["Visibilidade da marca", "Marketing sustentável", "Responsabilidade social"],
                            icon: <Handshake className="w-6 h-6" />,
                            color: "from-blue-500 to-cyan-600",
                            action: () => navigate('/partner')
                        }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="group relative backdrop-blur-sm rounded-xl p-8 border border-green-200/60 dark:border-green-700/60 hover:border-green-300/80 dark:hover:border-green-600/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10"
                        >
                            {/* Background gradient on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500`}></div>

                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${item.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                {item.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                {item.description}
                            </p>

                            {/* Benefits List */}
                            <ul className="space-y-2 mb-6">
                                {item.benefits.map((benefit, benefitIndex) => (
                                    <li key={benefitIndex} className="flex items-center space-x-3">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`}></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action Button */}
                            <button
                                onClick={item.action}
                                className={`w-full px-4 py-3 rounded-lg bg-gradient-to-r ${item.color} text-white font-semibold transition-all duration-300 hover:scale-105 group-hover:shadow-lg`}
                            >
                                Saiba Mais
                            </button>

                            {/* Hover effect line */}
                            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-xl`}></div>
                        </div>
                    ))}
                </div>

                {/* Final Call to Action */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200 dark:border-green-700 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                        <Leaf className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-medium">Transforme reciclagem em recompensas hoje mesmo!</span>
                        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTASection