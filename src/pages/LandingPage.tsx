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
            <CTASection />
            <Footer id="contact" />
        </div>
    )
}

export default LandingPage