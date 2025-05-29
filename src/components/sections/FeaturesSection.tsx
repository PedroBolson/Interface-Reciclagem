interface Feature {
    icon: string
    title: string
    description: string
    color: string
}

const FeaturesSection = () => {
    const features: Feature[] = [
        {
            icon: '🎯',
            title: 'Pontuação Transparente',
            description: 'Cada kg reciclado = pontos. Sistema totalmente transparente com extrato detalhado.',
            color: 'material-plastic'
        },
        {
            icon: '📱',
            title: 'Scanner QR/NFC',
            description: 'Registro automático nos pontos de coleta. Rápido, seguro e sem filas.',
            color: 'material-electronic'
        },
        {
            icon: '🎁',
            title: 'Recompensas Reais',
            description: 'Troque pontos por vouchers do iFood, créditos em mercados parceiros e muito mais.',
            color: 'material-energy'
        },
        {
            icon: '🌍',
            title: 'Impacto Social',
            description: 'Participe de competições por bairro e veja o impacto ambiental em tempo real.',
            color: 'material-organic'
        },
        {
            icon: '📍',
            title: 'Pontos Próximos',
            description: 'Geolocalização inteligente para encontrar o ponto de coleta mais próximo.',
            color: 'material-glass'
        },
        {
            icon: '🔔',
            title: 'Lembretes Inteligentes',
            description: 'Agendamento de coletas porta-a-porta com cooperativas locais.',
            color: 'material-paper'
        }
    ]

    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Como Funciona
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Um ecossistema completo para transformar reciclagem em recompensas reais
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="material-card animate-slide-up group"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`material-icon ${feature.color} mb-4`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                                {feature.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection