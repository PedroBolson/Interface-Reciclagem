import { useNavigate } from 'react-router-dom'

const CTASection = () => {
    const navigate = useNavigate()

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 gradient-eco opacity-10"></div>
            <div className="max-w-4xl mx-auto text-center relative">
                <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    Pronto para Começar?
                </h2>
                <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Junte-se a milhares de pessoas que já estão fazendo a diferença
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/register')}
                        className="eco-button text-lg px-8 py-4"
                    >
                        📱 Baixar App
                    </button>
                    <button
                        onClick={() => navigate('/partner')}
                        className="eco-button-secondary text-lg px-8 py-4"
                    >
                        🤝 Seja Parceiro
                    </button>
                </div>
            </div>
        </section>
    )
}

export default CTASection