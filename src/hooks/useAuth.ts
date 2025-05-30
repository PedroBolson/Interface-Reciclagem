import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { auth, db, functions } from '../lib/firebase'

export interface UserData {
    uid: string
    email: string
    firstName: string
    lastName: string
    cpf: string
    birthDate: string
    cep: string
    address: string
    addressNumber: string
    city: string
    state: string
    acceptedTerms: boolean
    createdAt: any
    updatedAt: any
    // Novo campo para o presente de boas-vindas
    welcomeGiftClaimed?: boolean
    welcomeGiftClaimedAt?: any
}

// Interface para o balanço do usuário
export interface UserBalance {
    uid: string
    currentBalance: number
    totalEarned: number
    totalSpent: number
    updatedAt: Date
}

// Interface para transações
export interface Transaction {
    id: string
    uid: string
    type: 'recycling' | 'reward' | 'admin_credit' | 'admin_debit' | 'bonus' | 'adjustment'
    points: number
    material?: string
    weight?: number
    weightUnit?: 'kg' | 'g'
    location?: string
    rewardName?: string
    rewardCategory?: string
    reason?: string
    adminId?: string
    description: string
    timestamp: any
    createdAt: any
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            return { success: true, user: result.user }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    }

    const signUp = async (email: string, password: string, userData: Omit<UserData, 'uid' | 'createdAt' | 'updatedAt'>) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)

            // Salvar dados do usuário
            await setDoc(doc(db, 'users', result.user.uid), {
                ...userData,
                uid: result.user.uid,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            // Criar balanço inicial será feito automaticamente na primeira transação

            return { success: true, user: result.user }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    }

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email)
            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    }

    const signOut = async () => {
        try {
            await firebaseSignOut(auth)
            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    }

    const getUserData = async (uid: string): Promise<UserData | null> => {
        try {
            const docRef = doc(db, 'users', uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return docSnap.data() as UserData
            }
            return null
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error)
            return null
        }
    }

    // Usar Firebase Functions para operações de balanço
    const getUserBalance = async (): Promise<UserBalance | null> => {
        try {
            const getBalance = httpsCallable(functions, 'getUserBalance')
            const result = await getBalance({})
            return result.data as UserBalance
        } catch (error: any) {
            console.error('Erro ao buscar balanço do usuário:', error)
            return null
        }
    }

    // Função para registrar reciclagem usando Firebase Function
    const addRecyclingPoints = async (
        material: string,
        weight: number,
        weightUnit: 'kg' | 'g',
        location: string,
        pointsPerUnit: number = 10
    ) => {
        try {
            const addPoints = httpsCallable(functions, 'addRecyclingPoints')
            const result = await addPoints({
                material,
                weight,
                weightUnit,
                location,
                pointsPerUnit
            })
            return result.data
        } catch (error: any) {
            console.error('Erro ao adicionar pontos de reciclagem:', error)
            return { success: false, error: error.message }
        }
    }

    // Função para gastar pontos usando Firebase Function
    const spendPointsOnReward = async (
        points: number,
        rewardName: string,
        rewardCategory: string
    ) => {
        try {
            const spendPoints = httpsCallable(functions, 'spendPointsOnReward')
            const result = await spendPoints({
                points,
                rewardName,
                rewardCategory
            })
            return result.data
        } catch (error: any) {
            console.error('Erro ao gastar pontos:', error)
            return { success: false, error: error.message }
        }
    }

    // Função para obter transações usando Firebase Function
    const getUserTransactions = async (limit = 20, lastDoc?: any) => {
        try {
            const getTransactions = httpsCallable(functions, 'getUserTransactions')
            const result = await getTransactions({ limit, lastDoc })
            return result.data
        } catch (error: any) {
            console.error('Erro ao obter transações:', error)
            return { success: false, error: error.message, transactions: [] }
        }
    }

    return {
        user,
        loading,
        signIn,
        signUp,
        resetPassword,
        signOut,
        getUserData,
        getUserBalance,
        addRecyclingPoints,
        spendPointsOnReward,
        getUserTransactions
    }
}