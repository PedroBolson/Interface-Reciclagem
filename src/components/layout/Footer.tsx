const Footer = () => {
    const footerSections = [
        {
            title: 'Produto',
            links: [
                { label: 'Funcionalidades', href: '#' },
                { label: 'Preços', href: '#' },
                { label: 'Para Empresas', href: '#' }
            ]
        },
        {
            title: 'Suporte',
            links: [
                { label: 'Central de Ajuda', href: '#' },
                { label: 'Contato', href: '#' },
                { label: 'Status', href: '#' }
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacidade', href: '#' },
                { label: 'Termos', href: '#' },
                { label: 'LGPD', href: '#' }
            ]
        }
    ]

    return (
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 gradient-eco rounded-lg flex items-center justify-center text-white font-bold">
                                ♻️
                            </div>
                            <span className="font-bold text-gradient">EcoRecicla</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            Transformando reciclagem em oportunidades reais para um futuro sustentável.
                        </p>
                    </div>

                    {footerSections.map((section, index) => (
                        <div key={index}>
                            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                                {section.title}
                            </h4>
                            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a href={link.href} className="hover:text-eco-primary transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        © 2025 EcoRecicla. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer