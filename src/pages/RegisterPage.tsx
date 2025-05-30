import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, MapPin, Phone, Calendar, CreditCard, AlertCircle, CheckCircle, Search, Hash } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCEP } from '../hooks/useCEP'
import ThemeToggle from '../components/ui/ThemeToggle'
import Logo from '../components/ui/Logo'

interface RegisterPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

interface FormData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    cpf: string
    birthDate: string
    phone: string
    cep: string
    address: string
    addressNumber: string // Campo atualizado
    city: string
    state: string
    neighborhood: string
    acceptedTerms: boolean
}

const RegisterPage = ({ darkMode, toggleDarkMode }: RegisterPageProps) => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        cpf: '',
        birthDate: '',
        phone: '',
        cep: '',
        address: '',
        addressNumber: '', // Campo atualizado
        city: '',
        state: '',
        neighborhood: '',
        acceptedTerms: false
    })

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string | undefined>>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [cepLoading, setCepLoading] = useState(false)

    const { signUp } = useAuth()
    const { searchCEP } = useCEP()
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const validateField = (name: keyof FormData, value: string | boolean): string => {
        switch (name) {
            case 'firstName':
                if (!value || (typeof value === 'string' && value.trim().length < 2)) return 'Nome deve ter pelo menos 2 caracteres'
                if (typeof value === 'string' && !/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) return 'Nome deve conter apenas letras'
                return ''

            case 'lastName':
                if (!value || (typeof value === 'string' && value.trim().length < 2)) return 'Sobrenome deve ter pelo menos 2 caracteres'
                if (typeof value === 'string' && !/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) return 'Sobrenome deve conter apenas letras'
                return ''

            case 'email':
                if (!value) return 'Email é obrigatório'
                if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email deve ter um formato válido'
                return ''

            case 'password':
                if (!value) return 'Senha é obrigatória'
                if (typeof value === 'string' && value.length < 8) return 'Senha deve ter pelo menos 8 caracteres'
                if (typeof value === 'string' && !/(?=.*[a-z])/.test(value)) return 'Senha deve conter pelo menos uma letra minúscula'
                if (typeof value === 'string' && !/(?=.*[A-Z])/.test(value)) return 'Senha deve conter pelo menos uma letra maiúscula'
                if (typeof value === 'string' && !/(?=.*\d)/.test(value)) return 'Senha deve conter pelo menos um número'
                return ''

            case 'confirmPassword':
                if (!value) return 'Confirmação de senha é obrigatória'
                if (value !== formData.password) return 'Senhas não coincidem'
                return ''

            case 'cpf':
                if (!value) return 'CPF é obrigatório'
                if (typeof value === 'string') {
                    const cleanCpf = value.replace(/\D/g, '')
                    if (cleanCpf.length !== 11) return 'CPF deve ter 11 dígitos'
                }
                return ''

            case 'birthDate':
                if (!value) return 'Data de nascimento é obrigatória'
                if (typeof value === 'string') {
                    const today = new Date()
                    const birth = new Date(value)
                    const age = today.getFullYear() - birth.getFullYear()
                    if (age < 16) return 'Você deve ter pelo menos 16 anos'
                }
                return ''

            case 'phone':
                if (!value) return 'Telefone é obrigatório'
                if (typeof value === 'string') {
                    const cleanPhone = value.replace(/\D/g, '')
                    if (cleanPhone.length < 10) return 'Telefone deve ter pelo menos 10 dígitos'
                }
                return ''

            case 'cep':
                if (!value) return 'CEP é obrigatório'
                if (typeof value === 'string') {
                    const cleanCep = value.replace(/\D/g, '')
                    if (cleanCep.length !== 8) return 'CEP deve ter 8 dígitos'
                }
                return ''

            case 'acceptedTerms':
                if (!value) return 'Você deve aceitar os termos e condições'
                return ''

            case 'addressNumber':
                if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                    return 'Número do endereço é obrigatório'
                }
                return ''

            default:
                return ''
        }
    }

    const formatCPF = (value: string): string => {
        const cleanValue = value.replace(/\D/g, '')
        if (cleanValue.length <= 11) {
            return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        }
        return value
    }

    const formatPhone = (value: string): string => {
        const cleanValue = value.replace(/\D/g, '')
        if (cleanValue.length <= 11) {
            if (cleanValue.length <= 10) {
                return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
            } else {
                return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
            }
        }
        return value
    }

    const formatCEP = (value: string): string => {
        const cleanValue = value.replace(/\D/g, '')
        if (cleanValue.length <= 8) {
            return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2')
        }
        return value
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        let formattedValue = value

        if (name === 'cpf') {
            formattedValue = formatCPF(value)
        } else if (name === 'phone') {
            formattedValue = formatPhone(value)
        } else if (name === 'cep') {
            formattedValue = formatCEP(value)
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : formattedValue
        }))

        // Validar campo em tempo real
        const error = validateField(name as keyof FormData, type === 'checkbox' ? checked : formattedValue)
        setErrors(prev => ({
            ...prev,
            [name]: error
        }))
    }

    const handleCEPBlur = async () => {
        const cleanCep = formData.cep.replace(/\D/g, '')
        if (cleanCep.length === 8) {
            setCepLoading(true)
            const cepData = await searchCEP(cleanCep)
            setCepLoading(false)

            if (cepData) {
                setFormData(prev => ({
                    ...prev,
                    address: cepData.logradouro || '',
                    city: cepData.localidade,
                    state: cepData.uf,
                    neighborhood: cepData.bairro || ''
                }))
            }
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {}

        Object.keys(formData).forEach(key => {
            const error = validateField(key as keyof FormData, formData[key as keyof FormData])
            if (error) newErrors[key as keyof FormData] = error
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setLoading(true)

        const result = await signUp(formData.email, formData.password, {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            cpf: formData.cpf,
            birthDate: formData.birthDate,
            phone: formData.phone,
            cep: formData.cep,
            address: formData.address,
            addressNumber: formData.addressNumber, // Campo atualizado
            city: formData.city,
            state: formData.state,
            neighborhood: formData.neighborhood,
            acceptedTerms: formData.acceptedTerms
        })

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError('Erro ao criar conta. Verifique os dados e tente novamente.')
        }

        setLoading(false)
    }

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
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/"
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

            <main className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Logo e Título */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <Logo size="lg" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Criar Conta
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Junte-se à comunidade de recicladores conscientes
                        </p>
                    </div>

                    {/* Formulário */}
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/50 shadow-xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Nome e Sobrenome */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                        Nome *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.firstName
                                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                }`}
                                            placeholder="Seu nome"
                                        />
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.firstName && <ErrorMessage error={errors.firstName} />}
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                        Sobrenome *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.lastName
                                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                }`}
                                            placeholder="Seu sobrenome"
                                        />
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.lastName && <ErrorMessage error={errors.lastName} />}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.email
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="seu@email.com"
                                    />
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                {errors.email && <ErrorMessage error={errors.email} />}
                            </div>

                            {/* Senha e Confirmar Senha */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                                        Senha *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.password
                                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                }`}
                                            placeholder="Mín. 8 caracteres"
                                        />
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <ErrorMessage error={errors.password} />}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                        Confirmar Senha *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.confirmPassword
                                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                }`}
                                            placeholder="Confirme sua senha"
                                        />
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <ErrorMessage error={errors.confirmPassword} />}
                                </div>
                            </div>

                            {/* CPF e Data de Nascimento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="cpf" className="block text-sm font-medium mb-2">
                                        CPF *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="cpf"
                                            name="cpf"
                                            type="text"
                                            required
                                            value={formData.cpf}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.cpf
                                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                }`}
                                            placeholder="000.000.000-00"
                                            maxLength={14}
                                        />
                                        <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.cpf && <ErrorMessage error={errors.cpf} />}
                                </div>

                                <div>
                                    <label htmlFor="birthDate" className="block text-sm font-medium mb-2">
                                        Data de Nascimento *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="birthDate"
                                            name="birthDate"
                                            type="date"
                                            required
                                            value={formData.birthDate}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.birthDate
                                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                }`}
                                        />
                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.birthDate && <ErrorMessage error={errors.birthDate} />}
                                </div>
                            </div>

                            {/* Telefone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                    Telefone *
                                </label>
                                <div className="relative">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.phone
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="(00) 00000-0000"
                                        maxLength={15}
                                    />
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                {errors.phone && <ErrorMessage error={errors.phone} />}
                            </div>

                            {/* CEP */}
                            <div>
                                <label htmlFor="cep" className="block text-sm font-medium mb-2">
                                    CEP *
                                </label>
                                <div className="relative">
                                    <input
                                        id="cep"
                                        name="cep"
                                        type="text"
                                        required
                                        value={formData.cep}
                                        onChange={handleInputChange}
                                        onBlur={handleCEPBlur}
                                        disabled={loading}
                                        className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.cep
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="00000-000"
                                        maxLength={9}
                                    />
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    {cepLoading && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <Search className="w-5 h-5 text-gray-400 animate-spin" />
                                        </div>
                                    )}
                                </div>
                                {errors.cep && <ErrorMessage error={errors.cep} />}
                            </div>

                            {/* Endereço com número - atualizado */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium mb-2">
                                        Endereço
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Rua/Avenida"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="addressNumber" className="block text-sm font-medium mb-2">
                                        Número *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="addressNumber"
                                            name="addressNumber"
                                            type="text"
                                            required
                                            value={formData.addressNumber}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${errors.addressNumber
                                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                }`}
                                            placeholder="123"
                                        />
                                        <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.addressNumber && <ErrorMessage error={errors.addressNumber} />}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                                        Cidade
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Cidade"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium mb-2">
                                        Estado
                                    </label>
                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Estado"
                                        maxLength={2}
                                    />
                                </div>
                            </div>

                            {/* Termos e Condições */}
                            <div className="flex items-start space-x-3">
                                <input
                                    id="acceptedTerms"
                                    name="acceptedTerms"
                                    type="checkbox"
                                    checked={formData.acceptedTerms}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="mt-1 w-4 h-4 text-green-600 bg-transparent border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <label htmlFor="acceptedTerms" className="text-sm text-gray-600 dark:text-gray-400">
                                    Eu aceito os{' '}
                                    <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200 underline">
                                        Termos de Uso
                                    </a>{' '}
                                    e{' '}
                                    <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200 underline">
                                        Política de Privacidade
                                    </a>
                                </label>
                            </div>
                            {errors.acceptedTerms && typeof errors.acceptedTerms === 'string' && <ErrorMessage error={errors.acceptedTerms} />}

                            {/* Mensagem de erro geral */}
                            {error && (
                                <div className="flex items-center space-x-2 text-red-500 dark:text-red-400 text-sm animate-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Botão Submit */}
                            <button
                                type="submit"
                                disabled={loading || Object.values(errors).some(error => error)}
                                className={`group relative w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${loading || Object.values(errors).some(error => error)
                                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-xl hover:scale-105'
                                    } text-white`}
                            >
                                <div className="relative flex items-center justify-center w-full h-full">
                                    {!loading ? (
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Criar Conta</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Criando conta...</span>
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Link para login */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Já tem uma conta?{' '}
                                    <Link
                                        to="/login"
                                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200 font-medium"
                                    >
                                        Faça login aqui
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage