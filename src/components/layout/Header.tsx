import { useState, useEffect } from 'react'
import { Menu, X, ChevronUp, LogIn, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'

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

    // Componente do Logo com SVG de reciclagem
    const RecycleLogo = () => (
        <button
            onClick={scrollToTop}
            className="group flex items-center space-x-3 transition-all duration-500 hover:scale-105 focus:outline-none"
            aria-label="Voltar ao topo"
        >
            {/* SVG Logo */}
            <div className="relative">
                <svg
                    className="w-10 h-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Círculo de fundo com glow */}
                    <circle
                        cx="25"
                        cy="25"
                        r="22"
                        stroke="url(#logo-gradient)"
                        strokeWidth="2"
                        fill="url(#logo-gradient-bg)"
                        className="opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                    />

                    {/* Símbolo de reciclagem */}
                    <path
                        d="M 19.0625 1 C 17.519531 1.089844 15.015625 1.527344 13.6875 3.71875 L 7.59375 14.28125 L 7.09375 15.15625 L 7.96875 15.65625 L 11.5 17.6875 L 3.15625 18.71875 L 0.1875 19.0625 L 2.75 20.5625 L 3.65625 21.09375 L 0.625 26.21875 C 0.246094 26.875 0.0234375 27.707031 0 28.65625 C -0.0234375 29.605469 0.164063 30.691406 0.78125 31.625 C 1.164063 32.207031 2.582031 34.710938 3.9375 37.125 C 5.203125 39.378906 6.351563 41.398438 6.90625 42.28125 C 6.941406 42.382813 6.996094 42.476563 7.0625 42.5625 C 7.070313 42.574219 7.085938 42.582031 7.09375 42.59375 C 7.949219 43.878906 9.550781 45.792969 12.09375 45.84375 L 25.28125 45.84375 L 25.28125 40.78125 L 30.34375 47.5 L 32.15625 49.875 L 32.15625 45.84375 L 38.125 45.9375 C 38.882813 45.9375 39.699219 45.671875 40.53125 45.21875 C 41.363281 44.765625 42.1875 44.09375 42.6875 43.09375 C 43 42.46875 44.464844 39.972656 45.875 37.59375 C 47.214844 35.335938 48.464844 33.273438 48.9375 32.375 C 48.988281 32.308594 49.03125 32.234375 49.0625 32.15625 C 49.066406 32.148438 49.058594 32.132813 49.0625 32.125 C 49.753906 30.742188 50.601563 28.417969 49.375 26.1875 L 49.375 26.15625 L 43.28125 15.59375 L 42.78125 14.75 L 41.90625 15.25 L 38.40625 17.28125 L 41.65625 9.53125 L 42.84375 6.78125 L 40.25 8.28125 L 39.375 8.78125 L 36.4375 3.59375 L 36.40625 3.59375 C 36.027344 2.9375 35.433594 2.335938 34.625 1.84375 C 33.832031 1.359375 32.839844 0.984375 31.75 1.03125 C 31.738281 1.03125 31.730469 1.03125 31.71875 1.03125 C 31.691406 1.03125 31.621094 1.03125 31.59375 1.03125 C 29.5 1.078125 24.636719 1.019531 19.125 1 Z M 19.09375 3 C 19.121094 3 19.128906 3 19.15625 3 C 22.796875 3.011719 24.953125 3.023438 27.4375 3.03125 C 26.988281 3.46875 26.445313 3.84375 26.15625 4.34375 L 24.25 7.65625 L 24.21875 7.71875 C 24.167969 7.785156 24.125 7.859375 24.09375 7.9375 L 17.71875 18.96875 L 9.8125 14.40625 L 15.40625 4.75 C 16.1875 3.457031 17.808594 3.082031 19.09375 3 Z M 31.625 3.03125 C 31.667969 3.035156 31.707031 3.035156 31.75 3.03125 C 31.761719 3.03125 31.769531 3.03125 31.78125 3.03125 C 32.363281 2.996094 33.015625 3.226563 33.5625 3.5625 C 34.109375 3.898438 34.558594 4.371094 34.6875 4.59375 L 38.125 10.65625 L 38.625 11.53125 L 38.6875 11.5 L 36.40625 16.8125 L 30.71875 16.125 L 30.75 16.09375 L 30.25 15.21875 L 26.21875 8.21875 L 27.875 5.34375 C 28.503906 4.253906 30.058594 3.070313 31.625 3.03125 Z M 25.0625 10.25 L 28 15.34375 L 27.125 15.875 L 24.53125 17.375 L 27.5 17.71875 L 35.84375 18.75 L 32.28125 20.78125 L 31.4375 21.28125 L 31.9375 22.15625 L 38.03125 32.75 L 32.15625 32.75 L 32.15625 28.71875 L 30.34375 31.125 L 25.28125 37.84375 L 25.28125 32.75 L 12.0625 32.75 L 15 27.625 L 15.90625 28.15625 L 18.5 29.65625 L 17.3125 26.90625 L 14 19.125 L 17.5625 21.1875 L 18.4375 21.6875 L 18.9375 20.84375 Z M 42.0625 17.46875 L 47.625 27.125 C 48.363281 28.46875 47.828125 30.125 47.25 31.28125 C 47.25 31.285156 47.25 31.308594 47.25 31.3125 C 47.25 31.316406 47.21875 31.339844 47.21875 31.34375 C 47.21875 31.355469 47.21875 31.363281 47.21875 31.375 C 47.027344 31.742188 46.601563 32.085938 46 32.34375 C 45.371094 32.613281 44.59375 32.75 43.96875 32.75 L 40.375 32.75 L 34.15625 22.03125 Z M 12.0625 19.625 L 14.28125 24.90625 L 13.78125 25.78125 L 9.65625 32.90625 C 9.394531 33.082031 9.234375 33.371094 9.21875 33.6875 L 7.375 36.875 C 7.148438 37.269531 7.0625 37.785156 6.90625 38.25 C 6.425781 37.402344 6.226563 37.085938 5.6875 36.125 C 4.332031 33.710938 2.988281 31.339844 2.4375 30.5 C 2.117188 30.011719 1.984375 29.359375 2 28.71875 C 2.015625 28.089844 2.214844 27.484375 2.34375 27.25 C 2.347656 27.246094 2.339844 27.222656 2.34375 27.21875 L 5.875 21.21875 L 6.40625 20.34375 L 6.375 20.3125 Z M 45.375 34.46875 C 44.882813 35.304688 44.714844 35.621094 44.15625 36.5625 C 42.742188 38.941406 41.355469 41.289063 40.90625 42.1875 C 40.644531 42.710938 40.15625 43.160156 39.59375 43.46875 C 39.03125 43.777344 38.382813 43.9375 38.125 43.9375 L 31.15625 43.84375 L 30.15625 43.84375 L 30.15625 43.9375 L 26.65625 39.3125 L 30.15625 34.6875 L 30.15625 34.75 L 43.96875 34.75 C 44.417969 34.75 44.898438 34.5625 45.375 34.46875 Z M 10.90625 34.75 L 23.28125 34.75 L 23.28125 43.84375 L 12.125 43.84375 C 12.113281 43.84375 12.105469 43.84375 12.09375 43.84375 C 10.578125 43.796875 9.429688 42.542969 8.71875 41.46875 C 8.71875 41.457031 8.71875 41.449219 8.71875 41.4375 C 8.472656 41.09375 8.355469 40.523438 8.4375 39.84375 C 8.519531 39.164063 8.78125 38.414063 9.09375 37.875 Z"
                        fill="url(#logo-gradient)"
                        stroke="currentColor"
                        strokeWidth="0.2"
                        className="drop-shadow-lg"
                    />

                    {/* Pontos de destaque */}
                    <circle cx="25" cy="15" r="1.5" fill="var(--color-eco-primary)" className="animate-pulse" />
                    <circle cx="35" cy="30" r="1.5" fill="var(--color-ocean)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <circle cx="15" cy="30" r="1.5" fill="var(--color-energy)" className="animate-pulse" style={{ animationDelay: '1s' }} />

                    <defs>
                        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-eco-primary)" />
                            <stop offset="50%" stopColor="var(--color-ocean)" />
                            <stop offset="100%" stopColor="var(--color-energy)" />
                        </linearGradient>
                        <linearGradient id="logo-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-eco-primary)" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="var(--color-ocean)" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl -z-10"></div>
            </div>

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

                                    {/* Icon */}
                                    <div className="relative text-black dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                                            ? 'text-green-600 dark:text-green-400 font-semibold'
                                            : 'text-black dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400'
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
                                        <LogIn size={18} className="relative text-black/70 dark:text-white/70 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                                        <span className="relative text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
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
                    className="fixed bottom-6 right-6 z-50 group p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    aria-label="Voltar ao topo"
                >
                    {/* Background glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-lg"></div>

                    {/* Icon */}
                    <ChevronUp size={24} className="relative transform group-hover:-translate-y-0.5 transition-transform duration-300" />
                </button>
            )}
        </>
    )
}

export default Header