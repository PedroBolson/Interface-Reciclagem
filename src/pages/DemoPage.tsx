import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ui/ThemeToggle'
import {
    MapPin,
    Coins,
    Truck,
    TreePine,
    CheckCircle2,
    Play,
    Pause,
    RotateCcw,
    ArrowLeft,
    QrCode,
    Scale,
    Gift
} from 'lucide-react'

interface DemoPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

interface DemoStep {
    id: number
    title: string
    description: string
    icon: React.ComponentType<any>
    color: string
    bgColor: string
    delay: number
}

const DemoPage = ({ darkMode, toggleDarkMode }: DemoPageProps) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const demoSteps: DemoStep[] = [
        {
            id: 1,
            title: "Informar Material e Peso",
            description: "Usuário informa o tipo de material reciclável e o peso estimado para ver os pontos que pode receber",
            icon: Scale,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            delay: 0
        },
        {
            id: 2,
            title: "Escolher Local de Coleta",
            description: "Sistema mostra pontos de coleta próximos, alguns podem oferecer bônus extra",
            icon: MapPin,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            delay: 1000
        },
        {
            id: 3,
            title: "Gerar Código de Reciclagem",
            description: "Sistema gera um código único que deve ser apresentado no local de coleta",
            icon: QrCode,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            delay: 2000
        },
        {
            id: 4,
            title: "Entrega no Local",
            description: "Usuário vai ao local escolhido com o material e apresenta o código",
            icon: Truck,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            delay: 3000
        },
        {
            id: 5,
            title: "Verificação e Pesagem",
            description: "Responsável do app confere o material, pesa e confirma a reciclagem",
            icon: CheckCircle2,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            delay: 4000
        },
        {
            id: 6,
            title: "Receber Pontos",
            description: "Pontos são automaticamente enviados para a conta do usuário",
            icon: Coins,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            delay: 5000
        },
        {
            id: 7,
            title: "Trocar por Prêmios",
            description: "Usuário pode usar os pontos para trocar por diversos prêmios e benefícios",
            icon: Gift,
            color: "text-pink-600",
            bgColor: "bg-pink-100 dark:bg-pink-900/30",
            delay: 6000
        },
        {
            id: 8,
            title: "Impacto Ambiental",
            description: "Contribuição direta para um planeta mais sustentável e economia circular",
            icon: TreePine,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            delay: 7000
        }
    ]

    // Compute positions on a circle (percentages)
    const stepCount = demoSteps.length;
    const center = { x: 50, y: 50 };
    const radius = 45; // 45% of container dimensions (spreads icons farther out)
    const positions = demoSteps.map((_, i) => {
        const angle = (2 * Math.PI * i) / stepCount - Math.PI / 2;
        const baseX = center.x + radius * Math.cos(angle);
        let baseY = center.y + radius * Math.sin(angle);
        // Se for "Verificação e Pesagem" (index 4), move 5% para cima
        if (i === 4) {
            baseY -= 5;
        }
        return {
            x: baseX,
            y: baseY,
        };
    });

    // Auto-play animation
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev >= demoSteps.length - 1) {
                        setIsPlaying(false)
                        return prev
                    }
                    return prev + 1
                })
            }, 3000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isPlaying, demoSteps.length])

    const handlePlay = () => {
        if (currentStep >= demoSteps.length - 1) {
            setCurrentStep(0)
        }
        setIsPlaying(!isPlaying)
    }

    const handleReset = () => {
        setCurrentStep(0)
        setIsPlaying(false)
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-900'
            : 'bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50'
            }`}>

            {/* Simple Header */}
            <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            to="/"
                            className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Voltar
                        </Link>
                        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </div>
                </div>
            </div>

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header da Demo - Título */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Demonstração Interativa
                        </h1>
                    </div>

                    {/* Layout Principal do Topo - Etapa Atual (2/3) + Descrição e Controles (1/3) */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Etapa Atual em Destaque - 2/3 da largura */}
                        <div className="lg:col-span-2">
                            {currentStep < demoSteps.length && (
                                <div className={`p-8 rounded-2xl border shadow-xl ${darkMode
                                    ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                    : 'bg-white/70 border-green-200/50 backdrop-blur-sm'
                                    }`}>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-6">
                                            Etapa Atual
                                        </h3>

                                        <div className={`inline-flex items-center gap-4 p-6 rounded-2xl ${demoSteps[currentStep].bgColor} mb-4`}>
                                            {(() => {
                                                const IconComponent = demoSteps[currentStep].icon;
                                                return <IconComponent className={`w-12 h-12 ${demoSteps[currentStep].color}`} />;
                                            })()}
                                            <div className="text-left">
                                                <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                                    {demoSteps[currentStep].title}
                                                </h4>
                                                <p className="text-lg max-w-2xl">
                                                    {demoSteps[currentStep].description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="max-w-md mx-auto space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                                                <span className="text-gray-800 dark:text-white font-medium">
                                                    {currentStep + 1}/{demoSteps.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                                                    style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Descrição e Controles - 1/3 da largura */}
                        <div className="space-y-6">
                            {/* Descrição */}
                            <div className={`p-6 rounded-2xl border shadow-xl ${darkMode
                                ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                : 'bg-white/70 border-green-200/50 backdrop-blur-sm'
                                }`}>
                                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                                    Veja como nosso sistema revoluciona a reciclagem, conectando pessoas e transformando resíduos em oportunidades
                                </p>

                                {/* Controles da Demo */}
                                <div className="space-y-4">
                                    <button
                                        onClick={handlePlay}
                                        className={`w-full cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${isPlaying
                                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                            : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                                            } shadow-lg`}
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                        {isPlaying ? 'Pausar' : 'Iniciar Demo'}
                                    </button>

                                    <button
                                        onClick={handleReset}
                                        className="w-full cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-all duration-300 hover:scale-105 shadow-lg"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                        Reiniciar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Área Principal da Demo */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Visualização do Fluxo */}
                        <div className="lg:col-span-2">
                            <div className={`relative h-[600px] md:h-[700px] rounded-2xl p-6 border shadow-xl ${darkMode
                                ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                : 'bg-white/70 border-green-200/50 backdrop-blur-sm'
                                }`}>
                                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
                                    Fluxo do Processo
                                </h3>
                                {/* Container do fluxo animado */}
                                <div className="relative w-full h-full">
                                    {demoSteps.map((step, index) => {
                                        const isActive = index <= currentStep;
                                        const isCurrent = index === currentStep;
                                        const Icon = step.icon;
                                        const pos = positions[index];

                                        return (
                                            <div
                                                key={step.id}
                                                className={`absolute transform transition-all duration-1000 ${isActive ? 'scale-100 opacity-100' : 'scale-50 opacity-30'} ${isCurrent ? 'animate-pulse' : ''}`}
                                                style={{
                                                    left: `${pos.x}%`,
                                                    top: `${pos.y}%`,
                                                    transform: `translate(-50%, -50%) ${isActive ? 'scale(1)' : 'scale(0.5)'}`,
                                                    zIndex: isCurrent ? 20 : 10
                                                }}
                                                onClick={() => setCurrentStep(index)}
                                            >
                                                <div className={`relative p-4 rounded-full ${step.bgColor} transition-all duration-500 cursor-pointer hover:scale-110`}>
                                                    <Icon className={`w-8 h-8 ${step.color}`} />

                                                    {/* Tooltip */}
                                                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300 ${isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg border`}>
                                                        {step.title}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Detalhes das Etapas */}
                        <div className="space-y-6">
                            {/* Steps List */}
                            <div className={`p-6 rounded-2xl border shadow-xl ${darkMode
                                ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                : 'bg-white/70 border-green-200/50 backdrop-blur-sm'
                                }`}>
                                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                                    Todas as Etapas
                                </h3>

                                <div className="space-y-2">
                                    {demoSteps.map((step, index) => {
                                        const Icon = step.icon
                                        const isCompleted = index < currentStep
                                        const isCurrent = index === currentStep

                                        return (
                                            <div
                                                key={step.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${isCurrent
                                                    ? step.bgColor + ' ring-2 ring-current'
                                                    : isCompleted
                                                        ? 'bg-green-100 dark:bg-green-900/30'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                    }`}
                                                onClick={() => setCurrentStep(index)}
                                            >
                                                <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-500' : step.bgColor
                                                    }`}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <Icon className={`w-4 h-4 ${step.color}`} />
                                                    )}
                                                </div>
                                                <span className={`text-sm font-medium ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                    {step.title}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default DemoPage
