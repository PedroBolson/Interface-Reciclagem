import { Recycle, Droplets, Coins, Receipt, Anvil, FileText, Leaf, Battery, Laptop, Package, Zap, RefreshCcw } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface Material {
    name: string
    icon: React.ReactNode
    points: string
    description: string
    color: string
}

// Hook customizado para detectar visibilidade
const useIntersectionObserver = (threshold = 0.3) => {
    const [isVisible, setIsVisible] = useState(false)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setIsVisible(true)
                    setHasAnimated(true)
                }
            },
            { threshold }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [threshold, hasAnimated])

    return { ref, isVisible }
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

const MaterialsSection = () => {
    const navigate = useNavigate()
    const { ref: calculatorRef, isVisible } = useIntersectionObserver(0.3)

    // Values para count-up
    const pointsCount = useCountUp(500, 2000, isVisible)
    const rewardsCount = useCountUp(25, 2000, isVisible)
    const co2Count = useCountUp(15, 2000, isVisible)

    const materials: Material[] = [
        {
            name: 'Plásticos',
            icon: <Package className="w-8 h-8" />,
            points: '5 pts/kg',
            description: 'Garrafas PET, embalagens, sacolas',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            name: 'Vidros',
            icon: <Recycle className="w-8 h-8" />,
            points: '4 pts/kg',
            description: 'Garrafas, potes, frascos diversos',
            color: 'from-emerald-500 to-teal-600'
        },
        {
            name: 'Metais',
            icon: <Anvil className="w-8 h-8" />,
            points: '8 pts/kg',
            description: 'Latas de alumínio, ferro, aço',
            color: 'from-orange-500 to-red-600'
        },
        {
            name: 'Papel',
            icon: <FileText className="w-8 h-8" />,
            points: '3 pts/kg',
            description: 'Jornais, revistas, papelão',
            color: 'from-amber-500 to-yellow-600'
        },
        {
            name: 'Orgânicos',
            icon: <Leaf className="w-8 h-8" />,
            points: '2 pts/kg',
            description: 'Restos de comida, cascas, folhas',
            color: 'from-green-500 to-emerald-600'
        },
        {
            name: 'Óleo',
            icon: <Droplets className="w-8 h-8" />,
            points: '8 pts/L',
            description: 'Óleo de cozinha usado',
            color: 'from-yellow-500 to-orange-600'
        },
        {
            name: 'Baterias',
            icon: <Battery className="w-8 h-8" />,
            points: '17 pts/un',
            description: 'Pilhas, baterias de celular',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            name: 'Eletrônicos',
            icon: <Laptop className="w-8 h-8" />,
            points: '20 pts/kg',
            description: 'Celulares, computadores, TVs',
            color: 'from-slate-500 to-gray-600'
        }
    ]

    return (
        <section id="materials" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        Materiais Aceitos
                    </h2>
                    <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
                        Veja quantos pontos você ganha por cada tipo de material reciclado
                    </p>
                </div>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 text-center md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {materials.map((material, index) => (
                        <div
                            key={index}
                            className="group relative backdrop-blur-sm rounded-xl p-6 border border-green-200/60 dark:border-green-700/60 hover:border-green-300/80 dark:hover:border-green-600/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10"
                        >
                            {/* Background gradient on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${material.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500`}></div>

                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${material.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {material.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                {material.name}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                {material.description}
                            </p>

                            {/* Points Badge */}
                            <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${material.color} text-white text-sm font-semibold group-hover:scale-105 transition-transform duration-300`}>
                                {material.points}
                            </div>

                            {/* Hover effect line */}
                            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${material.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-xl`}></div>
                        </div>
                    ))}
                </div>

                {/* Points Calculator */}
                <div ref={calculatorRef} className="mt-20">
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-green-200/60 dark:border-green-700/60">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                                Calculadora de Pontos
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Estime quantos pontos você pode ganhar com seus materiais recicláveis
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {[
                                {
                                    value: pointsCount,
                                    suffix: "+",
                                    label: "Pontos médios/mês",
                                    icon: <Coins className="w-6 h-6" />,
                                    color: "from-green-500 to-emerald-600"
                                },
                                {
                                    value: rewardsCount,
                                    prefix: "R$ ",
                                    suffix: "+",
                                    label: "Em recompensas",
                                    icon: <Receipt className="w-6 h-6" />,
                                    color: "from-blue-500 to-cyan-600"
                                },
                                {
                                    value: co2Count,
                                    suffix: "kg",
                                    label: "CO₂ economizado",
                                    icon: <Leaf className="w-6 h-6" />,
                                    color: "from-purple-500 to-pink-600"
                                }
                            ].map((item, index) => (
                                <div key={index} className="group">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${item.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 ${isVisible ? 'animate-bounce' : ''}`}>
                                        {item.icon}
                                    </div>
                                    <div className={`text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent transition-all duration-500 ${isVisible ? 'scale-110' : 'scale-100'}`}>
                                        {item.prefix || ""}{item.value}{item.suffix || ""}
                                    </div>
                                    <p className={`text-gray-600 dark:text-gray-400 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'}`}>
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Dicas para Maximizar Pontos
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Limpe os Materiais",
                                description: "Materiais limpos valem mais pontos",
                                icon: <Droplets className="w-6 h-6" />,
                                color: "from-blue-500 to-cyan-600"
                            },
                            {
                                title: "Separe Corretamente",
                                description: "Classificação correta = pontos extras",
                                icon: <Recycle className="w-6 h-6" />,
                                color: "from-green-500 to-emerald-600"
                            },
                            {
                                title: "Recicle Regularmente",
                                description: "Usuários frequentes ganham bônus",
                                icon: <RefreshCcw className="w-6 h-6" />,
                                color: "from-purple-500 to-pink-600"
                            }
                        ].map((tip, index) => (
                            <div key={index} className="text-center group">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${tip.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {tip.icon}
                                </div>
                                <h4 className="text-lg font-bold mb-2 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                    {tip.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {tip.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <button
                        onClick={() => navigate('/login')}
                        className="inline-flex cursor-pointer items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    >
                        <Recycle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-semibold">Comece a pontuar agora</span>
                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default MaterialsSection