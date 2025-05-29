// filepath: /Volumes/KINGSTON/Projects/Interface-Reciclagem/src/pages/LandingPage.tsx
import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import MaterialsSection from '../components/sections/MaterialsSection'
import CTASection from '../components/sections/CTASection'

const LandingPage = () => {
    const [darkMode, setDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <div className="min-h-screen">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <HeroSection />
            <FeaturesSection />
            <MaterialsSection />
            <CTASection />
            <Footer />
        </div>
    )
}

export default LandingPage