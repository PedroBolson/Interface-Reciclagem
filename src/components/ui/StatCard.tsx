import AnimatedCounter from './AnimatedCounter'

interface StatCardProps {
    value: number
    label: string
    suffix?: string
    prefix?: string
    icon: React.ReactNode
    delay: number
    isVisible: boolean
    gradient: string
}

const StatCard = ({
    value,
    label,
    suffix = '',
    prefix = '',
    icon,
    delay,
    isVisible,
    gradient
}: StatCardProps) => {
    return (
        <div
            className={`
        material-card p-6 md:p-8 text-center group hover:scale-105 
        transition-all duration-500 backdrop-blur-md relative overflow-hidden
        ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}
      `}
            style={{
                animationDelay: `${delay}ms`,
                border: '1px solid var(--border)',
                background: 'var(--surface)'
            }}
        >
            {/* Hover Gradient Effect */}
            <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${gradient}`}
            ></div>

            {/* Icon Container */}
            <div className="flex justify-center mb-4 md:mb-6 relative z-10">
                <div className="relative">
                    <div className={`p-3 md:p-4 rounded-2xl bg-gradient-to-br transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${gradient.replace('bg-gradient-to-r', 'from-current/10 to-current/5')}`}>
                        <div className="relative z-10">
                            {icon}
                        </div>
                    </div>

                    {/* Pulse effect */}
                    <div className={`absolute inset-0 rounded-2xl animate-ping opacity-20 group-hover:animate-pulse ${gradient.replace('bg-gradient-to-r', 'bg-current')}`}></div>
                </div>
            </div>

            {/* Counter - Ajustado para números grandes */}
            <div className="mb-3 md:mb-4 relative z-10 min-h-[50px] flex items-center justify-center">
                <AnimatedCounter
                    value={value}
                    suffix={suffix}
                    prefix={prefix}
                    duration={3.5}
                    delay={delay}
                    isVisible={isVisible}
                />
            </div>

            {/* Label */}
            <div
                className="text-sm md:text-base font-semibold tracking-wide uppercase opacity-80 relative z-10 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: 'var(--text-muted)' }}
            >
                {label}
            </div>

            {/* Progress Bar Effect */}
            <div className="mt-4 md:mt-6 relative z-10">
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-out ${gradient.replace('bg-gradient-to-r', 'bg-gradient-to-r')} ${isVisible ? 'w-full' : 'w-0'}`}
                        style={{ transitionDelay: `${delay + 500}ms` }}
                    ></div>
                </div>
            </div>

            {/* Enhanced floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 md:w-2 md:h-2 rounded-full opacity-20 animate-float ${gradient.replace('bg-gradient-to-r', 'bg-current')}`}
                        style={{
                            left: `${15 + i * 25}%`,
                            top: `${20 + i * 15}%`,
                            animationDelay: `${i * 0.7}s`,
                            animationDuration: `${4 + i}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Subtle glow effect */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${gradient} blur-xl`}></div>
        </div>
    )
}

export default StatCard