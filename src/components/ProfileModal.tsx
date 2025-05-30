import React, { useState, useEffect, useRef } from 'react'
import { X, User, Mail, Phone, MapPin, Eye, EyeOff, Save, Loader2, AlertCircle, Upload, Trash2, RotateCcw } from 'lucide-react'
import { useAuth, type UserData } from '../hooks/useAuth'
import { useCEP } from '../hooks/useCEP'
import { useToastContext } from './ui/ToastProvider'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../lib/firebase'

interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
    userData: UserData | null
    darkMode?: boolean
}

interface FormData {
    firstName: string
    lastName: string
    phone: string
    cep: string
    address: string
    addressNumber: string
    city: string
    state: string
    neighborhood: string
}

interface PasswordData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userData }) => {
    const { user } = useAuth()
    const { searchCEP } = useCEP()
    const { showSuccess, showError } = useToastContext()

    // Ref para controlar se os dados já foram carregados
    const dataLoadedRef = useRef(false)

    // Armazenar dados originais para o reset
    const [originalData, setOriginalData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phone: '',
        cep: '',
        address: '',
        addressNumber: '',
        city: '',
        state: '',
        neighborhood: ''
    })

    // Estados do formulário
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phone: '',
        cep: '',
        address: '',
        addressNumber: '',
        city: '',
        state: '',
        neighborhood: ''
    })

    // Estados da senha
    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // Estados da interface
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [cepLoading, setCepLoading] = useState(false)
    const [showPasswordSection, setShowPasswordSection] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    // Estados da foto
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [originalProfileImage, setOriginalProfileImage] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isDeletingImage, setIsDeletingImage] = useState(false)

    // Errors
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
    const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordData, string>>>({})

    // Carregar dados do usuário APENAS UMA VEZ quando o modal abrir
    useEffect(() => {
        if (userData && isOpen && !dataLoadedRef.current) {
            const initialData = {
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phone: userData.phone || '',
                cep: userData.cep || '',
                address: userData.address || '',
                addressNumber: userData.addressNumber || '',
                city: userData.city || '',
                state: userData.state || '',
                neighborhood: userData.neighborhood || ''
            }

            setFormData(initialData)
            setOriginalData(initialData)

            // Carregar foto do perfil se existir
            const imageUrl = userData.profileImageUrl || null
            setProfileImage(imageUrl)
            setOriginalProfileImage(imageUrl)

            dataLoadedRef.current = true
        }
    }, [userData, isOpen])

    // Limpar estados ao fechar
    useEffect(() => {
        if (!isOpen) {
            // Reset de todos os estados
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setShowPasswordSection(false)
            setImageFile(null)
            setImagePreview(null)
            setErrors({})
            setPasswordErrors({})

            // Reset da flag de dados carregados
            dataLoadedRef.current = false
        }
    }, [isOpen])

    // Função para resetar formulário aos valores originais
    const handleReset = () => {
        setFormData({ ...originalData })
        setProfileImage(originalProfileImage)
        setImageFile(null)
        setImagePreview(null)
        setErrors({})
        showSuccess('Formulário resetado aos valores originais!')
    }

    // Validação
    const validateField = (name: keyof FormData, value: string): string => {
        switch (name) {
            case 'firstName':
                if (!value.trim()) return 'Nome é obrigatório'
                if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres'
                if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) return 'Nome deve conter apenas letras'
                return ''

            case 'lastName':
                if (!value.trim()) return 'Sobrenome é obrigatório'
                if (value.trim().length < 2) return 'Sobrenome deve ter pelo menos 2 caracteres'
                if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) return 'Sobrenome deve conter apenas letras'
                return ''

            case 'phone':
                if (!value.trim()) return 'Telefone é obrigatório'
                const cleanPhone = value.replace(/\D/g, '')
                if (cleanPhone.length < 10 || cleanPhone.length > 11) return 'Telefone deve ter 10 ou 11 dígitos'
                return ''

            case 'cep':
                if (!value.trim()) return 'CEP é obrigatório'
                const cleanCep = value.replace(/\D/g, '')
                if (cleanCep.length !== 8) return 'CEP deve ter 8 dígitos'
                return ''

            case 'address':
                if (!value.trim()) return 'Endereço é obrigatório'
                return ''

            case 'addressNumber':
                if (!value.trim()) return 'Número é obrigatório'
                return ''

            case 'city':
                if (!value.trim()) return 'Cidade é obrigatória'
                return ''

            case 'state':
                if (!value.trim()) return 'Estado é obrigatório'
                if (value.length !== 2) return 'Estado deve ter 2 caracteres'
                return ''

            default:
                return ''
        }
    }

    const validatePassword = (name: keyof PasswordData, value: string): string => {
        switch (name) {
            case 'currentPassword':
                if (!value) return 'Senha atual é obrigatória'
                return ''

            case 'newPassword':
                if (!value) return 'Nova senha é obrigatória'
                if (value.length < 8) return 'Nova senha deve ter pelo menos 8 caracteres'
                if (!/(?=.*[a-z])/.test(value)) return 'Nova senha deve conter pelo menos uma letra minúscula'
                if (!/(?=.*[A-Z])/.test(value)) return 'Nova senha deve conter pelo menos uma letra maiúscula'
                if (!/(?=.*\d)/.test(value)) return 'Nova senha deve conter pelo menos um número'
                return ''

            case 'confirmPassword':
                if (!value) return 'Confirmação de senha é obrigatória'
                if (value !== passwordData.newPassword) return 'Senhas não coincidem'
                return ''

            default:
                return ''
        }
    }

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Limpar erro do campo se existir
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))

        // Limpar erro do campo se existir
        if (passwordErrors[name as keyof PasswordData]) {
            setPasswordErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    // Buscar CEP
    const handleCepBlur = async () => {
        const cleanCep = formData.cep.replace(/\D/g, '')
        if (cleanCep.length === 8) {
            setCepLoading(true)
            const result = await searchCEP(cleanCep)

            if (result) {
                setFormData(prev => ({
                    ...prev,
                    address: result.logradouro || prev.address,
                    city: result.localidade || prev.city,
                    state: result.uf || prev.state,
                    neighborhood: result.bairro || prev.neighborhood
                }))
            }
            setCepLoading(false)
        }
    }

    // Gerenciar upload de imagem
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            showError('Por favor, selecione apenas arquivos de imagem')
            return
        }

        // Validar tamanho (10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError('A imagem deve ter no máximo 10MB')
            return
        }

        setImageFile(file)

        // Criar preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    // Upload da imagem
    const uploadProfileImage = async (): Promise<string | null> => {
        if (!imageFile || !user) return null

        setIsUploadingImage(true)
        try {
            // Deletar imagem anterior se existir
            if (profileImage) {
                try {
                    const oldImageRef = ref(storage, `profiles/${user.uid}/profile.jpg`)
                    await deleteObject(oldImageRef)
                } catch (error) {
                    console.log('Imagem anterior não encontrada ou já foi deletada')
                }
            }

            // Upload nova imagem
            const imageRef = ref(storage, `profiles/${user.uid}/profile.jpg`)
            await uploadBytes(imageRef, imageFile)
            const downloadURL = await getDownloadURL(imageRef)

            setProfileImage(downloadURL)
            setImagePreview(null)
            setImageFile(null)

            return downloadURL
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error)
            showError('Erro ao fazer upload da imagem')
            return null
        } finally {
            setIsUploadingImage(false)
        }
    }

    // Deletar imagem
    const deleteProfileImage = async () => {
        if (!user || !profileImage) return

        setIsDeletingImage(true)
        try {
            const imageRef = ref(storage, `profiles/${user.uid}/profile.jpg`)
            await deleteObject(imageRef)

            // Atualizar no Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                profileImageUrl: null,
                updatedAt: new Date()
            })

            setProfileImage(null)
            showSuccess('Foto de perfil removida com sucesso!')
        } catch (error) {
            console.error('Erro ao deletar imagem:', error)
            showError('Erro ao deletar imagem')
        } finally {
            setIsDeletingImage(false)
        }
    }

    // Alterar senha
    const handlePasswordSubmit = async () => {
        // Validar todos os campos APENAS NO SUBMIT
        const currentPasswordError = validatePassword('currentPassword', passwordData.currentPassword)
        const newPasswordError = validatePassword('newPassword', passwordData.newPassword)
        const confirmPasswordError = validatePassword('confirmPassword', passwordData.confirmPassword)

        setPasswordErrors({
            currentPassword: currentPasswordError,
            newPassword: newPasswordError,
            confirmPassword: confirmPasswordError
        })

        if (currentPasswordError || newPasswordError || confirmPasswordError) {
            return
        }

        if (!user) return

        setIsChangingPassword(true)
        try {
            // Re-autenticar usuário
            const credential = EmailAuthProvider.credential(user.email!, passwordData.currentPassword)
            await reauthenticateWithCredential(user, credential)

            // Atualizar senha
            await updatePassword(user, passwordData.newPassword)

            showSuccess('Senha alterada com sucesso!')
            setShowPasswordSection(false)
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setPasswordErrors({})
        } catch (error: any) {
            console.error('Erro ao alterar senha:', error)
            if (error.code === 'auth/wrong-password') {
                setPasswordErrors(prev => ({ ...prev, currentPassword: 'Senha atual incorreta' }))
            } else {
                showError('Erro ao alterar senha. Tente novamente.')
            }
        } finally {
            setIsChangingPassword(false)
        }
    }

    // Salvar perfil
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validar todos os campos APENAS NO SUBMIT
        const newErrors: Partial<Record<keyof FormData, string>> = {}
        Object.keys(formData).forEach(key => {
            const error = validateField(key as keyof FormData, formData[key as keyof FormData])
            if (error) newErrors[key as keyof FormData] = error
        })

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            showError('Por favor, corrija os erros no formulário')
            return
        }

        if (!user) return

        setIsSubmitting(true)
        try {
            let profileImageUrl = profileImage

            // Upload da imagem se houver
            if (imageFile) {
                profileImageUrl = await uploadProfileImage()
            }

            // Atualizar dados no Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                ...formData,
                ...(profileImageUrl && { profileImageUrl }),
                updatedAt: new Date()
            })

            showSuccess('Perfil atualizado com sucesso!')
            onClose()
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error)
            showError('Erro ao atualizar perfil. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Fechar modal
    const handleClose = () => {
        if (isSubmitting || isChangingPassword || isUploadingImage || isDeletingImage) return
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                Editar Perfil
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                Atualize suas informações pessoais
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSubmitting || isChangingPassword || isUploadingImage || isDeletingImage}
                            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            title="Resetar aos valores originais"
                        >
                            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting || isChangingPassword || isUploadingImage || isDeletingImage}
                            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            type="button"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                            {/* Foto de Perfil */}
                            <div className="text-center">
                                <h3 className="text-base sm:text-lg text-white font-semibold mb-4">Foto de Perfil</h3>

                                <div className="relative inline-block">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        {imagePreview || profileImage ? (
                                            <img
                                                src={imagePreview || profileImage!}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Overlay de loading */}
                                    {(isUploadingImage || isDeletingImage) && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                                    <label className="cursor-pointer inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                        <Upload className="w-4 h-4" />
                                        <span>Escolher Foto</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            disabled={isUploadingImage || isDeletingImage}
                                        />
                                    </label>

                                    {profileImage && (
                                        <button
                                            type="button"
                                            onClick={deleteProfileImage}
                                            disabled={isDeletingImage || isUploadingImage}
                                            className="inline-flex cursor-pointer items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Remover</span>
                                        </button>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Arquivos suportados: JPG, PNG, GIF (máx. 10MB)
                                </p>
                            </div>

                            {/* Informações Pessoais */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Informações Pessoais</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm text-white font-medium mb-2">
                                            Nome *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full pl-10 text-white placeholder:text-gray-400 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${errors.firstName
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Seu nome"
                                            />
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        </div>
                                        {errors.firstName && (
                                            <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs sm:text-sm">
                                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>{errors.firstName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Sobrenome *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full pl-10 text-white placeholder:text-gray-400 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${errors.lastName
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Seu sobrenome"
                                            />
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        </div>
                                        {errors.lastName && (
                                            <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs sm:text-sm">
                                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>{errors.lastName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Email (não pode ser alterado)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={userData?.email || ''}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm sm:text-base"
                                            />
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Telefone *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full pl-10 text-white placeholder:text-gray-400 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${errors.phone
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                    }`}
                                                placeholder="(11) 99999-9999"
                                            />
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        </div>
                                        {errors.phone && (
                                            <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs sm:text-sm">
                                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>{errors.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Endereço - Simplificado para mobile */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Endereço</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white font-medium mb-2">
                                                CEP *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="cep"
                                                    value={formData.cep}
                                                    onChange={handleInputChange}
                                                    onBlur={handleCepBlur}
                                                    disabled={isSubmitting}
                                                    className={`w-full pl-10 text-white placeholder:text-gray-400 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${errors.cep
                                                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                        }`}
                                                    placeholder="00000-000"
                                                    maxLength={9}
                                                />
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                                {cepLoading && (
                                                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-spin" />
                                                )}
                                            </div>
                                            {errors.cep && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{errors.cep}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white font-medium mb-2">
                                                Bairro
                                            </label>
                                            <input
                                                type="text"
                                                name="neighborhood"
                                                value={formData.neighborhood}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className="w-full text-white placeholder:text-gray-400 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                placeholder="Seu bairro"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm text-white font-medium mb-2">
                                                Endereço *
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full text-white placeholder:text-gray-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${errors.address
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Rua, Avenida..."
                                            />
                                            {errors.address && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{errors.address}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white font-medium mb-2">
                                                Número *
                                            </label>
                                            <input
                                                type="text"
                                                name="addressNumber"
                                                value={formData.addressNumber}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full text-white placeholder:text-gray-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${errors.addressNumber
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                    }`}
                                                placeholder="123"
                                            />
                                            {errors.addressNumber && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{errors.addressNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm text-white font-medium mb-2">
                                                Cidade *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full text-white placeholder:text-gray-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${errors.city
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Sua cidade"
                                            />
                                            {errors.city && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{errors.city}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white font-medium mb-2">
                                                Estado *
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`w-full text-white placeholder:text-gray-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${errors.state
                                                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                    }`}
                                                placeholder="SP"
                                                maxLength={2}
                                            />
                                            {errors.state && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{errors.state}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seção de Senha - Compacta no mobile */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base sm:text-lg text-white font-semibold">Alterar Senha</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                                        className="text-blue-500 cursor-pointer hover:text-blue-600 text-xs sm:text-sm"
                                    >
                                        {showPasswordSection ? 'Cancelar' : 'Alterar Senha'}
                                    </button>
                                </div>

                                {showPasswordSection && (
                                    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 text-white bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium mb-2">
                                                Senha Atual *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    disabled={isChangingPassword}
                                                    className={`w-full pl-4 pr-12 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${passwordErrors.currentPassword
                                                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                        }`}
                                                    placeholder="Digite sua senha atual"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                </button>
                                            </div>
                                            {passwordErrors.currentPassword && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{passwordErrors.currentPassword}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium mb-2">
                                                Nova Senha *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    disabled={isChangingPassword}
                                                    className={`w-full pl-4 pr-12 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${passwordErrors.newPassword
                                                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                        }`}
                                                    placeholder="Digite sua nova senha"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                </button>
                                            </div>
                                            {passwordErrors.newPassword && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{passwordErrors.newPassword}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium mb-2">
                                                Confirmar Nova Senha *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    disabled={isChangingPassword}
                                                    className={`w-full pl-4 pr-12 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-transparent focus:ring-2 focus:border-transparent text-sm sm:text-base ${passwordErrors.confirmPassword
                                                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                        }`}
                                                    placeholder="Confirme sua nova senha"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                </button>
                                            </div>
                                            {passwordErrors.confirmPassword && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-500 text-xs">
                                                    <AlertCircle className="w-3 h-3" />
                                                    <span>{passwordErrors.confirmPassword}</span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handlePasswordSubmit}
                                            disabled={isChangingPassword}
                                            className="w-full cursor-pointer flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            {isChangingPassword ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Alterando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>Alterar Senha</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center text-white justify-between space-y-3 sm:space-y-0">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSubmitting || isChangingPassword || isUploadingImage || isDeletingImage}
                            className="w-full sm:w-auto flex items-center cursor-pointer justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Resetar</span>
                        </button>

                        <div className="flex w-full sm:w-auto items-center space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting || isChangingPassword || isUploadingImage || isDeletingImage}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || isChangingPassword || isUploadingImage || isDeletingImage}
                                className="flex-1 sm:flex-none flex items-center cursor-pointer justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Salvar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal