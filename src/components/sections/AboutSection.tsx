import { Leaf, Users, Target, Award } from 'lucide-react'

const AboutSection = () => {
    const achievements = [
        {
            icon: <Leaf className="w-8 h-8" />,
            title: "Sustentabilidade",
            description: "Comprometidos com um futuro mais verde através de tecnologia inovadora",
            color: "from-green-500 to-emerald-600"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Comunidade",
            description: "Conectando pessoas que se importam com o meio ambiente",
            color: "from-blue-500 to-cyan-600"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Impacto Real",
            description: "Resultados mensuráveis que fazem a diferença no planeta",
            color: "from-purple-500 to-pink-600"
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Excelência",
            description: "Padrões elevados em tudo que fazemos pela natureza",
            color: "from-amber-500 to-orange-600"
        }
    ]

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50/80 via-blue-50/60 to-emerald-50/80 dark:from-gray-900/95 dark:via-green-900/30 dark:to-blue-900/20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        Sobre a EcoRecicla
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Somos uma plataforma inovadora que conecta pessoas, empresas e pontos de coleta,
                        transformando a reciclagem em uma experiência digital moderna e eficiente.
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-green-200/50 dark:border-green-700/50 shadow-xl shadow-green-500/5">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Nossa Missão
                        </h3>
                        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                            Democratizar a reciclagem através da tecnologia, criando um ecossistema onde cada
                            ação individual contribui para um impacto coletivo significativo no meio ambiente.
                            Acreditamos que a sustentabilidade deve ser acessível, conveniente e recompensadora.
                        </p>
                    </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {achievements.map((achievement, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 border border-green-200/60 dark:border-green-700/60 hover:border-green-300/80 dark:hover:border-green-600/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10"
                        >
                            {/* Background gradient on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500`}></div>

                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${achievement.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {achievement.icon}
                            </div>

                            {/* Content */}
                            <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                                {achievement.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {achievement.description}
                            </p>

                            {/* Hover effect line */}
                            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${achievement.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-xl`}></div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200 dark:border-green-700 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                        <Leaf className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-green-700 dark:text-green-300 font-medium">Junte-se a nós nessa jornada sustentável</span>
                        <Leaf className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:-rotate-12 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection
