import { ArrowLeft, MapPin, Building, Users, Leaf, Send, CheckCircle, X, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ui/ThemeToggle'

interface PartnerPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

interface FormErrors {
    [key: string]: string
}

const PartnerPage = ({ darkMode, toggleDarkMode }: PartnerPageProps) => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        location: '',
        businessType: '',
        description: '',
        whyPartner: '',
        expectedVolume: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

    // Scroll para o topo ao montar o componente
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Validações personalizadas
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'companyName':
                if (!value.trim()) return 'Nome da empresa é obrigatório'
                if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres'
                return ''

            case 'contactName':
                if (!value.trim()) return 'Nome do responsável é obrigatório'
                if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres'
                if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) return 'Nome deve conter apenas letras'
                return ''

            case 'email':
                if (!value.trim()) return 'Email é obrigatório'
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email deve ter um formato válido'
                return ''

            case 'phone':
                if (!value.trim()) return 'Telefone é obrigatório'
                const cleanPhone = value.replace(/\D/g, '')
                if (cleanPhone.length < 10) return 'Telefone deve ter pelo menos 10 dígitos'
                if (cleanPhone.length > 11) return 'Telefone deve ter no máximo 11 dígitos'
                return ''

            case 'location':
                if (!value.trim()) return 'Localização é obrigatória'
                if (value.trim().length < 3) return 'Localização deve ter pelo menos 3 caracteres'
                return ''

            case 'businessType':
                if (!value) return 'Tipo de negócio é obrigatório'
                return ''

            case 'whyPartner':
                if (!value.trim()) return 'Este campo é obrigatório'
                if (value.trim().length < 20) return 'Por favor, escreva pelo menos 20 caracteres explicando sua motivação'
                if (value.trim().length > 500) return 'Máximo de 500 caracteres permitidos'
                return ''

            case 'description':
                if (value.trim() && value.trim().length > 300) return 'Máximo de 300 caracteres permitidos'
                return ''

            default:
                return ''
        }
    }

    // Validar todos os campos
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        const requiredFields = ['companyName', 'contactName', 'email', 'phone', 'location', 'businessType', 'whyPartner']

        // Validar campos obrigatórios
        requiredFields.forEach(field => {
            const error = validateField(field, formData[field as keyof typeof formData])
            if (error) newErrors[field] = error
        })

        // Validar campos opcionais
        if (formData.description) {
            const descError = validateField('description', formData.description)
            if (descError) newErrors.description = descError
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        let formattedValue = value
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '')
            if (digits.length <= 11) {
                if (digits.length <= 10) {
                    formattedValue = digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
                } else {
                    formattedValue = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                }
            } else {
                return // Não permite mais de 11 dígitos
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }))

        // Validar campo em tempo real se já foi tocado
        if (touchedFields.has(name)) {
            const error = validateField(name, formattedValue)
            setErrors(prev => ({
                ...prev,
                [name]: error
            }))
        }
    }

    const handleFieldBlur = (name: string) => {
        setTouchedFields(prev => new Set(prev).add(name))
        const error = validateField(name, formData[name as keyof typeof formData])
        setErrors(prev => ({
            ...prev,
            [name]: error
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Marcar todos os campos como tocados
        const allFields = Object.keys(formData)
        setTouchedFields(new Set(allFields))

        if (!validateForm()) {
            // Encontrar o primeiro campo com erro e focar nele
            const firstErrorField = Object.keys(errors)[0]
            if (firstErrorField) {
                const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
                element?.focus()
            }
            return
        }

        setIsSubmitting(true)

        // Simular envio com delay
        setTimeout(() => {
            console.log('Dados do formulário:', formData)
            setIsSubmitting(false)
            setShowModal(true)

            // Auto fechar modal após 8 segundos
            setTimeout(() => {
                setShowModal(false)
                // Reset form
                setFormData({
                    companyName: '',
                    contactName: '',
                    email: '',
                    phone: '',
                    location: '',
                    businessType: '',
                    description: '',
                    whyPartner: '',
                    expectedVolume: ''
                })
                setErrors({})
                setTouchedFields(new Set())
            }, 10000)
        }, 2000)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    // Componente para exibir erros
    const ErrorMessage = ({ error }: { error: string }) => (
        <div className="flex items-center space-x-2 mt-2 text-red-500 dark:text-red-400 text-sm animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
        </div>
    )

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-900'
            : 'bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50'
            }`}>
            {/* Header Simples */}
            <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/#contact"
                            className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300" />
                            <span className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                                Voltar
                            </span>
                        </Link>

                        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </div>
                </div>
            </header>

            <main className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white mb-6">
                            <Building className="w-10 h-10" />
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Seja Nosso Parceiro
                        </h1>

                        <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
                            Junte-se à nossa rede de pontos de coleta e ajude a construir um futuro mais sustentável
                        </p>
                    </div>

                    {/* Benefícios */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: "Visibilidade",
                                description: "Apareça no mapa para milhares de usuários",
                                color: "from-green-500 to-emerald-600"
                            },
                            {
                                icon: <Leaf className="w-8 h-8" />,
                                title: "Sustentabilidade",
                                description: "Contribua ativamente para o meio ambiente",
                                color: "from-blue-500 to-cyan-600"
                            },
                            {
                                icon: <MapPin className="w-8 h-8" />,
                                title: "Crescimento",
                                description: "Atraia novos clientes conscientes",
                                color: "from-purple-500 to-pink-600"
                            }
                        ].map((benefit, index) => (
                            <div key={index} className="text-center group">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${benefit.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Formulário */}
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-green-200/60 dark:border-green-700/60">
                        <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-green-700 to-blue-700 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Formulário de Cadastro
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nome da Empresa/Local *
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        onBlur={() => handleFieldBlur('companyName')}
                                        required
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 ${errors.companyName && touchedFields.has('companyName')
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="Ex: EcoMercado Central"
                                        aria-invalid={errors.companyName && touchedFields.has('companyName') ? 'true' : 'false'}
                                        aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                                    />
                                    {errors.companyName && touchedFields.has('companyName') && (
                                        <ErrorMessage error={errors.companyName} />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nome do Responsável *
                                    </label>
                                    <input
                                        type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleInputChange}
                                        onBlur={() => handleFieldBlur('contactName')}
                                        required
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 ${errors.contactName && touchedFields.has('contactName')
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="Seu nome completo"
                                        aria-invalid={errors.contactName && touchedFields.has('contactName') ? 'true' : 'false'}
                                        aria-describedby={errors.contactName ? 'contactName-error' : undefined}
                                    />
                                    {errors.contactName && touchedFields.has('contactName') && (
                                        <ErrorMessage error={errors.contactName} />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={() => handleFieldBlur('email')}
                                        required
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 ${errors.email && touchedFields.has('email')
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="contato@empresa.com"
                                        aria-invalid={errors.email && touchedFields.has('email') ? 'true' : 'false'}
                                        aria-describedby={errors.email ? 'email-error' : undefined}
                                    />
                                    {errors.email && touchedFields.has('email') && (
                                        <ErrorMessage error={errors.email} />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Telefone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        onBlur={() => handleFieldBlur('phone')}
                                        required
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 ${errors.phone && touchedFields.has('phone')
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="(11) 99999-9999"
                                        aria-invalid={errors.phone && touchedFields.has('phone') ? 'true' : 'false'}
                                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                                    />
                                    {errors.phone && touchedFields.has('phone') && (
                                        <ErrorMessage error={errors.phone} />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Localização *
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        onBlur={() => handleFieldBlur('location')}
                                        required
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 ${errors.location && touchedFields.has('location')
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="Cidade, Estado"
                                        aria-invalid={errors.location && touchedFields.has('location') ? 'true' : 'false'}
                                        aria-describedby={errors.location ? 'location-error' : undefined}
                                    />
                                    {errors.location && touchedFields.has('location') && (
                                        <ErrorMessage error={errors.location} />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Tipo de Negócio *
                                    </label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleInputChange}
                                        onBlur={() => handleFieldBlur('businessType')}
                                        required
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${errors.businessType && touchedFields.has('businessType')
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        aria-invalid={errors.businessType && touchedFields.has('businessType') ? 'true' : 'false'}
                                        aria-describedby={errors.businessType ? 'businessType-error' : undefined}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="supermercado">Supermercado</option>
                                        <option value="farmacia">Farmácia</option>
                                        <option value="posto">Posto de Combustível</option>
                                        <option value="escola">Escola/Universidade</option>
                                        <option value="empresa">Empresa</option>
                                        <option value="condominio">Condomínio</option>
                                        <option value="cooperativa">Cooperativa</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                    {errors.businessType && touchedFields.has('businessType') && (
                                        <ErrorMessage error={errors.businessType} />
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Descrição do Local
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                        ({formData.description.length}/300)
                                    </span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    onBlur={() => handleFieldBlur('description')}
                                    rows={3}
                                    disabled={isSubmitting}
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto ${errors.description && touchedFields.has('description')
                                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                        }`}
                                    placeholder="Descreva brevemente seu local (tamanho, localização, horários de funcionamento...)"
                                    style={{
                                        minHeight: '80px',
                                        maxHeight: '120px'
                                    }}
                                    aria-invalid={errors.description && touchedFields.has('description') ? 'true' : 'false'}
                                    aria-describedby={errors.description ? 'description-error' : undefined}
                                />
                                {errors.description && touchedFields.has('description') && (
                                    <ErrorMessage error={errors.description} />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Por que gostaria de ser parceiro? *
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                        ({formData.whyPartner.length}/500)
                                    </span>
                                </label>
                                <textarea
                                    name="whyPartner"
                                    value={formData.whyPartner}
                                    onChange={handleInputChange}
                                    onBlur={() => handleFieldBlur('whyPartner')}
                                    required
                                    rows={4}
                                    disabled={isSubmitting}
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto ${errors.whyPartner && touchedFields.has('whyPartner')
                                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                        }`}
                                    placeholder="Conte-nos sua motivação para participar da nossa rede de reciclagem..."
                                    style={{
                                        minHeight: '100px',
                                        maxHeight: '150px'
                                    }}
                                    aria-invalid={errors.whyPartner && touchedFields.has('whyPartner') ? 'true' : 'false'}
                                    aria-describedby={errors.whyPartner ? 'whyPartner-error' : undefined}
                                />
                                {errors.whyPartner && touchedFields.has('whyPartner') && (
                                    <ErrorMessage error={errors.whyPartner} />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Volume Esperado de Materiais
                                </label>
                                <select
                                    name="expectedVolume"
                                    value={formData.expectedVolume}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="baixo">Baixo (até 50kg/mês)</option>
                                    <option value="medio">Médio (50-200kg/mês)</option>
                                    <option value="alto">Alto (200-500kg/mês)</option>
                                    <option value="muito-alto">Muito Alto (500kg+/mês)</option>
                                </select>
                            </div>

                            {/* Botão Animado */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full relative overflow-hidden flex items-center justify-center px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${isSubmitting
                                    ? 'bg-gradient-to-r from-green-400 to-blue-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-xl hover:scale-105'
                                    } text-white`}
                            >
                                {/* Background animation */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 transform transition-transform duration-1000 ${isSubmitting ? 'translate-x-0' : 'translate-x-full'
                                    }`}></div>

                                {/* Content com animação elaborada */}
                                <div className="relative flex items-center justify-center w-full h-full">
                                    {/* Estado normal */}
                                    {!isSubmitting && (
                                        <div className="flex items-center space-x-3 animate-in fade-in duration-300">
                                            <Send className="w-5 h-5" />
                                            <span>Enviar Solicitação</span>
                                        </div>
                                    )}

                                    {isSubmitting && (
                                        <div className="relative flex items-center justify-center w-full">
                                            <Send className={`absolute w-5 h-5 z-20 transition-all duration-1000 ease-in-out transform ${isSubmitting ? 'translate-x-0' : '-translate-x-full'
                                                } animate-pulse`}
                                                style={{
                                                    left: isSubmitting ? '1.5rem' : '-2rem',
                                                    animation: isSubmitting ? 'flyAcross 1s ease-in-out forwards' : 'none'
                                                }} />

                                            <div className="flex items-center space-x-1">
                                                <span className={`transition-all duration-500 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                                                    Enviar
                                                </span>
                                                <span className={`transition-all duration-500 delay-300 ${isSubmitting ? 'opacity-100' : 'opacity-0'} absolute`}>
                                                    Enviando...
                                                </span>
                                            </div>

                                            {/* Loading dots no final */}
                                            <div className="absolute right-6 flex space-x-1">
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Modal de Confirmação */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`relative max-w-md w-full rounded-2xl p-8 shadow-2xl transform transition-all duration-300 scale-100 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>

                        {/* Success Icon */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-4 animate-bounce">
                                <CheckCircle className="w-10 h-10" />
                            </div>

                            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                Solicitação Enviada!
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                <strong>Muito obrigado pela sua iniciativa em ajudar nossa causa!</strong>
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Nossa equipe entrará em contato sobre sua solicitação em breve.
                                Juntos podemos fazer a diferença para um futuro mais sustentável! 🌱
                            </p>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-4">
                                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                            </div>

                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Esta janela irá se fechar sozinha
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                Fechar
                            </button>
                            <Link
                                to="/"
                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white text-center font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                Voltar ao Início
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PartnerPage