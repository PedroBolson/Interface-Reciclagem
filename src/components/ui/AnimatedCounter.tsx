import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

interface AnimatedCounterProps {
    value: number
    suffix?: string
    prefix?: string
    duration?: number
    delay?: number
    isVisible: boolean
}

const AnimatedCounter = ({
    value,
    suffix = '',
    prefix = '',
    duration = 3,
    delay = 0,
    isVisible
}: AnimatedCounterProps) => {
    const [shouldStart, setShouldStart] = useState(false)

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setShouldStart(true)
            }, delay)

            return () => clearTimeout(timer)
        }
    }, [isVisible, delay])

    if (!shouldStart) {
        return (
            <span className="text-3xl md:text-4xl font-bold text-gradient block">
                {prefix}0{suffix}
            </span>
        )
    }

    return (
        <CountUp
            start={0}
            end={value}
            duration={duration}
            separator="."
            prefix={prefix}
            suffix={suffix}
            preserveValue
            useEasing
            className="text-3xl md:text-4xl font-bold text-gradient block"
        />
    )
}

export default AnimatedCounter