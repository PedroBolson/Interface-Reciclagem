interface Material {
    name: string
    icon: string
    points: string
    class: string
}

const MaterialsSection = () => {
    const materials: Material[] = [
        { name: 'Plásticos', icon: '🧴', points: '2 pts/kg', class: 'material-plastic' },
        { name: 'Vidros', icon: '🫙', points: '1.5 pts/kg', class: 'material-glass' },
        { name: 'Metais', icon: '🥫', points: '3 pts/kg', class: 'material-metal' },
        { name: 'Papel', icon: '📄', points: '1 pt/kg', class: 'material-paper' },
        { name: 'Orgânicos', icon: '🥬', points: '0.5 pts/kg', class: 'material-organic' },
        { name: 'Óleo', icon: '🛢️', points: '5 pts/L', class: 'material-oil' },
        { name: 'Baterias', icon: '🔋', points: '10 pts/un', class: 'material-battery' },
        { name: 'Eletrônicos', icon: '💻', points: '15 pts/kg', class: 'material-electronic' }
    ]

    return (
        <section id="materials" className="py-20 px-4 sm:px-6 lg:px-8 gradient-surface">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Materiais Aceitos
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Veja quantos pontos você ganha por cada tipo de material reciclado
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {materials.map((material, index) => (
                        <div
                            key={index}
                            className="material-card text-center group animate-slide-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className={`material-icon ${material.class} mx-auto mb-4`}>
                                {material.icon}
                            </div>
                            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                {material.name}
                            </h3>
                            <div className="reward-badge-success text-xs">
                                {material.points}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MaterialsSection