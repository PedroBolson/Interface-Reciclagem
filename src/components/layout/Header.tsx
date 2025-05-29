import { useState, useEffect } from 'react'
import { ChevronUp, LogIn, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'
import Logo from '../ui/Logo'

interface HeaderProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [activeSection, setActiveSection] = useState('home')

    // Detectar scroll para efeitos e seção ativa
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            setIsScrolled(scrollTop > 20)
            setShowScrollTop(scrollTop > 400)

            // Detectar seção ativa
            const sections = ['home', 'about', 'features', 'materials', 'contact']
            const current = sections.find(section => {
                const element = document.getElementById(section)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    return rect.top <= 100 && rect.bottom >= 100
                }
                return false
            })

            if (current) {
                setActiveSection(current)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Navegação suave
    const scrollToSection = (id: string) => {
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            const element = document.getElementById(id)
            if (element) {
                const headerHeight = 80
                const elementPosition = element.offsetTop - headerHeight
                window.scrollTo({ top: elementPosition, behavior: 'smooth' })
            }
        }
        setIsMenuOpen(false)
    }

    // Scroll to top suave
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const navItems = [
        { name: 'Início', id: 'home' },
        { name: 'Sobre', id: 'about' },
        { name: 'Recursos', id: 'features' },
        { name: 'Materiais', id: 'materials' },
        { name: 'Contato', id: 'contact' }
    ]

    // Componente do Logo simplificado
    const RecycleLogo = () => (
        <button
            onClick={scrollToTop}
            className="group flex items-center space-x-3 transition-all duration-500 hover:scale-105 focus:outline-none"
            aria-label="Voltar ao topo"
        >
            {/* Logo Component */}
            <Logo size="md" />

            {/* Texto do logo */}
            <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent group-hover:from-green-500 group-hover:via-blue-500 group-hover:to-emerald-500 transition-all duration-500">
                    EcoRecicla
                </span>
                <div className="h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
        </button>
    )

    return (
        <>
            <header className={`transition-all duration-700 sticky top-0 z-50 ${isScrolled
                ? 'backdrop-blur-xl border-b border-white/20 dark:border-white/10'
                : 'backdrop-blur-lg border-b border-white/10 dark:border-white/5'
                }`}>
                {/* Overlay sutil para melhorar contraste quando scrolled */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${isScrolled
                    ? 'bg-white/5 dark:bg-black/10 opacity-100'
                    : 'bg-white/0 dark:bg-black/0 opacity-0'
                    }`}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <RecycleLogo />
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`group cursor-pointer relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${activeSection === item.id
                                        ? 'bg-white/20 dark:bg-white/10 backdrop-blur-sm'
                                        : ''
                                        }`}
                                >
                                    {/* Background hover effect */}
                                    <div className="absolute inset-0 rounded-lg bg-white/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>

                                    {/* Text */}
                                    <span className={`relative cursor-pointer transition-colors duration-300 ${activeSection === item.id
                                        ? ' font-semibold'
                                        : ' group-hover:text-green-600 dark:group-hover:text-green-400'
                                        }`}>
                                        {item.name}
                                    </span>

                                    {/* Underline effect */}
                                    <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 ease-in-out ${activeSection === item.id ? 'w-3/4 opacity-100' : 'w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100'
                                        }`}></div>

                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                </button>
                            ))}
                        </nav>

                        {/* Auth Buttons + Theme Toggle and Mobile Menu Button */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Auth Buttons - Desktop */}
                            <div className="hidden sm:flex items-center space-x-2">
                                {/* Login Button */}
                                <Link
                                    to="/login"
                                    className="group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    {/* Background */}
                                    <div className="absolute inset-0 rounded-lg bg-white/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>

                                    {/* Content */}
                                    <div className="relative flex items-center space-x-2">
                                        <LogIn size={16} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            Entrar
                                        </span>
                                    </div>
                                </Link>

                                {/* Register Button - MANTÉM INTACTO */}
                                <Link
                                    to="/register"
                                    className="group relative px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                >
                                    {/* Background glow */}
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>

                                    {/* Content */}
                                    <div className="relative flex items-center space-x-2">
                                        <UserPlus size={16} className="transition-transform duration-300 group-hover:scale-110" />
                                        <span className="font-semibold">Cadastre-se</span>
                                    </div>
                                </Link>
                            </div>

                            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="group relative p-2 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                >
                                    {/* Background */}
                                    <div className="absolute inset-0 rounded-lg bg-white/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>

                                    {/* Animated Menu Icon */}
                                    <div className="relative group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                                        <svg
                                            className="w-6 h-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            {/* Primeira barra */}
                                            <line
                                                x1="4"
                                                y1="8"
                                                x2="20"
                                                y2="8"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                className={`transform transition-transform duration-300 ease-in-out origin-center ${isMenuOpen ? 'translate-y-1 rotate-45' : 'translate-y-0 rotate-0'}`}
                                                style={{ transformBox: 'fill-box', transformOrigin: 'center center' }}
                                            />

                                            {/* Segunda barra */}
                                            <line
                                                x1="4"
                                                y1="16"
                                                x2="20"
                                                y2="16"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                className={`transform transition-transform duration-300 ease-in-out origin-center ${isMenuOpen ? '-translate-y-1 -rotate-45' : 'translate-y-0 rotate-0'}`}
                                                style={{ transformBox: 'fill-box', transformOrigin: 'center center' }}
                                            />
                                        </svg>

                                        {/* Partículas de energia ao abrir/fechar */}
                                        {isMenuOpen && (
                                            <>
                                                <div className="absolute top-0 left-0 w-1 h-1 bg-green-400 rounded-full animate-menu-particle-1"></div>
                                                <div className="absolute top-0 right-0 w-1 h-1 bg-blue-400 rounded-full animate-menu-particle-2"></div>
                                                <div className="absolute bottom-0 left-0 w-0.5 h-0.5 bg-emerald-400 rounded-full animate-menu-particle-3"></div>
                                                <div className="absolute bottom-0 right-0 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-menu-particle-4"></div>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden border-t border-white/20 dark:border-white/10">
                            <div className="px-2 pt-2 pb-3 space-y-2 backdrop-blur-xl bg-white/5 dark:bg-black/10">
                                {/* Navigation Items */}
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`group relative w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500/20 ${activeSection === item.id
                                            ? 'bg-white/20 dark:bg-white/10 backdrop-blur-sm'
                                            : ''
                                            }`}
                                    >
                                        {/* Background */}
                                        <div className="absolute inset-0 rounded-lg bg-white/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>

                                        {/* Text */}
                                        <span className={`relative transition-colors duration-300 ${activeSection === item.id
                                            ? 'font-semibold'
                                            : 'group-hover:text-green-600 dark:group-hover:text-green-400'
                                            }`}>
                                            {item.name}
                                        </span>
                                    </button>
                                ))}

                                {/* Mobile Auth Buttons */}
                                <div className="pt-2 space-y-2 border-t border-white/10 dark:border-white/5">
                                    {/* Login Button */}
                                    <Link
                                        to="/login"
                                        className="group relative w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {/* Background */}
                                        <div className="absolute inset-0 rounded-lg bg-white/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>

                                        {/* Content */}
                                        <LogIn size={18} className="relative group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                                        <span className="relative group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            Entrar
                                        </span>
                                    </Link>

                                    {/* Register Button - MANTÉM INTACTO */}
                                    <Link
                                        to="/register"
                                        className="group relative w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {/* Background glow */}
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>

                                        {/* Content */}
                                        <UserPlus size={18} className="relative transition-transform duration-300 group-hover:scale-110" />
                                        <span className="relative font-semibold">Cadastre-se</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 cursor-pointer right-6 z-50 group p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    aria-label="Voltar ao topo"
                >
                    {/* Background glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-lg"></div>

                    {/* Icon */}
                    <ChevronUp size={24} className="relative transform group-hover:-translate-y-0.5 transition-transform duration-300" />
                </button>
            )}

            {/* Estilos customizados para as animações do menu */}
            <style>{`
                @keyframes menu-particle-1 {
                    0% { 
                        transform: translate(0, 0) scale(0); 
                        opacity: 0; 
                    }
                    20% { 
                        transform: translate(0, 0) scale(1); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(-8px, -8px) scale(0); 
                        opacity: 0; 
                    }
                }

                @keyframes menu-particle-2 {
                    0% { 
                        transform: translate(0, 0) scale(0); 
                        opacity: 0; 
                    }
                    25% { 
                        transform: translate(0, 0) scale(1); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(8px, -8px) scale(0); 
                        opacity: 0; 
                    }
                }

                @keyframes menu-particle-3 {
                    0% { 
                        transform: translate(0, 0) scale(0); 
                        opacity: 0; 
                    }
                    30% { 
                        transform: translate(0, 0) scale(1); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(-6px, 8px) scale(0); 
                        opacity: 0; 
                    }
                }

                @keyframes menu-particle-4 {
                    0% { 
                        transform: translate(0, 0) scale(0); 
                        opacity: 0; 
                    }
                    35% { 
                        transform: translate(0, 0) scale(1); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(6px, 8px) scale(0); 
                        opacity: 0; 
                    }
                }

                .animate-menu-particle-1 {
                    animation: menu-particle-1 0.8s ease-out forwards;
                }

                .animate-menu-particle-2 {
                    animation: menu-particle-2 0.8s ease-out forwards;
                    animation-delay: 0.1s;
                }

                .animate-menu-particle-3 {
                    animation: menu-particle-3 0.8s ease-out forwards;
                    animation-delay: 0.2s;
                }

                .animate-menu-particle-4 {
                    animation: menu-particle-4 0.8s ease-out forwards;
                    animation-delay: 0.3s;
                }

                /* Efeito de glow sutil no hover */}
                .group:hover svg line {
                    filter: drop-shadow(0 0 2px currentColor);
                }
            `}</style>
        </>
    )
}

export default Header