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
    Gift,
    ChevronLeft,
    ChevronRight
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
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            delay: 0
        },
        {
            id: 2,
            title: "Escolher Local de Coleta",
            description: "Sistema mostra pontos de coleta próximos, alguns podem oferecer bônus extra",
            icon: MapPin,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            delay: 1000
        },
        {
            id: 3,
            title: "Gerar Código de Reciclagem",
            description: "Sistema gera um código único que deve ser apresentado no local de coleta",
            icon: QrCode,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            delay: 2000
        },
        {
            id: 4,
            title: "Entrega no Local",
            description: "Usuário vai ao local escolhido com o material e apresenta o código",
            icon: Truck,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            delay: 3000
        },
        {
            id: 5,
            title: "Verificação e Pesagem",
            description: "Responsável do app confere o material, pesa e confirma a reciclagem",
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            delay: 4000
        },
        {
            id: 6,
            title: "Receber Pontos",
            description: "Pontos são automaticamente enviados para a conta do usuário",
            icon: Coins,
            color: "text-yellow-600 dark:text-yellow-400",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            delay: 5000
        },
        {
            id: 7,
            title: "Trocar por Prêmios",
            description: "Usuário pode usar os pontos para trocar por diversos prêmios e benefícios",
            icon: Gift,
            color: "text-pink-600 dark:text-pink-400",
            bgColor: "bg-pink-100 dark:bg-pink-900/30",
            delay: 6000
        },
        {
            id: 8,
            title: "Impacto Ambiental",
            description: "Contribuição direta para um planeta mais sustentável e economia circular",
            icon: TreePine,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            delay: 7000
        }
    ]

    // Compute positions on a circle (percentages) - para desktop
    const stepCount = demoSteps.length;
    const center = { x: 50, y: 50 };
    const radius = 40;
    const positions = demoSteps.map((_, i) => {
        const angle = (2 * Math.PI * i) / stepCount - Math.PI / 2;
        const baseX = center.x + radius * Math.cos(angle);
        let baseY = center.y + radius * Math.sin(angle);
        if (i === 4) {
            baseY -= 3;
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

    const nextStep = () => {
        if (currentStep < demoSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-900'
            : 'bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50'
            }`}>

            {/* Header */}
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

            <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Título */}
                    <div className="text-center mb-6 lg:mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Como Funciona
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:whitespace-nowrap">
                            Descubra como transformar seus resíduos em recompensas de forma simples e rápida
                        </p>
                    </div>

                    {/* Layout Mobile-First */}
                    <div className="space-y-6">
                        {/* Versão Mobile - Layout Linear */}
                        <div className="block lg:hidden">
                            {/* Etapa Atual - Mobile */}
                            <div className={`p-4 rounded-2xl border shadow-xl mb-6 ${darkMode
                                ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                : 'bg-white/80 border-green-200/50 backdrop-blur-sm'
                                }`}>

                                {/* Progress bar - Mobile */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                                        <span className="text-gray-800 dark:text-white font-medium">
                                            {currentStep + 1}/{demoSteps.length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Etapa atual - Mobile */}
                                <div className={`p-4 rounded-xl ${demoSteps[currentStep].bgColor} mb-4`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        {(() => {
                                            const IconComponent = demoSteps[currentStep].icon;
                                            return <IconComponent className={`w-8 h-8 ${demoSteps[currentStep].color} flex-shrink-0`} />;
                                        })()}
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                            {demoSteps[currentStep].title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {demoSteps[currentStep].description}
                                    </p>
                                </div>

                                {/* Controles de navegação - Mobile */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <button
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-all duration-300"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Anterior
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={currentStep === demoSteps.length - 1}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-all duration-300"
                                    >
                                        Próximo
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Controles Auto-play - Mobile */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handlePlay}
                                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${isPlaying
                                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                            }`}
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        {isPlaying ? 'Pausar' : 'Auto Play'}
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-gray-500 hover:bg-gray-600 text-white transition-all duration-300"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reiniciar
                                    </button>
                                </div>
                            </div>

                            {/* Lista de todas as etapas - Mobile */}
                            <div className={`p-4 rounded-2xl border shadow-xl ${darkMode
                                ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                : 'bg-white/80 border-green-200/50 backdrop-blur-sm'
                                }`}>
                                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
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
                                                    ? step.bgColor + ' ring-2 ring-blue-500 dark:ring-blue-400'
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
                                                <div className="flex-1">
                                                    <span className={`text-sm font-medium block ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                        {step.title}
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            Etapa atual
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Versão Desktop - Layout Original */}
                        <div className="hidden lg:block">
                            {/* Etapa Atual - Desktop */}
                            <div className="mb-8">
                                {currentStep < demoSteps.length && (
                                    <div className={`p-8 rounded-2xl border shadow-xl ${darkMode
                                        ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                        : 'bg-white/70 border-green-200/50 backdrop-blur-sm'
                                        }`}>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                                Etapa Atual
                                            </h3>

                                            {/* Controles - Desktop */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handlePlay}
                                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${isPlaying
                                                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                                        : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                                                        } shadow-lg`}
                                                >
                                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                                    {isPlaying ? 'Pausar' : 'Auto Play'}
                                                </button>

                                                <button
                                                    onClick={handleReset}
                                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-all duration-300 hover:scale-105 shadow-lg"
                                                >
                                                    <RotateCcw className="w-5 h-5" />
                                                    Reiniciar
                                                </button>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-6 p-6 rounded-2xl ${demoSteps[currentStep].bgColor}`}>
                                            {(() => {
                                                const IconComponent = demoSteps[currentStep].icon;
                                                return <IconComponent className={`w-16 h-16 ${demoSteps[currentStep].color} flex-shrink-0`} />;
                                            })()}
                                            <div className="flex-1">
                                                <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                                    {demoSteps[currentStep].title}
                                                </h4>
                                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {demoSteps[currentStep].description}
                                                </p>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {currentStep + 1}/{demoSteps.length}
                                                </span>
                                                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fluxo Circular e Lista de Etapas - Desktop */}
                            <div className="grid lg:grid-cols-4 gap-8">
                                {/* Fluxo Circular - Desktop (maior espaço) */}
                                <div className="lg:col-span-3">
                                    <div className={`relative h-[700px] rounded-2xl p-6 border shadow-xl ${darkMode
                                        ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                        : 'bg-white/70 border-green-200/50 backdrop-blur-sm'
                                        }`}>
                                        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                                            Fluxo do Processo
                                        </h3>
                                        <div className="relative w-full h-full">
                                            {/* Centro do círculo */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                                                <div className={`p-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-2xl border-4 border-green-500`}>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                            {currentStep + 1}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                            de {demoSteps.length}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {demoSteps.map((step, index) => {
                                                const isActive = index <= currentStep;
                                                const isCurrent = index === currentStep;
                                                const Icon = step.icon;
                                                const pos = positions[index];

                                                return (
                                                    <div
                                                        key={step.id}
                                                        className={`absolute transform transition-all duration-1000 ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-50'} ${isCurrent ? 'animate-pulse' : ''}`}
                                                        style={{
                                                            left: `${pos.x}%`,
                                                            top: `${pos.y}%`,
                                                            transform: `translate(-50%, -50%) ${isActive ? 'scale(1)' : 'scale(0.75)'}`,
                                                            zIndex: isCurrent ? 20 : 10
                                                        }}
                                                        onClick={() => setCurrentStep(index)}
                                                    >
                                                        <div className={`relative p-6 rounded-full ${step.bgColor} transition-all duration-500 cursor-pointer hover:scale-110 shadow-lg ${isCurrent ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`}>
                                                            <Icon className={`w-10 h-10 ${step.color}`} />

                                                            {/* Número da etapa */}
                                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                                {index + 1}
                                                            </div>

                                                            {/* Tooltip com título */}
                                                            <div className={`absolute ${index === 4 ? 'bottom-full mb-3' : 'top-full mt-3'} left-1/2 transform -translate-x-1/2 p-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-xl border ${index === 2 ? 'min-w-[240px]' : ''} text-center`}>
                                                                {step.title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Linhas conectoras - incluindo o ciclo completo */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                                                {demoSteps.map((_, index) => {
                                                    const nextIndex = (index + 1) % demoSteps.length;
                                                    const pos1 = positions[index];
                                                    const pos2 = positions[nextIndex];
                                                    const isActiveConnection = index < currentStep;

                                                    // Conexão especial do último para o primeiro (ciclo)
                                                    const isCycleConnection = index === demoSteps.length - 1;
                                                    // Só mostra a linha do ciclo se chegou na última etapa
                                                    const showCycleConnection = isCycleConnection && currentStep >= demoSteps.length - 1;

                                                    return (
                                                        <g key={`connection-${index}`}>
                                                            <line
                                                                x1={`${pos1.x}%`}
                                                                y1={`${pos1.y}%`}
                                                                x2={`${pos2.x}%`}
                                                                y2={`${pos2.y}%`}
                                                                stroke={isActiveConnection ? "#10b981" : showCycleConnection ? "#f59e0b" : darkMode ? "#374151" : "#d1d5db"}
                                                                strokeWidth="3"
                                                                strokeDasharray={isActiveConnection ? "0" : showCycleConnection ? "8,4" : "10,5"}
                                                                className="transition-all duration-1000"
                                                                opacity={isActiveConnection ? 0.8 : showCycleConnection ? 0.6 : darkMode ? 0.15 : 0.3}
                                                            />

                                                            {/* Seta indicando direção */}
                                                            {(isActiveConnection || showCycleConnection) && (
                                                                <polygon
                                                                    points="0,-3 8,0 0,3"
                                                                    fill={showCycleConnection ? "#f59e0b" : "#10b981"}
                                                                    transform={`translate(${(pos1.x + pos2.x) / 2}%, ${(pos1.y + pos2.y) / 2}%) rotate(${Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI})`}
                                                                    opacity={isActiveConnection ? 0.8 : showCycleConnection ? 0.6 : 0.3}
                                                                    className="transition-all duration-1000"
                                                                />
                                                            )}
                                                        </g>
                                                    );
                                                })}
                                            </svg>

                                            {/* Texto explicativo do ciclo - só aparece quando o ciclo é mostrado */}
                                            {currentStep >= demoSteps.length - 1 && (
                                                <div className="absolute bottom-4 right-4 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-300 dark:border-amber-700 animate-fade-in">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="w-4 h-0.5 bg-amber-500" style={{ background: 'repeating-linear-gradient(to right, #f59e0b 0, #f59e0b 8px, transparent 8px, transparent 12px)' }}></div>
                                                        <span className="text-amber-700 dark:text-amber-300 font-medium">Ciclo Contínuo</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Etapas - Desktop (menor espaço) */}
                                <div className="lg:col-span-1">
                                    <div className={`p-6 rounded-2xl border shadow-xl h-[700px] overflow-y-auto ${darkMode
                                        ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                                        : 'bg-white/70 border-green-200/50 backdrop-blur-sm'
                                        }`}>
                                        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white sticky top-0 bg-inherit pb-2">
                                            Etapas
                                        </h3>

                                        <div className="space-y-3">
                                            {demoSteps.map((step, index) => {
                                                const Icon = step.icon
                                                const isCompleted = index < currentStep
                                                const isCurrent = index === currentStep

                                                return (
                                                    <div
                                                        key={step.id}
                                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${isCurrent
                                                            ? step.bgColor + ' ring-2 ring-blue-500'
                                                            : isCompleted
                                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                            }`}
                                                        onClick={() => setCurrentStep(index)}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className={`p-1.5 rounded-full ${isCompleted ? 'bg-green-500' : step.bgColor
                                                                }`}>
                                                                {isCompleted ? (
                                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                                ) : (
                                                                    <Icon className={`w-3 h-3 ${step.color}`} />
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-400">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <span className={`text-sm font-medium block ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                                            } leading-tight`}>
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
                    </div>
                </div>
            </main>
        </div>
    )
}

export default DemoPage
