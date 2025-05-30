import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Send } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../components/ui/ThemeToggle'
import Logo from '../components/ui/Logo'

interface LoginPageProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

const LoginPage = ({ darkMode, toggleDarkMode }: LoginPageProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isResetMode, setIsResetMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const { signIn, resetPassword } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const validateEmail = (value: string): string => {
        if (!value.trim()) return 'Email é obrigatório'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email deve ter um formato válido'
        return ''
    }

    const validatePassword = (value: string): string => {
        if (!value) return 'Senha é obrigatória'
        return ''
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        setEmailError(validateEmail(value))
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        setPasswordError(validatePassword(value))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const emailErr = validateEmail(email)
        const passwordErr = !isResetMode ? validatePassword(password) : ''

        setEmailError(emailErr)
        setPasswordError(passwordErr)

        if (emailErr || passwordErr) return

        setLoading(true)

        if (isResetMode) {
            const result = await resetPassword(email)
            if (result.success) {
                setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.')
                setTimeout(() => {
                    setIsResetMode(false)
                    setSuccess('')
                    setEmail('')
                }, 3000)
            } else {
                setError('Erro ao enviar email de recuperação. Verifique se o email está cadastrado.')
            }
        } else {
            const result = await signIn(email, password)
            if (result.success) {
                navigate('/dashboard')
            } else {
                setError('Email ou senha inválidos.')
            }
        }

        setLoading(false)
    }

    const toggleResetMode = () => {
        setIsResetMode(!isResetMode)
        setError('')
        setSuccess('')
        setPassword('')
        setPasswordError('')
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

            <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo e Título */}
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Logo size="lg" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 dark:from-green-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            {isResetMode ? 'Recuperar Senha' : 'Entrar na Conta'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {isResetMode
                                ? 'Digite seu email para receber as instruções'
                                : 'Acesse sua conta para começar a reciclar'
                            }
                        </p>
                    </div>

                    {/* Formulário */}
                    <div className="backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/50 shadow-xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                        value={email}
                                        onChange={handleEmailChange}
                                        disabled={loading}
                                        className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${emailError
                                                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                            }`}
                                        placeholder="seu@email.com"
                                    />
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                {emailError && <ErrorMessage error={emailError} />}
                            </div>

                            {/* Senha - apenas se não for modo reset */}
                            {!isResetMode && (
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                                        Senha *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={handlePasswordChange}
                                            disabled={loading}
                                            className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${passwordError
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                                                }`}
                                            placeholder="Sua senha"
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
                                    {passwordError && <ErrorMessage error={passwordError} />}
                                </div>
                            )}

                            {/* Mensagens de erro/sucesso */}
                            {error && (
                                <div className="flex items-center space-x-2 text-red-500 dark:text-red-400 text-sm animate-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="flex items-center space-x-2 text-green-500 dark:text-green-400 text-sm animate-in slide-in-from-top-1 duration-200">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Botão Submit */}
                            <button
                                type="submit"
                                disabled={loading || !!emailError || (!isResetMode && !!passwordError)}
                                className={`group relative w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${loading || !!emailError || (!isResetMode && !!passwordError)
                                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-xl hover:scale-105'
                                    } text-white`}
                            >
                                <div className="relative flex items-center justify-center w-full h-full">
                                    {!loading ? (
                                        <div className="flex items-center space-x-3">
                                            {isResetMode ? <Send className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                            <span>{isResetMode ? 'Enviar Email' : 'Entrar'}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>{isResetMode ? 'Enviando...' : 'Entrando...'}</span>
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Links */}
                            <div className="text-center space-y-3">
                                <button
                                    type="button"
                                    onClick={toggleResetMode}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 underline"
                                >
                                    {isResetMode ? 'Voltar ao login' : 'Esqueceu sua senha?'}
                                </button>

                                {!isResetMode && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Não tem uma conta?{' '}
                                        <Link
                                            to="/register"
                                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200 font-medium"
                                        >
                                            Cadastre-se aqui
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LoginPage