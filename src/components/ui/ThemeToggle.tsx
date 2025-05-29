import { useState } from 'react'

interface ThemeToggleProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

const ThemeToggle = ({ darkMode, toggleDarkMode }: ThemeToggleProps) => {
    const [isAnimating, setIsAnimating] = useState(false)

    const handleToggle = () => {
        setIsAnimating(true)
        toggleDarkMode()
        setTimeout(() => setIsAnimating(false), 600)
    }

    return (
        <div className="relative group">
            {/* Switch Container */}
            <button
                onClick={handleToggle}
                className={`
                    relative w-16 h-8 cursor-pointer rounded-full transition-all duration-500 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${darkMode
                        ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800'
                        : 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500'
                    }
                    ${isAnimating ? 'scale-105' : 'hover:scale-105'}
                    shadow-lg hover:shadow-xl
                `}
                aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
                {/* Background Elements - Estrelas (Dark Mode) */}
                {darkMode && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                        {/* Estrelas grandes brilhantes - espalhadas */}
                        <div className="absolute top-0.5 left-1 w-1 h-1 bg-white rounded-full animate-twinkle opacity-90"></div>
                        <div className="absolute top-1.5 right-0.5 w-1 h-1 bg-blue-100 rounded-full animate-pulse delay-1500 opacity-85"></div>
                        <div className="absolute bottom-0.5 left-8 w-1 h-1 bg-purple-200 rounded-full animate-twinkle delay-500"></div>
                        <div className="absolute bottom-1.5 right-10 w-1 h-1 bg-yellow-200 rounded-full animate-pulse delay-2500"></div>
                        <div className="absolute top-2 left-6 w-1 h-1 bg-cyan-100 rounded-full animate-twinkle delay-3000 opacity-80"></div>
                        <div className="absolute bottom-2.5 left-12 w-1 h-1 bg-pink-100 rounded-full animate-pulse delay-1200 opacity-85"></div>

                        {/* Estrelas médias piscantes - espalhadas por todo o switch */}
                        <div className="absolute top-1 left-3 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-ping delay-300"></div>
                        <div className="absolute top-0.5 right-2 w-0.5 h-0.5 bg-white rounded-full animate-twinkle delay-700"></div>
                        <div className="absolute bottom-1 left-5 w-0.5 h-0.5 bg-blue-200 rounded-full animate-ping delay-1000"></div>
                        <div className="absolute top-2.5 left-9 w-0.5 h-0.5 bg-purple-300 rounded-full animate-shimmer delay-1700"></div>
                        <div className="absolute top-0.5 right-7 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-ping delay-2200"></div>
                        <div className="absolute bottom-2 right-1 w-0.5 h-0.5 bg-pink-200 rounded-full animate-twinkle delay-800"></div>
                        <div className="absolute top-3 left-11 w-0.5 h-0.5 bg-indigo-300 rounded-full animate-pulse delay-2800"></div>
                        <div className="absolute bottom-0.5 right-5 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-shimmer delay-1500"></div>

                        {/* Estrelas pequenas cintilantes - distribuídas uniformemente */}
                        <div className="absolute top-0.5 left-4 w-0.5 h-0.5 bg-white rounded-full animate-shimmer delay-400 opacity-60"></div>
                        <div className="absolute top-3 left-7 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse delay-1200 opacity-70"></div>
                        <div className="absolute bottom-0.5 left-2 w-0.5 h-0.5 bg-yellow-100 rounded-full animate-twinkle delay-1800"></div>
                        <div className="absolute bottom-2.5 right-3 w-0.5 h-0.5 bg-purple-100 rounded-full animate-shimmer delay-600 opacity-65"></div>
                        <div className="absolute top-1.5 left-10 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping delay-2000"></div>
                        <div className="absolute bottom-3 left-1.5 w-0.5 h-0.5 bg-indigo-200 rounded-full animate-twinkle delay-1400 opacity-75"></div>
                        <div className="absolute top-2 right-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-3200 opacity-55"></div>
                        <div className="absolute bottom-1.5 left-13 w-0.5 h-0.5 bg-blue-200 rounded-full animate-shimmer delay-2600 opacity-70"></div>
                        <div className="absolute top-0.5 left-14 w-0.5 h-0.5 bg-purple-200 rounded-full animate-twinkle delay-3500 opacity-60"></div>
                        <div className="absolute bottom-0.5 right-8 w-0.5 h-0.5 bg-cyan-100 rounded-full animate-pulse delay-900 opacity-65"></div>

                        {/* Constelação - mini estrelas em diferentes áreas */}
                        <div className="absolute top-2 right-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-900 opacity-50"></div>
                        <div className="absolute top-2.5 right-9 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-1100 opacity-55"></div>
                        <div className="absolute top-1.5 right-11 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-1300 opacity-45"></div>
                        <div className="absolute bottom-1 left-14 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2100 opacity-50"></div>
                        <div className="absolute bottom-1.5 left-11 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2300 opacity-55"></div>

                        {/* Estrelas cadentes - atravessando o switch */}
                        <div className="absolute top-0.5 left-0 w-6 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-pulse delay-2000"></div>
                        <div className="absolute bottom-1 left-2 w-5 h-0.5 bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-40 animate-pulse delay-3500"></div>
                        <div className="absolute top-2 left-4 w-4 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-50 animate-pulse delay-4500"></div>

                        {/* Via Láctea sutil - atravessando todo o switch */}
                        <div className="absolute top-1.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-25 animate-pulse delay-4000"></div>
                        <div className="absolute bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-100/10 to-transparent opacity-20 animate-pulse delay-5000"></div>
                    </div>
                )}

                {/* Background Elements - Nuvens (Light Mode) */}
                {!darkMode && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                        {/* Nuvens grandes flutuantes - espalhadas */}
                        <div className="absolute top-1 left-0 w-3 h-1.5 bg-white/50 rounded-full animate-drift"></div>
                        <div className="absolute top-0.5 right-0 w-2.5 h-1.5 bg-white/45 rounded-full animate-float delay-800"></div>
                        <div className="absolute bottom-1.5 right-1 w-2.5 h-1 bg-white/40 rounded-full animate-drift delay-1000"></div>
                        <div className="absolute bottom-1 left-1 w-3 h-1.5 bg-white/42 rounded-full animate-bounce-slow delay-700"></div>
                        <div className="absolute top-0.5 left-5 w-2 h-1 bg-white/38 rounded-full animate-float delay-1200"></div>
                        <div className="absolute bottom-0.5 left-8 w-1.5 h-0.5 bg-white/35 rounded-full animate-drift delay-1600"></div>

                        {/* Nuvens médias dançantes - por toda área */}
                        <div className="absolute top-2 left-2 w-2 h-1 bg-white/35 rounded-full animate-float delay-500"></div>
                        <div className="absolute top-1.5 right-2.5 w-1.5 h-0.5 bg-white/38 rounded-full animate-drift delay-1200"></div>
                        <div className="absolute bottom-2 left-0.5 w-2 h-0.5 bg-white/33 rounded-full animate-float delay-1500"></div>
                        <div className="absolute bottom-0.5 right-2 w-1.5 h-1 bg-white/36 rounded-full animate-bounce-slow delay-300"></div>
                        <div className="absolute top-1 left-7 w-1.5 h-0.5 bg-white/32 rounded-full animate-shimmer delay-2000"></div>
                        <div className="absolute bottom-2.5 left-10 w-1 h-0.5 bg-white/29 rounded-full animate-drift delay-2500"></div>
                        <div className="absolute top-2.5 right-6 w-1 h-0.5 bg-white/31 rounded-full animate-float delay-3000"></div>

                        {/* Nuvens pequenas e vapor - distribuídas uniformemente */}
                        <div className="absolute top-2.5 left-3 w-1 h-0.5 bg-white/28 rounded-full animate-shimmer delay-900"></div>
                        <div className="absolute top-0.5 left-1.5 w-1.5 h-0.5 bg-white/30 rounded-full animate-drift delay-1800"></div>
                        <div className="absolute bottom-2.5 right-0.5 w-1 h-0.5 bg-white/25 rounded-full animate-float delay-2100"></div>
                        <div className="absolute bottom-0.5 left-2.5 w-1.5 h-0.5 bg-white/32 rounded-full animate-bounce-slow delay-400"></div>
                        <div className="absolute top-3 right-1.5 w-1 h-0.5 bg-white/26 rounded-full animate-shimmer delay-1600"></div>
                        <div className="absolute top-0.5 left-9 w-0.5 h-0.5 bg-white/24 rounded-full animate-float delay-2800"></div>
                        <div className="absolute bottom-1 left-12 w-0.5 h-0.5 bg-white/27 rounded-full animate-drift delay-3200"></div>
                        <div className="absolute top-1.5 right-8 w-0.5 h-0.5 bg-white/23 rounded-full animate-shimmer delay-3600"></div>

                        {/* Vapor e neblina - espalhados */}
                        <div className="absolute top-1.5 left-4 w-2 h-0.5 bg-white/20 rounded-full animate-drift delay-2400 opacity-60"></div>
                        <div className="absolute bottom-1.5 right-3 w-1.5 h-0.5 bg-white/22 rounded-full animate-bounce-slow delay-1100 opacity-70"></div>
                        <div className="absolute top-0.5 left-11 w-1 h-0.5 bg-white/18 rounded-full animate-float delay-3400 opacity-50"></div>
                        <div className="absolute bottom-2 right-7 w-1 h-0.5 bg-white/19 rounded-full animate-shimmer delay-3800 opacity-55"></div>

                        {/* Raios de sol expandidos */}
                        <div className="absolute inset-0">
                            {/* Raios cardinais */}
                            <div className="absolute top-0 left-1/2 w-0.5 h-1.5 bg-yellow-200/70 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-1/2 w-0.5 h-1.5 bg-yellow-200/70 rounded-full transform -translate-x-1/2"></div>
                            <div className="absolute top-1/2 left-0 w-1.5 h-0.5 bg-yellow-200/70 rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-1.5 h-0.5 bg-yellow-200/70 rounded-full transform -translate-y-1/2"></div>

                            {/* Raios diagonais */}
                            <div className="absolute top-0.5 left-0.5 w-1 h-0.5 bg-yellow-200/60 rounded-full transform rotate-45"></div>
                            <div className="absolute top-0.5 right-0.5 w-1 h-0.5 bg-yellow-200/60 rounded-full transform -rotate-45"></div>
                            <div className="absolute bottom-0.5 left-0.5 w-1 h-0.5 bg-yellow-200/60 rounded-full transform -rotate-45"></div>
                            <div className="absolute bottom-0.5 right-0.5 w-1 h-0.5 bg-yellow-200/60 rounded-full transform rotate-45"></div>

                            {/* Raios intermediários sutis */}
                            <div className="absolute top-1 left-0 w-0.5 h-0.5 bg-yellow-100/50 rounded-full"></div>
                            <div className="absolute top-1 right-0 w-0.5 h-0.5 bg-yellow-100/50 rounded-full"></div>
                            <div className="absolute bottom-1 left-0 w-0.5 h-0.5 bg-yellow-100/50 rounded-full"></div>
                            <div className="absolute bottom-1 right-0 w-0.5 h-0.5 bg-yellow-100/50 rounded-full"></div>
                        </div>

                        {/* Brilho atmosférico */}
                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-100/20 via-transparent to-cyan-100/15 animate-pulse delay-3000"></div>
                    </div>
                )}

                {/* Switch Thumb */}
                <div
                    className={`
                        absolute top-0.5 w-7 h-7 rounded-full transition-all duration-500 ease-in-out
                        transform ${darkMode ? 'translate-x-0.5' : 'translate-x-8'}
                        ${isAnimating ? 'rotate-180' : ''}
                        shadow-lg z-20
                        ${darkMode
                            ? 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300'
                            : 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400'
                        }
                    `}
                >
                    {/* Lua (Dark Mode) */}
                    {darkMode && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Crateras da lua */}
                            <div className="absolute inset-0 rounded-full">
                                <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-gray-400/40 rounded-full"></div>
                                <div className="absolute top-2 right-1.5 w-0.5 h-0.5 bg-gray-400/30 rounded-full"></div>
                                <div className="absolute bottom-1.5 left-2 w-0.5 h-0.5 bg-gray-400/35 rounded-full"></div>
                            </div>
                            {/* Brilho da lua */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                        </div>
                    )}

                    {/* Sol (Light Mode) */}
                    {!darkMode && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Núcleo do sol */}
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 shadow-inner"></div>
                            {/* Raios rotativos do sol */}
                            <div className="absolute inset-0 animate-spin-slow">
                                <div className="absolute top-0 left-1/2 w-0.5 h-1.5 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-0.5"></div>
                                <div className="absolute bottom-0 left-1/2 w-0.5 h-1.5 bg-yellow-300 rounded-full transform -translate-x-1/2 translate-y-0.5"></div>
                                <div className="absolute top-1/2 left-0 w-1.5 h-0.5 bg-yellow-300 rounded-full transform -translate-y-1/2 -translate-x-0.5"></div>
                                <div className="absolute top-1/2 right-0 w-1.5 h-0.5 bg-yellow-300 rounded-full transform -translate-y-1/2 translate-x-0.5"></div>
                                <div className="absolute top-1 left-1 w-1 h-0.5 bg-yellow-300 rounded-full transform rotate-45"></div>
                                <div className="absolute top-1 right-1 w-1 h-0.5 bg-yellow-300 rounded-full transform -rotate-45"></div>
                                <div className="absolute bottom-1 left-1 w-1 h-0.5 bg-yellow-300 rounded-full transform -rotate-45"></div>
                                <div className="absolute bottom-1 right-1 w-1 h-0.5 bg-yellow-300 rounded-full transform rotate-45"></div>
                            </div>
                            {/* Brilho do sol */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                        </div>
                    )}
                </div>

                {/* Ripple Effect no Click */}
                {isAnimating && (
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                )}
            </button>

            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg">
                    {darkMode ? 'Modo Escuro' : 'Modo Claro'}
                </div>
            </div>
        </div>
    )
}

export default ThemeToggle