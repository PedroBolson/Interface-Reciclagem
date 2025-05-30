import {
    collection,
    doc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    getDocs,
    getDoc,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface Transaction {
    id: string
    uid: string
    type: 'recycling' | 'reward' | 'bonus'
    points: number
    description: string
    material?: string
    weight?: number
    weightUnit?: 'kg' | 'g'
    location?: string
    rewardName?: string
    rewardCategory?: string
    timestamp: any
    createdAt: any
}

export interface UserBalance {
    uid: string
    currentBalance: number
    totalEarned: number
    totalSpent: number
    updatedAt: any
    createdAt?: any
}

// Escutar mudanças no balanço em tempo real
export const subscribeToUserBalance = (
    uid: string,
    callback: (balance: UserBalance | null) => void
): Unsubscribe => {
    const balanceRef = doc(db, 'balances', uid)

    return onSnapshot(balanceRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data() as UserBalance)
        } else {
            callback(null)
        }
    }, (error) => {
        console.error('Erro ao escutar balanço:', error)
        callback(null)
    })
}

// Buscar transações (sem tempo real para evitar erro de índice)
export const getUserTransactions = async (uid: string, limitCount: number = 20): Promise<Transaction[]> => {
    try {
        // Primeiro tenta com orderBy timestamp
        try {
            const q = query(
                collection(db, 'transactions'),
                where('uid', '==', uid),
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transaction[]
        } catch (indexError) {
            // Se falhar por causa do índice, tenta sem orderBy
            console.log('Índice não disponível, buscando sem ordenação...')

            const q = query(
                collection(db, 'transactions'),
                where('uid', '==', uid),
                limit(limitCount)
            )

            const snapshot = await getDocs(q)
            const transactions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transaction[]

            // Ordena manualmente por timestamp
            return transactions.sort((a, b) => {
                const aTime = a.timestamp?.toDate?.() || a.timestamp || new Date(0)
                const bTime = b.timestamp?.toDate?.() || b.timestamp || new Date(0)
                return new Date(bTime).getTime() - new Date(aTime).getTime()
            })
        }
    } catch (error) {
        console.error('Erro ao buscar transações:', error)
        return []
    }
}

// Escutar transações com polling (atualiza a cada 5 segundos)
export const subscribeToUserTransactions = (
    uid: string,
    limitCount: number = 20,
    callback: (transactions: Transaction[]) => void
): () => void => {
    let isActive = true

    const fetchTransactions = async () => {
        if (!isActive) return

        try {
            const transactions = await getUserTransactions(uid, limitCount)
            callback(transactions)
        } catch (error) {
            console.error('Erro ao buscar transações:', error)
            callback([])
        }
    }

    // Busca inicial
    fetchTransactions()

    // Polling a cada 5 segundos
    const interval = setInterval(fetchTransactions, 5000)

    // Retorna função de cleanup
    return () => {
        isActive = false
        clearInterval(interval)
    }
}

// Buscar balanço uma única vez
export const getUserBalanceOnce = async (uid: string): Promise<UserBalance | null> => {
    try {
        const balanceRef = doc(db, 'balances', uid)
        const balanceDoc = await getDoc(balanceRef)

        if (balanceDoc.exists()) {
            return balanceDoc.data() as UserBalance
        }

        return null
    } catch (error) {
        console.error('Erro ao buscar balanço:', error)
        return null
    }
}