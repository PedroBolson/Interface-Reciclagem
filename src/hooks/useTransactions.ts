import { useState, useEffect } from 'react'
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    limit,
    startAfter,
    QueryDocumentSnapshot
} from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Transaction } from './useAuth'

interface UseTransactionsOptions {
    uid: string
    transactionType?: 'recycling' | 'reward' | 'admin_credit' | 'admin_debit' | 'bonus' | 'adjustment'
    limitCount?: number
    material?: string
    dateFrom?: Date
    dateTo?: Date
}

export const useTransactions = (options: UseTransactionsOptions) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(true)
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)

    const {
        uid,
        transactionType,
        limitCount = 20,
        material,
        dateFrom,
        dateTo
    } = options

    useEffect(() => {
        if (!uid) return
        fetchTransactions(true)
    }, [uid, transactionType, material, dateFrom, dateTo])

    const fetchTransactions = async (isInitial = false) => {
        try {
            setLoading(true)

            let q = query(
                collection(db, 'transactions'),
                where('uid', '==', uid),
                orderBy('timestamp', 'desc')
            )

            // Filtros opcionais
            if (transactionType) {
                q = query(q, where('type', '==', transactionType))
            }

            if (dateFrom) {
                q = query(q, where('timestamp', '>=', dateFrom))
            }

            if (dateTo) {
                q = query(q, where('timestamp', '<=', dateTo))
            }

            // Paginação
            if (!isInitial && lastDoc) {
                q = query(q, startAfter(lastDoc))
            }

            q = query(q, limit(limitCount))

            const querySnapshot = await getDocs(q)
            const newTransactions: Transaction[] = []

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                newTransactions.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate?.() || data.timestamp,
                    createdAt: data.createdAt?.toDate?.() || data.createdAt
                } as Transaction)
            })

            // Filtro por material (feito no cliente para simplicidade)
            const filteredTransactions = material
                ? newTransactions.filter(t =>
                    t.type === 'recycling' &&
                    (t as any).material?.toLowerCase().includes(material.toLowerCase())
                )
                : newTransactions

            if (isInitial) {
                setTransactions(filteredTransactions)
            } else {
                setTransactions(prev => [...prev, ...filteredTransactions])
            }

            setHasMore(querySnapshot.docs.length === limitCount)
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null)

        } catch (error) {
            console.error('Erro ao buscar transações:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchTransactions(false)
        }
    }

    const refresh = () => {
        setLastDoc(null)
        setHasMore(true)
        fetchTransactions(true)
    }

    return {
        transactions,
        loading,
        hasMore,
        loadMore,
        refresh
    }
}