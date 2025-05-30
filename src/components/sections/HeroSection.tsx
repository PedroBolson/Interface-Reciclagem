import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import StatCard from '../ui/StatCard'

const HeroSection = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false)
    const [isTrashAnimating, setIsTrashAnimating] = useState(false)
    const [mobileCounts, setMobileCounts] = useState([0, 0, 0])
    const sectionRef = useRef<HTMLElement>(null)

    const stats = [
        {
            value: 2500000,
            label: 'kg Reciclados',
            suffix: '+',
            prefix: '',
            gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Símbolo de reciclagem melhorado */}
                    <path
                        d="M7 6L3 11L7 16M17 6L21 11L17 16M12 3V8M12 16V21"
                        stroke="var(--color-eco-primary)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />

                    {/* Círculo central */}
                    <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="var(--color-ocean)"
                        strokeWidth="2"
                        fill="url(#recycle-gradient-bg)"
                        opacity="0.8"
                    />

                    {/* Setas de reciclagem */}
                    <path
                        d="M8 4L12 8L16 4"
                        stroke="var(--color-energy)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />

                    <path
                        d="M8 20L12 16L16 20"
                        stroke="var(--color-energy)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />

                    <defs>
                        <linearGradient id="recycle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-eco-primary)" />
                            <stop offset="50%" stopColor="var(--color-ocean)" />
                            <stop offset="100%" stopColor="var(--color-energy)" />
                        </linearGradient>
                        <linearGradient id="recycle-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-eco-primary)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--color-ocean)" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            )
        },
        {
            value: 150000,
            label: 'Usuários Ativos',
            suffix: '+',
            prefix: '',
            gradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Corpo principal mais grosso */}
                    <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        stroke="var(--color-ocean)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="url(#users-gradient-bg)"
                    />

                    {/* Cabeça preenchida */}
                    <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="var(--color-ocean)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="url(#users-gradient-light)"
                    />

                    {/* Usuário adicional mais visível */}
                    <path
                        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                        stroke="var(--color-energy)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.8"
                    />

                    <defs>
                        <linearGradient id="users-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-ocean)" />
                            <stop offset="100%" stopColor="var(--color-energy)" />
                        </linearGradient>
                        <linearGradient id="users-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-ocean)" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="var(--color-energy)" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="users-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-ocean)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--color-energy)" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            )
        },
        {
            value: 500,
            label: 'Pontos de Coleta',
            suffix: '+',
            prefix: '',
            gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Pin principal preenchido */}
                    <path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                        stroke="var(--color-energy)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="url(#location-gradient-bg)"
                    />

                    {/* Círculo interno mais visível */}
                    <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="var(--color-energy)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="var(--color-eco-primary)"
                        opacity="0.8"
                    />

                    {/* Ponto central sólido */}
                    <circle
                        cx="12"
                        cy="10"
                        r="1.5"
                        fill="var(--color-energy)"
                    />

                    <defs>
                        <linearGradient id="location-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-energy)" />
                            <stop offset="100%" stopColor="var(--color-eco-primary)" />
                        </linearGradient>
                        <linearGradient id="location-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-energy)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--color-eco-primary)" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            )
        }
    ]

    const handleTrashButtonClick = () => {
        setIsTrashAnimating(true)

        // Aguarda a animação completar antes de navegar
        setTimeout(() => {
            navigate('/register')
        }, 2000) // 2 segundos para completar toda a animação
    }

    // Função de countup para mobile
    const animateCount = (targetValue: number, index: number, duration: number = 2000) => {
        const startTime = Date.now()
        const startValue = 0

        const updateCount = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)

            // Easing function para suavizar a animação
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const currentValue = Math.floor(startValue + (targetValue * easeOut))

            setMobileCounts(prev => {
                const newCounts = [...prev]
                newCounts[index] = currentValue
                return newCounts
            })

            if (progress < 1) {
                requestAnimationFrame(updateCount)
            }
        }

        requestAnimationFrame(updateCount)
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)

                    // Iniciar countup no mobile após um delay
                    setTimeout(() => {
                        stats.forEach((stat, index) => {
                            setTimeout(() => {
                                animateCount(stat.value, index, 2000)
                            }, index * 300)
                        })
                    }, 500)
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 gradient-eco opacity-5"></div>

            {/* Animated background orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                    {/* Main Title - Responsivo */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
                            Recicle e seja
                        </h1>
                        <span className="text-gradient text-4xl sm:text-5xl md:text-7xl font-extrabold block animate-float">
                            Recompensado
                        </span>
                    </div>

                    {/* Enhanced Subtitle - Compacto no mobile */}
                    <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
                        style={{ color: 'var(--text-secondary)' }}>
                        Transforme seus resíduos em pontos e troque por{' '}
                        <span className="text-gradient font-bold relative">
                            vouchers reais
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform scale-x-0 animate-pulse"></span>
                        </span> do iFood,
                        créditos em mercados parceiros e muito mais.{' '}
                        <span className="text-gradient font-bold">Sustentabilidade que vale a pena!</span>
                    </p>

                    {/* Enhanced Action Buttons - Texto centralizado */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-20">
                        <button
                            onClick={handleTrashButtonClick}
                            disabled={isTrashAnimating}
                            className="eco-button text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-5 group relative overflow-hidden shadow-xl hover:shadow-2xl disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center justify-center gap-2 sm:gap-3 relative z-10 w-full">
                                {/* Lixeira SVG Container - Menor no mobile */}
                                <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                                    {/* Lixeira */}
                                    <svg
                                        className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-300 ${isTrashAnimating ? 'animate-bounce' : 'group-hover:scale-110'
                                            }`}
                                        viewBox="0 0 32 32"
                                        fill="none"
                                    >
                                        {/* Base da lixeira */}
                                        <path
                                            d="M8 10V26C8 27.1 8.9 28 10 28H22C23.1 28 24 27.1 24 26V10H8Z"
                                            fill="currentColor"
                                            opacity="0.8"
                                            className={isTrashAnimating ? 'animate-shake' : ''}
                                        />

                                        {/* Tampa da lixeira */}
                                        <path
                                            d="M6 8H26V10H6V8Z"
                                            fill="currentColor"
                                            className={isTrashAnimating ? 'animate-shake' : ''}
                                        />

                                        {/* Alça da lixeira */}
                                        <path
                                            d="M12 6V4C12 3.4 12.4 3 13 3H19C19.6 3 20 3.4 20 4V6H12Z"
                                            fill="currentColor"
                                            opacity="0.6"
                                        />

                                        {/* Linhas de detalhe */}
                                        <line x1="12" y1="12" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                                        <line x1="16" y1="12" x2="16" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                                        <line x1="20" y1="12" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                                    </svg>

                                    {/* Lixo voando */}
                                    <div
                                        className={`absolute transition-all duration-1000 ${isTrashAnimating
                                            ? 'animate-trash-fall'
                                            : 'opacity-0 -top-4 left-0'
                                            }`}
                                    >
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none">
                                            {/* Papel amassado */}
                                            <circle cx="8" cy="8" r="6" fill="var(--color-eco-primary)" opacity="0.8" />
                                            <circle cx="6" cy="6" r="1" fill="var(--color-eco-primary)" opacity="0.6" />
                                            <circle cx="10" cy="7" r="1" fill="var(--color-eco-primary)" opacity="0.6" />
                                            <circle cx="8" cy="10" r="1" fill="var(--color-eco-primary)" opacity="0.6" />
                                        </svg>
                                    </div>

                                    {/* Segundo lixo */}
                                    <div
                                        className={`absolute transition-all duration-1000 ${isTrashAnimating
                                            ? 'animate-trash-fall-delayed'
                                            : 'opacity-0 -top-4 right-0'
                                            }`}
                                    >
                                        <svg className="w-2 h-2 sm:w-3 sm:h-3" viewBox="0 0 16 16" fill="none">
                                            {/* Folha */}
                                            <path
                                                d="M8 2C10 2 14 6 14 10C14 12 12 14 8 14C4 14 2 12 2 10C2 6 6 2 8 2Z"
                                                fill="var(--color-energy)"
                                                opacity="0.8"
                                            />
                                            <path
                                                d="M8 2C8 6 8 10 8 14"
                                                stroke="var(--color-eco-primary)"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                    </div>

                                    {/* Partículas de impacto */}
                                    {isTrashAnimating && (
                                        <>
                                            <div className="absolute top-6 left-2 w-1 h-1 bg-green-400 rounded-full animate-particle-1"></div>
                                            <div className="absolute top-6 right-2 w-1 h-1 bg-blue-400 rounded-full animate-particle-2"></div>
                                            <div className="absolute top-7 left-4 w-0.5 h-0.5 bg-emerald-400 rounded-full animate-particle-3"></div>
                                        </>
                                    )}
                                </div>

                                <span className={`transition-all duration-300 text-center ${isTrashAnimating ? 'text-green-300' : ''
                                    }`}>
                                    {isTrashAnimating ? 'Reciclando...' : 'Começar Agora'}
                                </span>
                            </span>

                            {/* Efeito de ondas ao clicar */}
                            {isTrashAnimating && (
                                <div className="absolute inset-0 rounded-lg">
                                    <div className="absolute inset-0 bg-green-400/20 rounded-lg animate-ping"></div>
                                    <div className="absolute inset-0 bg-blue-400/20 rounded-lg animate-ping" style={{ animationDelay: '0.3s' }}></div>
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/demo')}
                            className="eco-button-secondary text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-5 group shadow-lg hover:shadow-xl"
                        >
                            <span className="flex items-center justify-center gap-2 sm:gap-3 w-full">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="2" width="20" height="20" rx="3" ry="3" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                    <path d="M13 7h7M13 12h7M13 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="hidden sm:inline text-center">Ver Demo Interativo</span>
                                <span className="sm:hidden text-center">Ver Demo</span>
                            </span>
                        </button>
                    </div>

                    {/* Enhanced Stats with Better Animation - Layout horizontal no mobile */}
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-3 sm:gap-8 max-w-6xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="md:hidden">
                                {/* Versão mobile compacta com countup */}
                                <div className={`
                                    bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 
                                    hover:bg-white/15 transition-all duration-300 text-center
                                    ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                                `}
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                                        <div className="w-6 h-6">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className=" text-lg font-bold mb-1">
                                        {mobileCounts[index].toLocaleString()}{stat.suffix}
                                    </div>
                                    <div className="text-xs font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Versão desktop original */}
                        {stats.map((stat, index) => (
                            <div key={`desktop-${index}`} className="hidden md:block">
                                <StatCard
                                    {...stat}
                                    delay={index * 300}
                                    isVisible={isVisible}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Estilos customizados para as animações */}
            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }

                @keyframes trash-fall {
                    0% {
                        opacity: 1;
                        transform: translateY(-16px) translateX(-8px) rotate(0deg);
                    }
                    30% {
                        transform: translateY(8px) translateX(-4px) rotate(-45deg);
                    }
                    60% {
                        transform: translateY(12px) translateX(2px) rotate(-90deg);
                    }
                    80% {
                        transform: translateY(14px) translateX(1px) rotate(-120deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(16px) translateX(0px) rotate(-180deg);
                    }
                }

                @keyframes trash-fall-delayed {
                    0% {
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                        transform: translateY(-16px) translateX(8px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(8px) translateX(4px) rotate(45deg);
                    }
                    80% {
                        transform: translateY(12px) translateX(-2px) rotate(90deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(16px) translateX(0px) rotate(180deg);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10% { transform: translateX(-2px) rotate(-1deg); }
                    20% { transform: translateX(2px) rotate(1deg); }
                    30% { transform: translateX(-2px) rotate(-1deg); }
                    40% { transform: translateX(2px) rotate(1deg); }
                    50% { transform: translateX(-1px) rotate(-0.5deg); }
                    60% { transform: translateX(1px) rotate(0.5deg); }
                    70% { transform: translateX(-1px) rotate(-0.5deg); }
                    80% { transform: translateX(1px) rotate(0.5deg); }
                    90% { transform: translateX(-1px) rotate(-0.5deg); }
                }

                @keyframes particle-1 {
                    0% { transform: translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: translate(-10px, -10px) scale(0); opacity: 0; }
                }

                @keyframes particle-2 {
                    0% { transform: translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: translate(10px, -8px) scale(0); opacity: 0; }
                }

                @keyframes particle-3 {
                    0% { transform: translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: translate(-6px, -12px) scale(0); opacity: 0; }
                }

                .animate-trash-fall {
                    animation: trash-fall 1s ease-in-out forwards;
                }

                .animate-trash-fall-delayed {
                    animation: trash-fall-delayed 1.2s ease-in-out forwards;
                    animation-delay: 0.3s;
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                    animation-delay: 0.8s;
                }

                .animate-particle-1 {
                    animation: particle-1 0.8s ease-out forwards;
                    animation-delay: 1.2s;
                }

                .animate-particle-2 {
                    animation: particle-2 0.8s ease-out forwards;
                    animation-delay: 1.3s;
                }

                .animate-particle-3 {
                    animation: particle-3 0.8s ease-out forwards;
                    animation-delay: 1.4s;
                }
            `}</style>
        </section>
    )
}

export default HeroSection