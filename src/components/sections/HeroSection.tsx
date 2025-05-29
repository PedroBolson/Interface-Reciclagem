import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import StatCard from '../ui/StatCard'

const HeroSection = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    const stats = [
        {
            value: 2500000,
            label: 'kg Reciclados',
            suffix: '+',
            prefix: '',
            gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Círculo de fundo sutil */}
                    <circle
                        cx="25"
                        cy="25"
                        r="22"
                        stroke="url(#recycle-gradient)"
                        strokeWidth="1.5"
                        fill="url(#recycle-gradient-bg)"
                        opacity="0.3"
                    />

                    {/* Símbolo de reciclagem principal */}
                    <path
                        d="M 19.0625 1 C 17.519531 1.089844 15.015625 1.527344 13.6875 3.71875 L 7.59375 14.28125 L 7.09375 15.15625 L 7.96875 15.65625 L 11.5 17.6875 L 3.15625 18.71875 L 0.1875 19.0625 L 2.75 20.5625 L 3.65625 21.09375 L 0.625 26.21875 C 0.246094 26.875 0.0234375 27.707031 0 28.65625 C -0.0234375 29.605469 0.164063 30.691406 0.78125 31.625 C 1.164063 32.207031 2.582031 34.710938 3.9375 37.125 C 5.203125 39.378906 6.351563 41.398438 6.90625 42.28125 C 6.941406 42.382813 6.996094 42.476563 7.0625 42.5625 C 7.070313 42.574219 7.085938 42.582031 7.09375 42.59375 C 7.949219 43.878906 9.550781 45.792969 12.09375 45.84375 L 25.28125 45.84375 L 25.28125 40.78125 L 30.34375 47.5 L 32.15625 49.875 L 32.15625 45.84375 L 38.125 45.9375 C 38.882813 45.9375 39.699219 45.671875 40.53125 45.21875 C 41.363281 44.765625 42.1875 44.09375 42.6875 43.09375 C 43 42.46875 44.464844 39.972656 45.875 37.59375 C 47.214844 35.335938 48.464844 33.273438 48.9375 32.375 C 48.988281 32.308594 49.03125 32.234375 49.0625 32.15625 C 49.066406 32.148438 49.058594 32.132813 49.0625 32.125 C 49.753906 30.742188 50.601563 28.417969 49.375 26.1875 L 49.375 26.15625 L 43.28125 15.59375 L 42.78125 14.75 L 41.90625 15.25 L 38.40625 17.28125 L 41.65625 9.53125 L 42.84375 6.78125 L 40.25 8.28125 L 39.375 8.78125 L 36.4375 3.59375 L 36.40625 3.59375 C 36.027344 2.9375 35.433594 2.335938 34.625 1.84375 C 33.832031 1.359375 32.839844 0.984375 31.75 1.03125 C 31.738281 1.03125 31.730469 1.03125 31.71875 1.03125 C 31.691406 1.03125 31.621094 1.03125 31.59375 1.03125 C 29.5 1.078125 24.636719 1.019531 19.125 1 Z M 19.09375 3 C 19.121094 3 19.128906 3 19.15625 3 C 22.796875 3.011719 24.953125 3.023438 27.4375 3.03125 C 26.988281 3.46875 26.445313 3.84375 26.15625 4.34375 L 24.25 7.65625 L 24.21875 7.71875 C 24.167969 7.785156 24.125 7.859375 24.09375 7.9375 L 17.71875 18.96875 L 9.8125 14.40625 L 15.40625 4.75 C 16.1875 3.457031 17.808594 3.082031 19.09375 3 Z M 31.625 3.03125 C 31.667969 3.035156 31.707031 3.035156 31.75 3.03125 C 31.761719 3.03125 31.769531 3.03125 31.78125 3.03125 C 32.363281 2.996094 33.015625 3.226563 33.5625 3.5625 C 34.109375 3.898438 34.558594 4.371094 34.6875 4.59375 L 38.125 10.65625 L 38.625 11.53125 L 38.6875 11.5 L 36.40625 16.8125 L 30.71875 16.125 L 30.75 16.09375 L 30.25 15.21875 L 26.21875 8.21875 L 27.875 5.34375 C 28.503906 4.253906 30.058594 3.070313 31.625 3.03125 Z M 25.0625 10.25 L 28 15.34375 L 27.125 15.875 L 24.53125 17.375 L 27.5 17.71875 L 35.84375 18.75 L 32.28125 20.78125 L 31.4375 21.28125 L 31.9375 22.15625 L 38.03125 32.75 L 32.15625 32.75 L 32.15625 28.71875 L 30.34375 31.125 L 25.28125 37.84375 L 25.28125 32.75 L 12.0625 32.75 L 15 27.625 L 15.90625 28.15625 L 18.5 29.65625 L 17.3125 26.90625 L 14 19.125 L 17.5625 21.1875 L 18.4375 21.6875 L 18.9375 20.84375 Z M 42.0625 17.46875 L 47.625 27.125 C 48.363281 28.46875 47.828125 30.125 47.25 31.28125 C 47.25 31.285156 47.25 31.308594 47.25 31.3125 C 47.25 31.316406 47.21875 31.339844 47.21875 31.34375 C 47.21875 31.355469 47.21875 31.363281 47.21875 31.375 C 47.027344 31.742188 46.601563 32.085938 46 32.34375 C 45.371094 32.613281 44.59375 32.75 43.96875 32.75 L 40.375 32.75 L 34.15625 22.03125 Z M 12.0625 19.625 L 14.28125 24.90625 L 13.78125 25.78125 L 9.65625 32.90625 C 9.394531 33.082031 9.234375 33.371094 9.21875 33.6875 L 7.375 36.875 C 7.148438 37.269531 7.0625 37.785156 6.90625 38.25 C 6.425781 37.402344 6.226563 37.085938 5.6875 36.125 C 4.332031 33.710938 2.988281 31.339844 2.4375 30.5 C 2.117188 30.011719 1.984375 29.359375 2 28.71875 C 2.015625 28.089844 2.214844 27.484375 2.34375 27.25 C 2.347656 27.246094 2.339844 27.222656 2.34375 27.21875 L 5.875 21.21875 L 6.40625 20.34375 L 6.375 20.3125 Z M 45.375 34.46875 C 44.882813 35.304688 44.714844 35.621094 44.15625 36.5625 C 42.742188 38.941406 41.355469 41.289063 40.90625 42.1875 C 40.644531 42.710938 40.15625 43.160156 39.59375 43.46875 C 39.03125 43.777344 38.382813 43.9375 38.125 43.9375 L 31.15625 43.84375 L 30.15625 43.84375 L 30.15625 43.9375 L 26.65625 39.3125 L 30.15625 34.6875 L 30.15625 34.75 L 43.96875 34.75 C 44.417969 34.75 44.898438 34.5625 45.375 34.46875 Z M 10.90625 34.75 L 23.28125 34.75 L 23.28125 43.84375 L 12.125 43.84375 C 12.113281 43.84375 12.105469 43.84375 12.09375 43.84375 C 10.578125 43.796875 9.429688 42.542969 8.71875 41.46875 C 8.71875 41.457031 8.71875 41.449219 8.71875 41.4375 C 8.472656 41.09375 8.355469 40.523438 8.4375 39.84375 C 8.519531 39.164063 8.78125 38.414063 9.09375 37.875 Z"
                        fill="url(#recycle-gradient)"
                        stroke="var(--color-eco-primary)"
                        strokeWidth="0.3"
                    />

                    {/* Destaque nas setas principais */}
                    <circle
                        cx="25"
                        cy="15"
                        r="2"
                        fill="var(--color-eco-primary)"
                        opacity="0.8"
                    />
                    <circle
                        cx="35"
                        cy="30"
                        r="2"
                        fill="var(--color-ocean)"
                        opacity="0.8"
                    />
                    <circle
                        cx="15"
                        cy="30"
                        r="2"
                        fill="var(--color-energy)"
                        opacity="0.8"
                    />

                    <defs>
                        <linearGradient id="recycle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-eco-primary)" />
                            <stop offset="50%" stopColor="var(--color-ocean)" />
                            <stop offset="100%" stopColor="var(--color-energy)" />
                        </linearGradient>
                        <linearGradient id="recycle-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-eco-primary)" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="var(--color-ocean)" stopOpacity="0.05" />
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
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
                    {/* Main Title */}
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                            Recicle e seja
                        </h1>
                        <span className="text-gradient text-5xl md:text-7xl font-extrabold block animate-float">
                            Recompensado
                        </span>
                    </div>

                    {/* Enhanced Subtitle */}
                    <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
                        style={{ color: 'var(--text-secondary)' }}>
                        Transforme seus resíduos em pontos e troque por{' '}
                        <span className="text-gradient font-bold relative">
                            vouchers reais
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform scale-x-0 animate-pulse"></span>
                        </span> do iFood,
                        créditos em mercados parceiros e muito mais.{' '}
                        <span className="text-gradient font-bold">Sustentabilidade que vale a pena!</span>
                    </p>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                        <button
                            onClick={() => navigate('/register')}
                            className="eco-button text-lg px-10 py-5 group relative overflow-hidden shadow-xl hover:shadow-2xl"
                        >
                            <span className="flex items-center gap-3 relative z-10">
                                <svg className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 24 24" fill="none">
                                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
                                </svg>
                                Começar Agora
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/demo')}
                            className="eco-button-secondary text-lg px-10 py-5 group shadow-lg hover:shadow-xl"
                        >
                            <span className="flex items-center gap-3">
                                <svg className="w-6 h-6 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="2" width="20" height="20" rx="3" ry="3" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                    <path d="M13 7h7M13 12h7M13 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Ver Demo Interativo
                            </span>
                        </button>
                    </div>

                    {/* Enhanced Stats with Better Animation */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {stats.map((stat, index) => (
                            <StatCard
                                key={index}
                                {...stat}
                                delay={index * 300}
                                isVisible={isVisible}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection