import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'

interface HeaderProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
    const navigate = useNavigate()

    return (
        <header className="glass-effect sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-eco rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            ♻️
                        </div>
                        <h1 className="text-xl font-bold text-gradient">EcoRecicla</h1>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <a
                            href="#features"
                            className="text-sm font-medium hover:text-eco-primary transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Funcionalidades
                        </a>
                        <a
                            href="#materials"
                            className="text-sm font-medium hover:text-eco-primary transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Materiais
                        </a>
                        <a
                            href="#impact"
                            className="text-sm font-medium hover:text-eco-primary transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Impacto
                        </a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

                        <button
                            onClick={() => navigate('/login')}
                            className="eco-button-secondary text-sm px-4 py-2"
                        >
                            Entrar
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className="eco-button text-sm px-4 py-2"
                        >
                            Cadastrar
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header