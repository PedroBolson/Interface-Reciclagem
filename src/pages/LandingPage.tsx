import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import MaterialsSection from '../components/sections/MaterialsSection'
import CTASection from '../components/sections/CTASection'

interface LandingPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

const LandingPage = ({ darkMode, toggleDarkMode }: LandingPageProps) => {
    const location = useLocation()

    // Detectar hash na URL e rolar para a seção
    useEffect(() => {
        if (location.hash) {
            const elementId = location.hash.substring(1) // Remove o #
            const element = document.getElementById(elementId)

            if (element) {
                // Delay pequeno para garantir que a página carregou
                setTimeout(() => {
                    const headerHeight = 80 // Altura do header fixo
                    const elementPosition = element.offsetTop - headerHeight
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    })
                }, 100)
            }
        }
    }, [location.hash])

    return (
        <div className="min-h-screen">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <section id="home">
                <HeroSection />
            </section>
            <section id="about">
                <AboutSection />
            </section>
            <section id="features">
                <FeaturesSection />
            </section>
            <section id="materials">
                <MaterialsSection />
            </section>
            <section id="contact">
                <CTASection />
            </section>
            <Footer />
        </div>
    )
}

export default LandingPage