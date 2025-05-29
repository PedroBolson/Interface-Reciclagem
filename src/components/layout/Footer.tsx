import { Mail, Phone, MapPin, Heart, Leaf, Recycle, ArrowUp, ExternalLink, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Logo from '../ui/Logo'

const Footer = ({ id }: { id?: string }) => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isTouched, setIsTouched] = useState(false)

    // Detectar scroll para mostrar botão de voltar ao topo
    useEffect(() => {
        const handleScroll = () => {
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Validação do email
    const validateEmail = (value: string): string => {
        if (!value.trim()) return 'Email é obrigatório'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email deve ter um formato válido'
        return ''
    }

    // Handle input change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)

        // Validar em tempo real se já foi tocado
        if (isTouched) {
            const error = validateEmail(value)
            setEmailError(error)
        }
    }

    // Handle blur
    const handleEmailBlur = () => {
        setIsTouched(true)
        const error = validateEmail(email)
        setEmailError(error)
    }

    // Handle submit
    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setIsTouched(true)
        const error = validateEmail(email)
        setEmailError(error)

        if (error) return

        setIsSubmitting(true)

        // Simular envio
        setTimeout(() => {
            setIsSubmitting(false)
            setShowSuccess(true)
            setEmail('')
            setIsTouched(false)
            setEmailError('')

            // Auto-hide success após 3 segundos
            setTimeout(() => {
                setShowSuccess(false)
            }, 3000)
        }, 2000)
    }

    // Componente para exibir erros
    const ErrorMessage = ({ error }: { error: string }) => (
        <div className="flex items-center space-x-2 mt-2 text-red-500 dark:text-red-400 text-sm animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
        </div>
    )

    // Ícones customizados para redes sociais
    const InstagramIcon = () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    )

    const LinkedInIcon = () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    )

    const GitHubIcon = () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    )

    const footerSections = [
        {
            title: 'Produto',
            links: [
                { label: 'Como Funciona', href: '#features', icon: <Recycle className="w-4 h-4" /> },
                { label: 'Programa de Recompensas', href: '/user-program', icon: <Heart className="w-4 h-4" /> },
                { label: 'Para Empresas', href: '/business-program', icon: <Leaf className="w-4 h-4" /> },
                { label: 'Seja Parceiro', href: '/partner', icon: <MapPin className="w-4 h-4" /> }
            ]
        },
        {
            title: 'Suporte',
            links: [
                { label: 'Central de Ajuda', href: '#contact', icon: <Mail className="w-4 h-4" /> },
                { label: 'Contato', href: '#contact', icon: <Phone className="w-4 h-4" /> },
                { label: 'Download App', href: '/app', icon: <ArrowUp className="w-4 h-4" /> },
                { label: 'Status do Sistema', href: '#', icon: <ExternalLink className="w-4 h-4" /> }
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Política de Privacidade', href: '#', icon: <Heart className="w-4 h-4" /> },
                { label: 'Termos de Uso', href: '#', icon: <Leaf className="w-4 h-4" /> },
                { label: 'LGPD', href: '#', icon: <MapPin className="w-4 h-4" /> },
                { label: 'Cookies', href: '#', icon: <Recycle className="w-4 h-4" /> }
            ]
        }
    ]

    const socialLinks = [
        { name: 'Instagram', icon: <InstagramIcon />, href: '', color: 'hover:text-pink-500' },
        { name: 'LinkedIn', icon: <LinkedInIcon />, href: '', color: 'hover:text-blue-500' },
        { name: 'GitHub', icon: <GitHubIcon />, href: 'https://github.com/PedroBolson', color: 'hover:text-gray-600 dark:hover:text-gray-300' }
    ]

    return (
        <footer id={id} className="relative overflow-hidden">
            {/* Background decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-900"></div>

            {/* Padrão de pontos decorativo */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative">
                {/* Conteúdo principal do footer */}
                <div className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                            {/* Branding Section */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <Logo
                                        size="md"
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    />
                                    <div>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                            EcoRecicla
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Seu destino sustentável
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    Transformando reciclagem em oportunidades reais para um futuro sustentável.
                                    Conectamos pessoas conscientes com recompensas que fazem a diferença.
                                </p>

                                {/* Redes sociais */}
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Siga-nos:
                                    </span>
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className={`p-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-110 hover:border-green-300 dark:hover:border-green-600 ${social.color}`}
                                            aria-label={social.name}
                                            target='_blank'
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Links Sections */}
                            {footerSections.map((section, index) => (
                                <div key={index}>
                                    <h4 className="font-bold text-lg mb-6 bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-4">
                                        {section.links.map((link, linkIndex) => (
                                            <li key={linkIndex}>
                                                <a
                                                    href={link.href}
                                                    className="group flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                                                >
                                                    <span className="text-green-500 group-hover:scale-110 transition-transform duration-300">
                                                        {link.icon}
                                                    </span>
                                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                                        {link.label}
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Newsletter Section - Com Validação e Animação */}
                        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-200/60 dark:border-green-700/60">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                {/* Texto à esquerda */}
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                                        Mantenha-se Atualizado
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Receba novidades sobre sustentabilidade e novas recompensas
                                    </p>
                                </div>

                                {/* Form à direita */}
                                <div className="lg:min-w-[400px]">
                                    <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                onBlur={handleEmailBlur}
                                                placeholder="Seu melhor e-mail"
                                                disabled={isSubmitting || showSuccess}
                                                className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${emailError && isTouched
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : showSuccess
                                                        ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                                                        : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                    }`}
                                            />

                                            <button
                                                type="submit"
                                                disabled={isSubmitting || showSuccess || (!!emailError && isTouched)}
                                                className={`relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 whitespace-nowrap ${showSuccess
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 cursor-default'
                                                    : isSubmitting
                                                        ? 'bg-gradient-to-r from-green-400 to-blue-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-lg hover:scale-105'
                                                    } text-white`}
                                            >
                                                {/* Background animation */}
                                                <div className={`absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 transform transition-transform duration-1000 ${isSubmitting ? 'translate-x-0' : 'translate-x-full'
                                                    }`}></div>

                                                {/* Content com animação */}
                                                <div className="relative flex items-center justify-center w-full h-full">
                                                    {/* Estado normal */}
                                                    {!isSubmitting && !showSuccess && (
                                                        <div className="flex items-center space-x-2">
                                                            <Send className="w-4 h-4" />
                                                            <span>Inscrever-se</span>
                                                        </div>
                                                    )}

                                                    {/* Estado enviando */}
                                                    {isSubmitting && (
                                                        <div className="relative flex items-center justify-center w-full">
                                                            {/* Ícone voando */}
                                                            <Send className="absolute w-4 h-4 z-20 transition-all duration-1000 ease-in-out transform animate-pulse"
                                                                style={{
                                                                    left: isSubmitting ? '1rem' : '-2rem',
                                                                    animation: isSubmitting ? 'flyAcross 1s ease-in-out forwards' : 'none'
                                                                }} />

                                                            <span className="text-sm">
                                                                Enviando...
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Estado sucesso */}
                                                    {showSuccess && (
                                                        <div className="flex items-center space-x-2 animate-in fade-in duration-500">
                                                            <CheckCircle className="w-4 h-4 animate-pulse" />
                                                            <span className="text-sm">Inscrito!</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        </div>

                                        {/* Error Message */}
                                        {emailError && isTouched && (
                                            <ErrorMessage error={emailError} />
                                        )}

                                        {/* Success Message */}
                                        {showSuccess && (
                                            <div className="flex items-center space-x-2 mt-2 text-green-600 dark:text-green-400 text-sm animate-in slide-in-from-bottom-1 duration-300">
                                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                                <span>Obrigado! Você receberá nossas novidades em breve 🌱</span>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Bottom section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
                            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span>© 2025 EcoRecicla. Feito com</span>
                                    <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                                    <span>para o planeta</span>
                                </div>

                                <div className="flex items-center space-x-3 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Projeto DEMO - Interface Humano Computador
                                    </span>

                                    {/* Logo FSG */}
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-18 h-18 opacity-70 hover:opacity-100 transition-opacity duration-300"
                                            viewBox="0 0 2048 955"
                                            fill="currentColor"
                                        >
                                            <path transform="translate(432)" d="m0 0h32l5 6 8 7 6 10 5 17 12 74 12 80 2 8h10l64-8 51-4 64-3h70l36 2 27 3 15 4 13 7 6 5 7 11 4 10v15l-6 12-12 13-11 9-18 11-24 14-56 34-24 15-25 16-20 13-14 9-15 10-11 7-21 14-23 16-29 19-4 3 2 10 14 54 19 66 12 40 16 49 12 35 17 46 11 33 4 19v19l-3 12-8 15-11 12-9 6-12 4-11 2-14-1-14-5-16-10-15-13-14-12-31-29-24-22-16-15-39-36-12-11-13-12-8-7-10-9-24-22-8-7-15-14-8-7-11-10-9-6-6 4-25 20-17 12-18 14-11 8-16 12-17 13-11 8-17 13-15 11-18 14-14 10-20 15-14 10-18 13-13 8-13 6-9 2h-11l-13-4-8-6-7-7-9-13v-38l11-30 11-28 15-36 11-25 26-56 38-76 13-23 6-11-1-5-17-14-13-11-11-9-14-12-22-18-14-12-8-8-7-10-3-8v-7l3-9 9-9 17-9 29-12 27-10 42-15 36-12 47-15 18-6 6-4 11-17 10-17 15-24 16-25 10-15 14-22 8-11 7-11 17-25 16-24 9-13 14-19 11-16 9-10 8-7zm-32 100-9 7-7 8-10 13-12 17-13 19-22 33-11 17-23 34-1 2 8-1 27-7 60-14 36-7 2-1v-8l-12-75-6-31-3-6zm284 144-70 2-54 3-37 3-2 1 5 26 8 38 10 50 3 12 1 2 5-1 24-15 13-9 27-18 43-29 36-24 19-13 10-9 2-4v-7l-3-6-9-2zm-254 18-35 5-53 9-49 9-23 5-3 2-6 12-7 11-10 18-14 25-16 29-12 22-15 28-9 16 1 4 15 13 14 12 13 11 14 11 9 8 11 9 14 12 14 11 10 8 5-2 50-34 12-8 25-17 12-8 43-29 19-12 9-6 1-7-19-85-15-77-3-5zm-206 38-65 18-49 15-32 11-16 7-5 4v2h2l2 4 9 10 9 8 16 12 16 13 13 10 16 13 9 7h3l9-15 9-16 14-25 10-17 26-44 8-17zm-67 192-12 27-17 36-18 38-17 36-16 36-7 18v6l4 6 4 4 10-1 12-6 19-13 11-8 16-11 14-10 18-13 14-10 19-14 15-11 17-12 14-10v-4l-10-9-11-9-14-13-8-7-14-12-11-9-26-22-4-3zm331 21-18 12-14 10-17 12-19 13-12 9-17 12-14 10-13 9-8 5 1 3 11 9 13 12 11 9 15 13 12 11 11 9 8 8 8 7 10 9 11 9 10 9 11 9 14 13 8 7 14 12 13 11 11 8 8 1 4-4 1-6-5-19-17-56-16-53-19-67-13-51-2-5z" fill="#375C93"></path>
                                            <path transform="translate(1536,219)" d="m0 0h48l28 4 23 5 9 3 2 3 1 19v35l-6-1-18-7-24-7-12-2-12-1h-22l-21 3-16 5-17 9-13 12-8 9-6 10-6 15-4 18-1 7v23l3 19 6 18 8 14 8 10 8 7 11 7 13 6 17 4 8 1h29l18-3 8-4 1-2 1-86 1-1 60 1v121l-5 5-28 10-26 6-27 4-14 1h-24l-20-2-25-6-18-7-17-9-12-9-12-11-9-10-9-14-8-16-6-15-4-16-2-17v-25l4-15 5-12 8-12 9-10 12-9 15-8 19-6z" fill="#375C93"></path>
                                            <path transform="translate(1258,218)" d="m0 0 27 1 22 4 19 5 9 4 3 3 1 53-5-1-20-8-17-5-24-4h-17l-10 3-8 6-6 9-1 4v8l4 10 6 8 8 6 27 15 22 11 16 10 11 8 10 9 8 10 8 16 4 13 1 6v22l-4 16-8 16-11 13-9 8-14 9-19 7-25 5-10 1h-23l-22-3-21-6-18-7-14-8-2-4 15-29 4-11 2-3 5 1 15 8 16 6 13 3 8 1h25l11-3 9-5 6-5 4-6 2-10-4-13-5-8-7-7-11-7-27-14-22-12-15-10-10-8-8-8-9-14-5-12-3-12v-21l4-15 5-12 8-12 9-10 12-9 15-8 19-6z" fill="#375C93"></path>
                                            <path transform="translate(957,221)" d="m0 0h166l3 1-2 9-11 38-3 4h-87l-5-1v18l-1 51h91l2 2v47l-1 1h-92v122l-1 1-36 1h-22l-2-3v-290z" fill="#375C93"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos customizados para animação */}
            <style>{`
                @keyframes flyAcross {
                    0% {
                        transform: translateX(-100%) rotate(0deg);
                        opacity: 0;
                    }
                    50% {
                        transform: translateX(50%) rotate(180deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(100%) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </footer>
    )
}

export default Footer